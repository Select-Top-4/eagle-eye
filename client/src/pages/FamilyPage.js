import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Divider,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  CircularProgress,
  Typography,
  Button,
  Box,
} from "@mui/material";
import config from "../config.json";
import { Link } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";

export default function FamilyPage() {
  const { family_code } = useParams();
  const [familyInfo, setFamilyInfo] = useState({});
  const [familySpecies, setFamilySpecies] = useState({});
  const [pageSize, setPageSize] = useState(10);

  const columns = [
    {
      field: "common_name",
      headerName: "Species",
      flex: 1,
      renderCell: params => (
        <Link to={`/species/${params.id}`}>{params.row.common_name}</Link>
      ),
    },
  ];

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
        <Card sx={{ height: "100%", display: "flex", flexDirection: "row" }}>
          <CardContent sx={{ width: "2500px" }}>
            <CardMedia
              component="img"
              sx={{ padding: "1em 1em 1em 1em", objectFit: "contain" }}
              height="250"
              image={"https://" + familyInfo.random_family_img_link}
              alt={familyInfo.family_common_name}
              title={familyInfo.family_common_name}
            />
          </CardContent>

          <CardContent sx={{ flexGrow: 1 }}>
            <Typography
              gutterBottom
              variant="body1"
              component="h3"
              textAlign="center"
            >
              {familyInfo.family_description}
            </Typography>
          </CardContent>
        </Card>
        <Divider />
        <Card sx={{ height: "100%", display: "flex", flexDirection: "row" }}>
          <CardContent sx={{ flexGrow: 1 }}>
            <Typography gutterBottom variant="body1" component="h3">
              Common name: {familyInfo.family_common_name}
            </Typography>
            <Typography gutterBottom variant="body1" component="h3">
              Family: {familyInfo.family_scientific_name}
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
          <Typography gutterBottom variant="body1" component="h3">
            Recent Sightings
          </Typography>

          <DataGrid
            rows={familySpecies}
            columns={columns}
            pageSize={pageSize}
            rowsPerPageOptions={[5, 10, 25]}
            onPageSizeChange={newPageSize => setPageSize(newPageSize)}
            autoHeight
          />
        </Card>

        <CardActions>
          <Button component={Link} to="/" variant="outlined" size="large">
            Back
          </Button>
        </CardActions>
      </Box>
    </Container>
  );
}
