import React from "react";

const Topbar = ({ collaborators }) => {
  return (
    <header className="bg-gray-800 w-full flex justify-between p-4 border-b border-gray-700">
      <h2 className="text-lg font-bold">DevCollab</h2>

      <ul className="flex space-x-4 overflow-x-auto max-w-[60%] scrollbar-hide min-w-[500px]">
        {collaborators.map((collab, index) => (
          <li key={index} className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
              {collab.username[0]}
            </div>
            <div>
              <p className="font-semibold">{collab.username}</p>
            </div>
          </li>
        ))}
      </ul>
    </header>
  );
};

export default Topbar;
