import React from "react";

const ToolBar = () => {
  return (
    <div className="bg-gray-100 w-full h-8 flex flex-row justify-evenly items-center border-b border-gray-300">
      <p>File</p>
      <p>Edit</p>
      <p>Tools</p>
      <p>Export</p>
    </div>
  );
};

export default ToolBar;
