import Image from "next/image";
import React from "react";
import { MdOutlineSwapCalls } from "react-icons/md";
import logo from "@/assets/logo1.jpeg";
import NavItem from "./customUI/navItem";

const Navbar = () => {
  const navItems = [
    {
      name: "Swap",
      path: "#swap",
      icon: <MdOutlineSwapCalls className="text-[black] text-[20px]" />,
    },
  ];
  return (
    <div className="fixed inset-x-0 top-0 z-[10] h-fit w-full px-[30px] py-2 flex justify-between items-center border-b bg-transparent backdrop-blur-sm">
      <div className="flex gap-2 items-center">
        <Image alt="Logo" src={logo} width={60} height={60} />
      </div>
      <div className="flex gap-4 items-center ">
        {navItems?.map((item) => (
          <NavItem key={item?.name} item={item} />
        ))}
      </div>
    </div>
  );
};

export default Navbar;
