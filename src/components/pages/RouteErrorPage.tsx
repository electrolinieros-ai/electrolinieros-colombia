import { useEffect, useRef } from "react";

import { Box, Button, Stack, Typography } from "@mui/material";

import CloudOffOutlinedIcon from "@mui/icons-material/CloudOffOutlined";
import ErrorOutlinedIcon from "@mui/icons-material/ErrorOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import RefreshIcon from "@mui/icons-material/Refresh";

import { useNavigate, useRouter } from "@tanstack/react-router";

import { getRouteErrorMessage } from "../../lib/route-errors";
import { BrandMark } from "../brand/BrandMark";
import { TrustFooter } from "../brand/TrustFooter";

type RouteErrorPageProps = {
  error?: unknown;
  reset?: () => void;
  info?: { componentStack?: string };
};

export function RouteErrorPage({ error }: RouteErrorPageProps) {
  const navigate = useNavigate();
  const router = useRouter();

  const headingRef = useRef<HTMLHeadingElement>(null);

  const message = getRouteErrorMessage(error);

  const isNetworkError = message.includes("problema de conexión");

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  const retry = () => {
    void router.invalidate();
  };

  const goHome = () => {
    void navigate({ to: "/" });
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
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: 2,
        }}
      >
        <Stack
          spacing={3}
          sx={{
            maxWidth: 520,
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <BrandMark />

          {isNetworkError ? (
            <CloudOffOutlinedIcon
              sx={{
                fontSize: 72,
                color: "primary.light",
              }}
            />
          ) : (
            <ErrorOutlinedIcon
              sx={{
                fontSize: 72,
                color: "primary.light",
              }}
            />
          )}

          <Typography
            ref={headingRef}
            component="h1"
            tabIndex={-1}
            sx={{
              fontFamily: '"Space Grotesk", sans-serif',
              fontSize: {
                xs: "2rem",
                sm: "2.6rem",
              },
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: "-0.04em",
              outline: "none",
            }}
          >
            {isNetworkError ? "No pudimos conectar." : "Algo salió mal."}
          </Typography>

          <Typography
            sx={{
              color: "text.secondary",
              lineHeight: 1.65,
            }}
          >
            {message}
          </Typography>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            sx={{
              width: "100%",
              pt: 1,
            }}
          >
            <Button
              type="button"
              onClick={retry}
              variant="contained"
              size="large"
              startIcon={<RefreshIcon />}
              sx={{
                minHeight: 52,
                flex: 1,
                borderRadius: 999,
                fontWeight: 800,
                textTransform: "none",
              }}
            >
              Reintentar
            </Button>

            <Button
              type="button"
              onClick={goHome}
              variant="outlined"
              size="large"
              startIcon={<HomeOutlinedIcon />}
              sx={{
                minHeight: 52,
                flex: 1,
                borderRadius: 999,
                fontWeight: 800,
                textTransform: "none",
              }}
            >
              Volver al inicio
            </Button>
          </Stack>
        </Stack>
      </Box>

      <TrustFooter />
    </Box>
  );
}
