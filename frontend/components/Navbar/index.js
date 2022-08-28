import Link from "next/link";
import { useState } from "react";
import { useToast } from "@chakra-ui/react";

const navLinks = [
  {
    text: "Create",
    link: "/",
  },
  {
    text: "Plexes",
    link: "/plexes",
  },
];

const Navbar = () => {

  return (
    <div className="w-full max-w-[1440px] mx-auto px-[32px] md:px-[64px] xl:px-[120px] shadow">
      <header className="w-full flex items-center justify-between bg-background py-[15px]">
        <div className="flex flex-1">
          <nav className="flex flex-1">
            <h1 className="flex-1 lg:flex-auto text-3xl mr-[20px] font-bold text-cyan-500 whitespace-nowrap">
              DAOplex
            </h1>
            <ul className="hidden flex-[2] lg:flex-auto md:flex w-full items-center">
              {navLinks.map(({ link, text }) => (
                <Link href={link} key={text + link}>
                  <li className="cursor-pointer">
                    <a className="px-[10px]">{text}</a>
                  </li>
                </Link>
              ))}
            </ul>
          </nav>
        </div>
      </header>
    </div>
  );
};

export default Navbar;