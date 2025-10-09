import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getUsername, userPosts, deletePost, followUser, isfollow, unfollowUser } from '../api';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import DefaultPic from '../assets/image.png';
import InstagramIcon from '../assets/instagram.png';
import FacebookIcon from '../assets/facebook.png';
import TwitterIcon from '../assets/twitter.png';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../auth/firebase';

function ProfilePage() {
  const { uid } = useParams();
  const [loggedInUid, setLoggedInUid] = useState(null);
  const [data, setData] = useState(null);
  const [profilePic, setProfilePic] = useState(null);
  const [username, setUsername] = useState(null);
  const [bio, setBio] = useState(null);
  const [instagram, setInstagram] = useState(null);
  const [facebook, setFacebook] = useState(null);
  const [twitter, setTwitter] = useState(null);
  const [interests, setInterests] = useState(null);
  const [branch, setBranch] = useState(null);
  const [year, setYear] = useState(null);
  const [ids, setIds] = useState(null);
  const [posts, setPosts] = useState([]);
  const [follow, setFollow] = useState(false);
  const [follower, setFollower] = useState([]);
  const [following, setFollowing] = useState([]);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const res = await getUsername(user.uid);
        console.log("xeitu beh", res.data)
        setLoggedInUid(res.data.uid);
        setProfilePic(res.data.profilePic);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getUsername(uid);
        console.log(res.data);

        setData(res.data);
        setProfilePic(res.data.profilePic);
        setUsername(res.data.username);
        setBio(res.data.bio);
        setInstagram(res.data.instagram);
        setFacebook(res.data.facebook);
        setTwitter(res.data.twitter);
        setInterests(res.data.interests);
        setBranch(res.data.branch);
        setYear(res.data.year);
        setIds(res.data._id);
        setFollowing(res.data.following);
        setFollower(res.data.followers);
      } catch (err) {
        console.error("Error occurred while fetching user:", err.message);
      }
    };
    fetchUser();
  }, [uid]);

  const ownProfile = uid === loggedInUid;

  useEffect(() => {
    if (!ids) return;

    const fetchPosts = async () => {
      try {
        const res = await userPosts(ids);
        console.log(res.data);
        setPosts(res.data);
      } catch (err) {
        console.error("Error occurred while fetching posts:", err.message);
      }
    };
    fetchPosts();
  }, [ids]);

  useEffect(() => {
    try {
      const checkFollowStatus = async () => {
        const res = await isfollow(loggedInUid, uid);
        setFollow(res.data.isFollowing);
        console.log("hello", res.data)
      }
      if (loggedInUid && uid) {
        checkFollowStatus();
      }
    } catch (err) {
      console.error(err.message);
    }
  }, [loggedInUid, uid])

  const handleFollow = async () => {
    if (follow) {
      await unfollowUser(loggedInUid, uid);
      setFollow(false);
    } else {
      await followUser(loggedInUid, uid);
      setFollow(true)
    }
  }

  return (
    <>
      <Header />
      
      {/* Hero Section with Gradient */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 w-full h-48"></div>

      {/* Profile Card */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative -mt-24 mb-8">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            {/* Profile Picture and Basic Info */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              {profilePic ? (
                <img
                  src={`http://localhost:5000/${data.profilePic}`}
                  className="border-4 border-white rounded-full h-32 w-32 object-cover shadow-lg ring-4 ring-slate-100"
                  alt="Profile"
                />
              ) : (
                <img
                  src={DefaultPic}
                  className="border-4 border-white rounded-full h-32 w-32 object-cover shadow-lg ring-4 ring-slate-100"
                  alt="Default"
                />
              )}

              <div className="flex-1 text-center sm:text-left">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-bold text-slate-900">{username}</h1>
                    {branch && year && (
                      <p className="text-slate-600 mt-1">{branch} • {year} year</p>
                    )}
                  </div>
                  
                  {!ownProfile && (
                    <button 
                      className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                        follow 
                          ? 'bg-slate-100 text-slate-700 hover:bg-slate-200' 
                          : 'bg-slate-900 text-white hover:bg-slate-800 shadow-md'
                      }`}
                      onClick={handleFollow}
                    >
                      {follow ? "Following" : "Follow"}
                    </button>
                  )}
                </div>

                {/* Stats */}
                <div className="flex gap-8 mt-6 justify-center sm:justify-start">
                  <div className="text-center sm:text-left">
                    <p className="text-2xl font-bold text-slate-900">{follower.length}</p>
                    <p className="text-sm text-slate-600">Followers</p>
                  </div>
                  <div className="text-center sm:text-left">
                    <p className="text-2xl font-bold text-slate-900">{following.length}</p>
                    <p className="text-sm text-slate-600">Following</p>
                  </div>
                  <div className="text-center sm:text-left">
                    <p className="text-2xl font-bold text-slate-900">{posts.length}</p>
                    <p className="text-sm text-slate-600">Posts</p>
                  </div>
                </div>

                {/* Bio */}
                {bio && (
                  <p className="mt-6 text-slate-700 leading-relaxed">{bio}</p>
                )}

                {/* Interests */}
                {interests && (
                  <div className="mt-4 flex flex-wrap gap-2 justify-center sm:justify-start">
                    {(Array.isArray(interests) ? interests : [interests]).map((interest, idx) => (
                      <span key={idx} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm">
                        {interest}
                      </span>
                    ))}
                  </div>
                )}

                {/* Social Links */}
                {(instagram || facebook || twitter) && (
                  <div className="flex gap-4 mt-6 justify-center sm:justify-start">
                    {instagram && (
                      <a
                        href={instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors"
                      >
                        <img src={InstagramIcon} className="h-5 w-5" alt="Instagram" />
                      </a>
                    )}
                    {facebook && (
                      <a
                        href={facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors"
                      >
                        <img src={FacebookIcon} className="h-5 w-5" alt="Facebook" />
                      </a>
                    )}
                    {twitter && (
                      <a
                        href={twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors"
                      >
                        <img src={TwitterIcon} className="h-5 w-5" alt="Twitter" />
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Posts Section */}
        <div className="pb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Posts</h2>
          
          {posts.length > 0 ? (
            <div className="space-y-4">
              {posts.map((post) => (
                <div 
                  key={post._id} 
                  onClick={() => navigate(`/discussion/${post._id}`)} 
                  className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 p-6 cursor-pointer border border-slate-100"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          post?.author?.profilePic
                            ? `http://localhost:5000/${post.author.profilePic}`
                            : DefaultPic
                        }
                        alt="Profile"
                        className="h-12 w-12 rounded-full object-cover ring-2 ring-slate-100"
                      />
                      <div>
                        <p className="font-medium text-slate-900">{post.author.username}</p>
                        <p className="text-sm text-slate-500">
                          {new Date(post.createdAt).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>

                    {ownProfile && (
                      <button
                        className="text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg transition-colors text-sm font-medium"
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedPostId(post._id);
                          setDeleteConfirm(true);
                        }}
                      >
                        Delete
                      </button>
                    )}
                  </div>

                  <h3 className="text-xl font-semibold text-slate-900 mb-2">{post.title}</h3>
                  <p className="text-slate-700 leading-relaxed mb-4">{post.content}</p>

                  <div className="flex items-center gap-6 text-slate-600">
                    <div className="flex items-center gap-2">
                      <span>👍</span>
                      <span className="text-sm font-medium">{post.likes.length}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>👎</span>
                      <span className="text-sm font-medium">{post.dislikes.length}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-xl border-2 border-dashed border-slate-200">
              <p className="text-slate-500 text-lg">No posts yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
          onClick={() => setDeleteConfirm(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              Delete Post?
            </h2>
            <p className="text-slate-600 mb-8">
              This action cannot be undone. This post will be permanently deleted.
            </p>

            <div className="flex gap-3">
              <button
                className="flex-1 px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-all duration-200"
                onClick={() => setDeleteConfirm(false)}
              >
                Cancel
              </button>
              <button
                className="flex-1 px-6 py-3 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                onClick={() => {
                  deletePost(selectedPostId);
                  setDeleteConfirm(false);
                  window.location.reload();
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default ProfilePage;