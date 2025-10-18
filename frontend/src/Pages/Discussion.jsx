import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import DefaultPic from '../assets/image.png';
import { getUsername, trendingTags, topPosts, topCommented } from '../api';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../auth/firebase';
import SearchBar from '../components/SearchBar';
import { MagnifyingGlassIcon, FireIcon, HandThumbUpIcon, ChatBubbleBottomCenterTextIcon, Bars3Icon } from '@heroicons/react/24/outline';

function Discussion() {
  const [posts, setPosts] = useState([]);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchResult, setSearchResult] = useState(null);
  const [topPostsR, setTopPostsR] = useState([]);
  const [trendingTagsR, setTrendingTagsR] = useState([]);
  const [topCommentedR, setTopCommentedR] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch("https://unisocial-8gc2.onrender.com/api/allPosts");
        const data = await res.json();
        setPosts(data);
      } catch (err) {
        console.error("Failed.", err.message);
      }
    }
    fetchPosts();
  }, []);

  useEffect(() => {
    const fetchR = async () => {
      try {
        const res1 = await trendingTags();
        const res2 = await topPosts();
        const res3 = await topCommented();

        setTrendingTagsR(res1.data);

        setTopPostsR(res2.data);
        setTopCommentedR(res3.data);
      } catch (e) {
        console.error("Error in right section:", e.message);
      }
    }

    fetchR()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <SearchBar
        onSearchStateChange={setIsSearchActive}
        onSearchResult={setSearchResult}
      />
      
      <div className="max-w-8xl mx-auto px-3 sm:px-4 lg:px-8">
        {/* Navigation Tabs */}
        <div className="py-4 sm:py-6">
          <nav className="flex space-x-1 bg-white rounded-lg p-1 shadow-sm border border-gray-200">
            <Link 
              to={`/Discussion`} 
              className={`flex-1 text-center py-2 sm:py-2.5 px-2 sm:px-4 rounded-md font-medium text-xs sm:text-sm transition-colors ${
                location.pathname === "/Discussion" 
                  ? "bg-rose-500 text-white shadow-sm" 
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              All Discussions
            </Link>
            <Link 
              to={`/Feed`} 
              className={`flex-1 text-center py-2 sm:py-2.5 px-2 sm:px-4 rounded-md font-medium text-xs sm:text-sm transition-colors ${
                location.pathname === "/Feed" 
                  ? "bg-blue-600 text-white shadow-sm" 
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              Following
            </Link>
          </nav>
        </div>

        {/* Mobile Sidebar Toggle */}
        <div className="lg:hidden mb-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="flex items-center space-x-2 px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Bars3Icon className="h-5 w-5" />
            <span className="text-sm font-medium">Trending & Popular</span>
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
          {/* Main Content Area */}
          <div className="flex-1 min-w-0">
            {/* Search Result */}
            {isSearchActive && searchResult && (
              <div className="mb-4 sm:mb-6">
                <Link 
                  to={`/discussion/${searchResult._id}`} 
                  className="block bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <div className="p-4 sm:p-6">
                    {/* Post Header */}
                    <div className="flex items-start space-x-2 sm:space-x-3">
                      <img
                        src={
                          searchResult.author && searchResult.author.profilePic
                            ? `${searchResult.author.profilePic}`
                            : DefaultPic
                        }
                        className="h-10 w-10 sm:h-12 sm:w-12 rounded-full object-cover border-2 border-gray-100"
                        alt="profile"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold text-sm sm:text-base text-gray-900 truncate">
                            {searchResult.author ? searchResult.author.username : "[deleted user]"}
                          </h3>
                          <span className="text-gray-400">•</span>
                          <span className="text-xs sm:text-sm text-gray-500">
                            {new Date(searchResult.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Post Content */}
                    <div className="mt-3 sm:mt-4">
                      <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">{searchResult.title}</h2>
                      <p className="text-sm sm:text-base text-gray-700 line-clamp-3">{searchResult.content}</p>
                    </div>

                    {/* Tags */}
                    {searchResult.tags && searchResult.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3 sm:mt-4">
                        {searchResult.tags.map((tag, index) => (
                          <button
                            key={index}
                            className="inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              navigate(`/tags/${tag}`);
                            }}
                          >
                            #{tag}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Engagement Stats */}
                    <div className="flex items-center space-x-4 sm:space-x-6 mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-100">
                      <div className="flex items-center space-x-1 text-xs sm:text-sm text-gray-500">
                        <HandThumbUpIcon className="h-4 w-4" />
                        <span>{searchResult.likes.length}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-xs sm:text-sm text-gray-500">
                        <HandThumbUpIcon className="h-4 w-4 rotate-180" />
                        <span>{searchResult.dislikes.length}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            )}

            {/* No Search Results */}
            {isSearchActive && !searchResult && (
              <div className="text-center py-8 sm:py-12">
                <MagnifyingGlassIcon className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
                <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No posts found</h3>
                <p className="text-sm sm:text-base text-gray-500">Try adjusting your search terms</p>
              </div>
            )}

            {/* Regular Posts */}
            {!isSearchActive && (
              <div className="space-y-3 sm:space-y-4">
                {posts.length === 0 ? (
                  <div className="text-center py-8 sm:py-12">
                    <ChatBubbleBottomCenterTextIcon className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
                    <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No discussions yet</h3>
                    <p className="text-sm sm:text-base text-gray-500">Be the first to start a conversation!</p>
                  </div>
                ) : (
                  posts.map((post) => (
                    <Link 
                      key={post._id}
                      to={`/discussion/${post._id}`}
                      className="block bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                    >
                      <div className="p-4 sm:p-6">
                        {/* Post Header */}
                        <div className="flex items-start space-x-2 sm:space-x-3">
                          <img
                            src={
                              post.author && post.author.profilePic
                                ? `${post.author.profilePic}`
                                : DefaultPic
                            }
                            className="h-10 w-10 sm:h-12 sm:w-12 rounded-full object-cover border-2 border-gray-100"
                            alt="profile"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2">
                              <h3 className="font-semibold text-sm sm:text-base text-gray-900 truncate">
                                {post.author && !post.author.deleted ? (
                                  post.author.username
                                ) : (
                                  <span className="text-gray-500">[deleted user]</span>
                                )}
                              </h3>
                              <span className="text-gray-400 hidden sm:inline">•</span>
                              <span className="text-xs sm:text-sm text-gray-500 hidden sm:inline">
                                {new Date(post.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            
                            {/* Date for mobile */}
                            <div className="text-xs text-gray-500 sm:hidden mt-0.5">
                              {new Date(post.createdAt).toLocaleDateString()}
                            </div>
                            
                            {/* Engagement Stats in Header */}
                            <div className="flex items-center space-x-3 sm:space-x-4 mt-1">
                              <div className="flex items-center space-x-1 text-xs sm:text-sm text-gray-500">
                                <HandThumbUpIcon className="h-3 w-3" />
                                <span>{post.likes.length}</span>
                              </div>
                              <div className="flex items-center space-x-1 text-xs sm:text-sm text-gray-500">
                                <HandThumbUpIcon className="h-3 w-3 rotate-180" />
                                <span>{post.dislikes.length}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Post Title */}
                        <div className="mt-3 sm:mt-4">
                          <h2 className="text-base sm:text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                            {post.title}
                          </h2>
                        </div>

                        {/* Tags */}
                        {post.tags && post.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-2 sm:mt-3">
                            {post.tags.map((tag, index) => (
                              <button
                                key={index}
                                className="inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  navigate(`/tags/${tag}`);
                                }}
                              >
                                #{tag}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </Link>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Sidebar - Hidden on mobile by default, shown when toggled */}
          <div className={`${sidebarOpen ? 'block' : 'hidden'} lg:block w-full lg:w-80 flex-shrink-0`}>
            <div className="lg:sticky lg:top-6 space-y-4 lg:space-y-6">
              {/* Trending Tags */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="px-4 py-2.5 lg:py-3 border-b border-gray-200">
                  <div className="flex items-center space-x-2">
                    <FireIcon className="h-4 w-4 lg:h-5 lg:w-5 text-orange-500" />
                    <h2 className="font-semibold text-sm lg:text-base text-gray-900">Trending Tags</h2>
                  </div>
                </div>
                <div className="p-3 lg:p-4">
                  {trendingTagsR.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5 lg:gap-2">
                      {trendingTagsR.map((tag, index) => (
                        <button
                          key={index}
                          onClick={() => navigate(`/tags/${tag._id}`)}
                          className="inline-flex items-center px-2.5 lg:px-3 py-1 lg:py-1.5 rounded-full text-xs lg:text-sm font-medium bg-orange-50 text-orange-700 hover:bg-orange-100 transition-colors"
                        >
                          #{tag._id}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-xs lg:text-sm">No trending tags yet</p>
                  )}
                </div>
              </div>

              {/* Most Liked Posts */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="px-4 py-2.5 lg:py-3 border-b border-gray-200">
                  <div className="flex items-center space-x-2">
                    <HandThumbUpIcon className="h-4 w-4 lg:h-5 lg:w-5 text-green-500" />
                    <h2 className="font-semibold text-sm lg:text-base text-gray-900">Most Liked</h2>
                  </div>
                </div>
                <div className="p-3 lg:p-4">
                  {topPostsR.length > 0 ? (
                    <ul className="space-y-2 lg:space-y-3">
                      {topPostsR.map((post, index) => (
                        <li key={index}>
                          <button
                            onClick={() => navigate(`/Discussion/${post._id}`)}
                            className="text-left w-full p-2 rounded-md hover:bg-gray-50 transition-colors"
                          >
                            <p className="text-xs lg:text-sm font-medium text-gray-900 line-clamp-2 hover:text-blue-600">
                              {post.title}
                            </p>
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500 text-xs lg:text-sm">No popular posts yet</p>
                  )}
                </div>
              </div>

              {/* Most Commented Posts */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="px-4 py-2.5 lg:py-3 border-b border-gray-200">
                  <div className="flex items-center space-x-2">
                    <ChatBubbleBottomCenterTextIcon className="h-4 w-4 lg:h-5 lg:w-5 text-blue-500" />
                    <h2 className="font-semibold text-sm lg:text-base text-gray-900">Most Discussed</h2>
                  </div>
                </div>
                <div className="p-3 lg:p-4">
                  {topCommentedR.length > 0 ? (
                    <ul className="space-y-2 lg:space-y-3">
                      {topCommentedR.map((post, index) => (
                        <li key={index}>
                          <button
                            onClick={() => navigate(`/Discussion/${post._id}`)}
                            className="text-left w-full p-2 rounded-md hover:bg-gray-50 transition-colors"
                          >
                            <p className="text-xs lg:text-sm font-medium text-gray-900 line-clamp-2 hover:text-blue-600">
                              {post.title}
                            </p>
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500 text-xs lg:text-sm">No discussed posts yet</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Discussion;