import { useEffect, useState } from "react";
import {
  Container,
  Box,
  Grid,
  CardMedia,
  Typography,
  CircularProgress,
  Paper,
  Button,
} from "@mui/material";
import { Link } from "react-router-dom";
import CardFlip from "react-card-flip";
import config from "../config.json";

function SpeciesCard({ species }) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleMouseEnter = () => {
    setIsFlipped(true);
  };

  const handleMouseLeave = () => {
    setIsFlipped(false);
  };

  return (
    <Grid item xs={6} sm={4} md={3} lg={2} key={species.species_code}>
      <Link
        to={`/species/${species.species_code}`}
        style={{ textDecoration: "none" }}
      >
        <CardFlip isFlipped={isFlipped}>
          <Paper
            elevation={3}
            sx={{
              p: 1,
              borderRadius: 2,
              height: "200px",
              backgroundSize: "cover",
              backgroundImage: `url(https://${species.species_img_link})`,
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          />
          <Paper
            elevation={3}
            sx={{
              p: 1,
              borderRadius: 2,
              height: "200px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <Typography variant="h6" component="h3" textAlign="center">
              {species.common_name}
            </Typography>
          </Paper>
        </CardFlip>
      </Link>
    </Grid>
  );
}

export default function HomePage() {
  const [birdOfTheDay, setBirdOfTheDay] = useState({});
  const [speciesList, setSpeciesList] = useState([]);

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/random/species`)
      .then(res => res.json())
      .then(resJson => setBirdOfTheDay(resJson))
      .catch(error => console.log(error));
  }, []);

  useEffect(() => {
    fetch(
      `http://${config.server_host}:${config.server_port}/all-species?page=1&limit=18`
    )
      .then(res => res.json())
      .then(resJson => setSpeciesList(resJson))
      .catch(error => console.log(error));
  }, []);

  if (!birdOfTheDay || !birdOfTheDay.common_name || !speciesList) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container>
      <Box m={2} pt={3}>
        <Paper
          elevation={3}
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            p: 2,
            mb: 3,
            borderRadius: 2,
            backgroundColor: "primary.main",
            color: "white",
            position: "relative",
          }}
        >
          <Box
            sx={{
              maxHeight: "300px",
              overflowY: "auto",
              pr: 2, // Add some padding to the right
            }}
          >
            <Typography gutterBottom variant="h4" component="h2">
              BIRD OF THE DAY
            </Typography>
            <Typography gutterBottom variant="h5" component="h2">
              {birdOfTheDay.common_name}
            </Typography>
            <Typography>{birdOfTheDay.species_description}</Typography>
            <Button
              component={Link}
              to={`/species/${birdOfTheDay.species_code}`}
              variant="outlined"
              size="large"
              sx={{
                mt: 2,
                borderColor: "white",
                color: "white",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                },
              }}
            >
              More Info
            </Button>
          </Box>

          <CardMedia
            component="img"
            sx={{
              width: "300px",
              height: "250px",
              objectFit: "fill",
              borderRadius: 1,
              ml: 2,
            }}
            image={`https://${birdOfTheDay.species_img_link}`}
            alt={birdOfTheDay.common_name}
            title={birdOfTheDay.common_name}
          />
        </Paper>
      </Box>

      <Box m={2} pt={2}>
        <Grid container spacing={2}>
          {speciesList.map(species => (
            <SpeciesCard key={species.species_code} species={species} />
          ))}
        </Grid>
      </Box>
    </Container>
  );
}
