import { createTheme, responsiveFontSizes } from "@mui/material/styles";

let theme = createTheme({
  palette: {
    mode: "dark",

    background: {
      default: "#070609",
      paper: "#0D0B12",
    },

    primary: {
      main: "#8B5CF6",
      light: "#A78BFA",
      dark: "#6D28D9",
    },

    text: {
      primary: "#F5F3F7",
      secondary: "#A7A3AF",
    },
  },

  typography: {
    fontFamily: '"Manrope", sans-serif',

    h1: {
      fontFamily: '"Space Grotesk", sans-serif',
      fontWeight: 600,
      letterSpacing: "-0.045em",
      lineHeight: 0.98,
    },

    h2: {
      fontFamily: '"Space Grotesk", sans-serif',
      fontWeight: 600,
      letterSpacing: "-0.04em",
    },

    h3: {
      fontFamily: '"Space Grotesk", sans-serif',
      fontWeight: 600,
    },

    body1: {
      fontWeight: 400,
      lineHeight: 1.7,
    },

    body2: {
      fontWeight: 400,
      lineHeight: 1.6,
    },

    button: {
      fontFamily: '"Manrope", sans-serif',
      fontWeight: 700,
      textTransform: "none",
    },
  },

  shape: {
    borderRadius: 18,
  },

  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },

      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 800,
        },
      },
    },

    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: "#070609",
        },
      },
    },
  },
});

theme = responsiveFontSizes(theme);

export default theme;
