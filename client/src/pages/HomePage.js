import { useEffect, useState } from 'react';
import { Container, Divider, Link } from '@mui/material';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { NavLink } from 'react-router-dom';
import LazyTable from '../components/LazyTable';
import SongCard from '../components/SongCard';
const config = require('../config.json');

export default function HomePage() {
  // We use the setState hook to persist information across renders (such as the result of our API calls)
  const [birdOfTheDay, setBirdOfTheDay] = useState({});
  const [birdOfTheDayInfo, setBirdOfTheDayInfo] = useState({});
  const [selectedBird, setSelectedBird] = useState(null);

  // The useEffect hook by default runs the provided callback after every render
  // The second (optional) argument, [], is the dependency array which signals
  // to the hook to only run the provided callback if the value of the dependency array
  // changes from the previous render. In this case, an empty array means the callback
  // will only run on the very first render.
  useEffect(() => {
    // Fetch request to get the song of the day. Fetch runs asynchronously.
    // The .then() method is called when the fetch request is complete
    // and proceeds to convert the result to a JSON which is finally placed in state.
    fetch(`http://${config.server_host}:${config.server_port}/species/random`)
      .then(res => res.json())
      .then(
        resJson => {
          setBirdOfTheDay(resJson[0])
          fetch(`http://${config.server_host}:${config.server_port}/species/info?species_code=${birdOfTheDay.species_code}`)
          .then(res => res.json())
          .then(setBirdOfTheDayInfo(resJson[0]))
        })
      .then(console.log(birdOfTheDay));
  }, []);

  // Here, we define the columns of the "Top Songs" table. The songColumns variable is an array (in order)
  // of objects with each object representing a column. Each object has a "field" property representing
  // what data field to display from the raw data, "headerName" property representing the column label,
  // and an optional renderCell property which given a row returns a custom JSX element to display in the cell.
  // const songColumns = [
  //   {
  //     field: 'title',
  //     headerName: 'Song Title',
  //     renderCell: (row) => <Link onClick={() => setSelectedSongId(row.song_id)}>{row.title}</Link> // A Link component is used just for formatting purposes
  //   },
  //   {
  //     field: 'album',
  //     headerName: 'Album',
  //     renderCell: (row) => <NavLink to={`/albums/${row.album_id}`}>{row.album}</NavLink> // A NavLink component is used to create a link to the album page
  //   },
  //   {
  //     field: 'plays',
  //     headerName: 'Plays'
  //   },
  // ];
  // const albumColumns = [
  //   {
  //     field: 'title',
  //     headerName: 'Album Title',
  //     renderCell: (row) => <NavLink to={`/albums/${row.album_id}`}>{row.title}</NavLink> // A NavLink component is used to create a link to the album page
  //   },
  //   {
  //     field: 'plays',
  //     headerName: 'Plays'
  //   },
  // ];


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
    <Card
    sx={{ height: '100%', display: 'flex', flexDirection: 'row' }}
    >
    <CardMedia
      component="img"
      sx={{ padding: "1em 1em 1em 1em", objectFit: "contain" }}
      height = "250"
      image={"https://" + birdOfTheDayInfo.species_img_link}
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
      {birdOfTheDayInfo.species_description.length > 300?
        `${birdOfTheDayInfo.species_description.substring(0,300)}...` : birdOfTheDayInfo.species_description
      }
      </Typography>
    </CardContent>
    <CardActions>
      <Button size="large">View</Button>
    </CardActions>
  </Card>
  </Box>

  {/* <Divider />  */}
  </Container>
  
  );


};