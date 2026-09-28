import PropTypes from "prop-types";
import MUICard from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

export default function Card({
  children,
  className = "",
  padding = "default",
}) {
  return (
    <MUICard
      className={className}
      variant='outlined'
      sx={{
        bgcolor: "#ffffff",
        borderColor: "rgba(107,114,128,0.2)",
        borderRadius: 1,
        boxShadow: "0 1px 3px rgba(15,23,42,0.06)",
      }}>
      {padding === "default" ? (
        <CardContent>{children}</CardContent>
      ) : (
        <div style={{ padding }}>{children}</div>
      )}
    </MUICard>
  );
}

Card.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  padding: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
