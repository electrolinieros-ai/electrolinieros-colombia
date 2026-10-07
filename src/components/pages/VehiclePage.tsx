import { useEffect, useRef, useState } from "react";

import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Container,
  Dialog,
  DialogContent,
  Fade,
  IconButton,
  Typography,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";

import { Link, useParams } from "@tanstack/react-router";

import { getVehicleBySlug } from "../../data/vehicles";
import { trackEvent } from "../../lib/analytics";
import { useProductInterest } from "../../hooks/useProductInterest";

import { BrandMark } from "../brand/BrandMark";
import { TrustFooter } from "../brand/TrustFooter";

export function VehiclePage() {
  const { slug } = useParams({
    from: "/vehiculos/$slug",
  });

  const vehicle = getVehicleBySlug(slug);

  const headingRef = useRef<HTMLHeadingElement>(null);

  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null,
  );

  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);

  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const { goToInterest } = useProductInterest({
    slug,
  });

  const selectedProduct =
    vehicle?.products.find((product) => product.id === selectedProductId) ??
    null;

  /**
   * Cada vez que cambia el vehículo:
   * 1. La página vuelve arriba.
   * 2. Esperamos al siguiente frame para asegurarnos de que el h1
   *    ya está renderizado.
   * 3. Enfocamos el encabezado principal.
   *
   * Esto también funciona cuando navegamos entre vehículos
   * sin desmontar completamente VehiclePage.
   */
  useEffect(() => {
    if (!vehicle) {
      return;
    }

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto",
    });

    const frameId = window.requestAnimationFrame(() => {
      headingRef.current?.focus();
    });

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [slug, vehicle]);

  if (!vehicle) {
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
              Vehículo no encontrado
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

  const openProduct = (productId: string) => {
    setSelectedProductId(productId);
    setActiveImageIndex(0);
    setIsProductDialogOpen(true);

    void trackEvent("product_viewed", productId);
    void trackEvent("details_viewed", productId);
  };

  /**
   * Inicia la animación de salida.
   *
   * El producto NO se limpia todavía. Así el contenido permanece visible
   * durante todo el Fade y desaparece únicamente cuando la transición termina.
   */
  const closeProduct = () => {
    setIsProductDialogOpen(false);
  };

  /**
   * Se ejecuta cuando Fade termina completamente.
   *
   * Aquí sí limpiamos el producto y dejamos VehiclePage arriba.
   */
  const handleProductExited = () => {
    setSelectedProductId(null);
    setActiveImageIndex(0);

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto",
    });
  };

  const productImages = selectedProduct?.images ?? [];

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
            component={Link}
            to="/vehiculos/"
            startIcon={<ArrowBackIcon />}
            sx={{
              display: {
                xs: "inline-flex",
                sm: "none",
              },
              mb: 2,
              px: 0,
              color: "text.secondary",
              "&:hover": {
                backgroundColor: "transparent",
                color: "text.primary",
              },
            }}
          >
            Volver a vehículos
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
                {vehicle.brand}
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
                Soluciones para tu {vehicle.name}
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
                {vehicle.description}
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "repeat(3, minmax(0, 1fr))",
              },
              gap: {
                xs: 2,
                sm: 2.5,
                md: 3,
              },
            }}
          >
            {vehicle.products.map((product) => (
              <Card
                key={product.id}
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  overflow: "hidden",
                  border: "1px solid",
                  borderColor: "rgba(196,181,253,0.16)",
                  borderRadius: 4,
                  backgroundColor: "rgba(255,255,255,0.035)",
                  boxShadow: "0 8px 30px rgba(0,0,0,0.16)",
                  transition:
                    "transform 180ms ease, border-color 180ms ease, box-shadow 180ms ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    borderColor: "rgba(167,139,250,0.48)",
                    boxShadow: "0 18px 45px rgba(139,92,246,0.13)",
                  },
                }}
              >
                <CardActionArea
                  onClick={() => openProduct(product.id)}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "stretch",
                    height: "100%",
                    "&:hover": {
                      backgroundColor: "rgba(139,92,246,0.05)",
                    },
                  }}
                >
                  <Box
                    sx={{
                      aspectRatio: "16 / 10",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      overflow: "hidden",
                      backgroundColor: "rgba(255,255,255,0.02)",
                    }}
                  >
                    {product.images?.[0] ? (
                      <Box
                        component="img"
                        src={product.images[0]}
                        alt={product.name}
                        sx={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          display: "block",
                        }}
                      />
                    ) : (
                      <Inventory2OutlinedIcon
                        sx={{
                          fontSize: {
                            xs: 54,
                            md: 64,
                          },
                          color: "primary.light",
                          opacity: 0.85,
                        }}
                      />
                    )}
                  </Box>

                  <CardContent
                    sx={{
                      p: {
                        xs: 2.5,
                        sm: 3,
                      },
                      flex: 1,
                    }}
                  >
                    <Typography
                      component="h2"
                      sx={{
                        mb: 1,
                        fontFamily: '"Space Grotesk", sans-serif',
                        fontSize: {
                          xs: "1.35rem",
                          sm: "1.5rem",
                        },
                        fontWeight: 700,
                      }}
                    >
                      {product.name}
                    </Typography>

                    <Typography
                      sx={{
                        color: "text.secondary",
                        fontSize: "0.95rem",
                        lineHeight: 1.6,
                      }}
                    >
                      {product.shortDescription}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            ))}
          </Box>
        </Container>
      </Box>

      <TrustFooter />

      <Dialog
        open={isProductDialogOpen}
        onClose={closeProduct}
        fullWidth
        maxWidth="md"
        scroll="paper"
        aria-labelledby="product-dialog-title"
        slots={{
          transition: Fade,
        }}
        slotProps={{
          transition: {
            timeout: {
              enter: 500,
              exit: 800,
            },
            onExited: handleProductExited,
          },
          backdrop: {
            sx: {
              backgroundColor: "rgba(0, 0, 0, 0.82)",
              backdropFilter: "blur(6px)",
            },
          },
          paper: {
            sx: {
              m: {
                xs: 0,
                sm: 2,
              },
              width: {
                xs: "100%",
                sm: "calc(100% - 32px)",
              },
              maxWidth: 980,
              maxHeight: {
                xs: "100svh",
                sm: "calc(100svh - 32px)",
              },
              borderRadius: {
                xs: 0,
                sm: 4,
              },
              backgroundColor: "#100D18",
              backgroundImage:
                "linear-gradient(180deg, #15101F 0%, #0D0B12 24%, #0D0B12 100%)",
              border: {
                xs: "none",
                sm: "1px solid rgba(196,181,253,0.18)",
              },
              boxShadow: "0 30px 100px rgba(0,0,0,0.72)",
            },
          },
        }}
      >
        {selectedProduct && (
          <>
            <Box
              sx={{
                position: "sticky",
                top: 0,
                zIndex: 5,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                pl: {
                  xs: 4.5,
                  sm: 6,
                },
                pr: {
                  xs: 4.5,
                  sm: 6,
                },
                py: 1.5,
                minHeight: 64,
                backgroundColor: "#171220",
                borderBottom: "1px solid",
                borderColor: "rgba(167,139,250,0.16)",
              }}
            >
              <Typography
                sx={{
                  color: "#C4B5FD",
                  fontSize: "0.72rem",
                  fontWeight: 800,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                {vehicle.name}
              </Typography>

              <IconButton
                onClick={closeProduct}
                aria-label="Cerrar"
                sx={{
                  width: 40,
                  height: 40,
                  color: "#E9E5F2",
                  backgroundColor: "rgba(255,255,255,0.06)",
                }}
              >
                <CloseIcon />
              </IconButton>
            </Box>

            <DialogContent
              sx={{
                p: {
                  xs: 2,
                  sm: 3,
                  md: 4,
                },

                overflowY: "scroll",

                "&::-webkit-scrollbar": {
                  width: "8px",
                },

                "&::-webkit-scrollbar-track": {
                  background: "transparent",
                  borderRadius: "20px",
                },

                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "rgba(167,139,250,0.28)",
                  borderRadius: "20px",
                },

                "&::-webkit-scrollbar-thumb:hover": {
                  backgroundColor: "rgba(167,139,250,0.42)",
                },

                scrollbarWidth: "thin",
                scrollbarColor: "rgba(167,139,250,0.65) transparent",

                clipPath: {
                  xs: "none",
                  sm: "inset(0 0 12px 0 round 0 0 16px 16px)",
                },
              }}
            >
              {productImages.length > 0 ? (
                <>
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
                    }}
                  >
                    <Box
                      component="img"
                      src={productImages[activeImageIndex]}
                      alt={`${selectedProduct.name} - imagen ${
                        activeImageIndex + 1
                      }`}
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
                </>
              ) : (
                <Box
                  sx={{
                    width: "100%",
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

              <Box
                sx={{
                  mt: 4,
                  textAlign: "center",
                }}
              >
                <Typography
                  component="h2"
                  id="product-dialog-title"
                  sx={{
                    fontFamily: '"Space Grotesk", sans-serif',
                    fontSize: {
                      xs: "2rem",
                      sm: "2.6rem",
                      md: "3.2rem",
                    },
                    fontWeight: 600,
                    lineHeight: 1,
                  }}
                >
                  {selectedProduct.name}
                </Typography>

                <Typography
                  sx={{
                    mt: 1.5,
                    mx: "auto",
                    maxWidth: 680,
                    color: "text.secondary",
                    lineHeight: 1.65,
                  }}
                >
                  {selectedProduct.shortDescription}
                </Typography>
              </Box>

              <Box
                sx={{
                  mt: 3,
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
                      {selectedProduct.benefit}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {selectedProduct.technicalDetails &&
                selectedProduct.technicalDetails.length > 0 && (
                  <Box sx={{ mt: 3 }}>
                    <Typography
                      component="h3"
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
                      {selectedProduct.technicalDetails.map((detail) => (
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

              <Box sx={{ mt: 4 }}>
                <Button
                  type="button"
                  onClick={() => goToInterest(selectedProduct.id)}
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
            </DialogContent>
          </>
        )}
      </Dialog>
    </Box>
  );
}
