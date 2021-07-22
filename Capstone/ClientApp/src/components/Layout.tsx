import React from "react";
import Navbar from "./Navbar";

const Layout = ({ children }: { children: any }) => {
  return (
    <>
      <Navbar />
      <main>{children}</main>
    </>
  );
};

export default Layout;
