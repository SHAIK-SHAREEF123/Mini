import React from "react";
import { useSelector } from "react-redux";
import { UserCircle2 } from "lucide-react";

const Profile = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 px-4">
      <div className="bg-white bg-opacity-80 backdrop-blur-lg shadow-2xl rounded-2xl p-8 w-full max-w-md border border-gray-200">
        <div className="flex flex-col items-center text-center">
          <UserCircle2 className="w-20 h-20 text-blue-600 mb-4" />
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            {user?.name}
          </h2>
          <p className="text-gray-500 text-sm mb-6">{user?.email}</p>
        </div>
        <div className="space-y-4 text-left text-sm">
          <div className="flex justify-between border-b pb-2">
            <span className="text-gray-600 font-medium">Full Name:</span>
            <span className="text-gray-800">{user?.name}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="text-gray-600 font-medium">Email Address:</span>
            <span className="text-gray-800">{user?.email}</span>
          </div>
        </div>
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-400">Last updated just now</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
