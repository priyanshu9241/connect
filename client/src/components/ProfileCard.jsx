import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { LiaEditSolid } from "react-icons/lia";
import {
  BsBriefcase,
  BsFacebook,
  BsInstagram,
  BsPersonFillAdd,
} from "react-icons/bs";
import { FaTwitterSquare } from "react-icons/fa";
import { CiLocationOn } from "react-icons/ci";
import moment from "moment";

import { NoProfile } from "../assets";
import { UpdateProfile } from "../redux/userSlice";

const ProfileCard = ({ user }) => {
  const { user: data, edit } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  return (
    <div>
      <div className='flex flex-col items-center w-full px-6 py-4 shadow-sm bg-primary rounded-xl '>
        <div className='w-full flex items-center justify-between border-b pb-5 border-[#66666645]'>
          <Link to={"/profile/" + user?._id} className='flex gap-2'>
            <img
              src={user?.profileUrl ?? NoProfile}
              alt={user?.email}
              className='object-cover rounded-full w-14 h-14'
            />

            <div className='flex flex-col justify-center'>
              <p className='text-lg font-medium text-ascent-1'>
                {user?.firstName} {user?.lastName}
              </p>
              <span className='text-ascent-2'>
                {user?.profession ?? "No Profession"}
              </span>
            </div>
          </Link>

          <div className=''>
            {user?._id === data?._id ? (
              <LiaEditSolid
                size={22}
                className='cursor-pointer text-blue'
                onClick={() => dispatch(UpdateProfile(true))}
              />
            ) : (
              <button
                className='bg-[#0444a430] text-sm text-white p-1 rounded'
                onClick={() => {}}
              >
                <BsPersonFillAdd size={20} className='text-[#0f52b6]' />
              </button>
            )}
          </div>
        </div>

        <div className='w-full flex flex-col gap-2 py-4 border-b border-[#66666645]'>
          <div className='flex items-center gap-2 text-ascent-2'>
            <CiLocationOn className='text-xl text-ascent-1' />
            <span>{user?.location ?? "Add Location"}</span>
          </div>

          <div className='flex items-center gap-2 text-ascent-2'>
            <BsBriefcase className='text-lg text-ascent-1' />
            <span>{user?.profession ?? "Add Profession"}</span>
          </div>
        </div>

        <div className='w-full flex flex-col gap-2 py-4 border-b border-[#66666645]'>
          <p className='text-xl font-semibold text-ascent-1'>
            {user?.friends?.length} Friends
          </p>

          <div className='flex items-center justify-between'>
            <span className='text-ascent-2'>Who viewed your profile</span>
            <span className='text-lg text-ascent-1'>{user?.views?.length}</span>
          </div>

          <span className='text-base text-blue'>
            {user?.verified ? "Verified Account" : "Not Verified"}
          </span>

          <div className='flex items-center justify-between'>
            <span className='text-ascent-2'>Joined</span>
            <span className='text-base text-ascent-1'>
              {moment(user?.createdAt).fromNow()}
            </span>
          </div>
        </div>

        <div className='flex flex-col w-full gap-4 py-4 pb-6'>
          <p className='text-lg font-semibold text-ascent-1'>Social Profile</p>

          <div className='flex items-center gap-2 text-ascent-2'>
            <BsInstagram className='text-xl text-ascent-1' />
            <span>Instagram</span>
          </div>
          <div className='flex items-center gap-2 text-ascent-2'>
            <FaTwitterSquare className='text-xl text-ascent-1' />
            <span>Twitter</span>
          </div>
          <div className='flex items-center gap-2 text-ascent-2'>
            <BsFacebook className='text-xl text-ascent-1' />
            <span>Facebook</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
