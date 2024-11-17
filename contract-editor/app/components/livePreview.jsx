import React from "react";

const LivePreview = ({ htmlContent }) => {
  return (
    <div
      className="prose w-5/12"
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    ></div>
  );
};

export default LivePreview;
