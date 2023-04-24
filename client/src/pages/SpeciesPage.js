import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { Container, Divider } from '@mui/material';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Box from '@mui/material/Box';
import config from '../config.json';
import { Link } from 'react-router-dom';


export default function SpeciesPage() {
  const { species_code } = useParams();
  const [speciesInfo, setSpeciesInfo] = useState({});
  const [sightings, setSightings] = useState({});
  useEffect(() => {
    fetch(
      `http://${config.server_host}:${config.server_port}/species/${species_code}`
    )
      .then(res => res.json())
      .then(resJson => setSpeciesInfo(resJson))
      .catch(error => console.log(error));
  }, []);
  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/species/${species_code}/5-latest-observations`)
      .then(res => res.json())
      .then(resJson => setSightings(resJson))
      .catch(error => console.log(error));
  }, []);
  console.log(sightings[0])
  if (!speciesInfo) {
    return <div>Loading...</div>;
  }

  return (
    <Container>
      
      <Box m={2} pt={3}>
        <Card
          sx={{ height: '100%', display: 'flex', flexDirection: 'row' }}
        >
           <CardContent sx={{width: '2500px'}}>
            <Typography gutterBottom variant="h5" component="h3" textAlign="center" >
              More about the {speciesInfo.common_name}
            </Typography>
            <CardMedia
            component="img"
            sx={{ padding: "1em 1em 1em 1em", objectFit: "contain" }}
            height="250"
            image={"https://" + speciesInfo.species_img_link}
            alt={speciesInfo.common_name}
            title={speciesInfo.common_name}
          />
          </CardContent>
          
          <CardContent sx={{ flexGrow: 1}} >
            <Typography gutterBottom variant="body1" component="h3" textAlign="center" >
             {speciesInfo.species_description}
            </Typography>
          </CardContent>
        </Card>
        <Divider />
        <Card
          sx={{ height: '100%', display: 'flex', flexDirection: 'row' }}
        >
        
          <CardContent sx={{ flexGrow: 1 }}>
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
            <Typography gutterBottom variant="body1" component="h3">
              {speciesInfo.species_description}
            </Typography>
          </CardContent>
          
          
          <CardActions>
            <Button component={Link} to={`/family/${speciesInfo.family_code}`} variant="outlined" size="large">More About {speciesInfo.family_common_name}</Button>
          </CardActions>


        </Card>
        <Card
          sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
        >
        <Typography gutterBottom variant="body1" component="h3">
              Recent Sightings 
        </Typography>
        {/* {sightings[0]} */}
        
          {/* <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Dessert (100g serving)</TableCell>
                  <TableCell align="right">Calories</TableCell>
                  <TableCell align="right">Fat&nbsp;(g)</TableCell>
                  <TableCell align="right">Carbs&nbsp;(g)</TableCell>
                  <TableCell align="right">Protein&nbsp;(g)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((sightings) => (
                  <TableRow
                    key={row.name}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {row.name}
                    </TableCell>
                    <TableCell align="right">{row.calories}</TableCell>
                    <TableCell align="right">{row.fat}</TableCell>
                    <TableCell align="right">{row.carbs}</TableCell>
                    <TableCell align="right">{row.protein}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
    </TableContainer> */}
          
          


          
        </Card>

        <CardActions>
            <Button component={Link} to="/" variant="outlined" size="large" >Back</Button>
          </CardActions>
      </Box>

      {/* <Divider />  */}
    </Container>

  );


};
