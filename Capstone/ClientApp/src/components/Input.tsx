import React, { useEffect, useState } from "react";
import styles from "../stylesheets/Input.module.css";

interface IProps
  extends React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  showLabel?: boolean;
  value?: string | number;
  mask?: string | RegExp;
}

const Input = (props: IProps) => {
  const { showLabel: orgShowLabel, mask, ...rest } = props;
  const showLabel = orgShowLabel === undefined ? true : orgShowLabel;
  const [internalProps, setInternalProps] = useState<IProps>(rest);
  const [value, setValue] = useState("");

  const validateProps = () => {
    const tmp = Object.assign({}, rest);

    // Set default type
    if (!tmp.type) tmp.type = "text";

    if (tmp.onChange) {
      if (tmp.value) setValue(maskValue(tmp.value));
      const onChange = tmp.onChange;
      tmp.onChange = (e) => {
        e.target.value = maskValue(e.target.value);
        if (onChange) onChange(e);
        setValue(e.target.value);
      };
    }

    setInternalProps(tmp);
  };
  const maskValue = (value: string | number) => {
    let tmp = value;
    if (typeof value === "number") tmp = value.toString();
    if (mask) {
      const match = (tmp as string).match(mask);
      tmp = (match && match[0]) || tmp;
    }
    return tmp as string;
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(validateProps, [props]);

  return (
    <div
      className={`${
        internalProps.className || ""
      } relative border-b-2 h-10 w-full focus-within:border-blue-500`.trim()}
    >
      <input
        {...internalProps}
        value={value}
        className={`${
          showLabel || showLabel === undefined
            ? styles.animate + " placeholder-transparent"
            : ""
        } absolute bottom-0 block w-full appearance-none focus:outline-none bg-transparent`.trim()}
      />
      {internalProps.placeholder && showLabel && (
        <label
          className={`absolute bottom-0 -z-1 origin-0 duration-300 text-gray-400 truncate max-w-full`.trim()}
        >
          {internalProps.placeholder}
        </label>
      )}
    </div>
  );
};

export default Input;
