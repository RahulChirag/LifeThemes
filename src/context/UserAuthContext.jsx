import { createContext, useContext, useState, useEffect } from "react";
import { auth, db } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

const UserAuthContext = createContext();

export function UserAuthContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
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
      setLoading(false); // Set loading to false regardless of user state
    });

    return () => unsubscribe();
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
      setLoading(true); // Set loading to true while processing login
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
      setLoading(false); // Ensure loading is set to false after login attempt
    }
  };

  const handleLogOut = () => {
    setLoading(true); // Set loading to true before logging out
    signOut(auth);
    setUser(null);
  };

  const setUsername = async (userId, username) => {
    try {
      await setDoc(doc(db, "users", userId), { username }, { merge: true });
      setUser((prevUser) => ({ ...prevUser, username })); // Update the user object with the new username
      console.log("Username set successfully:", username);
    } catch (error) {
      console.error("Error setting username:", error);
      throw error;
    }
  };

  return (
    <UserAuthContext.Provider
      value={{ user, signUp, logIn, handleLogOut, setUsername }}
    >
      {loading && user === null ? null : children}
    </UserAuthContext.Provider>
  );
}

export function useUserAuth() {
  return useContext(UserAuthContext);
}
