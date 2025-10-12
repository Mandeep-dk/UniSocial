import React, { useRef, useState, useEffect } from 'react';
import DefaultPic from '../assets/image.png';
import { useNavigate } from "react-router-dom";
import { Pencil, Trash2 } from 'lucide-react';

const CommentItem = ({ comment, onReply, onReact, replies, onDelete, onUpdate, currentUserData }) => {
    const [showReplyBox, setShowReplyBox] = useState(false);
    const [replyContent, setReplyContent] = useState('');
    const [openMenu, setOpenMenu] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [text, setText] = useState('');
    const [deleteConfirm, setDeleteConfirm] = useState(false);
    const [selectedComment, setSelectedComment] = useState(null);
    const navigate = useNavigate();

    const divRef = useRef(null);


    const toggleReplyBox = () => {
        setShowReplyBox(!showReplyBox);
        setReplyContent('');
    };

    const submitReply = () => {
        onReply(replyContent, comment._id);
        toggleReplyBox();
        // console.log("hi bro", currentUserData)
    };

    const handleOpenMenu = () => {
        setOpenMenu(prev => !prev)
        // setOpenMenu(true);
    }

    const handleEdit = () => {
        setIsEditing(true);
        setOpenMenu(false);
        setTimeout(() => {
            divRef.current.focus();
        }, 0);
    }

    const handleBlur = () => {
        const updatedText = divRef.current.innerText.trim();
        if (updatedText) {
            setText(updatedText);
            onUpdate(comment._id, { content: updatedText, edited: true });
        }
        setIsEditing(false);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            divRef.current.blur();
        }
    }

    const handleDelete = (id) => {
        // const confirmBox = window.confirm("Are you sure you want to delete this comment?");
        setDeleteConfirm(true);
        onDelete(id, { deleted: true });
    }


    return (
        <div className="pl-2 sm:pl-4 border-l">
            <div className="relative p-2 sm:p-3 rounded">
                <div className="flex items-center gap-2">
                    <img
                        src={
                            currentUserData?.profilePic
                                ? `${currentUserData.profilePic.replace(/\\/g, "/")}`
                                : DefaultPic
                        }
                        alt="profile"
                        onClick={() => navigate(`/profile/${currentUserData.uid}`)}
                        className="h-8 w-8 sm:h-10 sm:w-10 rounded-full object-cover flex-shrink-0"
                    />

                    <div className="font-semibold text-sm sm:text-base truncate">
                        {comment?.author?.username || "Unknown User"}
                    </div>
                </div>

                <div
                    ref={divRef}
                    contentEditable={isEditing}
                    suppressContentEditableWarning
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    className={`rounded min-h-[40px] ${isEditing ? "bg-white border-rose-400 outline outline-1" : "bg-white"
                        }`}
                >
                    <p className="text-xs sm:text-sm ml-10 sm:ml-12 break-words">
                        {comment.deleted ? (
                            <span className="italic text-gray-400">[deleted]</span>
                        ) : (
                            <>
                                {comment.content}{' '}
                                {comment.edited && (
                                    <span className="text-xs text-gray-400">(edited)</span>
                                )}
                            </>
                        )}
                    </p>
                </div>

                <button
                    onClick={handleOpenMenu}
                    className="absolute top-2 right-2 text-lg sm:text-xl p-1 hover:bg-gray-100 rounded"
                >
                    ⋮
                </button>
                {deleteConfirm &&
                    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setDeleteConfirm(false)}
                    >
                        <div className="bg-white rounded-2xl shadow-2xl w-96 p-8 mx-4 animate-in zoom-in-95 duration-200"
                            onClick={(e) => e.stopPropagation()}>
                            <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
                                Are you sure?
                            </h2>
                            <div className='flex gap-3'>
                                <button className="flex-1 px-6 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition-all duration-200"
                                    onClick={() => setDeleteConfirm(false)}>Cancel</button>
                                <button className="flex-1 px-6 py-3 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                                    onClick={() => handleDelete(selectedComment)}>Confirm</button>
                            </div>

                        </div>
                    </div>
                }
                {openMenu && (
                    <div className='absolute top-8 right-2 bg-white w-32 border border-gray-200 rounded-sm shadow-lg z-10'>
                        <ul className='p-2 sm:p-4'>
                            <li className='hover:text-rose-500'>
                                <button className="flex items-center gap-2 text-sm" onClick={() => { setSelectedComment(comment._id); setDeleteConfirm(true) }}>
                                    <Trash2 size={16} />Delete
                                </button>
                            </li>
                            <li className='mt-2 sm:mt-3 hover:text-rose-500'>
                                <button className="flex items-center gap-2 text-sm" onClick={handleEdit}>
                                    <Pencil size={16} />Edit
                                </button>
                            </li>
                        </ul>
                    </div>
                )}

                <div className="flex gap-3 sm:gap-4 mt-2 ml-10 sm:ml-12 text-xs sm:text-sm text-gray-600 flex-wrap">
                    <button
                        onClick={() => onReact(comment._id, 'like')}
                        className="flex items-center gap-1 hover:text-rose-500"
                    >
                        👍 <span>{comment.likes.length}</span>
                    </button>
                    <button
                        onClick={() => onReact(comment._id, 'dislike')}
                        className="flex items-center gap-1 hover:text-rose-500"
                    >
                        👎 <span>{comment.dislikes.length}</span>
                    </button>
                    <button
                        onClick={toggleReplyBox}
                        className="hover:text-rose-500"
                    >
                        Reply
                    </button>
                </div>

                {showReplyBox && (
                    <div className="mt-2 ml-10 sm:ml-12">
                        <textarea
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            className="w-full p-2 border rounded text-sm resize-none"
                            rows="2"
                            placeholder="Write a reply..."
                        />
                        <div className="flex justify-end mt-2">
                            <button
                                onClick={submitReply}
                                className="px-3 py-1 bg-rose-500 text-white rounded text-sm hover:bg-rose-600"
                            >
                                Send
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Replies with reduced nesting on mobile */}
            <div className="pl-3 sm:pl-6 mt-2">
                {replies}
            </div>
        </div>
    );
};

export default CommentItem;
