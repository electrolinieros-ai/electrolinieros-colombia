import { useEffect, useRef } from "react";

import { Box, Button, Container, Stack, Typography } from "@mui/material";

import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import { Link } from "@tanstack/react-router";

import { BrandMark } from "../brand/BrandMark";
import { TrustFooter } from "../brand/TrustFooter";

export function HomePage() {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  return (
    <Box
      sx={{
        minHeight: "100svh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "background.default",
        overflow: "hidden",
      }}
    >
      <Box
        component="main"
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          pt: { xs: 2, sm: 3, md: 4 },
          pb: { xs: 3, sm: 4, md: 5 },
        }}
      >
        <Container maxWidth="lg">
          <Stack
            spacing={5}
            sx={{
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <BrandMark />

            <Typography
              ref={headingRef}
              component="h1"
              tabIndex={-1}
              sx={{
                maxWidth: 900,
                px: { xs: 1.5, sm: 3, md: 4 },
                py: { xs: 1, sm: 1.5 },
                fontFamily: '"Space Grotesk", sans-serif',
                fontSize: {
                  xs: "3.2rem",
                  sm: "4.4rem",
                  md: "6rem",
                },
                fontWeight: 600,
                lineHeight: 0.94,
                letterSpacing: "-0.055em",
                background:
                  "linear-gradient(110deg, #F5F3F7 15%, #A78BFA 52%, #8B5CF6 82%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                color: "transparent",
                outline: "none",
              }}
            >
              Haz que tu eléctrico
              <br />
              sea aún más tuyo.
            </Typography>

            <Typography
              sx={{
                maxWidth: 600,
                color: "text.secondary",
                fontSize: {
                  xs: "1.05rem",
                  md: "1.2rem",
                },
                lineHeight: 1.65,
                fontWeight: 500,
              }}
            >
              Accesorios y soluciones pensadas para ti.
            </Typography>

            <Button
              component={Link}
              to="/vehiculos"
              size="large"
              variant="contained"
              endIcon={<ArrowForwardIcon />}
              sx={{
                minHeight: 58,
                px: {
                  xs: 3.5,
                  md: 4.5,
                },
                borderRadius: 999,
                fontSize: "1rem",
                fontWeight: 800,
                color: "#FFFFFF",
                background:
                  "linear-gradient(135deg, #8B5CF6 0%, #7C3AED 50%, #6D28D9 100%)",
                boxShadow: "0 16px 50px rgba(139,92,246,0.22)",

                "&:hover": {
                  background:
                    "linear-gradient(135deg, #A78BFA 0%, #8B5CF6 50%, #7C3AED 100%)",
                  transform: "translateY(-2px)",
                  boxShadow: "0 20px 60px rgba(139,92,246,0.32)",
                },

                "&:focus-visible": {
                  outline: "2px solid",
                  outlineColor: "primary.light",
                  outlineOffset: 4,
                },
              }}
            >
              Elegir mi vehículo
            </Button>
          </Stack>
        </Container>
      </Box>

      <TrustFooter />
    </Box>
  );
}
