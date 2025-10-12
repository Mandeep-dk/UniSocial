import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import CommentSection from '../components/CommentSection';
import { getUsername, reactPost } from '../api';
import { useNavigate, useParams } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../auth/firebase';

const SingleDiscussion = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [uid, setUid] = useState(null);
  const [user, setUser] = useState(null);
  const [images, setImages] = useState([]);
  const [video, setVideo] = useState([]);
  const [files, setFiles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentIndexVideo, setCurrentIndexVideo] = useState(0);


  const navigate = useNavigate();

  const nextImage = () => {
    setCurrentIndex((index) => index === images.length - 1 ? 0 : index + 1);
  }

  const prevImage = () => {
    setCurrentIndex((index) => index === 0 ? images.length - 1 : index - 1);
  }

  const nextVideo = () =>{
    setCurrentIndexVideo((index)=>index===video.length-1?0:index+1);
  }

  const prevVideo =()=>{
    setCurrentIndexVideo((index)=>index===0?video.length-1:index-1)
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUid(user.uid);
        // console.log(user)
        setUser(user);
      }
    });
    return () => unsubscribe();
  }, [uid]);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`https://unisocial-8gc2.onrender.com/api/singlePost/${id}`);
        const data = await res.json();
        setPost(data);

        if (data.media && Array.isArray(data.media)) {
          const imgFiles = data.media.filter((file) =>
            file.match(/\.(jpg|jpeg|png|gif|webp)$/i)
          );
          const videoFiles = data.media.filter((file) =>
            file.match(/\.(mp4|webm|ogg|mov|avi|mkv)$/i)
          );
          const otherFiles = data.media.filter(
            (file) => !file.match(/\.(jpg|jpeg|png|gif|webp|mp4|webm|ogg|mov|avi|mkv)$/i)
          );

          setImages(imgFiles);
          setVideo(videoFiles);
          setFiles(otherFiles);
        }
        console.log(data);
      } catch (err) {
        console.error("Failed.", err.message);
      }
    };
    fetchPost();
  }, [id, user]);



 const handleReact = async (postId, type) => {
  try {
    const res = await reactPost(postId, { uid: uid, type });
    
    // Only update the reaction fields, preserve the rest of the post data
    setPost(prevPost => ({
      ...prevPost,
      likes: res.data.likes,
      dislikes: res.data.dislikes
    }));
  } catch (error) {
    console.error("Error occurred in reacting", error);
  }
}

  return (
    <>
      <Header />
      <div className="flex justify-center mt-4 px-4">
        {post ? (
          <div className="max-w w-full bg-white rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-800">{post.title}</h2>
              <span className="text-sm text-gray-500">
                {new Date(post.createdAt).toLocaleDateString()}
              </span>
            </div>
            <button className="mb-4 cursor-pointer block" onClick={() => navigate(`/profile/${post.author.uid}`)}>
              <p className="text-sm text-gray-600 font-medium">Posted by: {post.author.username}</p>
            </button>
            <div className="text-gray-700 text-base leading-relaxed whitespace-pre-line">
              {post.content}

            </div>

            <div className="flex gap-2">
              {post.tags.map((tag, index) => (
                <button
                  key={index}
                  className="px-3 py-1 rounded text-blue-900 cursor-pointer"
                  onClick={() => navigate(`/tags/${tag}`)}
                >
                  #{tag}
                </button>
              ))}
            </div>


            {images.length > 0 && (
              <div className="mt-4">
                <div className="w-[400px]">
                  <img
                    src={`${images[currentIndex]}`}
                    alt="slider"
                    className="w-full h-[250px]  rounded-xl bg-gray-100"
                  />
                </div>

                {images.length > 1 && (

                  <div className="mt-2 flex space-x-4">
                    <button onClick={prevImage}>❮</button>
                    <button onClick={nextImage}>❯</button>
                  </div>
                )}
              </div>
            )}

            {video.length > 0 && (
              <div className="mt-4">
                <div className="w-[400px]">
                  <video
                    src={`${video[currentIndexVideo]}`}
                    alt="slider"
                     className="w-full h-full object-contain"
                          controls
                          controlsList="nodownload"
                          preload="metadata"
                  />
                </div>

                {video.length > 1 && (

                  <div className="mt-2 flex space-x-4">
                    <button onClick={prevVideo}>❮</button>
                    <button onClick={nextVideo}>❯</button>
                  </div>
                )}
              </div>
            )}


            {files.length > 0 && (
              <div className="mt-4">
                {files.map((file, idx) => (
                  <a
                    key={idx}
                    href={`https://unisocial-8gc2.onrender.com/${file}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline block"
                  >
                    📎 {file.split("\\").pop()}
                  </a>
                ))}
              </div>
            )}

            <div className="flex gap-4 mt-2 text-sm text-gray-600">
              <button onClick={() => handleReact(post._id, 'like')}>
                👍 {post.likes.length}
              </button>
              <button onClick={() => handleReact(post._id, 'dislike')}>
                👎 {post.dislikes.length}
              </button>
            </div>
            <CommentSection postId={post._id} currentUser={user} />
          </div>
        ) : (
          <p className="text-center text-gray-500">Loading post...</p>
        )}
      </div>
    </>
  );
}

export default SingleDiscussion;
