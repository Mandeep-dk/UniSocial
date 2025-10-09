import React, { useState } from "react";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../auth/firebase";
import { useNavigate } from "react-router-dom";
import SignInWithGoogle from "../assets/download.png"
import { ToastContainer, toast } from 'react-toastify';
import { getUsername } from '../api'; // ADD THIS IMPORT

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

 const handleSignup = async (e) => {
    e.preventDefault();
    try {
        await createUserWithEmailAndPassword(auth, email, password);
        toast.success("You've been logged in!", { autoClose: 2000 });
        
        setMessage("Signup successful!");
        navigate("/Verify", { replace: true }); // ADD replace: true

    } catch (error) {
        setMessage(error.message);
    }
};

  const handleGoogleSignin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      toast.success("You've been logged in!", { autoClose: 2000 });

      // Check if user profile exists in backend
      try {
        const res = await getUsername(user.uid);
        
        if (res && res.data && res.data.profileCompleted) {
          navigate("/Discussion", { replace: true }); // User has completed profile
        } else {
          navigate("/Verify", { replace: true }); // New user or incomplete profile
        }
      } catch (error) {
        // If profile doesn't exist (new Google user), go to Verify
        console.log("New Google user, redirecting to Verify");
        navigate("/Verify", { replace: true });
      }
    } catch (error) {
      console.error("Google Sign-In Error:", error.message);
      toast.error("Sign-in failed. Please try again.");
    }
  };

  return (
    <div className='flex items-center justify-center h-screen'>
      <form onSubmit={handleSignup} className='bg-white p-10 rounded-lg w-[30%] shadow-2xl'>
        <h2 className='text-2xl font-bold mb-6'>Join UniSocial</h2>
        <div className=''>
          <p>Email address*</p>
          <input
            className='border p-2 border-gray-300 w-full'
            type="email"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          /><br />
        </div>
        <div className="mt-4">
          <p>Password*</p>
          <input
            className='border p-2 border-gray-300 w-full'
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          /><br />
          <div className="flex text-sm items-center mt-2">
            <p className="text-gray-500">Already have an account? - </p>
            <a href="signin" className="ml-2 underline">Sign In</a>
          </div>
        </div>
        <button type="submit" className='w-full block mt-3 text-white bg-rose-500 p-2 rounded-full'>Sign Up</button>
      
        <div className="flex items-center mt-6">
          <hr className="flex-grow border-gray-300" />
          <span className="px-3 text-gray-500">or</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        <div className="flex items-center mt-6">
          <button
            onClick={handleGoogleSignin}
            type="button"
            className="flex items-center justify-center gap-2 w-full border border-gray-100 rounded-full py-2 hover:bg-gray-100"
          >
            <span className="text-gray-700 font-medium">Sign in with Google</span>
            <img
              src={SignInWithGoogle}
              alt="Google logo"
              className="w-5 h-5 border-none outline-none"
            />
          </button>
        </div>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Signup;