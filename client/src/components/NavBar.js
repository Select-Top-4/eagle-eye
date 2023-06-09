import { AppBar, Container, Toolbar, Typography } from "@mui/material";
import { NavLink } from "react-router-dom";
import ForestIcon from "@mui/icons-material/Forest";
import MapIcon from "@mui/icons-material/Map";
import "./css/NavBar.css";

const NavText = ({ href, text, isMain, icon }) => {
  return (
    <Typography
      variant={isMain ? "h5" : "h7"}
      noWrap
      style={{
        marginRight: "40px",
        fontFamily: "Arial",
        fontWeight: "bold",
        letterSpacing: "0.08em",
      }}
    >
      <NavLink to={href} className="navLink">
        {icon && <span style={{ marginRight: "8px" }}>{icon}</span>}
        {text}
      </NavLink>
    </Typography>
  );
};

export default function NavBar() {
  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <NavText href="/" text="Eagle Eye" isMain icon={<ForestIcon />} />
          <NavText href="/map" text="Observe in Map" icon={<MapIcon />} />
        </Toolbar>
      </Container>
    </AppBar>
  );
}
