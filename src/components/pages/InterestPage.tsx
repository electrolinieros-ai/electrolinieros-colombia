import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  FormHelperText,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { useNavigate, useParams } from "@tanstack/react-router";

import { useEffect, useRef, useState } from "react";

import { supabase } from "../../lib/supabase";
import {
  EMAIL_MAX_LENGTH,
  NAME_MAX_LENGTH,
  PHONE_MAX_LENGTH,
  validateContact,
  validateEmail,
  validateName,
  validatePhone,
} from "../../lib/validation";
import { BrandMark } from "../brand/BrandMark";
import { TrustFooter } from "../brand/TrustFooter";

function formatProductName(productId: string) {
  return productId.replace(/-/g, " ").toUpperCase();
}

export function InterestPage() {
  const navigate = useNavigate();

  const { slug, productId } = useParams({
    from: "/vehiculos/$slug/productos/$productId/interes",
  });

  const headingRef = useRef<HTMLHeadingElement>(null);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const [nameError, setNameError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [contactError, setContactError] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  const goBackToProduct = async () => {
    await navigate({
      to: "/vehiculos/$slug/productos/$productId",
      params: {
        slug,
        productId,
      },
      resetScroll: true,
    });
  };

  const goToVehicles = async () => {
    await navigate({
      to: "/vehiculos",
      resetScroll: true,
    });
  };

  const validateForm = () => {
    let valid = true;

    setNameError("");
    setPhoneError("");
    setEmailError("");
    setContactError("");
    setSubmitError("");

    const nameError = validateName(name);
    const phoneError = validatePhone(phone);
    const emailError = validateEmail(email);
    const contactError = validateContact(phone, email);

    if (nameError) {
      setNameError(nameError);
      valid = false;
    }

    if (phoneError) {
      setPhoneError(phoneError);
      valid = false;
    }

    if (emailError) {
      setEmailError(emailError);
      valid = false;
    }

    if (contactError) {
      setContactError(contactError);
      valid = false;
    }

    return valid;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    try {
      const visitorId = localStorage.getItem("ELECTROLINIEROS_visitor_id");

      if (!visitorId) {
        throw new Error("No se encontró la identificación del visitante.");
      }

      const trimmedName = name.trim();
      const trimmedPhone = phone.trim();
      const trimmedEmail = email.trim();

      const { error } = await supabase.rpc("create_lead", {
        p_visitor_id: visitorId,
        p_product_id: productId,
        p_name: trimmedName,
        p_phone: trimmedPhone || null,
        p_email: trimmedEmail || null,
      });

      if (error) {
        throw error;
      }

      setSubmitted(true);

      window.setTimeout(() => {
        void goToVehicles();
      }, 1200);
    } catch (error) {
      console.error("Error creando el lead:", error);

      setSubmitError("No pudimos enviar tus datos. Inténtalo nuevamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const productName = formatProductName(productId);

  if (submitted) {
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
          component="header"
          sx={{
            pt: {
              xs: 3,
              sm: 4,
            },
            px: {
              xs: 2.5,
              sm: 4,
            },
          }}
        >
          <Container
            maxWidth="lg"
            sx={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <BrandMark />
          </Container>
        </Box>

        <Box
          component="main"
          sx={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            py: {
              xs: 6,
              sm: 8,
            },
          }}
        >
          <Container maxWidth="sm">
            <Stack
              spacing={3}
              sx={{
                alignItems: "center",
                textAlign: "center",
              }}
            >
              <Typography
                ref={headingRef}
                component="h1"
                tabIndex={-1}
                sx={{
                  fontFamily: '"Space Grotesk", sans-serif',
                  fontSize: {
                    xs: "2.4rem",
                    sm: "3.5rem",
                  },
                  fontWeight: 600,
                  lineHeight: 1,
                  letterSpacing: "-0.05em",
                  outline: "none",
                }}
              >
                ¡Enviado correctamente!
              </Typography>

              <Typography
                sx={{
                  maxWidth: 520,
                  color: "text.secondary",
                  lineHeight: 1.7,
                }}
              >
                Recibimos tus datos. Te responderemos a la vuelta con la
                información de disponibilidad y precio del producto que te
                interesa.
              </Typography>
            </Stack>
          </Container>
        </Box>

        <TrustFooter />
      </Box>
    );
  }

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
        component="header"
        sx={{
          pt: {
            xs: 2.5,
            sm: 3,
          },
          px: {
            xs: 2.5,
            sm: 4,
          },
        }}
      >
        <Button
          type="button"
          variant="text"
          startIcon={<ArrowBackIcon />}
          onClick={goBackToProduct}
          sx={{
            display: {
              xs: "inline-flex",
              sm: "none",
            },
            mb: {
              xs: 1.5,
              sm: 2,
            },
            px: 0,
            minHeight: 44,
            color: "text.secondary",
            "&:hover": {
              backgroundColor: "transparent",
              color: "text.primary",
            },
          }}
        >
          Volver al producto
        </Button>

        <Container
          maxWidth="lg"
          sx={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <BrandMark />
        </Container>
      </Box>

      <Box
        component="main"
        sx={{
          flex: 1,
          py: {
            xs: 5,
            sm: 7,
          },
        }}
      >
        <Container maxWidth="sm">
          <Stack spacing={4}>
            <Stack spacing={2}>
              <Typography
                ref={headingRef}
                component="h1"
                tabIndex={-1}
                sx={{
                  fontFamily: '"Space Grotesk", sans-serif',
                  fontSize: {
                    xs: "2.6rem",
                    sm: "3.7rem",
                  },
                  fontWeight: 600,
                  lineHeight: 0.98,
                  letterSpacing: "-0.05em",
                  outline: "none",
                }}
              >
                ¿Quieres conocer el precio?
              </Typography>

              <Typography
                sx={{
                  color: "text.secondary",
                  fontSize: "1rem",
                  lineHeight: 1.7,
                }}
              >
                Déjanos tus datos y te respondemos a la vuelta con la
                información de disponibilidad y precio de este producto.
              </Typography>
            </Stack>

            <Box
              sx={{
                p: {
                  xs: 2.5,
                  sm: 3,
                },
                border: "1px solid",
                borderColor: "rgba(255,255,255,0.08)",
                borderRadius: 3,
                background:
                  "linear-gradient(145deg, rgba(139,92,246,0.08), rgba(255,255,255,0.02))",
              }}
            >
              <Stack spacing={0.5}>
                <Typography
                  sx={{
                    color: "text.secondary",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                  }}
                >
                  Producto
                </Typography>

                <Typography
                  sx={{
                    fontWeight: 800,
                    wordBreak: "break-word",
                  }}
                >
                  {productName}
                </Typography>
              </Stack>
            </Box>

            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              autoComplete="off"
            >
              <Stack spacing={3}>
                <TextField
                  label="Tu nombre"
                  placeholder="Juan Gomez"
                  value={name}
                  onChange={(event) => {
                    setName(event.target.value);

                    if (nameError) {
                      setNameError("");
                    }
                  }}
                  error={Boolean(nameError)}
                  helperText={nameError}
                  slotProps={{
                    htmlInput: {
                      maxLength: NAME_MAX_LENGTH,
                      autoComplete: "off",
                    },
                  }}
                  fullWidth
                  required
                  autoComplete="off"
                  sx={{
                    "& .MuiInputBase-input::placeholder": {
                      color: "#A78BFA",
                      opacity: 1,
                    },
                  }}
                />

                <TextField
                  label="Número de teléfono"
                  type="tel"
                  placeholder="3142507000"
                  value={phone}
                  onChange={(event) => {
                    setPhone(event.target.value);

                    if (phoneError) {
                      setPhoneError("");
                    }

                    if (contactError) {
                      setContactError("");
                    }
                  }}
                  error={Boolean(phoneError)}
                  helperText={
                    phoneError ||
                    "Opcional. Móvil: 3XXXXXXXXX (10 dígitos) o fijo: 7 u 10 dígitos."
                  }
                  slotProps={{
                    htmlInput: {
                      maxLength: PHONE_MAX_LENGTH,
                      autoComplete: "off",
                    },
                  }}
                  fullWidth
                  autoComplete="off"
                  inputMode="tel"
                  sx={{
                    "& .MuiInputBase-input::placeholder": {
                      color: "#A78BFA",
                      opacity: 1,
                    },
                  }}
                />

                <TextField
                  label="Correo electrónico"
                  type="email"
                  placeholder="ELECTROLINIEROS@gmail.com"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);

                    if (emailError) {
                      setEmailError("");
                    }

                    if (contactError) {
                      setContactError("");
                    }
                  }}
                  error={Boolean(emailError)}
                  helperText={emailError || "Opcional."}
                  slotProps={{
                    htmlInput: {
                      maxLength: EMAIL_MAX_LENGTH,
                      autoComplete: "off",
                    },
                  }}
                  fullWidth
                  autoComplete="off"
                  inputMode="email"
                  sx={{
                    "& .MuiInputBase-input::placeholder": {
                      color: "#A78BFA",
                      opacity: 1,
                    },
                  }}
                />

                {contactError && (
                  <FormHelperText
                    error
                    sx={{
                      m: 0,
                      mt: -1,
                    }}
                  >
                    {contactError}
                  </FormHelperText>
                )}

                {submitError && <Alert severity="error">{submitError}</Alert>}

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={isSubmitting}
                  startIcon={
                    isSubmitting ? (
                      <CircularProgress
                        size={18}
                        thickness={5}
                        color="inherit"
                      />
                    ) : undefined
                  }
                  sx={{
                    minHeight: 58,
                    borderRadius: 999,
                    fontSize: "1rem",
                    fontWeight: 800,
                    color: "#fff",
                    background:
                      "linear-gradient(135deg, #8B5CF6 0%, #7C3AED 50%, #6D28D9 100%)",
                    boxShadow: "0 16px 50px rgba(139,92,246,0.22)",
                    "&:hover": {
                      background:
                        "linear-gradient(135deg, #A78BFA 0%, #8B5CF6 50%, #7C3AED 100%)",
                      transform: "translateY(-2px)",
                      boxShadow: "0 20px 60px rgba(139,92,246,0.32)",
                    },
                    "&.Mui-disabled": {
                      color: "rgba(255,255,255,0.75)",
                      background:
                        "linear-gradient(135deg, #6D28D9 0%, #5B21B6 100%)",
                    },
                  }}
                >
                  {isSubmitting ? "Enviando..." : "Enviar"}
                </Button>

                <FormHelperText
                  sx={{
                    m: 0,
                    textAlign: "center",
                    color: "text.secondary",
                  }}
                >
                  Sin compromiso. Te responderemos a la vuelta con la
                  información del producto.
                </FormHelperText>
              </Stack>
            </Box>
          </Stack>
        </Container>
      </Box>

      <TrustFooter />
    </Box>
  );
}
