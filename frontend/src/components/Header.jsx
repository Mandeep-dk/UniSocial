import React, { useState, useEffect, useRef } from 'react';
import DefaultPic from '../assets/image.png'; // fallback/default image
import { getUsername } from '../api';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../auth/firebase';
import { MessagesSquare, Plus, User, Settings, LogOut } from "lucide-react";

function Header() {
    const [openDropDown, setOpenDropDown] = useState(false);
    const [profilePic, setProfilePic] = useState('');
    const [uid, setUid] = useState(null);
    const [loginConfirm, setLoginConfirm] = useState(false);
    const dropdownRef = useRef(null); 
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const res = await getUsername(user.uid);
                setUid(user.uid)

                setProfilePic(res.data.profilePic); // set profilePic path
            }
        });

        return () => unsubscribe();
    }, [profilePic]);

    useEffect(() => {
    const handleClickOutside = (event) => {
      // If click is outside dropdown, close it
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropDown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

    const handleDropDown = () => {
        setOpenDropDown(prev => !prev);
    };

    const handleLogOut = async () => {
        try {
            await signOut(auth);
            navigate("/Signin")
        } catch (err) {
            console.error(err.message);
        }
    }
    return (
<div className='flex w-screen flex-row justify-between items-center px-4 sm:px-6 lg:px-8 py-3 shadow-md bg-white'>
            <a href="/Discussion" className='text-xl sm:text-2xl lg:text-3xl font-bold text-rose-500'>UniSocial</a>

            <div className='flex flex-row items-center gap-2 sm:gap-3'>
                <button 
                    className='flex flex-row items-center gap-1.5 sm:gap-2 px-3 py-2 sm:px-4 sm:py-2 bg-rose-500 text-white rounded-lg sm:rounded-2xl hover:bg-rose-600 transition-colors' 
                    onClick={() => navigate("/Post")}
                >
                    <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span className="hidden sm:inline text-sm sm:text-base">Create post</span>
                </button>
              <div className='relative flex items-center'>
    <button
        className='flex items-center justify-center p-0 rounded-full'
        onClick={handleDropDown}
    >
        <img
            src={profilePic ? `${profilePic}` : DefaultPic}
            className="h-9 w-9 sm:h-12 sm:w-12 md:h-14 md:w-14 rounded-full object-cover border-2 border-gray-200 hover:border-rose-500 transition-colors"
            alt='profile'
        />
    </button>
</div>

            </div>

            {openDropDown &&
                <div ref={dropdownRef}  className='absolute top-16 sm:top-20 right-4 sm:right-10 flex flex-col bg-white shadow-lg border rounded-lg p-4 z-50 w-48 sm:w-52'>
                    <ul className='space-y-3'>
                        <li className='cursor-pointer hover:text-rose-500 transition-colors'>
                            <button 
                                className='flex flex-row items-center gap-2 w-full text-left text-sm sm:text-base' 
                                onClick={() => {
                                    navigate(`/Discussion`);
                                    setOpenDropDown(false);
                                }}
                            >
                                <MessagesSquare className="h-4 w-4" />
                                Discussion
                            </button>
                        </li>
                        <li className='cursor-pointer hover:text-rose-500 transition-colors'>
                            <button 
                                className='flex flex-row items-center gap-2 w-full text-left text-sm sm:text-base' 
                                onClick={() => {
                                    navigate(`/Post`);
                                    setOpenDropDown(false);
                                }}
                            >
                                <Plus className="h-4 w-4" />
                                Create a post
                            </button>
                        </li>
                        <li className='cursor-pointer hover:text-rose-500 transition-colors'>
                            <button 
                                className='flex flex-row items-center gap-2 w-full text-left text-sm sm:text-base' 
                                onClick={() => {
                                    navigate(`/profile/${uid}`);
                                    setOpenDropDown(false);
                                }}
                            >
                                <User className="h-4 w-4" />
                                My profile
                            </button>
                        </li>

                        <li className='cursor-pointer hover:text-rose-500 transition-colors'>
                            <button 
                                className="flex flex-row items-center gap-2 w-full text-left text-sm sm:text-base" 
                                onClick={() => {
                                    navigate("/settings");
                                    setOpenDropDown(false);
                                }}
                            >
                                <Settings className="h-4 w-4" />
                                Settings
                            </button>
                        </li>
                        <hr className="my-2" />
                        <li className='cursor-pointer hover:text-rose-500 transition-colors'>
                            <button 
                                className="flex flex-row items-center gap-2 w-full text-left text-sm sm:text-base" 
                                onClick={() => {
                                    setLoginConfirm(true);
                                    setOpenDropDown(false);
                                }}
                            >
                                <LogOut className="h-4 w-4" />
                                Logout
                            </button>
                        </li>
                    </ul>
                </div>
            }

            {loginConfirm &&
                <div
                    className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 backdrop-blur-sm"
                    onClick={() => setLoginConfirm(false)}
                >
                    <div
                        className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-6 sm:p-8 animate-in zoom-in-95 duration-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 text-center mb-6">
                            Are you sure?
                        </h2>

                        <div className="flex gap-3 sm:gap-4">
                            <button
                                className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition-all duration-200 text-sm sm:text-base"
                                onClick={() => setLoginConfirm(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700 transition-all duration-200 shadow-lg hover:shadow-xl text-sm sm:text-base"
                                onClick={handleLogOut}
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            }
        </div>
    );
}

export default Header;