import React, { useEffect, useState } from 'react'
import { fetchComments, postComment, reactComment, deleteComment, editComment, getUsername } from '../api'
import CommentItem from './CommentItem';
import axios from 'axios';
import SingleDiscussion from '../Pages/SingleDiscussion';

const CommentSection = ({ postId, currentUser }) => {
    const [comments, setComments] = useState([]);
    const [content, setContent] = useState('');
    const [currentUserData, setCurrentUserData] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadComments();
        if (currentUser?.uid) {
            fetchCurrentUserData();
        }
    }, [postId, currentUser]);

    const fetchCurrentUserData = async () => {
        try {
            // Get current user's profile data including _id for posting comments
            const res = await getUsername([currentUser.uid]);
            
            // Handle different response formats from your API
            let userData = null;
            if (Array.isArray(res.data) && res.data.length > 0) {
                userData = res.data[0];
            } else if (res.data && res.data._id) {
                userData = res.data;
            }
            setCurrentUserData(userData);
        } catch (err) {
            console.error("Error fetching current user data:", err.message);
        }
    };

    const loadComments = async () => {
        try {
            setLoading(true);
            const res = await fetchComments(postId);
            
            setComments(res.data);
        } catch (err) {
            console.error("Error loading comments:", err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleComment = async () => {
        if (!content.trim() || !currentUserData?._id) {
            console.warn("Cannot post comment: missing content or user data");
            return;
        }
        
        try {
            const newComment = await postComment({
                postId,
                content: content.trim(),
                author: currentUserData._id,
            });
            
            setContent('');
            loadComments(); // Reload to get populated data
        } catch (err) {
            console.error("Error posting comment:", err.message);
        }
    }

    const handleReply = async (replyContent, parentId) => {
        if (!replyContent.trim() || !currentUserData?._id) {
            console.warn("Cannot post reply: missing content or user data");
            return;
        }
        
        try {
            await postComment({
                postId,
                content: replyContent.trim(),
                author: currentUserData._id, // Use the MongoDB _id
                parentComment: parentId
            });
            loadComments();
        } catch (err) {
            console.error("Error posting reply:", err.message);
        }
    };

    const handleReaction = async (id, type) => {
        if (!currentUser?.uid) return;
        
        try {
            await reactComment(id, { uid: currentUser.uid, type });
            loadComments();
        } catch (err) {
            console.error("Error reacting to comment:", err.message);
        }
    }

    const handleDelete = async (id, data) => {
        await deleteComment(id, data);
        loadComments();
    }

    const handleUpdate = async (id, newContent) => {
        try {
            await editComment(id, newContent);
            loadComments();
        } catch (err) {
            console.error("Error updating comment:", err.message);
        }
    }

    const nestComments = (comments, parentId = null) =>
        comments.filter(c => String(c.parentComment || null) === String(parentId));

    const renderComments = (parentId = null, depth = 0) =>
        nestComments(comments, parentId).map(comment => {
            // Check if comment has author data populated
            if (!comment.author) {
                console.warn("Comment missing author data:", comment);
                return null;
            }

            return (
                <>
                
                <CommentItem
                    key={comment._id}
                    comment={comment}
                    currentUser={currentUser}
                    currentUserData={currentUserData}
                    onReply={handleReply}
                    onReact={handleReaction}
                    onDelete={handleDelete}
                    onUpdate={handleUpdate}
                    replies={renderComments(comment._id, depth + 1)}
                    depth={depth}
                />

               
                </>
            );
        }).filter(Boolean); // Remove null entries

    const getProfilePicUrl = (profilePic) => {
        if (!profilePic) return '/default-avatar.png'; // Fallback image
        if (profilePic.startsWith('http')) return profilePic;
        return `${profilePic}`; // Adjust based on your backend setup
    };

    return (
        <div className="bg-white rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">
                Comments ({comments.length})
            </h3>
            
            {/* Comment Input */}
            <div className="flex gap-3 mb-6">
                {currentUserData && (
                    <div className="flex-shrink-0">
                        {/* <img
                            src={getProfilePicUrl(currentUserData.profilePic)}
                            alt={currentUserData.username || 'User'}
                            className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                            onError={(e) => {
                                e.target.src = '/default-avatar.png';
                            }}
                        /> */}
                    </div>
                )}
                <div className="flex-1">
                    <textarea
                        value={content}
                        placeholder="Write a comment..."
                        className="w-full p-3 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-rose-400"
                        rows="3"
                        onChange={(e) => setContent(e.target.value)}
                    />
                    <button 
                        onClick={handleComment} 
                        disabled={!content.trim() || !currentUserData || loading}
                        className="mt-2 px-4 py-2 bg-rose-500 text-white rounded hover:bg-rose-500 disabled:bg-rose-300 disabled:cursor-not-allowed transition-colors"
                    >
                        {loading ? 'Posting...' : 'Comment'}
                    </button>
                </div>
            </div>
            
            {/* Comments List */}
            <div className="space-y-4">
                {loading ? (
                    <div className="text-center py-4">
                        <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                        <p className="mt-2 text-gray-500">Loading comments...</p>
                    </div>
                ) : comments.length > 0 ? (
                    renderComments()
                ) : (
                    <div className="text-center py-8">
                        <p className="text-gray-500">No comments yet. Be the first to comment!</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default CommentSection