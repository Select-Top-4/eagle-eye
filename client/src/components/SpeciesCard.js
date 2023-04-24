import React from "react";
import { Card, CardContent, CardMedia, Typography, Grid } from "@mui/material";

const SpeciesCard = ({ species }) => {
  return (
    <Grid item xs={12} sm={6} md={4} lg={3}>
      <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
        <CardMedia
          component="img"
          sx={{ height: 140, objectFit: "cover" }}
          image={"https://" + species.species_img_link}
          alt={species.common_name}
          title={species.common_name}
        />
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography gutterBottom variant="h6" component="h2">
            {species.common_name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {species.scientific_name}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default SpeciesCard;
