import React from "react";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid,
} from "@mui/material";
import { Link } from "react-router-dom";

const SpeciesCard = ({ species }) => {
  return (
    <Grid item xs={12} sm={6} md={4} lg={3}>
      <Link
        to={`/species/${species.species_code}`}
        style={{ textDecoration: "none" }}
      >
        <Card
          sx={{
            height: 250,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            boxShadow: "0 0 20px 0 rgba(0,0,0,0.1)",
            borderRadius: "10px",
            padding: "1rem",
            "&:hover": {
              boxShadow: "0 0 40px 0 rgba(0,0,0,0.3)",
              transform: "scale(1.05)",
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
            },
          }}
        >
          <CardMedia
            component="img"
            width="80%"
            height="130"
            image={`https://${species.species_img_link}`}
            alt={species.common_name}
            title={species.common_name}
            sx={{ objectFit: "contain" }}
          />
          <Box
            sx={{
              flexGrow: 1,
              position: "relative",
            }}
            onMouseEnter={e => {
              e.currentTarget.querySelector(
                ".scroll-container"
              ).style.overflowY = "auto";
            }}
            onMouseLeave={e => {
              e.currentTarget.querySelector(
                ".scroll-container"
              ).style.overflowY = "hidden";
            }}
          >
            <Box
              className="scroll-container"
              sx={{
                overflowY: "hidden",
                position: "absolute",
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                "&::-webkit-scrollbar": {
                  width: "0.4em",
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "rgba(0, 0, 0, 0.1)",
                },
              }}
            >
              <CardContent>
                <Typography gutterBottom component="h6">
                  {species.common_name}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  component="p"
                >
                  {species.scientific_name}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  component="p"
                >
                  {species.species_description}
                </Typography>
              </CardContent>
            </Box>
          </Box>
        </Card>
      </Link>
    </Grid>
  );
};

export default SpeciesCard;
