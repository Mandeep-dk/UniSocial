import React, { useState, useEffect } from 'react';
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
        <div className='flex w-full flex-row justify-between items-center px-2 shadow-md'>
            <div className='text-2xl sm:text-2xl md:text-2xl lg:text-3xl font-bold text-rose-500 ml-7'>UniSocial</div>

            <div className='flex flex-row items-center'>
                <button className='flex flex-row items-center gap-2 p-2 bg-rose-500 mr-4 text-white rounded-2xl' onClick={() => navigate("/Post")}>
                    <Plus />
                    <span className=" hidden sm:inline">Create post</span>
                </button>
                <div>
                    <button onClick={handleDropDown}>
                        <img
                            src={profilePic ? `http://localhost:5000/${profilePic}` : DefaultPic}
                            className="h-19 w-19 mt-2 rounded-full object-cover border-2 border-gray-200 mr-5"
                            alt='profile'
                        />
                    </button>
                </div>
            </div>

            {openDropDown &&
                <div className='absolute top-22 right-10 flex flex-col bg-white shadow-lg border rounded-lg p-4 z-50 w-40'>
                    <ul className='space-y-4'>
                        <li className='cursor-pointer hover:text-rose-500 flex flex-row'>
                            <button className=' flex flex-row gap-2' onClick={() => navigate(`/Discussion`)}><MessagesSquare/>Discussion</button>
                        </li>
                        <li className='cursor-pointer hover:text-rose-500 flex flex-row'>
                            <button className=' flex flex-row gap-2' onClick={() => navigate(`/Post`)}><Plus />Create a post</button>
                        </li>
                        <li className='cursor-pointer hover:text-rose-500 flex flex-row'>
                            <button className=' flex flex-row gap-2' onClick={() => navigate(`/profile/${uid}`)}><User />My profile</button>
                        </li>

                        <li className='cursor-pointer hover:text-rose-500  flex flex-row'>
                            <button className=" flex flex-row gap-2" onClick={() => navigate("/settings")}><Settings />Settings</button>
                        </li>
                        <hr></hr>
                        <li className='cursor-pointer hover:text-rose-500  flex flex-row'>
                            <button className=" flex flex-row gap-2" onClick={() => setLoginConfirm(true)}><LogOut />Logout</button>
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
                        className="bg-white rounded-2xl shadow-2xl w-96 p-8 mx-4 animate-in zoom-in-95 duration-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
                            Are you sure?
                        </h2>


                        <div className="flex gap-4">
                            <button
                                className="flex-1 px-6 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition-all duration-200"
                                onClick={() => setLoginConfirm(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="flex-1 px-6 py-3 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700 transition-all duration-200 shadow-lg hover:shadow-xl"
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
