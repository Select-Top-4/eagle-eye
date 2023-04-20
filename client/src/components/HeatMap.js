import React, { useEffect, useState } from "react";
import { useRef } from "react";
import MapGL, { Source, Layer, Popup, NavigationControl } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import usStates from "../map_data/usstates.json";

const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN;

const HeatMap = ({ birdObservations }) => {
    const mapRef = useRef();

    const [stateBoundaries, setStateBoundaries] = useState(usStates);

    const [viewport, setViewport] = useState({
        latitude: 39.833333,
        longitude: -98.583333,
        zoom: 3,
        bearing: 0,
        pitch: 0,
    });

    const handleViewportChange = (newViewport) => {
        setViewport(newViewport);
    };

    const aggregateByState = (observations, stateBoundaries) => {
        const stateData = {};

        observations.forEach((obs) => {
            const state = obs.subnational1_name;
            if (!stateData[state]) {
                stateData[state] = 0;
            }
            stateData[state] += obs.total_count;
        });

        stateBoundaries.features.forEach((feature) => {
            const stateName = feature.properties.name;
            feature.properties.totalCount = stateData[stateName] || 0;
        });
    };

    useEffect(() => {
        aggregateByState(birdObservations, stateBoundaries);
    }, [birdObservations]);

    return (
        <MapGL
            ref={mapRef}
            {...viewport}
            width="100%"
            height="100%"
            mapStyle="mapbox://styles/mapbox/dark-v10"
            onMove={e => handleViewportChange(e.viewState)}
            mapboxAccessToken={MAPBOX_TOKEN}
        >
            <NavigationControl
                style={{ top: 10, right: 10 }}
            />

            {stateBoundaries && (
                <Source type="geojson" data={stateBoundaries}>
                    <Layer
                        id="choropleth"
                        type="fill-extrusion"
                        paint={{
                            "fill-extrusion-color": [
                                "interpolate",
                                ["linear"],
                                ["get", "totalCount"],
                                0,
                                "rgba(33,102,172,0)",
                                100,
                                "rgb(103,169,207)",
                                300,
                                "rgb(209,229,240)",
                                500,
                                "rgb(253,219,199)",
                                1000,
                                "rgb(239,138,98)",
                                2000,
                                "rgb(178,24,43)",
                            ],
                            "fill-extrusion-height": ["*", ["get", "totalCount"], 10],
                            "fill-extrusion-base": 0,
                            "fill-extrusion-opacity": 0.8,
                        }}
                    />
                </Source>
            )}

        </MapGL>
    );
};

export default HeatMap;
