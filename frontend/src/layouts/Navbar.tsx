import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import Hamburger from "./Hamburger";
import { links } from "../data";
import logo from "../assets/logo.svg";
import SignupButton from "../components/SignupButton";
import LoginButton from "../components/LoginButton";
function Navbar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  // console.log(pathname);
  const [open, setOpen] = useState(false);
  // const [isHome,setIshome] = useState(false)
  const isHome = pathname === "/";
  // if(pathname == "/"){
  //   setIshome(true)
  // }
  return (
    <>
      <div className="w-full h-16 flex items-center px-6 md:px-10 lg:px-20 justify-between bg-[#1A1A1A] border-b border-[#262626] ">
        <div
          className={`text-2xl font-inter font-bold text-white ${
            isHome ? "cursor-default" : "cursor-pointer"
          } flex items-center gap-3`}
          onClick={() => {
            if (!isHome) {
              navigate("/");
            }
          }}
        >
          <img src={logo} alt="" className="w-10 h-10" />
          WriteFlow
        </div>

        <div className="hidden sm:flex md:space-x-2">
          {links.map((val, i) => (
            <Link
              key={i}
              to={val.link}
              className={`text-base transition-colors duration-200 px-2 lg:px-4 py-2 rounded-md cursor-pointer ${
                pathname === val.link
                  ? "text-white bg-black border border-[#333333]"
                  : "text-[#7E7E81] hover:text-white"
              }`}
            >
              {val.name}
            </Link>
          ))}
        </div>

        <div className="hidden sm:flex items-center space-x-2">
          <LoginButton navigateTo="/login" />
          <SignupButton navigateTo="/signup" />
        </div>

        <div className="sm:hidden cursor-pointer">
          {open ? (
            <X size={30} onClick={() => setOpen(false)} />
          ) : (
            <Menu size={30} onClick={() => setOpen(true)} />
          )}
        </div>
      </div>

      {open && <Hamburger setOpen={setOpen} />}
    </>
  );
}

export default Navbar;
