import React from "react";

const ToolBar = () => {
  return (
    <div className="bg-gray-100 w-full h-8 flex flex-row justify-evenly items-center border border-black">
      <p>File</p>
      <p>Edit</p>
      <p>Tools</p>
      <p>Export</p>
    </div>
  );
};

export default ToolBar;
