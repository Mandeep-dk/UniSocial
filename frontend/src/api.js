import axios from 'axios';

// 🔹 Base URL automatically changes based on environment
const BASE_URL =  'http://localhost:5000';

//Comments
const commentsAPI = axios.create({ baseURL: `${BASE_URL}/api/comments` });

export const fetchComments = (postId) => commentsAPI.get(`/${postId}`);
export const postComment = (data) => commentsAPI.post(`/`, data);
export const reactComment = (id, data) => commentsAPI.patch(`/reaction/${id}`, data);
export const deleteComment = (id, data) => commentsAPI.put(`/delete/${id}`, data);
export const editComment = (id, data) => commentsAPI.put(`/edit/${id}`, data);

//Profile editing
const profileAPI = axios.create({ baseURL: `${BASE_URL}/api/users` });

export const editProfile = (id, data) => profileAPI.put(`/${id}/editProfile`, data);
export const getUsername = (uid) => profileAPI.get(`/getProfile/${uid}`);
export const uploadProfilePic = (uid, data) =>
  profileAPI.post(`/uploadProfilePic/${uid}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
export const deleteUserB = (uid) => profileAPI.delete(`/delete/${uid}`);
export const searchUser = (username, uid) =>
  axios.get(`${BASE_URL}/api/users/searchUser/`, { params: { query: username, uid } });

//Posts reaction
const postApi = axios.create({ baseURL: `${BASE_URL}/api/singlePost` });

export const reactPost = (id, data) => postApi.patch(`/reaction/${id}`, data);
export const deletePost = (id) => postApi.delete(`/deletePost/${id}`, id);

//Get all posts from the user
const userPostsApi = axios.create({ baseURL: `${BASE_URL}/api/userPosts` });
export const userPosts = (id) => userPostsApi.get(`/${id}`);

//Search
const searchApi = axios.create({ baseURL: `${BASE_URL}/api/search` });
export const search = (data) => searchApi.get(`/`, { params: { query: data } });

//Find post by post id
const findPostApi = axios.create({ baseURL: `${BASE_URL}/api/findPost` });
export const findPost = (id) => findPostApi.get(`/${id}`);

//Follow an user
const followApi = axios.create({ baseURL: `${BASE_URL}/api/follow` });
export const followUser = (currentUid, targetUid) => followApi.patch(`/${currentUid}/follow/${targetUid}`);
export const unfollowUser = (currentUid, targetUid) => followApi.patch(`/${currentUid}/unfollow/${targetUid}`);
export const isfollow = (currentUid, targetUid) => followApi.get(`/${currentUid}/is-following/${targetUid}`);

//tags
const tagApi = axios.create({ baseURL: `${BASE_URL}/api/tags` });
export const getTag = (tag) => tagApi.get(`/${tag}`);

//trending posts
const trends = axios.create({ baseURL: `${BASE_URL}/api/trends` });
export const trendingTags = () => trends.get(`/trending-tags`);
export const topPosts = () => trends.get(`/top-posts`);
export const topCommented = () => trends.get(`/top-commented`);

//contact form api
const contact = axios.create({
  baseURL: `${BASE_URL}/api/contact`,
  headers: { 'Content-Type': 'application/json' },
});
export const contactApi = (data) => contact.post('/', data);


//show followers
const followers = axios.create({baseURL: `${BASE_URL}/api/followers`});

export const getFollowers = (uid) => followers.get(`/${uid}/followers`);
export const getFollowing = (uid) => followers.get(`/${uid}/following`);
