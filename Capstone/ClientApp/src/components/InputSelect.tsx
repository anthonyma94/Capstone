import React, { useEffect, useState } from "react";
import styles from "../stylesheets/InputSelect.module.css";

interface IProp {
  allowNull?: boolean;
  options?: SelectItem[] | string[];
  value?: string;
  onChange?: (item: SelectItem) => void;
  placeholder?: string;
  className?: string;
}
interface SelectItem {
  value: string;
  text?: string;
}
const InputSelect = (props: IProp) => {
  const options =
    props.options &&
    (typeof props.options[0] === "string"
      ? props.options?.map<SelectItem>((item) => {
          return {
            value: item as string,
          };
        })
      : (props.options as SelectItem[]));

  const allowNull = props.allowNull === undefined || props.allowNull === true;
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedItem, setSelectedItem] = useState<SelectItem>();

  const close = () => setShowDropdown(false);
  const handleSelect = (item: SelectItem) => {
    setSelectedItem(item);
    if (props.onChange) {
      props.onChange(item);
    }
  };

  useEffect(() => {
    if (showDropdown) {
      window.addEventListener("click", close);
    } else {
      window.removeEventListener("click", close);
    }
    return () => window.removeEventListener("click", close);
  }, [showDropdown]);

  useEffect(() => {
    setSelectedItem(options?.find((x) => x.value === props.value));
  }, [props.value]);

  return (
    <div
      className={[
        styles.container,
        "relative",
        "border-b-2",
        "h-10",
        "w-full",
        "group",
        "hover:cursor-pointer",
        showDropdown ? styles.active : styles.inactive,
        selectedItem !== undefined ? styles.selected : "",
        props.className,
      ].join(" ")}
      onClick={(e) => setShowDropdown(!showDropdown)}
    >
      <div
        className={["absolute", "bottom-0", "block", "w-full"].join(" ")}
      ></div>
      <ul
        className={`absolute top-10 z-10 overflow-hidden mt-1 border-2 rounded-md w-full transform-gpu bg-white transition ease-in-out origin-top-right duration-200`.trim()}
      >
        {options?.map((item, index) => {
          return (
            <li
              className={`p-2 hover:bg-blue-400 ${
                index !== options.length - 1 ? "border-b-2" : ""
              }`.trim()}
              onClick={() => handleSelect(options[index])}
            >
              {item.text || item.value}
            </li>
          );
        })}
      </ul>

      <label className="absolute bottom-0 -z-1 origin-0 duration-300 text-gray-400 truncate max-w-full">
        {props.placeholder || "Select an option"}
      </label>

      {selectedItem && (
        <span className="absolute bottom-0">
          {selectedItem.text || selectedItem.value}
        </span>
      )}
      <span
        className={`absolute bottom-1 right-1 text-gray-400 ${styles.svg}`.trim()}
      >
        <svg
          className="fill-current h-4 w-4
            transition duration-150 ease-in-out"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
        >
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
        </svg>
      </span>
    </div>
  );
};

export default InputSelect;
