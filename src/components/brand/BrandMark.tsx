import { Box, Typography } from "@mui/material";

import { Link } from "@tanstack/react-router";

export function BrandMark() {
  return (
    <Box
      sx={{
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "flex-start",
        userSelect: "none",

        // Espacio superior global del logo
        pt: {
          xs: 1.5,
          sm: 2,
          md: 2.5,
        },
      }}
    >
      <Box
        sx={{
          display: "inline-flex",
          alignItems: "baseline",
          gap: {
            xs: 0.7,
            sm: 1.2,
          },
          whiteSpace: "nowrap",
        }}
      >
        <Typography
          component={Link}
          to="/"
          aria-label="ELECTRONLINIEROS — volver al inicio"
          sx={{
            display: "inline-block",
            fontFamily: '"Sora", sans-serif',
            fontSize: {
              xs: "1.25rem",
              sm: "1.8rem",
              md: "2.15rem",
            },
            fontWeight: 800,
            letterSpacing: "-0.055em",
            lineHeight: 1,
            color: "text.primary",
            textDecoration: "none",
            cursor: "pointer",
          }}
        >
          ELECTROLINIEROS
        </Typography>

        <Typography
          component="span"
          sx={{
            fontFamily: '"Sora", sans-serif',
            fontSize: {
              xs: "0.52rem",
              sm: "0.75rem",
              md: "0.9rem",
            },
            fontWeight: 700,
            letterSpacing: "0.14em",
            lineHeight: 1,
            color: "primary.light",
          }}
        >
          COLOMBIA
        </Typography>
      </Box>

      <Box
        aria-hidden="true"
        sx={{
          mt: {
            xs: 0.4,
            sm: 0.6,
          },
          height: "1px",
          width: {
            xs: "42%",
            sm: "38%",
            md: "34%",
          },
          minWidth: 70,
          maxWidth: 150,
          borderRadius: 999,
          background:
            "linear-gradient(90deg, #A78BFA 0%, #8B5CF6 65%, transparent 100%)",
          boxShadow: "0 0 10px rgba(139,92,246,0.18)",
        }}
      />
    </Box>
  );
}
