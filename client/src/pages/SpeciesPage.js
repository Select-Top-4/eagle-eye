import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import { Container, Divider } from "@mui/material";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import config from "../config.json";
import { Link } from "react-router-dom";

export default function SpeciesPage() {
  const { species_code } = useParams();
  const [speciesInfo, setSpeciesInfo] = useState({});
  useEffect(() => {
    fetch(
      `http://${config.server_host}:${config.server_port}/species/${species_code}`
    )
      .then(res => res.json())
      .then(resJson => setSpeciesInfo(resJson))
      .catch(error => console.log(error));
  }, []);

  if (!speciesInfo) {
    return <div>Loading...</div>;
  }

  return (
    <Container>
      <Box m={2} pt={3}>
        <Card sx={{ height: "100%", display: "flex", flexDirection: "row" }}>
          <CardMedia
            component="img"
            sx={{ padding: "1em 1em 1em 1em", objectFit: "contain" }}
            height="250"
            image={"https://" + speciesInfo.species_img_link}
            alt={speciesInfo.common_name}
            title={speciesInfo.common_name}
          />
          <CardContent sx={{ flexGrow: 1 }}>
            <Typography gutterBottom variant="h5" component="h2">
              Species: {speciesInfo.scientific_name}
            </Typography>
            <Typography gutterBottom variant="h5" component="h2">
              Common name: {speciesInfo.common_name}
            </Typography>
            <Typography gutterBottom variant="h5" component="h2">
              Family: {speciesInfo.family_scientific_name}
            </Typography>
            <Typography gutterBottom variant="h5" component="h2">
              Family common name: {speciesInfo.family_common_name}
            </Typography>
            <Typography gutterBottom variant="h5" component="h2">
              {speciesInfo.species_description}
            </Typography>
          </CardContent>
          <CardActions>
            <Button component={Link} to="/" variant="outlined" size="large">
              Back
            </Button>
          </CardActions>
          <CardActions>
            <Button
              component={Link}
              to={`/family/${speciesInfo.family_code}`}
              variant="outlined"
              size="large"
            >
              Family Info
            </Button>
          </CardActions>
        </Card>
      </Box>
    </Container>
  );
}
