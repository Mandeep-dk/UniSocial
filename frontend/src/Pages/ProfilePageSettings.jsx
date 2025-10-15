import React, { useState, useRef, useEffect } from 'react';
import { editProfile, getUsername, uploadProfilePic, searchUser } from '../api';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../auth/firebase';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';
import DefaultPic from '../assets/image.png';
import { ToastContainer, toast } from 'react-toastify';

function ProfilePageSettings() {
  const [isEditing, setIsEditing] = useState(false);
  const [uid, setUid] = useState('');
  const [userData, setUserData] = useState({
    username: '',
    bio: '',
    instagram: '',
    facebook: '',
    twitter: '',
    branch: '',
    year: '',
    interests: [],
    profilePic: null,
  });
  const [file, setFile] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);
  const navigate = useNavigate();

  const fieldRefs = {
    username: useRef(null),
    bio: useRef(null),
    instagram: useRef(null),
    facebook: useRef(null),
    twitter: useRef(null),
    branch: useRef(null),
    year: useRef(null),
    interests: useRef(null),
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUid(user.uid);
        const res = await getUsername(user.uid);
        setUserData({
          username: res.data.username,
          bio: res.data.bio,
          instagram: res.data.instagram,
          facebook: res.data.facebook,
          twitter: res.data.twitter,
          branch: res.data.branch,
          year: res.data.year,
          interests: res.data.interests,
          profilePic: res.data.profilePic,
        });
      }
    });
    return () => unsubscribe();
  }, []);

  const handleKeyDown = (e, field) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      fieldRefs[field].current.blur();
    }
  };

  const handleBlur = async (field) => {
    const updatedText = fieldRefs[field].current.innerText.trim();
    const updates = {};

    if (field === 'username' && updatedText !== userData.username) {
      const res = await searchUser(updatedText, uid);
      if (res.data.exists) {
        toast.error('Username already taken', { autoClose: 2000 });
        fieldRefs[field].current.innerText = userData.username;
        return;
      } else {
        updates.username = updatedText;
        setUserData({ ...userData, username: updatedText });
      }
    } else if (field === 'bio' && updatedText !== userData.bio) {
      updates.bio = updatedText;
      setUserData({ ...userData, bio: updatedText });
    } else if (field === 'instagram' && updatedText !== userData.instagram) {
      updates.instagram = updatedText;
      setUserData({ ...userData, instagram: updatedText });
    } else if (field === 'facebook' && updatedText !== userData.facebook) {
      updates.facebook = updatedText;
      setUserData({ ...userData, facebook: updatedText });
    } else if (field === 'twitter' && updatedText !== userData.twitter) {
      updates.twitter = updatedText;
      setUserData({ ...userData, twitter: updatedText });
    } else if (field === 'branch' && updatedText !== userData.branch) {
      updates.branch = updatedText;
      setUserData({ ...userData, branch: updatedText });
    } else if (field === 'year' && updatedText !== userData.year) {
      updates.year = updatedText;
      setUserData({ ...userData, year: updatedText });
    } else if (field === 'interests') {
      const updatedArray = updatedText.split(',').map(i => i.trim()).filter(i => i);
      if (JSON.stringify(updatedArray) !== JSON.stringify(userData.interests)) {
        updates.interests = updatedArray;
        setUserData({ ...userData, interests: updatedArray });
      }
    }

    if (Object.keys(updates).length > 0) {
      try {
        await editProfile(uid, updates);
      } catch (err) {
        console.error('Failed to update profile:', err.message);
      }
    }
    setIsEditing(false);
  };

  const handleDoubleClick = (field) => {
    setIsEditing(true);
    setTimeout(() => fieldRefs[field].current.focus(), 0);
  };

  const handleImageUpload = async () => {
    if (!file) return;
    try {
      const formData = new FormData();
      formData.append('profilePic', file);
      await uploadProfilePic(uid, formData);
      const res = await getUsername(uid);
      setUserData({ ...userData, profilePic: res.data.profilePic });
      setFile(null);
      document.querySelector('input[type="file"]').value = '';
      toast.success('Profile picture uploaded!', { autoClose: 2000 });
    } catch (err) {
      console.error(err);
      toast.error('Failed to upload profile picture', { autoClose: 2000 });
    }
  };

  const handleRemoveProfilePic = async () => {
    try {
      await editProfile(uid, { profilePic: null });
      setUserData({ ...userData, profilePic: null });
      setShowRemoveConfirm(false);
      toast.success('Profile picture removed!', { autoClose: 2000 });
    } catch (err) {
      console.error(err);
      toast.error('Failed to remove profile picture', { autoClose: 2000 });
    }
  };

  return (
    <>
      <Header />
      <ToastContainer />

      {/* Remove Confirmation */}
      {showRemoveConfirm && (
        <div
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => setShowRemoveConfirm(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-11/12 max-w-md p-6"
            onClick={e => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold text-gray-900 mb-2 text-center">Remove Profile Picture</h2>
            <p className="text-gray-600 text-center mb-4">
              Are you sure you want to remove your profile picture? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setShowRemoveConfirm(false)}
                className="flex-1 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleRemoveProfilePic}
                className="flex-1 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Sidebar */}
        <aside className="w-full lg:w-84 bg-gray-50 border-b lg:border-b-0 lg:border-r border-gray-200 p-4 flex-shrink-0">
          <div className="flex flex-col gap-2">
            <button
              className={`p-3 rounded-lg text-left transition-colors ${activeTab === 'profile'
                ? 'bg-rose-100 text-rose-500 border-l-4 border-rose-500'
                : 'hover:bg-gray-100 text-gray-700'}`}
              onClick={() => setActiveTab('profile')}
            >
              Profile Settings
            </button>
            <button
              className="p-3 rounded-lg text-left hover:bg-gray-100 text-gray-700"
              onClick={() => navigate('/settings/account')}
            >
              Account Settings
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-4 lg:p-6 bg-gray-50">
          {activeTab === 'profile' && (
            <div className="max-w-3xl mx-auto space-y-6">
              <h1 className="text-3xl font-bold mb-6">Profile Settings</h1>

              {/* Profile Picture */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col md:flex-row items-center gap-4">
                <img
                  src={userData.profilePic || DefaultPic}
                  alt="Profile"
                  className="h-24 w-24 md:h-28 md:w-28 rounded-full object-cover border-2 border-gray-200"
                />
                <div className="flex flex-col gap-2 w-full md:w-auto">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => setFile(e.target.files[0])}
                    className="text-sm"
                  />
                  <div className="flex gap-2 flex-wrap">
                    <button
                      onClick={handleImageUpload}
                      disabled={!file}
                      className={`px-4 py-2 rounded transition-colors ${
                        file
                          ? 'bg-rose-500 text-white hover:bg-rose-600'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      Upload
                    </button>
                    {userData.profilePic && (
                      <button
                        onClick={() => setShowRemoveConfirm(true)}
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* User Information */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-4">
                {['username', 'bio', 'instagram', 'facebook', 'twitter', 'branch', 'year', 'interests'].map(field => (
                  <div key={field}>
                    <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">{field === 'interests' ? 'Interests' : field}</label>
                    <div
                      ref={fieldRefs[field]}
                      contentEditable={isEditing}
                      suppressContentEditableWarning
                      onBlur={() => handleBlur(field)}
                      onDoubleClick={() => handleDoubleClick(field)}
                      onKeyDown={(e) => handleKeyDown(e, field)}
                      className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none min-h-[48px]"
                    >
                      {field === 'interests'
                        ? isEditing
                          ? userData.interests.join(', ')
                          : userData.interests.length > 0
                            ? <ul className="list-disc pl-4">{userData.interests.map((i, idx) => <li key={idx}>{i}</li>)}</ul>
                            : <p className="text-gray-400">No interests set</p>
                        : userData[field] || `Not set`}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Double-click to edit{field === 'interests' ? '. Separate with commas.' : ''}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
}

export default ProfilePageSettings;
