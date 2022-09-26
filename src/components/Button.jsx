import classNames from "classnames";
import React from "react";
import PropTypes from "prop-types";
const Button = ({ children, className, onClick, ...props }) => {
  return (
    <button
      onClick={onClick}
      className={classNames(
        " bg-blue-500 text-white  items-center justify-center font-medium transition-all duration-300 ease-in-out disabled:opacity-50 hover:bg-blue-600 active:bg-blue-700 border-blue-500  px-4 py-2 text-base border-none rounded-md disabled:cursor-not-allowed ",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  classNames: PropTypes.string,
  onClick: PropTypes.func,
};

export default Button;
