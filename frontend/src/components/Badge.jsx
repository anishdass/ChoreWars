import PropTypes from "prop-types";
import Chip from "@mui/material/Chip";

const toneStyles = {
  easy: { color: "#15803d", borderColor: "#86efac", bgcolor: "#f0fdf4" },
  medium: { color: "#a16207", borderColor: "#fde68a", bgcolor: "#fffbeb" },
  hard: { color: "#b91c1c", borderColor: "#fecaca", bgcolor: "#fef2f2" },
  default: { color: "#4b5563", borderColor: "#d1d5db", bgcolor: "#f9fafb" },
};

export default function Badge({ children, tone = "default", className = "" }) {
  return (
    <Chip
      label={children}
      variant='outlined'
      className={className}
      sx={{
        ...(toneStyles[tone] || toneStyles.default),
        fontWeight: 700,
        fontSize: 11,
      }}
    />
  );
}

Badge.propTypes = {
  children: PropTypes.node.isRequired,
  tone: PropTypes.oneOf(["easy", "medium", "hard", "default"]),
  className: PropTypes.string,
};
