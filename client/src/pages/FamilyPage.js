import { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { Container, Divider } from '@mui/material';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import config from '../config.json';
import { Link } from 'react-router-dom';


export default function FamilyPage(family_code) {
    const [familyInfo, setFamilyInfo] = useState({});
    const [familySpecies, setFamilySpecies] = useState({});
    useEffect(() => {
      fetch(`http://${config.server_host}:${config.server_port}/family/info?family_code=${family_code}`)
      .then(res => res.json())
      .then(resJson => setFamilyInfo(resJson))
      .catch(error => console.log(error));
    }, []);
    useEffect(() => {
      fetch(`http://${config.server_host}:${config.server_port}/family/species?family_code=${family_code}`)
      .then(res => res.json())
      .then(resJson => {
        setFamilySpecies(resJson)
      })
      .catch(error => console.log(error));
    }, []);

    if (!familyInfo) {
        return <div>Loading...</div>;
    }
    
    return (
    <Container>
      <Box m={2} pt={3}>

      Family Page!
        <Button component={Link} to="/" variant = "outlined" size="large">Home</Button>
     

    </Box>
  
    {/* <Divider />  */}
    </Container>
    
    );
  
  
  };