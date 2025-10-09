import React, { useState, useEffect } from 'react';
import { Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './auth/firebase';
import { getUsername } from './api';

import Signup from './Pages/Signup';
import Signin from './Pages/Signin';
import Profile from './Pages/Profile';
import Discussion from './Pages/Discussion';
import SingleDiscussion from './Pages/SingleDiscussion';
import Post from './Pages/Post';
import ProfilePageSettings from './Pages/ProfilePageSettings';
import AccountSettings from './Pages/AccountSettings';
import ProfilePage from './Pages/ProfilePage';
import FollowingFeed from './Pages/FollowingFeed';
import Tags from './Pages/Tags';
import Verify from './Pages/Verify';
import Main from './landing-page/Main';
import axios from 'axios';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// PrivateRoute component
function PrivateRoute({ user, children }) {
  if (!user) return <Navigate to="/" replace />; // redirect if not logged in
  return children;
}

function App() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [profileCompleted, setProfileCompleted] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        setProfileLoading(true);
        try {
          const res = await getUsername(currentUser.uid);
          if (res && res.data) {
            console.log("app.jsx", res.data);
            setProfileCompleted(res.data.profileCompleted);
          } else {
            setProfileCompleted(false);
          }
        } catch (err) {
          console.error("Error fetching profile:", err);
          setProfileCompleted(false);
        } finally {
          setProfileLoading(false);
          setLoading(false);
        }
      } else {
        setProfileCompleted(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const refreshProfileStatus = async () => {
    if (user) {
      try {
        const res = await getUsername(user.uid);
        if (res && res.data) {
          setProfileCompleted(res.data.profileCompleted);
        }
      } catch (err) {
        console.error("Error refreshing profile:", err);
      }
    }
  };

  // Show loading spinner while checking auth or profile status
  if (loading || (user && profileLoading)) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-8 h-8 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />

      <Routes>
        {/* Root route */}
        <Route path="/landing" element={<Main/>}/>
        <Route
          path="/"
          element={
            !user ? (
              <Signup />
            ) : profileCompleted === false ? (
              <Navigate to="/verify" replace />
            ) : profileCompleted === true ? (
              <Navigate to="/discussion" replace />
            ) : (
              <div className="flex justify-center items-center h-screen">
                <div className="w-8 h-8 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
              </div>
            )
          }
        />
        
        <Route path="/signin" element={!user ? <Signin /> : <Navigate to="/discussion" replace />} />

        {/* Profile completion routes - accessible only when logged in but profile not completed */}
        <Route 
          path="/verify" 
          element={
            user ? (
              <Verify />
            ) : (
              <Navigate to="/" replace />
            )
          } 
        />
        
        <Route 
          path="/profile" 
          element={
            user ? (
              <Profile onProfileComplete={refreshProfileStatus}/>
            ) : (
              <Navigate to="/" replace />
            )
          } 
        />

        {/* Protected Routes - only accessible when profile is completed */}
        <Route 
          path="/discussion" 
          element={
            user ? (
              profileCompleted ? (
                <Discussion />
              ) : profileCompleted === false ? (
                <Navigate to="/verify" replace />
              ) : (
                <div className="flex justify-center items-center h-screen">
                  <div className="w-8 h-8 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
                </div>
              )
            ) : (
              <Navigate to="/" replace />
            )
          } 
        />
        
        <Route 
          path="/discussion/:id" 
          element={
            user ? (
              profileCompleted ? (
                <SingleDiscussion />
              ) : profileCompleted === false ? (
                <Navigate to="/verify" replace />
              ) : (
                <div className="flex justify-center items-center h-screen">
                  <div className="w-8 h-8 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
                </div>
              )
            ) : (
              <Navigate to="/" replace />
            )
          } 
        />
        
        <Route 
          path="/post" 
          element={
            user ? (
              profileCompleted ? (
                <Post />
              ) : profileCompleted === false ? (
                <Navigate to="/verify" replace />
              ) : (
                <div className="flex justify-center items-center h-screen">
                  <div className="w-8 h-8 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
                </div>
              )
            ) : (
              <Navigate to="/" replace />
            )
          } 
        />
        
        <Route 
          path="/settings" 
          element={
            user ? (
              profileCompleted ? (
                <ProfilePageSettings />
              ) : profileCompleted === false ? (
                <Navigate to="/verify" replace />
              ) : (
                <div className="flex justify-center items-center h-screen">
                  <div className="w-8 h-8 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
                </div>
              )
            ) : (
              <Navigate to="/" replace />
            )
          } 
        />
        
        <Route 
          path="/settings/profile" 
          element={
            user ? (
              profileCompleted ? (
                <ProfilePageSettings />
              ) : profileCompleted === false ? (
                <Navigate to="/verify" replace />
              ) : (
                <div className="flex justify-center items-center h-screen">
                  <div className="w-8 h-8 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
                </div>
              )
            ) : (
              <Navigate to="/" replace />
            )
          } 
        />
        
        <Route 
          path="/settings/account" 
          element={
            user ? (
              profileCompleted ? (
                <AccountSettings />
              ) : profileCompleted === false ? (
                <Navigate to="/verify" replace />
              ) : (
                <div className="flex justify-center items-center h-screen">
                  <div className="w-8 h-8 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
                </div>
              )
            ) : (
              <Navigate to="/" replace />
            )
          } 
        />
        
        <Route 
          path="/profile/:uid" 
          element={
            user ? (
              profileCompleted ? (
                <ProfilePage />
              ) : profileCompleted === false ? (
                <Navigate to="/verify" replace />
              ) : (
                <div className="flex justify-center items-center h-screen">
                  <div className="w-8 h-8 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
                </div>
              )
            ) : (
              <Navigate to="/" replace />
            )
          } 
        />
        
        <Route 
          path="/feed" 
          element={
            user ? (
              profileCompleted ? (
                <FollowingFeed />
              ) : profileCompleted === false ? (
                <Navigate to="/verify" replace />
              ) : (
                <div className="flex justify-center items-center h-screen">
                  <div className="w-8 h-8 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
                </div>
              )
            ) : (
              <Navigate to="/" replace />
            )
          } 
        />
        
        <Route 
          path="/tags/:tag" 
          element={
            user ? (
              profileCompleted ? (
                <Tags />
              ) : profileCompleted === false ? (
                <Navigate to="/verify" replace />
              ) : (
                <div className="flex justify-center items-center h-screen">
                  <div className="w-8 h-8 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
                </div>
              )
            ) : (
              <Navigate to="/" replace />
            )
          } 
        />
      </Routes>
    </>
  );
}

export default App;