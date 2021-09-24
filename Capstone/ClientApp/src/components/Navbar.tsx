import React from "react";
import navLinks from "../assets/navlinks";

const Navbar = () => {
  return (
    <div className="w-screen px-1 py-2 bg-gradient-to-r from-purple-600 to-red-400 flex justify-center">
      <nav className="max-w-screen-2xl w-100 flex flex-row justify-center gap-3">
        {navLinks
          .filter((item) => item.includeInNavbar)
          .map((item) => {
            return (
              <a
                className="p-1 text-gray-100 hover:text-gray-600 hover:no-underline  "
                key={item.link}
                href={item.link}
              >
                {item.text}
              </a>
            );
          })}
      </nav>
    </div>
  );
};

export default Navbar;
