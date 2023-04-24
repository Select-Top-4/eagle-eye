import { useEffect, useState } from "react";
import {
  Container,
  Box,
  CardMedia,
  Typography,
  CircularProgress,
  Paper,
  Button,
} from "@mui/material";
import { Link } from "react-router-dom";
import config from "../config.json";

export default function HomePage() {
  const [birdOfTheDay, setBirdOfTheDay] = useState();
  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/random/species`)
      .then(res => res.json())
      .then(resJson => setBirdOfTheDay(resJson))
      .catch(error => console.log(error));
  }, []);

  if (!birdOfTheDay) {
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
          <Box>
            <Typography gutterBottom variant="h4" component="h2">
              Bird of the day
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
              objectFit: "cover",
              borderRadius: 1,
              ml: 2,
            }}
            image={"https://" + birdOfTheDay.species_img_link}
            alt={birdOfTheDay.common_name}
            title={birdOfTheDay.common_name}
          />
        </Paper>
      </Box>
      <Box m={2} pt={3}>
        {/* Add more content here */}
      </Box>
    </Container>
  );
}
