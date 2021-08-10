import { AxiosRequestConfig, AxiosResponse } from "axios";
import React, { useEffect, useState } from "react";
import axios from "../services/axios";
import { ReactComponent as LoadingLogo } from "../assets/Spinner.svg";

interface IProps
  extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  href?: string;
  target?: string;
  asyncHref?: string;
  asyncCallback?: (res: AxiosResponse<any>) => any;
  asyncErrorCallback?: (err: any) => any;
  asyncOpts?: AxiosRequestConfig;
  loading?: boolean;
  loadingCondition?: boolean;
}

const Button: React.FC<IProps> = (props) => {
  const {
    href,
    target,
    asyncHref,
    loading: manualLoading,
    loadingCondition,
    asyncCallback,
    asyncErrorCallback,
    asyncOpts,
    ...rest
  } = props;
  const [buttonProps, setButtonProps] = useState<IProps>(rest);
  const [loading, setLoading] = useState(
    manualLoading === undefined ? false : manualLoading
  );
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [clicked, setClicked] = useState(false);

  const button = React.createRef<HTMLButtonElement>();

  useEffect(
    () => setLoading(manualLoading === undefined ? false : manualLoading),
    [manualLoading]
  );

  const validateProps = () => {
    const tmp = Object.assign({}, rest);

    if (asyncHref || asyncOpts) {
      const originalClick = tmp.onClick;
      tmp.onClick = (e) => {
        asyncOnClick(asyncHref, asyncOpts)
          .then((res) => {
            if (asyncCallback) asyncCallback(res);
          })
          .catch((err) => {
            if (asyncErrorCallback) asyncErrorCallback(err);
          });
        if (originalClick) return originalClick(e);
      };
    }

    if (href) {
      const originalClick = tmp.onClick;
      tmp.onClick = (e) => {
        if (originalClick) originalClick(e);
        if (target) window.open(href, target);
        else window.location.href = href!;
      };
    }

    if (loadingCondition !== undefined) {
      const originalClick = tmp.onClick;
      tmp.onClick = (e) => {
        setLoading(true);
        setClicked(true);
        if (originalClick) originalClick(e);
      };
    }

    setButtonProps(tmp);
  };

  const asyncOnClick = async (href?: string, opts?: AxiosRequestConfig) => {
    try {
      setLoading(true);
      let res;
      if (opts) {
        if (!opts.url) opts.url = href;
        res = await axios.request(opts);
      } else {
        res = await axios.get(href!);
      }
      setLoading(false);
      if (res.status < 400) {
        return res.data;
      } else {
        throw new Error(`[Error ${res.status}]: ${res.statusText}`);
      }
    } catch (e) {
      throw e;
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(validateProps, [props]);

  // sets loading status on the clicked button when using redux
  useEffect(() => {
    if (clicked && loadingCondition !== undefined) {
      if (loadingCondition !== loading) {
        setClicked(false);
        setLoading(!loading);
      }
    }
  }, [clicked, loadingCondition]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (button.current) {
      setWidth(button.current?.clientWidth + 1);
      setHeight(button.current?.clientHeight + 1);
    }
  }, []);

  return (
    <button
      {...buttonProps}
      className={[
        "px-3",
        "py-2",
        "inline-block",
        "bg-blue-600",
        "text-white rounded",
        "hover:bg-blue-800",
        "duration-100",
        "disabled:opacity-50",
        "disabled:cursor-not-allowed",
        buttonProps.className,
      ]
        .join(" ")
        .trim()}
      disabled={buttonProps.disabled || loading}
      ref={button}
      style={{
        width: width || "initial",
        height: height || "initial",
      }}
    >
      {loading ? <LoadingLogo /> : buttonProps.children}
    </button>
  );
};

export default Button;
