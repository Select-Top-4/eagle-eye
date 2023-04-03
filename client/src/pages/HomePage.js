import { useEffect, useState } from 'react';
import { Container, Divider, Link } from '@mui/material';
import config from '../config.json';

export default function HomePage() {
  const [birdOfTheDay, setBirdOfTheDay] = useState({});

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/species/random`)
      .then(res => res.json())
      .then(data => {
        setBirdOfTheDay(data);
      })
      .catch(error => console.log(error));
  }, []);

  if (!birdOfTheDay) {
    return <div>Loading...</div>;
  }

  return (
    <Container>
      <h2>Bird of the day: &nbsp;
        <Link>{birdOfTheDay.common_name}</Link>
        <Divider />
        <img
        src={`https://${birdOfTheDay.species_img_link}`}
        alt={birdOfTheDay.common_name}
        />
      </h2>
    </Container>
  );
};