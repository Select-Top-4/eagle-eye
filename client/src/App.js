import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { purple, yellow } from "./color_scheme/ColorScheme";
import NavBar from "./components/NavBar";
import HomePage from "./pages/HomePage";
import SpeciesPage from "./pages/SpeciesPage";
import FamilyPage from "./pages/FamilyPage";
import MapPage from "./pages/MapPage";

export const theme = createTheme({
  palette: {
    primary: purple,
    secondary: yellow,
  },
});
export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/species/:species_code" element={<SpeciesPage />} />
          <Route path="/family/:family_code" element={<FamilyPage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
