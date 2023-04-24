import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Typography,
  Box,
  Grid,
  Pagination,
} from "@mui/material";
import SpeciesCard from "../components/SpeciesCard";
import config from "../config.json";

export default function FamilyPage() {
  const { family_code } = useParams();
  const [familyInfo, setFamilyInfo] = useState({});
  const [familySpecies, setFamilySpecies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetch(
      `http://${config.server_host}:${config.server_port}/family/${family_code}`
    )
      .then(res => res.json())
      .then(resJson => setFamilyInfo(resJson))
      .catch(error => console.log(error));
  }, [family_code]);

  useEffect(() => {
    fetch(
      `http://${config.server_host}:${config.server_port}/family/${family_code}/species`
    )
      .then(res => res.json())
      .then(resJson => {
        setFamilySpecies(resJson);
      })
      .catch(error => console.log(error));
  }, [family_code]);

  if (!familyInfo || !familyInfo.family_code || !familySpecies) {
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
        <Card
          sx={{
            height: 300,
            display: "flex",
            flexDirection: "row",
            backgroundColor: "secondary.main",
          }}
        >
          <CardMedia
            component="img"
            sx={{ width: "50%", objectFit: "cover" }}
            height="100%"
            image={`https://${familyInfo.random_family_img_link}`}
            alt={familyInfo.family_common_name}
            title={familyInfo.family_common_name}
          />

          <CardContent
            sx={{
              flexGrow: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Typography
              gutterBottom
              variant="h5"
              component="h2"
              textAlign="center"
            >
              {familyInfo.family_common_name}{" "}
              {familyInfo.family_scientific_name
                ? `(${familyInfo.family_scientific_name})`
                : ""}
            </Typography>
            <Typography
              variant="body1"
              component="div"
              textAlign="center"
              sx={{
                overflowY: "auto",
                height: "150px",
                px: 2,
              }}
            >
              {familyInfo.family_description
                ? familyInfo.family_description
                : "We apologize for the inconvenience, but currently, we do not have any family description regarding this family. However, please rest assured that our team is working diligently to gather and add more information for you to enjoy. We appreciate your patience and understanding as we continue to improve and update our platform. Thank you for your support!"}
            </Typography>
          </CardContent>
        </Card>
      </Box>

      <Box m={2} pt={3}>
        <Grid container spacing={4}>
          {familySpecies
            .slice((currentPage - 1) * 4, currentPage * 4)
            .map(species => (
              <SpeciesCard key={species.species_code} species={species} />
            ))}
        </Grid>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 2,
          }}
        >
          <Pagination
            count={Math.ceil(familySpecies.length / 4)}
            page={currentPage}
            onChange={(event, value) => setCurrentPage(value)}
            color="secondary"
            size="large"
          />
        </Box>
      </Box>
    </Container>
  );
}
