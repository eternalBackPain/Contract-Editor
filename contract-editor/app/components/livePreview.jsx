import React from "react";

const LivePreview = ({ htmlContent }) => {
  const text = htmlContent

  return (
    <div
      className="w-5/12 p-2 overflow-y-auto prose" // add 'prose' if needed
      dangerouslySetInnerHTML={{ __html: text }}
    >
      {/* <p>{text}</p> */}
    </div>
  );
};

export default LivePreview;

