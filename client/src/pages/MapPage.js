import { useEffect, useState } from "react";
import {
  Container,
  Grid,
  Box,
  Button,
  CircularProgress,
  TextField,
  Autocomplete,
} from "@mui/material";
import config from "../config.json";
import ScatterMap from "../components/ScatterMap";
import HeatMap from "../components/HeatMap";
import LazyTable from "../components/LazyTable";
import { Link } from "react-router-dom";

const US_STATES = [
  "Alaska",
  "Alabama",
  "Arkansas",
  "Arizona",
  "California",
  "Colorado",
  "Connecticut",
  "District of Columbia",
  "Delaware",
  "Florida",
  "Georgia",
  "Hawaii",
  "Iowa",
  "Idaho",
  "Illinois",
  "Indiana",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Massachusetts",
  "Maryland",
  "Maine",
  "Michigan",
  "Minnesota",
  "Missouri",
  "Mississippi",
  "Montana",
  "North Carolina",
  "North Dakota",
  "Nebraska",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "Nevada",
  "New York",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Pennsylvania",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Virginia",
  "Vermont",
  "Washington",
  "Wisconsin",
  "West Virginia",
  "Wyoming",
];
const currentYear = new Date().getFullYear();
const minDate = `${currentYear}-01-01`;
const maxDate = `${currentYear}-12-31`;
const columnsWithBirdImage = [
  {
    headerName: "Bird Image",
    field: "bird_image",
    renderCell: row => (
      <img
        src={`https://${row.species_img_link}`}
        alt={row.common_name}
        style={{
          width: "30px",
          height: "30px",
          borderRadius: "50%",
          objectFit: "cover",
        }}
      />
    ),
  },
  {
    headerName: "Common Name",
    field: "common_name",
    renderCell: row => (
      <Link
        to={`/species/${row.species_code}`}
      >
        {row.common_name}
      </Link>
    ),
  },
  { field: "scientific_name", headerName: "Scientific Name" },
  {
    headerName: "Family Common Name",
    field: "family_common_name",
    renderCell: row => (
      <Link
        to={`/family/${row.family_code}`}
      >
        {row.family_common_name}
      </Link>
    ),
  },
  { field: "family_scientific_name", headerName: "Family Scientific Name" },
  { field: "total_count", headerName: "Total Count" },
];

export default function MapPage() {
  const [birdObservations, setBirdObservations] = useState(null);
  const [speciesRankingRoute, setSpeciesRankingRoute] = useState("");
  const [mapType, setMapType] = useState("heatmap");
  const initialSearchOptions = {
    start_date: "",
    end_date: "",
    common_name: "",
    scientific_name: "",
    family_common_name: "",
    family_scientific_name: "",
    subnational1_name: [],
  };
  const [searchOptions, setSearchOptions] = useState(initialSearchOptions);

  useEffect(() => {
    fetch(
      `http://${config.server_host}:${config.server_port}/heatmap-observations?start_date=2023-03-21`
    )
      .then(res => res.json())
      .then(resJson => {
        setBirdObservations(resJson);
      });
  }, []);

  const handleSearch = event => {
    event.preventDefault();
    const {
      start_date,
      end_date,
      common_name,
      scientific_name,
      family_common_name,
      family_scientific_name,
      subnational1_name,
    } = searchOptions;

    const params = new URLSearchParams({
      ...(start_date && { start_date }),
      ...(end_date && { end_date }),
      ...(common_name && { common_name }),
      ...(scientific_name && { scientific_name }),
      ...(family_common_name && { family_common_name }),
      ...(family_scientific_name && { family_scientific_name }),
      ...(subnational1_name.length > 0 && {
        subnational1_name: subnational1_name.join(","),
      }),
    });

    fetch(
      `http://${config.server_host}:${
        config.server_port
      }/heatmap-observations?${params.toString()}`
    )
      .then(res => res.json())
      .then(resJson => {
        setBirdObservations(resJson);
        setSearchOptions(initialSearchOptions);
      })
      .catch(error => console.log(error));

    setSpeciesRankingRoute(
      `http://${config.server_host}:${
        config.server_port
      }/heatmap-observations/species-ranking?${params.toString()}`
    );
  };

  const toggleMapType = () => {
    setMapType(mapType === "heatmap" ? "scatter" : "heatmap");
  };

  if (!birdObservations) {
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
      <Box sx={{ marginTop: "1.5rem" }}>
        <form onSubmit={handleSearch}>
          <Grid container spacing={2} justifyContent="center">
            <Grid item xs={12} sm={4} md={3}>
              <TextField
                label="Start Date"
                type="date"
                value={searchOptions.start_date}
                onChange={e =>
                  setSearchOptions({
                    ...searchOptions,
                    start_date: e.target.value,
                  })
                }
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{
                  min: minDate,
                  max: searchOptions.end_date || maxDate,
                }}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={4} md={3}>
              <TextField
                label="End Date"
                type="date"
                value={searchOptions.end_date}
                onChange={e =>
                  setSearchOptions({
                    ...searchOptions,
                    end_date: e.target.value,
                  })
                }
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{
                  min: searchOptions.start_date || minDate,
                  max: maxDate,
                }}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={4} md={3}>
              <TextField
                label="Common Name"
                value={searchOptions.common_name}
                onChange={e =>
                  setSearchOptions({
                    ...searchOptions,
                    common_name: e.target.value,
                  })
                }
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={4} md={3}>
              <TextField
                label="Scientific Name"
                value={searchOptions.scientific_name}
                onChange={e =>
                  setSearchOptions({
                    ...searchOptions,
                    scientific_name: e.target.value,
                  })
                }
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={4} md={3}>
              <TextField
                label="Family Common Name"
                value={searchOptions.family_common_name}
                onChange={e =>
                  setSearchOptions({
                    ...searchOptions,
                    family_common_name: e.target.value,
                  })
                }
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={4} md={3}>
              <TextField
                label="Family Scientific Name"
                value={searchOptions.family_scientific_name}
                onChange={e =>
                  setSearchOptions({
                    ...searchOptions,
                    family_scientific_name: e.target.value,
                  })
                }
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={4} md={3}>
              <Autocomplete
                multiple
                options={US_STATES}
                getOptionLabel={option => option}
                value={searchOptions.subnational1_name}
                onChange={(event, newValue) => {
                  setSearchOptions({
                    ...searchOptions,
                    subnational1_name: newValue,
                  });
                }}
                renderInput={params => (
                  <TextField {...params} label="State or Region" fullWidth />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Box display="flex" justifyContent="center">
                <Button type="submit" variant="contained" color="primary">
                  Search
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Box>

      <Box
        sx={{
          height: "480px",
          width: "80vw",
          margin: "0 auto",
          marginTop: "1rem",
          position: "relative",
        }}
      >
        <Button
          onClick={toggleMapType}
          variant="contained"
          color="primary"
          sx={{
            position: "absolute",
            top: 10,
            left: 10,
            zIndex: 1000,
            size: "small",
          }}
        >
          {mapType === "heatmap" ? "Specific Observations" : "State Heat Map"}
        </Button>
        {mapType === "heatmap" ? (
          <HeatMap birdObservations={birdObservations} />
        ) : (
          <ScatterMap birdObservations={birdObservations} />
        )}
      </Box>
      {birdObservations.length && speciesRankingRoute && (
        <LazyTable
          route={speciesRankingRoute}
          columns={columnsWithBirdImage}
          defaultPageSize={5}
          rowsPerPageOptions={[5, 10, 25]}
        />
      )}
    </Container>
  );
}
