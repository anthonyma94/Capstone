import React, { MouseEventHandler, useEffect, useState } from "react";
import style from "../stylesheets/DataTableMenu.module.css";

const DataTableMenu = React.forwardRef(
  ({ onClick, ...rest }: { onClick: MouseEventHandler }, ref) => {
    const [show, setShow] = useState(false);
    const [item, setItem] = useState<any>(null);

    useEffect(() => {
      if (show) {
        window.addEventListener("click", close);
      } else {
        window.removeEventListener("click", close);
      }
      return () => {
        window.removeEventListener("click", close);
      };
    }, [show]);

    const close = () => {
      setShow(false);
    };

    return (
      <>
        <label
          className="hover:cursor-pointer"
          onClick={(e) => {
            console.log(e);
            setShow(!show);
            onClick(e);
          }}
        >
          &#8942;
        </label>
        <div className={style.menuContainer}>
          <nav className={[style.menu, show ? style.active : ""].join(" ")}>
            <ul>
              <li>Edit</li>
              <li>Delete</li>
            </ul>
          </nav>
        </div>
      </>
    );
  }
);

export default DataTableMenu;
