import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  CustomButton,
  EditProfile,
  FriendsCard,
  Loading,
  PostCard,
  ProfileCard,
  TextInput,
  TopBar,
} from "../components";
import { Link } from "react-router-dom";
import { NoProfile } from "../assets";
import { BsFiletypeGif, BsPersonFillAdd } from "react-icons/bs";
import { BiImages, BiSolidVideo } from "react-icons/bi";
import { useForm } from "react-hook-form";
import {
  apiRequest,
  deletePosts,
  fetchPosts,
  handleFileUpload,
  likePosts,
  sendFriendRequest,
  getUserInfo,
} from "./../../utils/index";
import { UserLogin } from "./../redux/userSlice";

const Home = () => {
  const dispatch = useDispatch();
  const { user, edit } = useSelector((state) => state.user);
  const { posts } = useSelector((state) => state.posts);
  const [friendRequest, setFriendRequest] = useState([]);
  const [suggestedFriends, setSuggestedFriends] = useState([]);
  const [errMsg, setErrMsg] = useState("");
  const [file, setFile] = useState(null);
  const [posting, setPosting] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const handlePostSubmit = async (data) => {
    setPosting(true);
    try {
      const media = file && (await handleFileUpload(file));
      const newData = media
        ? { ...data, media: media.secure_url, public_id: media.public_id }
        : data;
      const res = await apiRequest({
        method: "POST",
        url: "/posts/create-post",
        data: newData,
        token: user?.token,
      });
      if (res?.status === "failed") {
        setErrMsg(res);
      } else {
        reset({ description: "" });
        setFile(null);
        await fetchPost();
      }
      setPosting(false);
    } catch (e) {
      setPosting(false);
      console.log(e);
    }
  };
  const fetchPost = async () => {
    await fetchPosts(user?.token, dispatch);
    setLoading(false);
  };
  const handleLikePost = async (uri) => {
    await likePosts(uri, user?.token);
    await fetchPost();
  };
  const handleDelete = async (id) => {
    await deletePosts(id, user?.token);
    await fetchPost();
  };

  const fetchFriendRequests = async () => {
    try {
      const res = await apiRequest({
        method: "POST",
        url: "/users/get-friend-request",
        token: user?.token,
      });
      if (res?.status === "failed") {
        setErrMsg(res);
      } else {
        setFriendRequest(res?.data);
      }
    } catch (e) {
      console.log(e);
    }
  };
  const fetchSuggestedFriends = async () => {
    try {
      const res = await apiRequest({
        method: "POST",
        url: "/users/suggested-friends",
        token: user?.token,
      });
      if (res?.status === "failed") {
        setErrMsg(res);
      } else {
        setSuggestedFriends(res?.data);
      }
    } catch (e) {
      console.log(e);
    }
  };
  const handleFriendRequest = async (friendId) => {
    try {
      const res = await sendFriendRequest(user?.token, friendId);
      await fetchSuggestedFriends();
      await getUser();
    } catch (e) {
      console.log(e);
    }
  };
  const acceptFriendRequest = async (id, status) => {
    try {
      const res = await apiRequest({
        method: "POST",
        url: "/users/accept-request",
        token: user?.token,
        data: { rid: id, status },
      });
      if (res?.status === "failed") {
        setErrMsg(res);
      } else {
        setFriendRequest(res?.data);
      }
    } catch (e) {
      console.log(e);
    }
  };
  const getUser = async () => {
    try {
      const res = await getUserInfo(user?.token);
      const newData = { token: user?.token, ...res };
      dispatch(UserLogin(newData));
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    setLoading(true);
    getUser();
    fetchPost();
    fetchFriendRequests();
    fetchSuggestedFriends();
  }, []);

  return (
    <>
      <div className="w-full h-screen px-0 pb-20 overflow-hidden lg:px-10 2xl:px-40 bg-bgColor lg:rounded-lg">
        <TopBar />

        <div className="flex w-full h-full gap-2 pt-5 pb-10 lg:gap-4">
          {/* LEFT */}
          <div className="flex-col hidden w-1/3 h-full gap-6 overflow-y-auto lg:w-1/4 md:flex">
            <ProfileCard user={user} />
            <FriendsCard friends={user?.friends} />
          </div>

          {/* CENTER */}
          <div className="flex flex-col flex-1 h-full gap-6 px-4 overflow-y-auto rounded-lg">
            <form
              onSubmit={handleSubmit(handlePostSubmit)}
              className="px-4 rounded-lg bg-primary"
            >
              <div className="w-full flex items-center gap-2 py-4 border-b border-[#66666645]">
                <img
                  src={user?.profileUrl ?? NoProfile}
                  alt="User Image"
                  className="object-cover rounded-full w-14 h-14"
                />
                <TextInput
                  styles="w-full rounded-full py-5"
                  placeholder="What's on your mind...."
                  name="description"
                  register={register("description", {
                    required: "Write something about post",
                  })}
                  error={errors.description ? errors.description.message : ""}
                />
              </div>
              {errMsg?.message && (
                <span
                  role="alert"
                  className={`text-sm ${
                    errMsg?.status === "failed"
                      ? "text-[#f64949fe]"
                      : "text-[#2ba150fe]"
                  } mt-0.5`}
                >
                  {errMsg?.message}
                </span>
              )}

              <div className="flex items-center justify-between py-4">
                <label
                  htmlFor="imgUpload"
                  className="flex items-center gap-1 text-base cursor-pointer text-ascent-2 hover:text-ascent-1"
                >
                  <input
                    type="file"
                    onChange={(e) => setFile(e.target.files[0])}
                    className="hidden"
                    id="imgUpload"
                    data-max-size="5120"
                    accept=".jpg, .png, .jpeg"
                  />
                  <BiImages />
                  <span>Image</span>
                </label>

                <label
                  className="flex items-center gap-1 text-base cursor-pointer text-ascent-2 hover:text-ascent-1"
                  htmlFor="videoUpload"
                >
                  <input
                    type="file"
                    data-max-size="5120"
                    onChange={(e) => setFile(e.target.files[0])}
                    className="hidden"
                    id="videoUpload"
                    accept=".mp4, .wav"
                  />
                  <BiSolidVideo />
                  <span>Video</span>
                </label>

                <label
                  className="flex items-center gap-1 text-base cursor-pointer text-ascent-2 hover:text-ascent-1"
                  htmlFor="vgifUpload"
                >
                  <input
                    type="file"
                    data-max-size="5120"
                    onChange={(e) => setFile(e.target.files[0])}
                    className="hidden"
                    id="vgifUpload"
                    accept=".gif"
                  />
                  <BsFiletypeGif />
                  <span>Gif</span>
                </label>

                <div>
                  {posting ? (
                    <Loading />
                  ) : (
                    <CustomButton
                      type="submit"
                      title="Post"
                      containerStyles="bg-[#0444a4] text-white py-1 px-6 rounded-full font-semibold text-sm"
                    />
                  )}
                </div>
              </div>
            </form>

            {loading ? (
              <Loading />
            ) : posts?.length > 0 ? (
              posts?.map((post) => (
                <PostCard
                  key={post?._id}
                  post={post}
                  user={user}
                  deletePost={handleDelete}
                  likePost={handleLikePost}
                />
              ))
            ) : (
              <div className="flex items-center justify-center w-full h-full">
                <p className="text-lg text-ascent-2">No Post Available</p>
              </div>
            )}
          </div>

          {/* RIGJT */}
          <div className="flex-col hidden w-1/4 h-full gap-8 overflow-y-auto lg:flex">
            {/* FRIEND REQUEST */}
            <div className="w-full px-6 py-5 rounded-lg shadow-sm bg-primary">
              <div className="flex items-center justify-between text-xl text-ascent-1 pb-2 border-b border-[#66666645]">
                <span> Friend Request</span>
                <span>{friendRequest?.length}</span>
              </div>
              {friendRequest?.length === 0 ? (
                <p className="mt-2 text-sm text-center text-ascent-2">
                  No Friend Request
                </p>
              ) : (
                <div className="flex flex-col w-full gap-4 pt-4">
                  {friendRequest?.map(({ _id, requestFrom: from }) => (
                    <div
                      key={_id}
                      className="flex items-center justify-between"
                    >
                      <Link
                        to={"/profile/" + from._id}
                        className="flex items-center w-full gap-4 cursor-pointer"
                      >
                        <img
                          src={from?.profileUrl ?? NoProfile}
                          alt={from?.firstName}
                          className="object-cover w-10 h-10 rounded-full"
                        />
                        <div className="flex-1">
                          <p className="text-base font-medium text-ascent-1">
                            {from?.firstName} {from?.lastName}
                          </p>
                          <span className="text-sm text-ascent-2">
                            {from?.profession ?? "No Profession"}
                          </span>
                        </div>
                      </Link>

                      <div className="flex gap-1">
                        <CustomButton
                          title="Accept"
                          containerStyles="bg-[#0444a4] text-xs text-white px-1.5 py-1 rounded-full"
                          onClick={() => acceptFriendRequest(_id, "Accepted")}
                        />
                        <CustomButton
                          title="Deny"
                          containerStyles="border border-[#666] text-xs text-ascent-1 px-1.5 py-1 rounded-full"
                          onClick={() => acceptFriendRequest(_id, "Denied")}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* SUGGESTED FRIENDS */}
            <div className="w-full px-5 py-5 rounded-lg shadow-sm bg-primary">
              <div className="flex items-center justify-between text-lg text-ascent-1 border-b border-[#66666645]">
                <span>Friend Suggestion</span>
              </div>
              <div className="flex flex-col w-full gap-4 pt-4">
                {suggestedFriends?.map((friend) => (
                  <div
                    className="flex items-center justify-between"
                    key={friend._id}
                  >
                    <Link
                      to={"/profile/" + friend?._id}
                      key={friend?._id}
                      className="flex items-center w-full gap-4 cursor-pointer"
                    >
                      <img
                        src={friend?.profileUrl ?? NoProfile}
                        alt={friend?.firstName}
                        className="object-cover w-10 h-10 rounded-full"
                      />
                      <div className="flex-1 ">
                        <p className="text-base font-medium text-ascent-1">
                          {friend?.firstName} {friend?.lastName}
                        </p>
                        <span className="text-sm text-ascent-2">
                          {friend?.profession ?? "No Profession"}
                        </span>
                      </div>
                    </Link>

                    <div className="flex gap-1">
                      {user.friendRequestSent.includes(friend._id) ? (
                        <span>Sent</span>
                      ) : (
                        <button
                          className="bg-[#0444a430] text-sm text-white p-1 rounded"
                          onClick={() => {
                            
                            handleFriendRequest(friend._id);
                          }}
                        >
                          <BsPersonFillAdd
                            size={20}
                            className="text-[#0f52b6]"
                          />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {edit && <EditProfile />}
    </>
  );
};

export default Home;
