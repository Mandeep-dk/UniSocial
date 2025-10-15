import React, { useState, useEffect } from 'react';
import {
  onAuthStateChanged,
  reauthenticateWithCredential,
  updatePassword,
  GoogleAuthProvider,
  EmailAuthProvider,
  deleteUser,
  reauthenticateWithPopup,
} from 'firebase/auth';
import { auth } from '../auth/firebase';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';
import { deleteUserB } from '../api';
import { ToastContainer, toast } from 'react-toastify';

function AccountSettings() {
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(null);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [activeTab, setActiveTab] = useState('account');
  const [confirmBox, setConfirmBox] = useState(false);
  const [confirmBoxForGoogle, setConfirmBoxForGoogle] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setActiveTab('account');
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        setUserId(user.uid);
      }
    });
    return () => unsubscribe();
  }, []);

  const handlePasswordUpdate = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("Passwords don't match", { autoClose: 2000 });
      return;
    }
    try {
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, confirmPassword);
      toast.success('Password updated successfully!', { autoClose: 2000 });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch {
      toast.error('Error updating password. Check if the password matches', { autoClose: 2000 });
    }
  };

  const handleDelete = async () => {
    try {
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      await deleteUser(user);
      await deleteUserB(userId);
      navigate('/');
    } catch (err) {
      console.error(err);
      toast.error('Error deleting account. Check your password', { autoClose: 2000 });
    }
  };

  const handleDeleteForGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await reauthenticateWithPopup(user, provider);
      await deleteUserB(userId);
      await deleteUser(user);
      navigate('/');
      toast.success('Account deleted successfully', { autoClose: 2000 });
    } catch (err) {
      console.error(err);
      toast.error('Error deleting Google account. Try again.');
    }
  };

  return (
    <>
      <Header />
      <ToastContainer />

      <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50">
        {/* Sidebar */}
        <aside className="w-full lg:w-84 bg-gray-50 border-b lg:border-b-0 lg:border-r border-gray-200 p-4 flex-shrink-0">
          <div className="flex flex-col gap-2">
            <button
              className="p-3 text-left rounded-lg transition-colors hover:bg-gray-100 text-gray-700"
              onClick={() => navigate('/settings/profile')}
            >
              Profile Settings
            </button>
            <button
              className={`p-3 text-left rounded-lg transition-colors ${
                activeTab === 'account'
                  ? 'bg-rose-100 text-rose-500 border-l-4 border-rose-500'
                  : 'hover:bg-gray-100 text-gray-700'
              }`}
              onClick={() => setActiveTab('account')}
            >
              Account Settings
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-6">
          <div className="max-w-3xl mx-auto space-y-6">
            <h1 className="text-3xl font-bold mb-6">Account Settings</h1>

            {/* Change Password */}
            <section className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-4">
              <h2 className="text-lg font-semibold mb-4">Change Password</h2>
              <div className="space-y-4">
                {[
                  { label: 'Current Password', value: currentPassword, setter: setCurrentPassword },
                  { label: 'New Password', value: newPassword, setter: setNewPassword },
                  { label: 'Confirm New Password', value: confirmPassword, setter: setConfirmPassword },
                ].map((field) => (
                  <div key={field.label}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                    <input
                      type="password"
                      value={field.value}
                      onChange={(e) => field.setter(e.target.value)}
                      placeholder={field.label}
                      className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </div>
                ))}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handlePasswordUpdate}
                    className="px-6 py-3 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors font-medium"
                  >
                    Update Password
                  </button>
                  <a
                    href="https://myaccount.google.com/security"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium inline-flex items-center justify-center"
                  >
                    Change Google Password
                  </a>
                </div>
              </div>
            </section>

            {/* Account Info */}
            <section className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-2">
              <h2 className="text-lg font-semibold mb-4">Account Information</h2>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm font-medium text-gray-700">Email:</span>
                  <span className="text-sm text-gray-600">{user?.email}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm font-medium text-gray-700">Account Created:</span>
                  <span className="text-sm text-gray-600">
                    {user?.metadata?.creationTime
                      ? new Date(user.metadata.creationTime).toLocaleDateString()
                      : 'N/A'}
                  </span>
                </div>
              </div>
            </section>

            {/* Danger Zone */}
            <section className="bg-red-50 p-6 rounded-lg border border-red-200 shadow-sm space-y-4">
              <h2 className="text-lg font-semibold mb-4 text-red-800">Danger Zone</h2>
              <div className="bg-white p-4 rounded-lg border border-red-300 space-y-4">
                <p className="text-sm text-gray-600">
                  Once you delete your account, there is no going back. Please be certain.
                </p>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                    onClick={() => setConfirmBox(true)}
                    disabled={!currentPassword}
                  >
                    Delete Account
                  </button>
                  <button
                    className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                    onClick={() => setConfirmBoxForGoogle(true)}
                  >
                    Delete Account (Google Sign-In)
                  </button>
                </div>
              </div>

              {/* Confirm Delete Dialogs */}
              {confirmBox && (
                <div
                  className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 backdrop-blur-sm"
                  onClick={() => setConfirmBox(false)}
                >
                  <div
                    className="bg-white rounded-2xl shadow-2xl w-11/12 max-w-md p-6"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <h2 className="text-xl font-bold text-gray-900 text-center mb-4">
                      Are you sure you want to delete your account? This action can't be undone
                    </h2>
                    <div className="flex gap-4">
                      <button
                        className="flex-1 px-6 py-3 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium"
                        onClick={() => setConfirmBox(false)}
                      >
                        Cancel
                      </button>
                      <button
                        className="flex-1 px-6 py-3 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700"
                        onClick={handleDelete}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {confirmBoxForGoogle && (
                <div
                  className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 backdrop-blur-sm"
                  onClick={() => setConfirmBoxForGoogle(false)}
                >
                  <div
                    className="bg-white rounded-2xl shadow-2xl w-11/12 max-w-md p-6"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <h2 className="text-xl font-bold text-gray-900 text-center mb-4">
                      Are you sure you want to delete your account? You need to SignIn with Google again
                      to delete your account. This action can't be undone
                    </h2>
                    <div className="flex gap-4">
                      <button
                        className="flex-1 px-6 py-3 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium"
                        onClick={() => setConfirmBoxForGoogle(false)}
                      >
                        Cancel
                      </button>
                      <button
                        className="flex-1 px-6 py-3 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700"
                        onClick={handleDeleteForGoogle}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </section>
          </div>
        </main>
      </div>
    </>
  );
}

export default AccountSettings;
