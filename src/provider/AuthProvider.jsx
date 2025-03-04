import { createContext, useEffect, useState } from "react";
import app from "../firebase/firebase.config";
import {
  getAuth,
  onAuthStateChanged,
  GoogleAuthProvider,
  
  signOut,
  signInWithPopup,
} from "firebase/auth";
// import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

export const AuthContext = createContext(null);
const auth = getAuth(app);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();
  const [error, setError] = useState("");
  const googleProvider = new GoogleAuthProvider();

  const handleGoogleLogin = async () => {
    googleProvider.setCustomParameters({
      prompt: "select_account",
    });
    signInWithPopup(auth, googleProvider)
      .then(async (result) => {
        const user = result.user;
        setUser(user);

        const userData = {
          email: user.email,
          name: user.displayName,
          photo: user.photoURL,
          timestamp: new Date().toLocaleDateString(),
        };
        await axios.post("https://sharelink-server-five.vercel.app/users", userData);

        setError("");
        toast.success("Successfully login.");
       
      })

      .catch((error) => {
        setError("Failed to login with Google.");
      });
  };

  const logOut = () => {
    setLoading(true);
    return signOut(auth);
  };

  const authInfo = {
    user,
    setUser,
    loading,

    logOut,
    handleGoogleLogin,
    auth,
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;