import React from "react";
import { Box, CircularProgress } from "@mui/material";

export default function Loader() {
  return (
    <Box
      sx={{
        width: "100vw",
        height: "40vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <CircularProgress sx={{ color: "#72569D" }} size={70} />
    </Box>
  );
};