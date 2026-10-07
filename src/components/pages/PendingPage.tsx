import { Box, CircularProgress, Typography } from "@mui/material";

import { TrustFooter } from "../brand/TrustFooter";

export function PendingPage() {
  return (
    <Box
      sx={{
        minHeight: "100svh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "background.default",
      }}
    >
      <Box
        component="main"
        sx={{
          flex: 1,
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          px: 2,
        }}
      >
        <CircularProgress
          size={48}
          thickness={4}
          sx={{
            color: "primary.light",
          }}
        />

        <Typography
          sx={{
            mt: 2.5,
            color: "text.secondary",
            fontSize: "0.85rem",
          }}
        >
          Cargando…
        </Typography>
      </Box>

      <TrustFooter />
    </Box>
  );
}