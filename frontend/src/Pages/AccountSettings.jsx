import React, { useState, useEffect } from 'react'
import { onAuthStateChanged, reauthenticateWithCredential, reauthenticateWithPopup, updatePassword,GoogleAuthProvider, EmailAuthProvider, deleteUser, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth } from '../auth/firebase';
import Header from '../components/Header';
import { useNavigate } from "react-router-dom";
import { deleteUserB } from '../api';
import { ToastContainer, toast } from 'react-toastify';

function AccountSettings() {
    const [user, setUser] = useState(null);
    const [userId, setUserId] = useState(null);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('account');
    const [confirmBox, setConfirmBox] = useState(false);
    const [confirmBoxForGoogle, setConfirmBoxForGoogle] = useState(false);
    
    useEffect(() => {
        setActiveTab('account');
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setUser(user);
                console.log("This", user.uid);
                setUserId(user.uid);
            }
        });
        return () => unsubscribe();
    }, []);

    const handleSubmit = async () => {
        if (confirmPassword != newPassword) {
            toast.error("Passwords don't match", { autoclose: 2000 });
            return;
        }

        try {
            const credential = EmailAuthProvider.credential(user.email, currentPassword);
            await reauthenticateWithCredential(user, credential);
            await updatePassword(user, confirmPassword);
            toast.success("Password updated successfully!", { autoClose: 2000 });
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error) {
            toast.error("Error updating password. Check if the password matches", { autoClose: 2000 });
        }
    }

    const handleDelete = async () => {
        try {
            const credential = EmailAuthProvider.credential(user.email, currentPassword);
            await reauthenticateWithCredential(user, credential);
            await deleteUser(user);
            await deleteUserB(userId)
            navigate("/");
        } catch (error) {
            console.error("Error occurred:", error.message);
            toast.error("Error deleting account. Please check if your password matches", { autoclose: 2000 })
        }
    }

    const handleDeleteForGoogle = async () => {
        try {
            const provider = new GoogleAuthProvider();
            await reauthenticateWithPopup(user, provider);
            await deleteUserB(userId);
            await deleteUser(user);
            navigate("/");
            toast.success("Account deleted successfully");
        } catch (error) {
            console.error("Google Delete Error:", error.message);
            toast.error("Error deleting Google account. Try again.");
        }
    };

    return (
        <>
            <Header />
            <div className='flex min-h-screen'>
                {/* Left Sidebar Navigation */}
                <div className='w-64 bg-gray-50 border-r border-gray-200 p-4'>
                    <div className='flex flex-col gap-2'>
                        <button
                            className={`p-3 text-left rounded-lg transition-colors hover:bg-gray-100 text-gray-700`}
                            onClick={() => navigate('/settings/profile')}
                        >
                            Profile Settings
                        </button>
                        <button
                            className={`p-3 text-left rounded-lg transition-colors ${activeTab === 'account'
                                ? "bg-rose-100 text-rose-500 border-l-4 border-rose-500"
                                : "hover:bg-gray-100 text-gray-700"
                                }`}
                            onClick={() => setActiveTab("account")}
                        >
                            Account Settings
                        </button>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className='flex-1 p-6'>
                    <div className='max-w-2xl'>
                        <h1 className='text-3xl font-bold mb-6'>Account Settings</h1>

                        <div className='space-y-6'>
                            {/* Change Password Section */}
                            <div className='bg-white p-6 rounded-lg border border-gray-200 shadow-sm'>
                                <h2 className='text-lg font-semibold mb-4'>Change Password</h2>
                                <div className='space-y-4'>
                                    <div>
                                        <label className='block text-sm font-medium text-gray-700 mb-1'>
                                            Current Password
                                        </label>
                                        <input
                                            type='password'
                                            value={currentPassword}
                                            className='w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none'
                                            onChange={(e) => setCurrentPassword(e.target.value)}
                                            placeholder="Enter your current password"
                                        />
                                    </div>

                                    <div>
                                        <label className='block text-sm font-medium text-gray-700 mb-1'>
                                            New Password
                                        </label>
                                        <input
                                            type='password'
                                            value={newPassword}
                                            className='w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none'
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            placeholder="Enter your new password"
                                        />
                                    </div>

                                    <div>
                                        <label className='block text-sm font-medium text-gray-700 mb-1'>
                                            Confirm New Password
                                        </label>
                                        <input
                                            type='password'
                                            value={confirmPassword}
                                            className='w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none'
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            placeholder="Confirm your new password"
                                        />
                                    </div>

                                    <div className='flex gap-3'>
                                        <button
                                            className='px-6 py-3 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors font-medium'
                                            onClick={handleSubmit}
                                        >
                                            Update Password
                                        </button>
                                        <a
                                            href="https://myaccount.google.com/security"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className='px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium inline-flex items-center justify-center'
                                        >
                                            Change Google Password
                                        </a>
                                    </div>
                                </div>
                            </div>

                            {/* Account Information Section */}
                            <div className='bg-white p-6 rounded-lg border border-gray-200 shadow-sm'>
                                <h2 className='text-lg font-semibold mb-4'>Account Information</h2>
                                <div className='space-y-2'>
                                    <div className='flex justify-between items-center py-2'>
                                        <span className='text-sm font-medium text-gray-700'>Email:</span>
                                        <span className='text-sm text-gray-600'>{user?.email}</span>
                                    </div>
                                    <div className='flex justify-between items-center py-2'>
                                        <span className='text-sm font-medium text-gray-700'>Account Created:</span>
                                        <span className='text-sm text-gray-600'>
                                            {user?.metadata?.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : 'N/A'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Danger Zone Section */}
                            <div className='bg-red-50 p-6 rounded-lg border border-red-200 shadow-sm'>
                                <h2 className='text-lg font-semibold mb-4 text-red-800'>Danger Zone</h2>
                                <div className='space-y-4'>
                                    <div className='bg-white p-4 rounded-lg border border-red-300'>
                                        <h3 className='font-medium text-red-800 mb-2'>Delete Account</h3>
                                        <p className='text-sm text-gray-600 mb-4'>
                                            Once you delete your account, there is no going back. Please be certain.
                                        </p>
                                        <div className='mb-4'>
                                            <label className='block text-sm font-medium text-gray-700 mb-1'>
                                                Enter your current password to confirm
                                            </label>
                                            <input
                                                type='password'
                                                value={currentPassword}
                                                className='w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none'
                                                onChange={(e) => setCurrentPassword(e.target.value)}
                                                placeholder="Current password"
                                            />
                                        </div>
                                        <div className='flex gap-3'>
                                            <button
                                                className='px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium'
                                                onClick={() => setConfirmBox(true)}
                                                disabled={!currentPassword}
                                            >
                                                Delete Account
                                            </button>

                                            <button
                                                className='px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium'
                                                onClick={() => setConfirmBoxForGoogle(true)}
                                            >
                                                Delete Account (Google Sign-In)
                                            </button>
                                        </div>

                                        {confirmBox &&
                                            <div
                                                className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 backdrop-blur-sm"
                                                onClick={() => setConfirmBox(false)}
                                            >
                                                <div
                                                    className="bg-white rounded-2xl shadow-2xl w-96 p-8 mx-4 animate-in zoom-in-95 duration-200"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
                                                        Are you sure you want to delete your account? This action can't be undone
                                                    </h2>

                                                    <div className="flex gap-4">
                                                        <button
                                                            className="flex-1 px-6 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition-all duration-200"
                                                            onClick={() => setConfirmBox(false)}
                                                        >
                                                            Cancel
                                                        </button>
                                                        <button
                                                            className="flex-1 px-6 py-3 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                                                            onClick={handleDelete}
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                        {confirmBoxForGoogle &&
                                            <div
                                                className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 backdrop-blur-sm"
                                                onClick={() => setConfirmBoxForGoogle(false)}
                                            >
                                                <div
                                                    className="bg-white rounded-2xl shadow-2xl w-96 p-8 mx-4 animate-in zoom-in-95 duration-200"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
                                                        Are you sure you want to delete your account? You need to SignIn with Google again to delete your account. This action can't be undone
                                                    </h2>

                                                    <div className="flex gap-4">
                                                        <button
                                                            className="flex-1 px-6 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition-all duration-200"
                                                            onClick={() => setConfirmBoxForGoogle(false)}
                                                        >
                                                            Cancel
                                                        </button>
                                                        <button
                                                            className="flex-1 px-6 py-3 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                                                            onClick={handleDeleteForGoogle}
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AccountSettings