import React, { useState, useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../auth/firebase';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { searchUser } from '../api';
import { ToastContainer, toast } from 'react-toastify';

function Profile({ onProfileComplete }) {
  const [branch, setBranch] = useState(null);
  const [year, setYear] = useState(null);
  const [interests, setInterests] = useState([]);
  const [uid, setUid] = useState(null);
  const [username, setUsername] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUid(user.uid);
        setUsername(user.displayName || user.email);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    // Pass uid as a parameter to exclude current user from search
    const userSearchRes = await searchUser(username, uid);
    const res2 = userSearchRes.data;

    if (!res2.exists) {
      const interestsArray = interests.split(',').map(item => item.trim()).filter(item => item);
      const res = await axios.post("https://unisocial-8gc2.onrender.com/api/users/profile", {
        uid,
        username,
        branch,
        year,
        interests: interestsArray,
      });
      if (onProfileComplete) {
        await onProfileComplete();
      }
      navigate("/Discussion", { replace: true });
    } else {
      toast.error("Username is already taken", { autoClose: 2000 });
    }
  } catch (err) {
    console.error("Error saving profile:", err);
    toast.error("Error saving profile", { autoClose: 2000 });
  }
}
  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 px-4">
      <div className="bg-white/80 backdrop-blur-md p-10 rounded-2xl shadow-2xl w-full max-w-md">
        <h2 className="text-center font-bold text-3xl text-gray-800 mb-6">
          Fill Your Profile
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Username */}
          <div>
            <label className="block mb-1 text-sm font-semibold text-gray-700">
              Username
            </label>
            <input
              type="text"
              placeholder="Enter a username"
              value={username || ""}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
            />
          </div>

          {/* Branch */}
          <div>
            <label className="block mb-1 text-sm font-semibold text-gray-700">
              Branch
            </label>
            <input
              type="text"
              placeholder="Branch"
              onChange={(e) => setBranch(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
            />
          </div>

          {/* Year */}
          <div>
            <label className="block mb-1 text-sm font-semibold text-gray-700">
              Year
            </label>
            <input
              type="text"
              placeholder="Year"
              onChange={(e) => setYear(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
            />
          </div>

          {/* Interests */}
          <div>
            <label className="block mb-1 text-sm font-semibold text-gray-700">
              Interests
            </label>
            <input
              type="text"
              placeholder="Interests"
              onChange={(e) => setInterests(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
            />
          </div>

          <button
            type="submit"
            className="w-full mt-2 py-3 text-white font-semibold rounded-lg bg-gradient-to-r bg-rose-500 transition duration-300 shadow-md"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );

}

export default Profile