import { useEffect, useState } from 'react';
import { Container, Box, Button } from '@mui/material';
import config from '../config.json';
import ScatterMap from '../components/ScatterMap';
import HeatMap from '../components/HeatMap';

export default function MapPage() {
  const [birdObservations, setBirdObservations] = useState([]);
  const [mapType, setMapType] = useState('heatmap');

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/heatmap-observations?start_date=2023-03-03&common_name=hawk&family_common_name=Eagles`)
      .then(res => res.json())
      .then(resJson => setBirdObservations(resJson))
      .catch(error => console.log(error));
  }, []);

  const toggleMapType = () => {
    setMapType(mapType === 'heatmap' ? 'scatter' : 'heatmap');
  };

  if (!birdObservations) {
    return <div>Loading...</div>;
  }

  return (
    <Container>
      <Button onClick={toggleMapType} variant="contained" color="primary">
        {mapType === 'heatmap' ? 'Show Scatter Map' : 'Show Heat Map'}
      </Button>
      <Box sx={{
        height: '600px',
        width: '80vw',
        margin: '0 auto'
      }}>
        {mapType === 'heatmap' ? (
          <HeatMap birdObservations={birdObservations} />
        ) : (
          <ScatterMap birdObservations={birdObservations} />
        )}
      </Box>
    </Container>
  );
}
