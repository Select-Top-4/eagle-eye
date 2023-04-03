import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { indigo, amber } from '@mui/material/colors'
import NavBar from './components/NavBar';
import HomePage from './pages/HomePage';
import SpeciesPage from './pages/SpeciesPage';
import FamilyPage from './pages/FamilyPage';

export const theme = createTheme({
  palette: {
    primary: indigo,
    secondary: amber,
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
          <Route path="/species/:species_code" element={<SpeciesPage />} />
          <Route path="/family/:family_code" element={<FamilyPage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}