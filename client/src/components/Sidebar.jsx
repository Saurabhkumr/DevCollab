import React from "react";

const Sidebar = ({ collaborators }) => {
  return (
    <aside className="bg-gray-800 w-1/5 min-w-[200px] flex flex-col p-4 border-r border-gray-700">
      <h2 className="text-lg font-bold mb-4">Collaborators</h2>
      <ul className="space-y-3 flex-1">
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
      <button className="mt-4 px-4 py-2 bg-blue-500 rounded text-white hover:bg-blue-600">
        + Invite Collaborators
      </button>
    </aside>
  );
};

export default Sidebar;
