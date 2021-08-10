import React from "react";
import Navbar from "./Navbar";

interface IProps {
  loading?: boolean;
}

const Layout: React.FC<IProps> = ({ loading, children }) => {
  return (
    <>
      <Navbar />
      {loading === true ? <div>Loading...</div> : <main>{children}</main>}
    </>
  );
};

export default Layout;
