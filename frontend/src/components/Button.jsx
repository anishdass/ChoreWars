import PropTypes from "prop-types";
import MUIButton from "@mui/material/Button";

export default function Button({
  children,
  variant = "contained",
  type = "button",
  className = "",
  ...props
}) {
  return (
    <MUIButton type={type} variant={variant} className={className} {...props}>
      {children}
    </MUIButton>
  );
}

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(["contained", "outlined", "text"]),
  type: PropTypes.string,
  className: PropTypes.string,
};
