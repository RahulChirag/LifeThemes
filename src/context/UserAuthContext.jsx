import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { auth, db } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";

const UserAuthContext = createContext();

export function UserAuthContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [otp, setOtp] = useState(null);
  const [unsubscribe, setUnsubscribe] = useState(null); // Moved unsubscribe to state

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUser({
            ...currentUser,
            role: userData.role,
            username: userData.username,
          });
        } else {
          setUser({ ...currentUser, role: null, username: "" });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribe) {
        unsubscribe(); // Unsubscribe when component unmounts
      }
    };
  }, []);

  const signUp = async (email, password, role) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        role,
      });
    } catch (error) {
      console.error("Error signing up:", error);
    }
  };

  const logIn = async (email, password) => {
    try {
      setLoading(true);
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUser({ ...user, role: userData.role, username: userData.username });
        console.log("User logged in:", { ...user, role: userData.role });
      } else {
        throw new Error("User document not found");
      }
    } catch (error) {
      console.error("Error logging in:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogOut = () => {
    setLoading(true);
    signOut(auth);
    setUser(null);
  };

  const setUsername = async (userId, username) => {
    try {
      await setDoc(doc(db, "users", userId), { username }, { merge: true });
      setUser((prevUser) => ({ ...prevUser, username }));
      console.log("Username set successfully:", username);
    } catch (error) {
      console.error("Error setting username:", error);
      throw error;
    }
  };

  const setLobby = async (generatedOtp, game, StarterContent) => {
    const otpStr = generatedOtp.toString();
    setOtp(otpStr);

    try {
      if (!user || !user.uid) {
        throw new Error("User ID is not available");
      }

      if (typeof otpStr !== "string") {
        throw new TypeError("Generated OTP must be a string");
      }

      console.log("User UID:", user.uid);
      console.log("Generated OTP:", otpStr);

      // Explicitly cast StarterContent to a boolean
      const isStarterContent = !!StarterContent;

      await setDoc(doc(db, "host", otpStr), {
        teacherId: user.uid,
        studentsJoined: [],
        isLive: true,
        isStarterContent: isStarterContent, // Set the boolean value here
        game: game,
      });

      console.log("Game hosted successfully with OTP:", otpStr);
    } catch (error) {
      console.error("Error Hosting game:", error);
    }
  };

  const showLobby = (setStudentsJoined, otp) => {
    try {
      if (!otp) {
        throw new Error("OTP is not set");
      }

      const hostDocRef = doc(db, "host", otp);

      if (unsubscribe) {
        unsubscribe();
      }

      const newUnsubscribe = onSnapshot(hostDocRef, (doc) => {
        if (doc.exists()) {
          const data = doc.data();
          console.log("Lobby Data:", data.studentsJoined);
          setStudentsJoined(data.studentsJoined); // Update studentsJoined in the state
        } else {
          console.error("Lobby document not found");
        }
      });

      setUnsubscribe(() => newUnsubscribe); // Set unsubscribe only once
    } catch (error) {
      console.error("Error showing game:", error);
    }
  };

  const stopLobby = async (otp) => {
    try {
      const hostDocRef = doc(db, "host", otp);
      await setDoc(hostDocRef, { isLive: false }, { merge: true });
      console.log("Lobby stopped successfully.");
    } catch (error) {
      console.error("Error stopping lobby:", error);
    }
  };

  return (
    <UserAuthContext.Provider
      value={{
        user,
        signUp,
        logIn,
        handleLogOut,
        setUsername,
        setLobby,
        showLobby,
        stopLobby,
      }}
    >
      {loading && user === null ? null : children}
    </UserAuthContext.Provider>
  );
}

export function useUserAuth() {
  return useContext(UserAuthContext);
}
