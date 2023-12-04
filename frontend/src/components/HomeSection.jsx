import Link from "next/link";
import React from "react";

const HomeSection = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full">
      <div className="bg-gradient-to-br from-[#33334c] via-[#bcbaba] to-[#605f5f] bg-clip-text animate-charcter">
        <h1 className="text-transparent text-[50px] md:text-[70px] text-center leading-[80px] tracking-[6px] font-bold uppercase">
          Atomic Swap
        </h1>
      </div>
      <p className="text-[#cbcbcb] text-center text-[16px] max-md:w-[80%] font-regular">
        Empowering Peer-to-Peer Crypto Exchange with Seamless Simplicity!
      </p>
      <Link
        href="/#swap"
        className="bg-gradient-to-r from-[white] via-[gray] to-[#363636] text-black rounded-md px-[10px] py-[5px] mt-4"
      >
        SWAP NOW
      </Link>
    </div>
  );
};

export default HomeSection;
