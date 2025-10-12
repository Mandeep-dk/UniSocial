import React, { useState, useRef, useEffect } from 'react';
import { editProfile, getUsername, uploadProfilePic, searchUser } from '../api';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../auth/firebase';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';
import DefaultPic from '../assets/image.png'; // fallback/default image
import { ToastContainer, toast } from 'react-toastify';

function ProfilePageSettings() {
  const [isEditing, setIsEditing] = useState(false);
  const [uid, setUid] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [instagram, setInstagram] = useState('');
  const [facebook, setFacebook] = useState('');
  const [twitter, setTwitter] = useState('');
  const [branch, setBranch] = useState('');
  const [year, setYear] = useState('');
  const [interest, setInterest] = useState([]);
  const [file, setFile] = useState(null);
  const [profilePic, setProfilePic] = useState(null);

  const fieldRefs = {
    username: useRef(null),
    bio: useRef(null),
    instagram: useRef(null),
    facebook: useRef(null),
    twitter: useRef(null),
    branch: useRef(null),
    year: useRef(null),
    interest: useRef(null),
  }
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    setActiveTab("profile");
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUid(user.uid);
        console.log("this is  ", user)
        const res = await getUsername(user.uid);
        setUsername(res.data.username);
        setBio(res.data.bio);
        setInstagram(res.data.instagram);
        setFacebook(res.data.facebook);
        setTwitter(res.data.twitter);
        setBranch(res.data.branch);
        setYear(res.data.year);
        setInterest(res.data.interests);
        setProfilePic(res.data.profilePic);

        console.log("res data", res);
      }
    });
    return () => unsubscribe();
  }, [uid]);

  const handleKeyDown = (e, field) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      fieldRefs[field].current.blur();
    }
  };

  const handleBlur = async (field) => {
    const updatedText = fieldRefs[field].current.innerText.trim();
    const updates = {};

    if (field === 'username' && updatedText !== username) {
      const userSearchRes = await searchUser(updatedText, uid);
      const res2 = userSearchRes.data;

      if (res2.exists) {
  toast.error("This username is already taken", {autoClose: 2000});
        // alert("The username is already taken");
        fieldRefs[field].current.innerText = username;
        return;
      } else {
        setUsername(updatedText);
        updates.username = updatedText;
      }
    } else if (field === 'bio' && updatedText !== bio) {
      setBio(updatedText);
      updates.bio = updatedText;
    }else if (field === 'instagram' && updatedText !== instagram) {
      setInstagram(updatedText);
      updates.instagram = updatedText;
    } 
    else if (field === 'facebook' && updatedText !== facebook) {
      setFacebook(updatedText);
      updates.facebook = updatedText;
    }
    else if (field === 'twitter' && updatedText !== twitter) {
      setTwitter(updatedText);
      updates.twitter = updatedText;
    }
    else if (field === 'branch' && updatedText !== branch) {
      setBranch(updatedText);
      updates.branch = updatedText;
    }else if (field === 'year' && updatedText !== year) {
      setYear(updatedText);
      updates.year = updatedText;
    } else if (field === 'interest') {
      if (updatedText !== interest.join(', ')) {
        const updatedArray = updatedText
          .split(',')
          .map(i => i.trim())
          .filter(i => i);
        setInterest(updatedArray);
        updates.interests = updatedArray;
      }
    }

    if (Object.keys(updates).length > 0) {
      try {
        await editProfile(uid, updates);
      } catch (err) {
        console.error("Failed to update profile:", err.message);
      }
    }

    setIsEditing(false);
  };

  const handleDoubleClick = (field) => {
    setIsEditing(true);
    setTimeout(() => {
      fieldRefs[field].current.focus();
    }, 0);
  };

  const handleImageUpload = async () => {
    if (!file) return;
    
    try {
      const formData = new FormData();
      formData.append('profilePic', file);
      
      await uploadProfilePic(uid, formData);
      
      // Refresh user data
      const res = await getUsername(uid);
      setUsername(res.data.username);
      setBio(res.data.bio);
      setInstagram(res.data.instagram);
      setFacebook(res.data.facebook);
      setTwitter(res.data.twitter);
      setBranch(res.data.branch);
      setYear(res.data.year);
      setInterest(res.data.interests);
      setProfilePic(res.data.profilePic);
      
      // Clear the file input
      setFile(null);
      document.querySelector('input[type="file"]').value = '';
      
      console.log(res);
      toast.success("Profile picture uploaded successfully!", { autoClose: 2000 });

      // alert("Profile picture uploaded successfully!");
    } catch (err) {
      console.error("Error in upload file", err.message);
            toast.error("Failed to upload profile picture. Please try again.", { autoClose: 2000 });

      // alert("Failed to upload profile picture. Please try again.");
    }
  };

  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);

  const handleRemoveProfilePic = async () => {
    try {
      // Use the existing editProfile endpoint to remove the profilePic field
      const updates = { profilePic: null }; // or "" if your backend expects empty string
      
      await editProfile(uid, updates);
      
      // Refresh user data
      const res = await getUsername(uid);
      setUsername(res.data.username);
      setBio(res.data.bio);
      setInstagram(res.data.instagram);
      setFacebook(res.data.facebook);
      setTwitter(res.data.twitter);
      setBranch(res.data.branch);
      setYear(res.data.year);
      setInterest(res.data.interests);
      setProfilePic(res.data.profilePic);
      
      console.log('Profile updated after removal:', res);
      setShowRemoveConfirm(false);
      toast.success("Profile picture removed successfully!", {autoclose: 2000});
      // alert("Profile picture removed successfully!");
    } catch (err) {
      console.error("Error removing profile picture", err.response?.data || err.message);
      toast.error("Failed to remove profile picture", {autoClose: 2000});
      // alert(`Failed to remove profile picture: ${err.response?.data?.message || err.message}`);
    }
  };

  return (
    <>
      <Header />
      
      {/* Remove Profile Picture Confirmation Modal */}
      {showRemoveConfirm && (
        <div 
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => setShowRemoveConfirm(false)}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl w-96 p-6 mx-4 transform transition-all duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-6">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Remove Profile Picture
              </h2>
              <p className="text-gray-600">
                Are you sure you want to remove your profile picture? This action cannot be undone.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                className="flex-1 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition-colors duration-200"
                onClick={() => setShowRemoveConfirm(false)}
              >
                Cancel
              </button>
              <button
                className="flex-1 px-4 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition-colors duration-200"
                onClick={handleRemoveProfilePic}
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}

      <div className='flex min-h-screen'>
        {/* Left Sidebar Navigation */}
        <div className='w-64 bg-gray-50 border-r border-gray-200 p-4'>
          <div className='flex flex-col gap-2'>
            <button
              className={`p-3 text-left rounded-lg transition-colors ${activeTab === 'profile'
                ? "bg-rose-100 text-rose-500 border-l-4 border-rose-500"
                : "hover:bg-gray-100 text-gray-700"
                }`}
              onClick={() => setActiveTab("profile")}
            >
              Profile Settings
            </button>
            <button
              className={`p-3 text-left rounded-lg transition-colors hover:bg-gray-100 text-gray-700`}
              onClick={() => navigate("/settings/account")}
            >
              Account Settings
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className='flex-1 p-6'>
          {activeTab === 'profile' && (
            <div className='max-w-2xl'>
              <h1 className='text-3xl font-bold mb-6'>Profile Settings</h1>

              <div className='space-y-6'>
                {/* Profile Picture Section */}
                <div className='bg-white p-6 rounded-lg border border-gray-200 shadow-sm'>
                  <h2 className='text-lg font-semibold mb-4'>Profile Picture</h2>
                  <div className='flex items-center gap-4'>
                    <img
                      src={profilePic ? `${profilePic}` : DefaultPic}
                      alt="Profile"
                      className="h-20 w-20 rounded-full object-cover border-2 border-gray-200"
                    />

                    <div className='flex flex-col gap-2'>
                      <input
                        type='file'
                        accept='image/*'
                        onChange={(e) => setFile(e.target.files[0])}
                        className='text-sm'
                      />
                      <div className='flex gap-2'>
                        <button
                          onClick={handleImageUpload}
                          disabled={!file}
                          className={`px-4 py-2 rounded transition-colors w-fit ${
                            file 
                              ? 'bg-rose-500 text-white hover:bg-rose-600' 
                              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          }`}
                        >
                          Upload
                        </button>
                        {profilePic && (
                          <button
                            onClick={() => setShowRemoveConfirm(true)}
                            className='px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors w-fit'
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* User Information Section */}
                <div className='bg-white p-6 rounded-lg border border-gray-200 shadow-sm'>
                  <h2 className='text-lg font-semibold mb-4'>User Information</h2>
                  <div className='space-y-4'>

                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-1'>Name</label>
                      <div
                        ref={fieldRefs.username}
                        contentEditable={isEditing}
                        suppressContentEditableWarning
                        onBlur={() => handleBlur('username')}
                        onDoubleClick={() => handleDoubleClick('username')}
                        onKeyDown={(e) => handleKeyDown(e, 'username')}
                        className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none min-h-[48px]"
                      >
                        {username}
                      </div>
                      <p className='text-xs text-gray-500 mt-1'>Double-click to edit</p>
                    </div>

                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-1'>Bio</label>
                      <div
                        ref={fieldRefs.bio}
                        contentEditable={isEditing}
                        suppressContentEditableWarning
                        onBlur={() => handleBlur('bio')}
                        onDoubleClick={() => handleDoubleClick('bio')}
                        onKeyDown={(e) => handleKeyDown(e, 'bio')}
                        className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none min-h-[48px]"
                      >
                        {bio}
                      </div>
                      <p className='text-xs text-gray-500 mt-1'>Double-click to edit</p>
                    </div>

                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-1'>Instagram link:</label>
                      <div
                        ref={fieldRefs.instagram}
                        contentEditable={isEditing}
                        suppressContentEditableWarning
                        onBlur={() => handleBlur('instagram')}
                        onDoubleClick={() => handleDoubleClick('instagram')}
                        onKeyDown={(e) => handleKeyDown(e, 'instagram')}
                        className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none min-h-[48px]"
                      >
                        {instagram}
                      </div>
                      <p className='text-xs text-gray-500 mt-1'>Double-click to edit</p>
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-1'>Facebook link:</label>
                      <div
                        ref={fieldRefs.facebook}
                        contentEditable={isEditing}
                        suppressContentEditableWarning
                        onBlur={() => handleBlur('facebook')}
                        onDoubleClick={() => handleDoubleClick('facebook')}
                        onKeyDown={(e) => handleKeyDown(e, 'facebook')}
                        className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none min-h-[48px]"
                      >
                        {facebook}
                      </div>
                      <p className='text-xs text-gray-500 mt-1'>Double-click to edit</p>
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-1'>Twitter link:</label>
                      <div
                        ref={fieldRefs.twitter}
                        contentEditable={isEditing}
                        suppressContentEditableWarning
                        onBlur={() => handleBlur('twitter')}
                        onDoubleClick={() => handleDoubleClick('twitter')}
                        onKeyDown={(e) => handleKeyDown(e, 'twitter')}
                        className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none min-h-[48px]"
                      >
                        {twitter}
                      </div>
                      <p className='text-xs text-gray-500 mt-1'>Double-click to edit</p>
                    </div>

                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-1'>Branch</label>
                      <div
                        ref={fieldRefs.branch}
                        contentEditable={isEditing}
                        suppressContentEditableWarning
                        onBlur={() => handleBlur('branch')}
                        onDoubleClick={() => handleDoubleClick('branch')}
                        onKeyDown={(e) => handleKeyDown(e, 'branch')}
                        className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none min-h-[48px]"
                      >
                        {branch ? branch : "Not set"}
                      </div>
                      <p className='text-xs text-gray-500 mt-1'>Double-click to edit</p>
                    </div>

                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-1'>Year</label>
                      <div
                        ref={fieldRefs.year}
                        contentEditable={isEditing}
                        suppressContentEditableWarning
                        onBlur={() => handleBlur('year')}
                        onDoubleClick={() => handleDoubleClick('year')}
                        onKeyDown={(e) => handleKeyDown(e, 'year')}
                        className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none min-h-[48px]"
                      >
                        {year ? year : "Not set"}
                      </div>
                      <p className='text-xs text-gray-500 mt-1'>Double-click to edit</p>
                    </div>

                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-1'>Interests</label>
                      <div
                        ref={fieldRefs.interest}
                        contentEditable={isEditing}
                        suppressContentEditableWarning
                        onBlur={() => handleBlur('interest')}
                        onDoubleClick={() => handleDoubleClick('interest')}
                        onKeyDown={(e) => handleKeyDown(e, 'interest')}
                        className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none min-h-[48px]"
                      >
                        {isEditing
                          ? interest.join(', ')
                          : interest.length > 0
                            ? (
                              <ul className="list-disc pl-4">
                                {interest.map((i, idx) => (
                                  <li key={idx}>{i}</li>
                                ))}
                              </ul>
                            ) : (
                              <p className='text-gray-400'>No interests set</p>
                            )}
                      </div>
                      <p className='text-xs text-gray-500 mt-1'>Double-click to edit. Separate multiple interests with commas.</p>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default ProfilePageSettings;