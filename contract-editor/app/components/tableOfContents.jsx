"use client";
import React, { useState } from "react";
import { useEffect, useRef } from "react";

const TableOfContents = ({ initialWidth }) => {
  const [width, setWidth] = useState(parseFloat(initialWidth));
  const isDragging = useRef(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging.current) return;
      setWidth((prevWidth) => {
        const newWidth = prevWidth + e.movementX;
        return Math.max(100, newWidth); // Minimum width of 100px
      });
    };

    const handleMouseUp = () => {
      isDragging.current = false;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  const handleMouseDown = () => {
    isDragging.current = true;
  };

  return (
    <div className="flex h-full">
      <div
        className="bg-gray-100 h-full border border-black"
        style={{ width: `${width}px` }}
      ></div>
      <div
        className="w-1 bg-gray-500 cursor-ew-resize"
        onMouseDown={handleMouseDown}
      ></div>
    </div>
  );
};

export default TableOfContents;
