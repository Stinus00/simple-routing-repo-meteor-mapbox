import React, {useRef, useEffect, useState} from 'react';
import { Meteor } from "meteor/meteor";

import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import MapboxDirections from "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions";
import polyline from "@mapbox/polyline";
import * as turf from "@turf/turf";

mapboxgl.accessToken = Meteor.settings.public.mapbox_key;

const RouteTest = () => {

    const mapContainerRef = useRef(null);
    const mapRef = useRef(null);
    const directionsRef = useRef(null);
    const routeGeoJSONRef = useRef(null);

    const [coordinates, setCoordinates] = useState([ 5.7051399, 51.2546716 ]);
    const coordinatesRef = useRef(coordinates);

    const [mapLoaded, setMapLoaded] = useState(false);

    const directionsList = []

    const userId = Meteor.userId();

    function checkForProceed() {
        if (!mapContainerRef.current) {
            console.error("❌ mapContainerRef is null");
            return false;
        }

        if(mapRef.current) {
            console.error("❌ Map already initialized.");
            return false;
        }

        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if (!gl) {
            console.warn("❌ WebGL is NOT supported in this WebView!");
            return false
        }
        else
        {
            console.log("✅ WebGL is supported");
        }
        return true
    }
    function initializeMap() {
        console.log("✅ Initializing map...");

        mapRef.current = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [5.706, 51.251],
            zoom: 16,
            pitchWithRotate: true,
            pitch: 45,
        });

        console.log("⚠️ Current Mapref:", mapRef.current);

        mapRef.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

        console.log("NavControl Added");

        const geoLocation = new mapboxgl.GeolocateControl({
            positionOptions: {
                enableHighAccuracy: true,
            },
            fitBoundsOptions: {linear: true, minZoom: 20},
            trackUserLocation: true,
            showAccuracyCircle: true,
            showUserHeading: true,
        });

        mapRef.current.addControl(geoLocation, 'top-right');

        console.log("GeolocateControl Added");

        const directions = new MapboxDirections({
            accessToken: mapboxgl.accessToken,
            unit: "metric",
            profile: "mapbox/driving",
            alternatives: true,
        });

        mapRef.current.addControl(
            directions,
            'top-left'
        );
        directionsRef.current = directions;

        console.log("Added Route Control")

        mapRef.current.on('load', () => {
            console.log("✅ Map loaded.");
            setMapLoaded(true);

            directions.setOrigin([5.70400,51.25744]);
            directions.setDestination([5.70846,51.25151]);

            geoLocation.trigger();

            const layers = mapRef.current.getStyle().layers;
            const labelLayerId = layers.find(
                (layer) => layer.type === 'symbol' && layer.layout['text-field']
            ).id;

            mapRef.current.addLayer(
                {
                    id: 'add-3d-buildings',
                    source: 'composite',
                    'source-layer': 'building',
                    filter: ['==', 'extrude', 'true'],
                    type: 'fill-extrusion',
                    minzoom: 15,
                    paint: {
                        'fill-extrusion-color': '#aaa',
                        'fill-extrusion-height': [
                            'interpolate',
                            ['linear'],
                            ['zoom'],
                            15,
                            0,
                            15.05,
                            ['get', 'height']
                        ],
                        'fill-extrusion-base': [
                            'interpolate',
                            ['linear'],
                            ['zoom'],
                            15,
                            0,
                            15.05,
                            ['get', 'min_height']
                        ],
                        'fill-extrusion-opacity': 0.6
                    }
                },
                labelLayerId
            );
        });
        directions.on("route", (e) => {
            console.log("New route:", e.route[0]);
            console.log("All Routes:", e.route);
            const route = e.route[0];
            const decoded = polyline.decode(route.geometry)
            const coordinates = decoded.map(([lat, lng]) => [lng, lat])
            const line = turf.lineString(coordinates);
            routeGeoJSONRef.current = line;
            console.log("Route loaded:", line);
        });

        geoLocation.on("geolocate", (e) => {
            const userPoint = turf.point([e.coords.longitude, e.coords.latitude]);

            console.log(userPoint)

            console.log('test')

            console.log(e)

            const heading = e.target._heading ? e.target._heading : 0

            mapRef.current.easeTo({
                center: [e.coords.longitude, e.coords.latitude],
                zoom: 18,
                pitch: 60,
                bearing: heading,
                duration: 1500
            });

            if (routeGeoJSONRef.current) {
                const distance = turf.pointToLineDistance(
                    userPoint,
                    routeGeoJSONRef.current,
                    { units: "meters" }
                );

                console.log(distance)

                if (distance > 30) {
                    // Zet een nieuwe waypoint neer als mensen van het pad af zijn
                    const newWaypoint = directions.addWaypoint(directionsList.length, userPoint)
                    directionsList.push(newWaypoint)
                }
            }
        });

        mapRef.current.on('error', (e) => {
            console.error('Map error:', e.error);
        });

        mapRef.current.resize();

        console.log("Mapref Resize");
    }

    useEffect(() => {

        if(!checkForProceed())
            return;

        initializeMap()

        return () => {
            mapRef.current.remove()
        }
    }, []);

    useEffect(() => {
        coordinatesRef.current = coordinates;
    }, [coordinates]);

    return (
        <>
            <link rel="stylesheet"
                  href="https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-directions/v4.3.1/mapbox-gl-directions.css"
                  type="text/css"/>
            <div
                ref={mapContainerRef}
                style={{
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    width: '100vw',
                    height: '100vh',
                    borderRadius: '8px',
                    overflow: 'hidden',
                }}
            />
        </>
    );
};

export default RouteTest;
