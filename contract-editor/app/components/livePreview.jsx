import React from "react";

const LivePreview = ({ htmlContent }) => {
  return (
    <div
      className="prose w-5/12 p-2 overflow-y-auto"
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    ></div>
  );
};

export default LivePreview;

