import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header'
import { getUsername, userPosts, topPosts, trendingTags, topCommented } from '../api';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../auth/firebase';
import DefaultPic from '../assets/image.png';
import SearchBar from '../components/SearchBar';
import { MagnifyingGlassIcon, FireIcon, HandThumbUpIcon, ChatBubbleBottomCenterTextIcon, UserGroupIcon, Bars3Icon } from '@heroicons/react/24/outline';

function FollowingFeed() {
    const [loggedInUid, setLoggedInUid] = useState(null);
    const [followingUid, setFollowingUid] = useState([])
    const [followingId, setFollowingId] = useState(null);
    const [data, setData] = useState([]);
    const [topPostsR, setTopPostsR] = useState([]);
    const [trendingTagsR, setTrendingTagsR] = useState([]);
    const [topCommentedR, setTopCommentedR] = useState([]);
    const [isSearchActive, setIsSearchActive] = useState(false);
    const [searchResult, setSearchResult] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const res = await getUsername(user.uid);
                setLoggedInUid(res.data.uid);
                setFollowingUid(res.data.following);
            }
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const fetchPosts = (async () => {
            try {
                if (followingUid.length > 0) {
                    const res = await getUsername(followingUid);
                    setFollowingId(res.data._id);
                }
            } catch (err) {
                console.error(err.message);
            }
        })
        fetchPosts()
    }, [followingUid])

    useEffect(() => {
        const fetchPosts = (async () => {
            try {
                if (followingId) {
                    const res = await userPosts(followingId);
                    setData(res.data);
                }
            } catch (err) {
                console.error(err.message);
            }
        })
        fetchPosts()
    }, [followingId])

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
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Navigation Tabs */}
                <div className="py-4 md:py-6">
                    <nav className="flex space-x-1 bg-white rounded-lg p-1 shadow-sm border border-gray-200">
                        <Link 
                            to={`/Discussion`} 
                            className="flex-1 text-center py-2 md:py-2.5 px-2 md:px-4 rounded-md font-medium text-xs md:text-sm transition-colors text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                        >
                            All Discussions
                        </Link>
                        <Link 
                            to={`/Feed`} 
                            className="flex-1 text-center py-2 md:py-2.5 px-2 md:px-4 rounded-md font-medium text-xs md:text-sm transition-colors bg-rose-500 text-white shadow-sm"
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
                            <div className="mb-4 md:mb-6">
                                <Link 
                                    to={`/discussion/${searchResult._id}`} 
                                    className="block bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                                >
                                    <div className="p-4 md:p-6">
                                        {/* Post Header */}
                                        <div className="flex items-start space-x-3">
                                            <img
                                                src={
                                                    searchResult.author && searchResult.author.profilePic
                                                        ? `${searchResult.author.profilePic}`
                                                        : DefaultPic
                                                }
                                                className="h-10 w-10 md:h-12 md:w-12 rounded-full object-cover border-2 border-gray-100"
                                                alt="profile"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
                                                    <h3 className="font-semibold text-sm md:text-base text-gray-900 truncate">
                                                        {searchResult.author ? searchResult.author.username : "[deleted user]"}
                                                    </h3>
                                                    <span className="hidden sm:inline text-gray-400">•</span>
                                                    <span className="text-xs md:text-sm text-gray-500">
                                                        {new Date(searchResult.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Post Content */}
                                        <div className="mt-3 md:mt-4">
                                            <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">{searchResult.title}</h2>
                                            <p className="text-sm md:text-base text-gray-700 line-clamp-3">{searchResult.content}</p>
                                        </div>

                                        {/* Tags */}
                                        {searchResult.tags && searchResult.tags.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mt-3 md:mt-4">
                                                {searchResult.tags.map((tag, index) => (
                                                    <button
                                                        key={index}
                                                        className="inline-flex items-center px-2 md:px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors"
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
                                        <div className="flex items-center space-x-4 md:space-x-6 mt-3 md:mt-4 pt-3 md:pt-4 border-t border-gray-100">
                                            <div className="flex items-center space-x-1 text-xs md:text-sm text-gray-500">
                                                <HandThumbUpIcon className="h-4 w-4" />
                                                <span>{searchResult.likes.length}</span>
                                            </div>
                                            <div className="flex items-center space-x-1 text-xs md:text-sm text-gray-500">
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
                            <div className="text-center py-8 md:py-12">
                                <MagnifyingGlassIcon className="h-10 w-10 md:h-12 md:w-12 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-base md:text-lg font-medium text-gray-900 mb-2">No posts found</h3>
                                <p className="text-sm md:text-base text-gray-500">Try adjusting your search terms</p>
                            </div>
                        )}

                        {/* Following Feed Posts */}
                        {!isSearchActive && (
                            <div className="space-y-3 md:space-y-4">
                                {data.length === 0 ? (
                                    <div className="text-center py-8 md:py-12">
                                        <UserGroupIcon className="h-10 w-10 md:h-12 md:w-12 text-gray-400 mx-auto mb-4" />
                                        <h3 className="text-base md:text-lg font-medium text-gray-900 mb-2">No posts from your followings</h3>
                                        <p className="text-sm md:text-base text-gray-500 mb-4">Follow some users to see their posts here!</p>
                                        <Link 
                                            to="/Discussion"
                                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-rose-500 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
                                        >
                                            Browse All Discussions
                                        </Link>
                                    </div>
                                ) : (
                                    data.map((post) => (
                                        <Link 
                                            key={post._id}
                                            to={`/discussion/${post._id}`}
                                            className="block bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                                        >
                                            <div className="p-4 md:p-6">
                                                {/* Post Header */}
                                                <div className="flex items-start space-x-3">
                                                    <img
                                                        src={
                                                            post.author && post.author.profilePic
                                                                ? `${post.author.profilePic}`
                                                                : DefaultPic
                                                        }
                                                        className="h-10 w-10 md:h-12 md:w-12 rounded-full object-cover border-2 border-gray-100"
                                                        alt="profile"
                                                    />
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
                                                            <h3 className="font-semibold text-sm md:text-base text-gray-900 truncate">
                                                                {post.author ? post.author.username : "[deleted user]"}
                                                            </h3>
                                                            <span className="hidden sm:inline text-gray-400">•</span>
                                                            <span className="text-xs md:text-sm text-gray-500">
                                                                {new Date(post.createdAt).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                        
                                                        {/* Engagement Stats in Header */}
                                                        <div className="flex items-center space-x-3 md:space-x-4 mt-1">
                                                            <div className="flex items-center space-x-1 text-xs md:text-sm text-gray-500">
                                                                <HandThumbUpIcon className="h-3 w-3" />
                                                                <span>{post.likes.length}</span>
                                                            </div>
                                                            <div className="flex items-center space-x-1 text-xs md:text-sm text-gray-500">
                                                                <HandThumbUpIcon className="h-3 w-3 rotate-180" />
                                                                <span>{post.dislikes.length}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Post Content */}
                                                <div className="mt-3 md:mt-4">
                                                    <h2 className="text-base md:text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors mb-2">
                                                        {post.title}
                                                    </h2>
                                                    <p className="text-sm md:text-base text-gray-700 line-clamp-3">{post.content}</p>
                                                </div>

                                                {/* Tags */}
                                                {post.tags && post.tags.length > 0 && (
                                                    <div className="flex flex-wrap gap-2 mt-3">
                                                        {post.tags.map((tag, index) => (
                                                            <button
                                                                key={index}
                                                                className="inline-flex items-center px-2 md:px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
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
                        <div className="lg:sticky lg:top-6 space-y-4 md:space-y-6">
                            {/* Trending Tags */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                                <div className="px-4 py-3 border-b border-gray-200">
                                    <div className="flex items-center space-x-2">
                                        <FireIcon className="h-5 w-5 text-orange-500" />
                                        <h2 className="font-semibold text-sm md:text-base text-gray-900">Trending Tags</h2>
                                    </div>
                                </div>
                                <div className="p-4">
                                    {trendingTagsR.length > 0 ? (
                                        <div className="flex flex-wrap gap-2">
                                            {trendingTagsR.map((tag, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => navigate(`/tags/${tag._id}`)}
                                                    className="inline-flex items-center px-2.5 md:px-3 py-1 md:py-1.5 rounded-full text-xs md:text-sm font-medium bg-orange-50 text-orange-700 hover:bg-orange-100 transition-colors"
                                                >
                                                    #{tag._id}
                                                </button>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-gray-500 text-xs md:text-sm">No trending tags yet</p>
                                    )}
                                </div>
                            </div>

                            {/* Most Liked Posts */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                                <div className="px-4 py-3 border-b border-gray-200">
                                    <div className="flex items-center space-x-2">
                                        <HandThumbUpIcon className="h-5 w-5 text-green-500" />
                                        <h2 className="font-semibold text-sm md:text-base text-gray-900">Most Liked</h2>
                                    </div>
                                </div>
                                <div className="p-4">
                                    {topPostsR.length > 0 ? (
                                        <ul className="space-y-3">
                                            {topPostsR.map((post, index) => (
                                                <li key={index}>
                                                    <button
                                                        onClick={() => navigate(`/Discussion/${post._id}`)}
                                                        className="text-left w-full p-2 rounded-md hover:bg-gray-50 transition-colors"
                                                    >
                                                        <p className="text-xs md:text-sm font-medium text-gray-900 line-clamp-2 hover:text-blue-600">
                                                            {post.title}
                                                        </p>
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-gray-500 text-xs md:text-sm">No popular posts yet</p>
                                    )}
                                </div>
                            </div>

                            {/* Most Commented Posts */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                                <div className="px-4 py-3 border-b border-gray-200">
                                    <div className="flex items-center space-x-2">
                                        <ChatBubbleBottomCenterTextIcon className="h-5 w-5 text-blue-500" />
                                        <h2 className="font-semibold text-sm md:text-base text-gray-900">Most Discussed</h2>
                                    </div>
                                </div>
                                <div className="p-4">
                                    {topCommentedR.length > 0 ? (
                                        <ul className="space-y-3">
                                            {topCommentedR.map((post, index) => (
                                                <li key={index}>
                                                    <button
                                                        onClick={() => navigate(`/Discussion/${post._id}`)}
                                                        className="text-left w-full p-2 rounded-md hover:bg-gray-50 transition-colors"
                                                    >
                                                        <p className="text-xs md:text-sm font-medium text-gray-900 line-clamp-2 hover:text-blue-600">
                                                            {post.title}
                                                        </p>
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-gray-500 text-xs md:text-sm">No discussed posts yet</p>
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

export default FollowingFeed