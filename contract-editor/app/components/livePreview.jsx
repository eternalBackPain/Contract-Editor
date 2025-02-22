import React from "react";

const LivePreview = ({ htmlContent }) => {
  const text = htmlContent

  return (
    <div
      className="w-5/12 p-2 overflow-y-auto" // add 'prose' if needed
      // dangerouslySetInnerHTML={{ __html: htmlContent }}
    >
      <p>{text}</p>
    </div>
  );
};

export default LivePreview;

