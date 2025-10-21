import React, { useState } from 'react'
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../auth/firebase";
import { useNavigate } from "react-router-dom";
import SignInWithGoogle from "../assets/download.png"
import { ToastContainer, toast } from 'react-toastify';
import { getUsername } from '../api';

function Signin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

   const handleSignin = (e) => {
    e.preventDefault();
    try {
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                toast.success("You've been logged in!", { autoClose: 2000 });
                navigate("/discussion", { replace: true }); // ADD replace: true
            })
    } catch (error) {
        setMessage(error.message);
    }
};

   const handleGoogleSignin = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    toast.success("You've been logged in!", { autoClose: 2000 });

    // Check if user profile exists and is completed
    try {
      const res = await getUsername(user.uid);

      if (res && res.data && res.data.profileCompleted) {
        navigate("/discussion", { replace: true });
      } else {
        navigate("/verify", { replace: true });
      }
    } catch (error) {
      // If profile doesn't exist, redirect to Verify
      navigate("/verify", { replace: true });
    }
  } catch (error) {
    console.error("Google Sign-In Error:", error.message);
    toast.error("Sign-in failed. Please try again.");
  }
};
    return (
        <>

            <div className='flex items-center justify-center h-screen'>
                <form onSubmit={handleSignin} className='w-full sm:w-[80%] md:w-[50%] lg:w-[30%] bg-white p-10 rounded-lg shadow-lg'>
                    <h2 className='text-2xl font-bold mb-6'>Welcome back!</h2>
                    <div className=''>
                        <p>Email*</p>
                        <input
                            className='border border-gray-300 p-2 w-full'
                            type="email"
                            placeholder="Email"
                            onChange={(e) => setEmail(e.target.value)}
                        /><br />
                    </div>
                    <div className='mt-4'>

                        <p>Password*</p>
                        <input
                            className='border border-gray-300 p-2 w-full'

                            type="password"
                            placeholder="Password"
                            onChange={(e) => setPassword(e.target.value)}
                        /><br />

                        <div className="flex text-sm  items-center mt-2">

                            <p className="text-gray-500">Already have an account?  -   </p><a href="/Signup" className="ml-2 underline">Sign up</a>
                        </div>
                    </div>
                    <button type="submit" className='w-full bg-rose-500 rounded-full p-2 text-white block mt-3'>Sign In</button>
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
        </>
    )
}

export default Signin