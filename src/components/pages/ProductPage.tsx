import { useEffect, useRef, useState } from "react";

import { Box, Button, Container, IconButton, Typography } from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";

import { Link, useNavigate, useParams } from "@tanstack/react-router";

import { getProductById, getVehicleBySlug } from "../../data/vehicles";
import { trackEvent } from "../../lib/analytics";
import { useProductInterest } from "../../hooks/useProductInterest";

import { BrandMark } from "../brand/BrandMark";
import { TrustFooter } from "../brand/TrustFooter";

export function ProductPage() {
  const { slug, productId } = useParams({
    from: "/vehiculos/$slug/productos/$productId",
  });

  const vehicle = getVehicleBySlug(slug);
  const product = vehicle ? getProductById(vehicle.slug, productId) : undefined;

  const headingRef = useRef<HTMLHeadingElement>(null);

  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const navigate = useNavigate();

  const { goToInterest } = useProductInterest({
    slug,
  });

  useEffect(() => {
    if (!product) {
      return;
    }

    headingRef.current?.focus();

    void trackEvent("product_viewed", product.id);
    void trackEvent("details_viewed", product.id);
  }, [product]);

  if (!vehicle || !product) {
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
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            px: 2,
          }}
        >
          <Box sx={{ textAlign: "center" }}>
            <Typography
              ref={headingRef}
              component="h1"
              tabIndex={-1}
              sx={{
                mb: 2,
                fontFamily: '"Space Grotesk", sans-serif',
                fontSize: {
                  xs: "2rem",
                  sm: "3rem",
                },
                fontWeight: 700,
                outline: "none",
              }}
            >
              Producto no encontrado
            </Typography>

            <Button
              component={Link}
              to="/vehiculos/"
              variant="contained"
              startIcon={<ArrowBackIcon />}
            >
              Volver a vehículos
            </Button>
          </Box>
        </Box>

        <TrustFooter />
      </Box>
    );
  }

  const productImages = product.images ?? [];

  const showPreviousImage = () => {
    if (productImages.length <= 1) {
      return;
    }

    setActiveImageIndex((currentIndex) =>
      currentIndex === 0 ? productImages.length - 1 : currentIndex - 1,
    );
  };

  const showNextImage = () => {
    if (productImages.length <= 1) {
      return;
    }

    setActiveImageIndex((currentIndex) =>
      currentIndex === productImages.length - 1 ? 0 : currentIndex + 1,
    );
  };

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
        }}
      >
        <Container
          maxWidth="lg"
          sx={{
            pt: {
              xs: 2,
              sm: 3,
              md: 4,
            },
            pb: {
              xs: 4,
              sm: 6,
              md: 8,
            },
          }}
        >
          <Button
            type="button"
            onClick={() =>
              navigate({
                to: "/vehiculos/$slug",
                params: { slug },
                resetScroll: true,
              })
            }
            startIcon={<ArrowBackIcon />}
            sx={{
              mb: 2,
              px: 0,
              color: "text.secondary",
              "&:hover": {
                backgroundColor: "transparent",
                color: "text.primary",
              },
            }}
          >
            Volver a {vehicle.name}
          </Button>

          <Box
            sx={{
              mb: {
                xs: 4,
                sm: 5,
                md: 6,
              },
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <BrandMark />

            <Box
              sx={{
                mt: {
                  xs: 4,
                  sm: 5,
                  md: 6,
                },
                maxWidth: 820,
                width: "100%",
              }}
            >
              <Typography
                component="p"
                sx={{
                  mb: 1.5,
                  color: "primary.light",
                  fontSize: "0.72rem",
                  fontWeight: 800,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                }}
              >
                {vehicle.brand} · {vehicle.name}
              </Typography>

              <Typography
                ref={headingRef}
                component="h1"
                tabIndex={-1}
                sx={{
                  fontFamily: '"Space Grotesk", sans-serif',
                  fontSize: {
                    xs: "2.7rem",
                    sm: "3.8rem",
                    md: "5rem",
                  },
                  fontWeight: 600,
                  lineHeight: 0.98,
                  letterSpacing: "-0.055em",
                  outline: "none",
                }}
              >
                {product.name}
              </Typography>

              <Typography
                sx={{
                  mt: 2,
                  mx: "auto",
                  maxWidth: 650,
                  color: "text.secondary",
                  fontSize: {
                    xs: "1rem",
                    sm: "1.1rem",
                  },
                  lineHeight: 1.65,
                }}
              >
                {product.shortDescription}
              </Typography>
            </Box>
          </Box>

          {/* GALERÍA */}

          {productImages.length > 0 ? (
            <Box
              sx={{
                mx: "auto",
                maxWidth: 980,
              }}
            >
              <Box
                sx={{
                  position: "relative",
                  width: "100%",
                  aspectRatio: {
                    xs: "4 / 3",
                    sm: "16 / 9",
                  },
                  overflow: "hidden",
                  borderRadius: 3,
                  backgroundColor: "rgba(255,255,255,0.025)",
                  border: "1px solid",
                  borderColor: "rgba(196,181,253,0.12)",
                }}
              >
                <Box
                  component="img"
                  src={productImages[activeImageIndex]}
                  alt={`${product.name} - imagen ${activeImageIndex + 1}`}
                  sx={{
                    width: "100%",
                    height: "100%",
                    display: "block",
                    objectFit: "contain",
                  }}
                />

                {productImages.length > 1 && (
                  <>
                    <IconButton
                      onClick={showPreviousImage}
                      aria-label="Imagen anterior"
                      sx={{
                        position: "absolute",
                        left: 12,
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: "#FFFFFF",
                        backgroundColor: "rgba(7,6,9,0.62)",
                      }}
                    >
                      <ArrowBackIcon />
                    </IconButton>

                    <IconButton
                      onClick={showNextImage}
                      aria-label="Imagen siguiente"
                      sx={{
                        position: "absolute",
                        right: 12,
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: "#FFFFFF",
                        backgroundColor: "rgba(7,6,9,0.62)",
                      }}
                    >
                      <ArrowForwardIcon />
                    </IconButton>
                  </>
                )}
              </Box>

              {productImages.length > 1 && (
                <Box
                  sx={{
                    mt: 1.5,
                    display: "flex",
                    justifyContent: "center",
                    gap: 0.8,
                  }}
                >
                  {productImages.map((image, index) => (
                    <Box
                      key={image}
                      component="button"
                      type="button"
                      onClick={() => setActiveImageIndex(index)}
                      aria-label={`Ver imagen ${index + 1}`}
                      sx={{
                        width: index === activeImageIndex ? 24 : 7,
                        height: 7,
                        p: 0,
                        border: 0,
                        borderRadius: 999,
                        cursor: "pointer",
                        backgroundColor:
                          index === activeImageIndex
                            ? "primary.light"
                            : "rgba(255,255,255,0.22)",
                      }}
                    />
                  ))}
                </Box>
              )}
            </Box>
          ) : (
            <Box
              sx={{
                mx: "auto",
                maxWidth: 980,
                aspectRatio: {
                  xs: "4 / 3",
                  sm: "16 / 9",
                },
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 3,
                backgroundColor: "rgba(255,255,255,0.025)",
              }}
            >
              <Inventory2OutlinedIcon
                sx={{
                  fontSize: 100,
                  color: "primary.light",
                  opacity: 0.7,
                }}
              />
            </Box>
          )}

          {/* BENEFICIO */}

          <Box
            sx={{
              mt: 4,
              mx: "auto",
              maxWidth: 980,
              p: 3,
              borderRadius: 3,
              backgroundColor: "rgba(139,92,246,0.07)",
              border: "1px solid",
              borderColor: "rgba(167,139,250,0.14)",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "flex-start",
                gap: 1.2,
              }}
            >
              <CheckCircleIcon
                sx={{
                  fontSize: 22,
                  color: "primary.light",
                  flexShrink: 0,
                }}
              />

              <Box>
                <Typography
                  sx={{
                    mb: 0.5,
                    color: "primary.light",
                    fontSize: "0.72rem",
                    fontWeight: 800,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                  }}
                >
                  Beneficio
                </Typography>

                <Typography
                  sx={{
                    color: "text.secondary",
                    fontSize: "0.95rem",
                    lineHeight: 1.6,
                  }}
                >
                  {product.benefit}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* ESPECIFICACIONES */}

          {product.technicalDetails && product.technicalDetails.length > 0 && (
            <Box
              sx={{
                mt: 4,
                mx: "auto",
                maxWidth: 980,
              }}
            >
              <Typography
                component="h2"
                sx={{
                  mb: 2,
                  fontFamily: '"Space Grotesk", sans-serif',
                  fontSize: "1.5rem",
                  fontWeight: 700,
                }}
              >
                Especificaciones
              </Typography>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "repeat(2, minmax(0, 1fr))",
                  },
                  gap: 1,
                }}
              >
                {product.technicalDetails.map((detail) => (
                  <Box
                    key={`${detail.label}-${detail.value}`}
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 0.5,
                      p: 2,
                      borderRadius: 2.5,
                      backgroundColor: "rgba(255,255,255,0.035)",
                      border: "1px solid",
                      borderColor: "rgba(196,181,253,0.08)",
                    }}
                  >
                    <Typography
                      sx={{
                        color: "text.secondary",
                        fontSize: "0.68rem",
                        fontWeight: 800,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                      }}
                    >
                      {detail.label}
                    </Typography>

                    <Typography
                      sx={{
                        color: "text.primary",
                        fontSize: "0.9rem",
                        lineHeight: 1.5,
                      }}
                    >
                      {detail.value}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          )}

          {/* CTA */}

          <Box
            sx={{
              mt: 5,
              mx: "auto",
              maxWidth: 980,
              textAlign: "center",
            }}
          >
            <Typography
              sx={{
                mb: 2,
                color: "text.secondary",
                fontSize: "1rem",
                lineHeight: 1.6,
              }}
            >
              Déjanos tus datos y te enviaremos información del producto,
              precios y disponibilidad.
            </Typography>

            <Button
              type="button"
              onClick={() => goToInterest(product.id)}
              fullWidth
              size="large"
              variant="contained"
              endIcon={<ArrowForwardIcon />}
              sx={{
                minHeight: 58,
                borderRadius: 999,
                fontSize: {
                  xs: "0.92rem",
                  sm: "1rem",
                },
                fontWeight: 800,
                color: "#FFFFFF",
                background:
                  "linear-gradient(135deg, #8B5CF6 0%, #7C3AED 50%, #6D28D9 100%)",
                boxShadow: "0 16px 50px rgba(139,92,246,0.22)",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #A78BFA 0%, #8B5CF6 50%, #7C3AED 100%)",
                  transform: "translateY(-2px)",
                },
              }}
            >
              Me interesa — quiero conocer el precio
            </Button>
          </Box>
        </Container>
      </Box>

      <TrustFooter />
    </Box>
  );
}
