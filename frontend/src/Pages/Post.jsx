import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../auth/firebase';
import Header from '../components/Header';
import { ToastContainer, toast } from 'react-toastify';
import { FileText, File } from 'lucide-react';

function Post() {
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [uid, setUid] = useState('');
  const [previewImage, setPreviewImage] = useState([]);
  const [file, setFile] = useState([]);
  const [tags, setTags] = useState([]);
  const [inputTagValue, setInputTagValue] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUid(user.uid);
      }
    })
    return () => unsubscribe();
  }, []);

  const handleCreatePost = async () => {
    setLoading(true);
    if (!postContent || !uid || !postTitle) {
      toast.error("Please fill in all required fields", { autoClose: 2000 });
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

      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/posts`, {
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
    } finally {
      setLoading(false);
    }
  };

  const getFileType = (file) => {
    if (file.type.startsWith("image")) return "image";
    if (file.type.startsWith("video")) return "video";
    if (file.type === "application/pdf") return "pdf";
    if (file.type.includes("word") || file.name.endsWith(".doc") || file.name.endsWith(".docx")) return "doc";
    return "other";
  };

  const handleFiles = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFile((prev) => [...prev, ...selectedFiles]);

    selectedFiles.forEach((file) => {
      const fileType = getFileType(file);
      
      if (fileType === "image" || fileType === "video") {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewImage((prev) => [...prev, {
            src: reader.result,
            type: fileType,
            name: file.name
          }]);
        };
        reader.readAsDataURL(file);
      } else {
        // For documents, just store the file info
        setPreviewImage((prev) => [...prev, {
          src: null,
          type: fileType,
          name: file.name,
          size: (file.size / 1024).toFixed(2) // Size in KB
        }]);
      }
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
    const filtered = input.replace(/[^A-Za-z0-9]/g, "");
    setInputTagValue(filtered)
  }

  const getFileIcon = (type) => {
    if (type === "pdf") {
      return <FileText className="w-8 h-8 text-red-500" />;
    }
    return <File className="w-8 h-8 text-blue-500" />;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Create New Post
          </h1>
          <p className="text-sm sm:text-base text-gray-600">Share your thoughts with the community</p>
        </div>

        {/* Main Form */}
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8">
          {/* Title Input */}
          <div className="mb-4 sm:mb-6">
            <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
              Post Title *
            </label>
            <input
              type="text"
              value={postTitle}
              onChange={(e) => setPostTitle(e.target.value)}
              placeholder="Enter an engaging title for your post..."
              className="w-full p-3 sm:p-4 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200 text-base sm:text-lg"
            />
          </div>

          {/* Content Textarea */}
          <div className="mb-4 sm:mb-6">
            <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
              Post Content *
            </label>
            <textarea
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              placeholder="Write your content here..."
              rows="6"
              className="w-full p-3 sm:p-4 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200 resize-vertical text-sm sm:text-base"
            />
          </div>

          {/* Tags Section */}
          <div className="mb-4 sm:mb-6">
            <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
              Tags
            </label>
            <div className="mb-3">
              <input
                type="text"
                value={inputTagValue}
                onKeyDown={handleTagKeyDown}
                onChange={handleChange}
                placeholder="Type a tag and press Enter or comma..."
                className="w-full p-2.5 sm:p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200 text-sm sm:text-base"
              />
              <p className="text-xs text-gray-500 mt-1">Press Enter or comma to add tags</p>
            </div>

            {/* Tags Display */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-2 px-2.5 sm:px-3 py-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs sm:text-sm rounded-full shadow-sm hover:shadow-md transition-shadow duration-200"
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
          <div className="mb-4 sm:mb-6">
            <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
              Media Files
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-6 text-center hover:border-blue-400 transition-colors duration-200">
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
                className="cursor-pointer inline-flex items-center px-3 sm:px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200 text-sm sm:text-base"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                </svg>
                Choose Files
              </label>
              <p className="text-xs sm:text-sm text-gray-500 mt-2">
                Supported: JPG, PNG, PDF, DOC, DOCX, MP4, WEBM, MOV, AVI
              </p>
            </div>
          </div>

          {/* Media Preview */}
          {previewImage.length > 0 && (
            <div className="mb-4 sm:mb-6">
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                Media Preview
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {previewImage.map((media, index) => (
                  <div key={index} className="relative group">
                    {media.type === "video" ? (
                      <div className="relative w-full aspect-video bg-black rounded-lg shadow-sm overflow-hidden">
                        <video
                          src={media.src}
                          className="w-full h-full object-cover"
                          controls
                          controlsList="nodownload"
                          preload="metadata"
                        >
                          Your browser does not support video playback.
                        </video>
                      </div>
                    ) : media.type === "image" ? (
                      <div className="relative w-full aspect-video bg-gray-100 rounded-lg shadow-sm overflow-hidden">
                        <img
                          src={media.src}
                          alt={`preview-${index}`}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center bg-gray-50 border-2 border-gray-200 rounded-lg shadow-sm p-3 sm:p-4 aspect-video hover:bg-gray-100 transition-colors">
                        {getFileIcon(media.type)}
                        <span className="text-gray-700 text-xs sm:text-sm font-medium mt-2 truncate w-full text-center px-2">
                          {media.name}
                        </span>
                        <span className="text-gray-500 text-xs mt-1">
                          {media.size} KB
                        </span>
                      </div>
                    )}

                    <button
                      onClick={() => removePreviewImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 text-xs flex items-center justify-center shadow-lg transition-colors z-10"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Submit Button */}
          {loading?(
                    <p className="text-rose-500 font-medium">Uploading...</p>

          ):(

          <div className="flex justify-center pt-2 sm:pt-4">
            <button
              onClick={handleCreatePost}
              className="w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 bg-rose-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 focus:ring-4 focus:ring-blue-200 text-sm sm:text-base"
            >
              Create Post
            </button>
          </div>
          )}
        </div>

        {/* Helper Text */}
        <div className="text-center mt-4 sm:mt-6">
          <p className="text-xs sm:text-sm text-gray-500">
            Fields marked with * are required
          </p>
        </div>
      </div>
    </div>
  );
}

export default Post;