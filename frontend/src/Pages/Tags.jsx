import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getTag } from '../api';
import Header from '../components/Header';
import DefaultPic from '../assets/image.png';

function Tags() {
    const { tag } = useParams();
    const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await getTag(tag);
                console.log("Posts for tag:", res.data);
                setPosts(res.data);
            } catch (err) {
                console.error("Error while fetching posts:", err.message);
            }
        };

        fetchPosts();
    }, [tag]);

    return (
        <>
            <Header />
            <div className="max-w-5xl ml-4 px-4 py-8">
                <h1 className="text-3xl font-bold mb-6">Posts tagged: <span className="text-blue-500">#{tag}</span></h1>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {posts.map(post => (
                        <div
                            key={post._id}
                            className="bg-white shadow-md rounded-lg p-5 flex flex-col gap-4 hover:shadow-xl transition-shadow duration-300"
                        >
                            {/* Author Info */}
                            <div className="flex items-center gap-3">
                               <img
          className="h-12 w-12 rounded-full border border-gray-200 object-cover"
          src={post.author.profilePic ? `http://localhost:5000/${post.author.profilePic}` : DefaultPic}
          alt={post.author.username || "User"}
        />
                                <h2 className="font-semibold text-lg">{post.author.username}</h2>
                            </div>

                            {/* Post Title */}
                            <Link to={`/Discussion/${post._id}`} className="cursor-pointer text-xl font-bold text-gray-800">{post.title}</Link>

                            {/* Post Content */}
                            <p className="text-gray-700">{post.content}</p>

                            {/* Tags */}
                            <div className="flex flex-wrap gap-2 mt-2">
                                {post.tags.map((t, idx) => (
                                    <button
                                        key={idx}
                                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium cursor-pointer hover:bg-blue-200 transition"
                                        onClick={() => navigate(`/tags/${t}`)}
                                    >
                                        #{t}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

export default Tags;
