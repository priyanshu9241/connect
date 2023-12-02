import axios from "axios";
import { SetPosts } from "../src/redux/postSlice";
export const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  responseType: "json",
});
export const apiRequest = async ({ url, token, data, method }) => {
  try {
    const result = await API(url, {
      method: method || "GET",
      data: data,
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
    });
    return result?.data;
  } catch (e) {
    console.log(e);
    return { status: e.success, message: e.message };
  }
};
export const handleFileUpload = async (uploadFile) => {
  const formData = new FormData();
  formData.append("file", uploadFile);
  formData.append("upload_preset", "SocialMedia");

  try {
    const { data } = await axios.post(
      `https://api.cloudinary.com/v1_1/${
        import.meta.env.VITE_CLOUDINARY_ID
      }/image/upload`,
      formData
    );
    console.log(data);
    return data.secure_url;
  } catch (e) {
    console.log(e);
    return { status: e.success, message: e.message };
  }
};
export const fetchPosts = async (token, dispatch, uri, data) => {
  try {
    const result = await apiRequest({
      url: uri || "/posts",
      token: token,
      method: "POST",
      data: data || {},
    });
    dispatch(SetPosts(result?.data));
  } catch (e) {
    console.log(e);
    return { status: e.success, message: e.message };
  }
};
export const likePosts = async (uri, token) => {
  try {
    const result = await apiRequest({
      url: uri,
      token,
      method: "POST",
    });
    return result;
  } catch (e) {
    const error = e.response.data;
    console.log(error);
    return { status: error.success, message: error.message };
  }
};
export const deletePosts = async (id, token) => {
  try {
    const result = await apiRequest({
      url: "/posts/" + id,
      token,
      method: "DELETE",
    });
    return;
  } catch (e) {
    const error = e.response.data;
    console.log(error);
    return { status: error.success, message: error.message };
  }
};

export const getUserInfo = async (token, id) => {
  try {
    const uri = id === undefined ? "/users/get-user" : `/users/get-user/${id}`;
    const result = await apiRequest({
      url: uri,
      token,
      method: "POST",
    });
    if (result?.message === "Authentication failed!") {
      localStorage.removeItem("user");
      window.alert("User sessioon expired, please login again");
      window.location.replace("/login");
    }
    return result?.user;
  } catch (e) {
    const error = e.response.data;
    console.log(error);
    return { status: error.success, message: error.message };
  }
};

export const sendFriendRequest = async (token, id) => {
  try {
    const result = await apiRequest({
      url: "/users/friend-request/",
      token,
      method: "POST",
      data: { requestTo: id },
    });
    return;
  } catch (e) {
    const error = e.response.data;
    console.log(error);
    return { status: error.success, message: error.message };
  }
};
export const viewUserProfile = async (token, id) => {
  try {
    const result = await apiRequest({
      url: "/users/profile-view/",
      token,
      method: "POST",
      data: { id },
    });
    return;
  } catch (e) {
    const error = e.response.data;
    console.log(error);
    return { status: error.success, message: error.message };
  }
};
