import { useEffect, useState } from "react";
import {
  Container,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
  CircularProgress,
} from "@mui/material";
import config from "../config.json";
import { Link } from "react-router-dom";

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
    //   <Container>
    //  {/* SongCard is a custom component that we made. selectedSongId && <SongCard .../> makes use of short-circuit logic to only render the SongCard if a non-null song is selected */}
    //     {/* {selectedSongId && <SongCard songId={selectedSongId} handleClose={() => setSelectedSongId(null)} />}    */}
    //     </h2>
    //     <Divider />
    //     {/* <h2>Top Songs</h2> */}
    //     {/* <LazyTable route={`http://${config.server_host}:${config.server_port}/top_songs`} columns={songColumns} /> */}
    //     <Divider />
    //     {/* TODO (TASK 16): add a h2 heading, LazyTable, and divider for top albums. Set the LazyTable's props for defaultPageSize to 5 and rowsPerPageOptions to [5, 10] */}
    //     {/* <h2>Top Albums</h2> */}
    //     {/* <LazyTable route={`http://${config.server_host}:${config.server_port}/top_albums`} columns={albumColumns} defaultPageSize={5} rowsPerPageOptions={[5,10]}/> */}
    //     <Divider />
    //     <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>
    //   </Container>

    <Container>
      <Box m={2} pt={3}>
        <Card sx={{ height: "100%", display: "flex", flexDirection: "row" }}>
          <CardMedia
            component="img"
            sx={{ padding: "1em 1em 1em 1em", objectFit: "contain" }}
            height="250"
            image={"https://" + birdOfTheDay.species_img_link}
            alt={birdOfTheDay.common_name}
            title={birdOfTheDay.common_name}
          />
          <CardContent sx={{ flexGrow: 1 }}>
            <Typography gutterBottom variant="h4" component="h2">
              Bird of the day
            </Typography>
            <Typography gutterBottom variant="h5" component="h2">
              {birdOfTheDay.common_name}
            </Typography>
            <Typography>
              {/* {birdOfTheDay.species_description.length > 250 ?
        `${birdOfTheDay.species_description.substring(0,250)}...` : birdOfTheDay.species_description
      } */}
              {birdOfTheDay.species_description}
            </Typography>
          </CardContent>
          <CardActions>
            <Button
              component={Link}
              to={`/species/${birdOfTheDay.species_code}`}
              variant="outlined"
              size="large"
            >
              More
            </Button>
          </CardActions>
        </Card>
      </Box>

    </Container>
  );
}
