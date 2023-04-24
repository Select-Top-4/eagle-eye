import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Typography,
  CircularProgress,
  Box,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
} from "@mui/material";
import { Link } from "react-router-dom";
import config from "../config.json";

export default function SpeciesPage() {
  const { species_code } = useParams();
  const [speciesInfo, setSpeciesInfo] = useState({});
  const [sightings, setSightings] = useState([]);

  useEffect(() => {
    fetch(
      `http://${config.server_host}:${config.server_port}/species/${species_code}`
    )
      .then(res => res.json())
      .then(resJson => setSpeciesInfo(resJson))
      .catch(error => console.log(error));
  }, []);
  useEffect(() => {
    fetch(
      `http://${config.server_host}:${config.server_port}/species/${species_code}/5-latest-observations`
    )
      .then(res => res.json())
      .then(resJson => setSightings(resJson))
      .catch(error => console.log(error));
  }, []);

  if (!speciesInfo) {
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
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography
              gutterBottom
              variant="h5"
              component="h3"
              textAlign="center"
            >
              {speciesInfo.common_name}
            </Typography>
          </Grid>
          <Grid item xs={12} md={3}>
            <Paper
              elevation={3}
              sx={{
                p: 2,
                mb: 3,
                borderRadius: 2,
                backgroundColor: "primary.main",
                color: "white",
                position: "relative",
              }}
            >
              <img
                src={"https://" + speciesInfo.species_img_link}
                alt={speciesInfo.common_name}
                title={speciesInfo.common_name}
                style={{ width: "100%", height: "auto", borderRadius: "4px" }}
              />
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper elevation={1} sx={{ p: 2, mb: 3, borderRadius: 2 }}>
              <Typography gutterBottom variant="body1" component="h3">
                Species: {speciesInfo.scientific_name}
              </Typography>
              <Typography gutterBottom variant="body1" component="h3">
                Common name: {speciesInfo.common_name}
              </Typography>
              <Typography gutterBottom variant="body1" component="h3">
                Family: {speciesInfo.family_scientific_name}
              </Typography>
              <Typography gutterBottom variant="body1" component="h3">
                Family common name: {speciesInfo.family_common_name}
              </Typography>
              <Button
                component={Link}
                to={`/family/${speciesInfo.family_code}`}
                variant="outlined"
                size="large"
                fullWidth
                sx={{ mb: 3 }}
              >
                Read More About {speciesInfo.family_scientific_name}
              </Button>
            </Paper>
          </Grid>
          <Grid item xs={12} md={5}>
            <Paper elevation={1} sx={{ p: 2, mb: 3, borderRadius: 2 }}>
              <Typography
                gutterBottom
                variant="body1"
                component="h3"
                textAlign="center"
              >
                {speciesInfo.species_description}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Typography gutterBottom variant="body1" component="h3">
              Recent Sightings
            </Typography>
            <TableContainer component={Paper} sx={{ mb: 3 }}>
              <Table sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Location</TableCell>
                    <TableCell>Observation Count</TableCell>
                    <TableCell>Spotted By</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Array.isArray(sightings) &&
                    sightings.map((sighting, id) => (
                      <TableRow key={id}>
                        <TableCell component="th" scope="row">
                          {sighting.observation_date}
                        </TableCell>
                        <TableCell>{sighting.location_name}</TableCell>
                        <TableCell>{sighting.observation_count}</TableCell>
                        <TableCell>{`${sighting.first_name} ${sighting.last_name}`}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Button component={Link} to="/" variant="outlined" size="large">
            Back
          </Button>
        </Grid>
      </Box>
    </Container>
  );
}
