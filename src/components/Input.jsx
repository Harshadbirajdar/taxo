import React from "react";
import PropTypes from "prop-types";

const Input = React.forwardRef(
  (
    {
      label,
      placeholder,
      onChange,
      error,
      type = "text",
      warpperClass,
      endIcon,
      ...props
    },
    ref
  ) => {
    return (
      <div
        className={`${
          error &&
          "border-red-500 mb-10 !focus-within:border-red-500 !focus-visible:border-red-500"
        } relative my-3 flex h-14  cursor-text flex-wrap items-center justify-start rounded-lg border-[1px]  focus-within:border-blue-500 focus-visible:border-blue-500 ${warpperClass}`}
      >
        <label
          className={`${
            error && "text-red-500"
          } capitalize absolute left-3 -top-2.5 bg-white px-1 text-sm `}
        >
          {label}
        </label>
        <div className="flex h-full w-full items-center justify-start ">
          <input
            {...props}
            type={type}
            ref={ref}
            onChange={onChange}
            placeholder={placeholder}
            autoComplete="off"
            className="h-full w-full border-0 bg-transparent px-4 outline-none placeholder:text-gray-400  "
          />
          {endIcon}
        </div>
        {error && <span className="text-red-500 block">{error?.message}</span>}
      </div>
    );
  }
);
Input.propTypes = {
  label: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
};

export default Input;
