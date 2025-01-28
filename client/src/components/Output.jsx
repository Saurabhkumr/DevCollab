import React from "react";

const Output = ({ output, loading }) => {
  return (
    <div className="bg-gray-800 border-t border-gray-700 p-4">
      <h3 className="text-lg font-bold border-b border-gray-600 pb-2 mb-4">
        Output
      </h3>
      <div
        className="bg-zinc-900 p-4 rounded-lg text-white font-mono text-sm"
        style={{
          minHeight: "150px",
          whiteSpace: "pre-wrap", // Preserve line breaks and white space
          overflowY: "auto", // Allow scrolling when content overflows
        }}
      >
        {/* Display the output or a loading message */}
        {loading ? "Loading..." : output || "Output will appear here..."}
      </div>
    </div>
  );
};

export default Output;
