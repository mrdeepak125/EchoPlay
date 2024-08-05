import Link from "next/link";
import React from "react";
import { AiOutlineDownload } from "react-icons/ai";

const Download = ({ setShowNav }) => {
  return (
    <div className=" pt-5 m-2 rounded-md w-[95%] hover:bg-white/5">
      <Link
        href="/Download"
        className="flex cursor-pointer items-center"
        onClick={() => setShowNav(false)}
      >
        <p className=" font-semibold text-lg text-white mx-3 mb-7">
          Download
        </p>
        <AiOutlineDownload
          title="Favourites"
          size={25}
          color={"white"}
          className={` mb-7 `}
        />
      </Link>
    </div>
  );
};

export default Download;
