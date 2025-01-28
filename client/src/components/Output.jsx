import React from "react";

const Output = ({ output, loading, clearOutput }) => {
  return (
    <div className="bg-gray-800 h-[82vh] p-4 flex-1 overflow-hidden">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold pb-2">Output</h3>
        {/* Clear Button */}
        <button
          className="px-4 py-2 mr-2  bg-red-500 rounded text-white hover:bg-red-600"
          onClick={clearOutput}
          disabled={loading} // Disable the button when loading
        >
          Clear
        </button>
      </div>
      <div
        className="bg-zinc-900 p-4 text-white font-mono text-sm h-full overflow-y-auto scrollbar-hide"
        style={{
          whiteSpace: "pre-wrap",
        }}
      >
        {loading ? "Loading..." : output || "Output will appear here..."}
      </div>
    </div>
  );
};

export default Output;
