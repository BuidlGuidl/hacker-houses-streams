import React from "react";
import { NewCustomButton } from "./scaffold-eth/NewCustomButton";

const NavFooter = () => {
  const btnStyle =
    "hover:scale-[1.05] transition-all ease-linear  border-[2px] border-l-[#FFFFFF] border-t-[#FFFFFF] border-[#0A0A0A] flex py-[23px] font-medium text-[#2A2A2A] bg-[#C3C3C3] justify-center items-center gap-2 text-sm  w-full";
  return (
    <div className="grid grid-cols-nav-footer bg-[#C3C3C3] p-1">
      <div className={btnStyle}>MAIN </div>
      <div className={btnStyle}>BUILDERS </div>
      <div className={btnStyle}>SMART CONTRACT BALANCE </div>

      <NewCustomButton />
    </div>
  );
};

export default NavFooter;
