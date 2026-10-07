import { useEffect, useRef } from "react";

import { Box, Container, Stack, Typography } from "@mui/material";

import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import { Link } from "@tanstack/react-router";

import { BrandMark } from "../brand/BrandMark";
import { TrustFooter } from "../brand/TrustFooter";

const vehicles = [
  {
    slug: "yuan-up",
    brand: "BYD",
    name: "Yuan Up",
  },
  {
    slug: "seagull",
    brand: "BYD",
    name: "Seagull",
  },
  {
    slug: "dolphin",
    brand: "BYD",
    name: "Dolphin",
  },
  {
    slug: "model-3",
    brand: "Tesla",
    name: "Model 3",
  },
  {
    slug: "model-y",
    brand: "Tesla",
    name: "Model Y",
  },
];

export function VehiclesPage() {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto",
    });

    headingRef.current?.focus();
  }, []);

  return (
    <Box
      sx={{
        height: "100svh",
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
          minHeight: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Container maxWidth="lg">
          <Stack
            spacing={{ xs: 4, sm: 4.5, md: 5 }}
            sx={{
              alignItems: "center",
              textAlign: "center",
              pt: { xs: 2, sm: 3, md: 4 },
              pb: { xs: 2, sm: 3, md: 4 },
            }}
          >
            <BrandMark />

            <Stack
              spacing={2}
              sx={{
                alignItems: "center",
              }}
            >
              <Typography
                ref={headingRef}
                component="h1"
                tabIndex={-1}
                sx={{
                  maxWidth: 760,
                  fontFamily: '"Space Grotesk", sans-serif',
                  fontSize: {
                    xs: "2.7rem",
                    sm: "3.8rem",
                    md: "5rem",
                  },
                  fontWeight: 600,
                  lineHeight: 0.98,
                  letterSpacing: "-0.055em",
                  color: "text.primary",
                  outline: "none",
                }}
              >
                ¿Cuál es tu vehículo?
              </Typography>

              <Typography
                sx={{
                  maxWidth: 560,
                  color: "text.secondary",
                  fontSize: {
                    xs: "1rem",
                    sm: "1.1rem",
                  },
                  lineHeight: 1.65,
                }}
              >
                Elige uno para descubrir qué puedes mejorar.
              </Typography>
            </Stack>

            <Box
              sx={{
                width: "100%",
                maxWidth: 900,
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr 1fr",
                  sm: "repeat(6, 1fr)",
                },
                gridTemplateRows: {
                  xs: "repeat(3, auto)",
                  sm: "repeat(2, auto)",
                },
                gap: {
                  xs: 1.5,
                  sm: 2,
                },
                alignItems: "center",
                justifyItems: "center",
                px: {
                  xs: 0,
                  sm: 3,
                },
              }}
            >
              {vehicles.map((vehicle, index) => {
                const positions = [
                  {
                    gridColumn: {
                      xs: "1",
                      sm: "2 / 4",
                    },
                    gridRow: {
                      xs: "1",
                      sm: "1",
                    },
                  },
                  {
                    gridColumn: {
                      xs: "2",
                      sm: "4 / 6",
                    },
                    gridRow: {
                      xs: "1",
                      sm: "1",
                    },
                  },
                  {
                    gridColumn: {
                      xs: "1 / 3",
                      sm: "3 / 5",
                    },
                    gridRow: {
                      xs: "2",
                      sm: "2",
                    },
                  },
                  {
                    gridColumn: {
                      xs: "1",
                      sm: "1 / 3",
                    },
                    gridRow: {
                      xs: "3",
                      sm: "2",
                    },
                  },
                  {
                    gridColumn: {
                      xs: "2",
                      sm: "5 / 7",
                    },
                    gridRow: {
                      xs: "3",
                      sm: "2",
                    },
                  },
                ];

                return (
                  <Box
                    key={vehicle.slug}
                    component={Link}
                    to={`/vehiculos/${vehicle.slug}`}
                    sx={{
                      ...positions[index],

                      width: "100%",
                      maxWidth: {
                        xs: 210,
                        sm: 250,
                      },

                      minHeight: {
                        xs: 92,
                        sm: 112,
                      },

                      px: {
                        xs: 2,
                        sm: 3,
                      },

                      py: 2,

                      border: "1px solid",
                      borderColor: "rgba(196,181,253,0.28)",

                      borderRadius: 5,

                      backgroundColor: "rgba(255,255,255,0.055)",

                      color: "text.primary",

                      textDecoration: "none",

                      cursor: "pointer",

                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",

                      gap: 0.5,

                      boxShadow: "0 8px 30px rgba(0,0,0,0.18)",

                      transition:
                        "transform 180ms ease, border-color 180ms ease, background-color 180ms ease, box-shadow 180ms ease",

                      "&:hover": {
                        borderColor: "rgba(167,139,250,0.75)",

                        backgroundColor: "rgba(139,92,246,0.14)",

                        transform: "translateY(-5px) scale(1.02)",

                        boxShadow: "0 18px 45px rgba(139,92,246,0.16)",
                      },

                      "&:focus-visible": {
                        outline: "2px solid",
                        outlineColor: "primary.light",
                        outlineOffset: 4,
                      },

                      "&:active": {
                        transform: "translateY(-1px) scale(0.99)",
                      },

                      "@media (prefers-reduced-motion: reduce)": {
                        transition: "none",
                      },
                    }}
                  >
                    <Typography
                      component="span"
                      sx={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 0.7,
                        color: "primary.light",
                        fontSize: "0.68rem",
                        fontWeight: 800,
                        letterSpacing: "0.14em",
                        textTransform: "uppercase",
                      }}
                    >
                      {vehicle.brand}

                      <ArrowForwardIcon
                        sx={{
                          fontSize: 14,
                          opacity: 0.7,
                        }}
                      />
                    </Typography>

                    <Typography
                      component="span"
                      sx={{
                        fontFamily: '"Space Grotesk", sans-serif',
                        fontSize: {
                          xs: "1.3rem",
                          sm: "1.55rem",
                        },
                        fontWeight: 700,
                        letterSpacing: "-0.025em",
                      }}
                    >
                      {vehicle.name}
                    </Typography>
                  </Box>
                );
              })}
            </Box>

            <Typography
              sx={{
                color: "text.secondary",
                fontSize: "0.78rem",
                opacity: 0.7,
              }}
            >
              Selecciona tu vehículo para continuar.
            </Typography>
          </Stack>
        </Container>
      </Box>

      <TrustFooter />
    </Box>
  );
}
