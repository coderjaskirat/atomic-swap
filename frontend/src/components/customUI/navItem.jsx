import Link from "next/link";
import React from "react";

const NavItem = ({ item }) => {
  return (
    <Link
      href={item?.path}
      className="bg-gradient-to-br from-[white] via-[#a2a2a2] to-[#606060] text-[14px] hover:bg-gradient-to-br  transition-all ease-in-out duration-300 text-[black] uppercase tracking-[1px] hover:via-[white] hover:to-[white] hover:shadow-sm  hover:translate-y-[-2px] hover:shadow-[white] flex gap-2 items-center px-3 py-1 rounded-md"
    >
      {item?.icon}
      {item?.name}
    </Link>
  );
};

export default NavItem;
