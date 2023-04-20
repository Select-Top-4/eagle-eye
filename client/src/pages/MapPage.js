import { useEffect, useState } from 'react';
import { Container, Divider } from '@mui/material';
import config from '../config.json';
import BirdMap from '../components/BirdMap';

export default function MapPage() {
  const [birdObservations, setBirdObservations] = useState([]);

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/heatmap-observations?start_date=2023-03-03&common_name=hawk&family_common_name=Eagles`)
      .then(res => res.json())
      .then(resJson => setBirdObservations(resJson))
      .catch(error => console.log(error));
  }, []);

  if (!birdObservations) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
        <BirdMap birdObservations={birdObservations} />
    </div>
  );
};