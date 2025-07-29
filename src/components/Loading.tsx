import React from "react";
import { ClipLoader } from "react-spinners";

interface LoadingProps {
  text?: string;
}

const Loading: React.FC<LoadingProps> = ({ text = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <ClipLoader color="#00F7A5" size={40} />
      <p className="mt-4 text-gray-300">{text}</p>
    </div>
  );
};

export default Loading;
