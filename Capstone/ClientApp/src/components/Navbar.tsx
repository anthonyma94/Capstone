import React from "react";
import { Navbar as BootstrapNavbar, Nav } from "react-bootstrap";
import navLinks from "../assets/navlinks";
import "../stylesheets/Navbar.scss";

const Navbar = () => {
  return (
    <BootstrapNavbar>
      {navLinks
        .filter((item) => item.includeInNavbar)
        .map((item) => {
          return (
            <Nav.Link key={item.link} href={item.link}>
              {item.text}
            </Nav.Link>
          );
        })}
    </BootstrapNavbar>
  );
};

export default Navbar;
