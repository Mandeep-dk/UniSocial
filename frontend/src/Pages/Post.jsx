import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../auth/firebase';
import Header from '../components/Header';
import { ToastContainer, toast } from 'react-toastify';

function Post() {
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [uid, setUid] = useState('');
  const [previewImage, setPreviewImage] = useState([]);
  const [file, setFile] = useState([]);
  const [tags, setTags] = useState([]);
  const [inputTagValue, setInputTagValue] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUid(user.uid);
      }
    })
    return () => unsubscribe();
  }, []);

  const handleCreatePost = async () => {
    if (!postContent || !uid || !postTitle) {
      toast.error("Please fill in all required fields", {autoClose: 2000});
      // alert("Please fill in all required fields");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", postTitle);
      formData.append("content", postContent);
      formData.append("uid", uid);
      tags.forEach(tag => { formData.append("tags", tag) });
      if (file.length > 0) {
        file.forEach(f => formData.append("media", f));
      }

      const res = await fetch("http://localhost:5000/api/posts", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      console.log("Post created: ", data);

      setPostTitle("");
      setPostContent("");
      setPreviewImage([]);
      setFile([]);
      setTags([]);
    } catch (err) {
      console.error("Failed to create post: ", err.message);
    }
  };

  const handleFiles = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFile((prev) => [...prev, ...selectedFiles]);

    const mediaFiles = selectedFiles.filter((file) =>
      file.type.startsWith("image") || file.type.startsWith("video")
    );

    mediaFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage((prev) => [...prev, { 
          src: reader.result, 
          type: file.type.startsWith("video") ? "video" : "image" 
        }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleTagKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      if (inputTagValue.trim() !== "" && !tags.includes(inputTagValue.trim())) {
        setTags([...tags, inputTagValue.trim()]);
        setInputTagValue("");
      }
    }
  }

  const removeTag = (indexOfTag) => {
    setTags(tags.filter((_, index) => index !== indexOfTag))
  }

  const removePreviewImage = (indexToRemove) => {
    setPreviewImage(prev => prev.filter((_, index) => index !== indexToRemove));
    setFile(prev => prev.filter((_, index) => index !== indexToRemove));
  }

  const handleChange = (e) => {
    const input = e.target.value;
    // Allow only A-Z, a-z, 0-9
    const filtered = input.replace(/[^A-Za-z0-9]/g, "");
    setInputTagValue(filtered)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Create New Post
          </h1>
          <p className="text-gray-600">Share your thoughts with the community</p>
        </div>

        {/* Main Form */}
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          {/* Title Input */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Post Title *
            </label>
            <input
              type="text"
              value={postTitle}
              onChange={(e) => setPostTitle(e.target.value)}
              placeholder="Enter an engaging title for your post..."
              className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200 text-lg"
            />
          </div>

          {/* Content Textarea */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Post Content *
            </label>
            <textarea
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              placeholder="Write your content here..."
              rows="8"
              className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200 resize-vertical"
            />
          </div>

          {/* Tags Section */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Tags
            </label>
            <div className="mb-3">
              <input
                type="text"
                value={inputTagValue}
                onKeyDown={handleTagKeyDown}
                onChange={handleChange}
                placeholder="Type a tag and press Enter or comma..."
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200"
              />
              <p className="text-xs text-gray-500 mt-1">Press Enter or comma to add tags</p>
            </div>

            {/* Tags Display */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-full shadow-sm hover:shadow-md transition-shadow duration-200"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => removeTag(index)}
                      className="text-white hover:text-red-200 transition-colors duration-200 ml-1 text-xs"
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* File Upload Section */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Media Files
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors duration-200">
              <input
                type="file"
                onChange={handleFiles}
                accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.mp4,.webm,.mov,.avi"
                multiple
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                </svg>
                Choose Files
              </label>
              <p className="text-sm text-gray-500 mt-2">
                Supported: JPG, PNG, PDF, DOC, DOCX, MP4, WEBM, MOV, AVI
              </p>
            </div>
          </div>

          {/* Media Preview */}
          {previewImage.length > 0 && (
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Media Preview
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {previewImage.map((media, index) => (
                  <div key={index} className="relative group">
                    {media.type === "video" ? (
                      <div className="relative w-full h-24 bg-black rounded-lg shadow-sm overflow-hidden">
                        <video
                          src={media.src}
                          className="w-full h-full object-contain"
                          controls
                          controlsList="nodownload"
                          preload="metadata"
                        >
                          Your browser does not support video playback.
                        </video>
                      </div>
                    ) : (
                      <img
                        src={media.src}
                        alt={`preview-${index}`}
                        className="w-full h-24 object-cover rounded-lg shadow-sm"
                      />
                    )}
                    <button
                      onClick={() => removePreviewImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600 z-10"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-center pt-4">
            <button
              onClick={handleCreatePost}
              className="px-8 py-3 bg-rose-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 focus:ring-4 focus:ring-blue-200"
            >
              Create Post
            </button>
          </div>
        </div>

        {/* Helper Text */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            Fields marked with * are required
          </p>
        </div>
      </div>
    </div>
  );
}

export default Post;