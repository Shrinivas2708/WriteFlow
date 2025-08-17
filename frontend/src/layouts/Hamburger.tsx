import React, { useEffect, useRef } from "react";
import { links } from "../data";
import Login from "../components/LoginButton";
import Signup from "../components/SignupButton";
import { Link } from "react-router-dom";

function Hamburger({
  setOpen,
}: {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setOpen]);

  return (
    <div
      ref={menuRef}
      className="absolute w-full h-[420px] left-0 bg-[#1A1A1A] rounded-xl transition-transform ease-in duration-300 flex sm:hidden flex-col items-center z-50"
    >
      <ul className="flex flex-col justify-center items-center text-lg gap-5 w-full">
        {links.map((val, i) => (
          <Link
            to={val.link}
            key={i}
            className="w-[50%] flex items-center justify-center mt-5 text-[#7E7E81] hover:text-white cursor-pointer"
            onClick={() => setOpen(false)}
          >
            {val.name}
          </Link>
        ))}
      </ul>
      <div className="w-full py-2 mt-4 flex justify-center items-center">
        <div className="w-[80%] h-[0.5px] bg-[#7E7E81]"></div>
      </div>
      <div className="w-[200px] flex flex-col gap-3 mt-2">
        <Login className="text-center text-lg" navigateTo="/login" />
        <Signup className="text-center text-lg" navigateTo="/signup" />
      </div>
    </div>
  );
}

export default Hamburger;
