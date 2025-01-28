import React, { useState } from "react";
import "../index.css";
import { v4 as uuid } from "uuid";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const generateRoomId = (e) => {
    e.preventDefault();
    const id = uuid();
    setRoomId(id);
    toast.success("Room Id is generated");
  };

  const joinRoom = (e) => {
    e.preventDefault();
    if (!roomId || !username) {
      toast.error("Both fields are required");
      return;
    }
    navigate(`/editor/${roomId}`, {
      state: { username },
    });
    toast.success("Room is created");
  };

  return (
    <div className="w-screen h-screen bg-black flex justify-center items-center">
      <div className="bg-black bg-opacity-10 border border-opacity-30 rounded-lg p-4 shadow-lg w-1/3 text-center">
        <h1 className="text-2xl font-semibold mb-4 text-white">Join a Room</h1>
        <form className="flex flex-col w-full">
          <input
            type="text"
            id="roomId"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            placeholder="Enter Room ID"
            className="mb-5 p-2 rounded-md bg-opacity-80 bg-white focus:outline-none border-2 border-transparent focus:border-black focus:ring-4 focus:ring-blue-500 text-black"
          />
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter Username"
            className="mb-5 p-2 rounded-md bg-opacity-80 bg-white focus:outline-none border-2 border-transparent focus:border-black focus:ring-4 focus:ring-blue-500 text-black"
          />
          <button
            type="submit"
            className="p-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-green-500 transition-all"
            onClick={joinRoom}
          >
            JOIN
          </button>
          <p className="mt-3 text-white">
            Don't have a room ID? Create{" "}
            <span
              className="relative text-green-400 cursor-pointer pb-1 after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 after:bg-green-400 after:transition-all after:duration-300 hover:after:w-full"
              onClick={generateRoomId}
            >
              New Room
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Home;
