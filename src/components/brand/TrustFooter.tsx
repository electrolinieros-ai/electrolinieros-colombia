import { Box, Container, Typography } from "@mui/material";

export function TrustFooter() {
  return (
    <Box
      component="footer"
      sx={{
        width: "100%",
        py: { xs: 2.5, sm: 3 },
      }}
    >
      <Container maxWidth="lg">
        <Typography
          component="p"
          sx={{
            m: 0,
            width: "100%",
            textAlign: "center",
            whiteSpace: "nowrap",
            fontSize: {
              xs: "0.58rem",
              sm: "0.72rem",
              md: "0.82rem",
            },
            fontWeight: 600,
            letterSpacing: {
              xs: "0.025em",
              sm: "0.05em",
              md: "0.08em",
            },
            color: "primary.light",
          }}
        >
          RESPALDADO POR{" "}
          <Box
            component="span"
            sx={{
              mx: { xs: 0.5, sm: 0.8 },
              color: "primary.dark",
            }}
          >
            ·
          </Box>
          <Box
            component="span"
            sx={{
              color: "#C4B5FD",
              fontWeight: 900,
              letterSpacing: {
                xs: "0.04em",
                sm: "0.06em",
                md: "0.08em",
              },
            }}
          >
            IMPORTQUINDIO
          </Box>
          <Box
            component="span"
            sx={{
              mx: { xs: 0.5, sm: 0.8 },
              color: "primary.dark",
            }}
          >
            +
          </Box>
          <Box
            component="span"
            sx={{
              color: "primary.light",
              fontWeight: 700,
            }}
          >
            26 AÑOS EN EL MERCADO
          </Box>
        </Typography>
      </Container>
    </Box>
  );
}
