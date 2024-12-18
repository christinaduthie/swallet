// src/pages/CashInLocationsPage.js

import React, { useEffect, useState, useCallback } from 'react';
import {
  Container,
  Button,
  Card,
  Alert,
  Form,
  Col,
  Row,
} from 'react-bootstrap';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import * as geolib from 'geolib';
import Papa from 'papaparse';
import proj4 from 'proj4';
import axios from 'axios';

import 'leaflet/dist/leaflet.css';
import TopBar from '../components/Topbar';

// Fix for default icon issue with Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icon for user's location (red marker)
const userIcon = L.icon({
  iconUrl:
    'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  iconRetinaUrl:
    'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red-2x.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Custom icon for Cash In Locations (default blue marker)
const storeIcon = L.icon({
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const sourceProj = 'EPSG:3857'; // Adjust based on your data
const destProj = 'WGS84';

const MAX_DISTANCE = 80 * 1000; // 80 kilometers in meters

const CashInLocationsPage = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [searchLocation, setSearchLocation] = useState(null);
  const [nearestStore, setNearestStore] = useState(null);
  const [nearbyStores, setNearbyStores] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [walmartStores, setWalmartStores] = useState([]);
  const [zipCode, setZipCode] = useState('');
  const [mapCenter, setMapCenter] = useState([39.8283, -98.5795]); // Center of USA
  const [mapZoom, setMapZoom] = useState(4);
  const [mapInstance, setMapInstance] = useState(null);

  useEffect(() => {
    // Fetch and parse the CSV data
    fetch(`${process.env.PUBLIC_URL}/data/walmartStores.csv`)
      .then((response) => response.text())
      .then((csvText) => {
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (result) => {
            const stores = result.data.map((store, index) => {
              const x = parseFloat(store.x);
              const y = parseFloat(store.y);

              // Convert x, y to longitude, latitude
              const [longitude, latitude] = proj4(sourceProj, destProj, [x, y]);

              return {
                id: index,
                name: store.Description.trim(),
                address: `${store.Address.trim()}, ${store.City.trim()}, ${store.State.trim()} ${store['Postal Code'].trim()}`,
                latitude,
                longitude,
              };
            });
            setWalmartStores(stores);
          },
        });
      })
      .catch((error) => {
        console.error('Error fetching CSV data:', error);
        setErrorMessage('Error loading store data.');
      });
  }, []);

  useEffect(() => {
    // Get user's current location
    if (!userLocation) {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setUserLocation({ latitude, longitude });
          },
          (error) => {
            setErrorMessage('Unable to retrieve your location.');
            console.error('Geolocation error:', error);
          }
        );
      } else {
        setErrorMessage('Geolocation is not supported by your browser.');
      }
    }
  }, [userLocation]);

  const findNearestStore = useCallback(
    (latitude, longitude) => {
      if (walmartStores.length === 0) return;

      // Find the nearest store
      const nearest = geolib.findNearest(
        { latitude, longitude },
        walmartStores.map((store) => ({
          latitude: store.latitude,
          longitude: store.longitude,
          id: store.id,
        }))
      );

      const store = walmartStores.find((s) => s.id === nearest.id);
      setNearestStore(store);

      // Find all stores within MAX_DISTANCE
      const storesWithinDistance = walmartStores.filter((store) => {
        const distance = geolib.getDistance(
          { latitude, longitude },
          { latitude: store.latitude, longitude: store.longitude }
        );
        return distance <= MAX_DISTANCE;
      });

      setNearbyStores(storesWithinDistance);
    },
    [walmartStores]
  );

  useEffect(() => {
    if (userLocation && walmartStores.length > 0) {
      // Only find nearest store if not searching by zip code
      if (!searchLocation) {
        setMapCenter([userLocation.latitude, userLocation.longitude]);
        setMapZoom(14); // Increase zoom level
        findNearestStore(userLocation.latitude, userLocation.longitude);
      }
    }
  }, [userLocation, walmartStores, findNearestStore, searchLocation]);

  useEffect(() => {
    if (searchLocation && walmartStores.length > 0) {
      setMapCenter([searchLocation.latitude, searchLocation.longitude]);
      setMapZoom(14); // Increase zoom level
      findNearestStore(searchLocation.latitude, searchLocation.longitude);
    }
  }, [searchLocation, walmartStores, findNearestStore]);

  // Update map view when mapCenter or mapZoom change
  useEffect(() => {
    if (mapInstance) {
      mapInstance.setView(mapCenter, mapZoom);
    }
  }, [mapCenter, mapZoom, mapInstance]);

  const handleGetDirections = (store) => {
    const destination = `${store.latitude},${store.longitude}`;
    const origin = searchLocation
      ? `${searchLocation.latitude},${searchLocation.longitude}`
      : userLocation
      ? `${userLocation.latitude},${userLocation.longitude}`
      : '';
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${destination}&origin=${origin}`;

    window.open(googleMapsUrl, '_blank');
  };

  const handleZipCodeSearch = (e) => {
    e.preventDefault();
    if (zipCode.trim() === '') {
      setErrorMessage('Please enter a zip code.');
      return;
    }
    // Reset search location to trigger re-render
    setSearchLocation(null);
    // Call function to geocode the zip code
    geocodeZipCode(zipCode);
  };

  const geocodeZipCode = async (zip) => {
    try {
      const response = await axios.get(
        'https://api.opencagedata.com/geocode/v1/json',
        {
          params: {
            key: process.env.REACT_APP_OPENCAGE_API_KEY,
            q: zip,
            countrycode: 'us',
            limit: 1,
          },
        }
      );
      if (response.data.results.length > 0) {
        const { lat, lng } = response.data.results[0].geometry;
        setSearchLocation({ latitude: lat, longitude: lng });
        setMapCenter([lat, lng]);
        setMapZoom(14); // Increase zoom level to zoom in closer
        findNearestStore(lat, lng);
        setErrorMessage(''); // Clear any previous error messages
      } else {
        setErrorMessage('Invalid zip code. Please try again.');
      }
    } catch (error) {
      console.error('Error geocoding zip code:', error);
      setErrorMessage('Error retrieving location for the entered zip code.');
    }
  };

  return (
    <>
   
   <div className='main-content'>
   <TopBar />
     <Container>
      <h2>Cash In Locations</h2>

      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

      {/* Zip Code Search Form */}
      <Form className="mb-3" onSubmit={handleZipCodeSearch}>
        <Row className="align-items-center justify-content-center">
          <Col xs="auto">
            <Form.Control
              type="text"
              placeholder="Enter Zip Code"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              className="mb-2 zip-code-input"
            />
          </Col>
          <Col xs="auto">
            <Button variant="primary" type="submit" className="mb-2">
              Search
            </Button>
          </Col>
        </Row>
      </Form>

      {nearestStore ? (
        <>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Nearest Cash In Location</Card.Title>
              <Card.Text>
                <strong>{nearestStore.name}</strong>
                <br />
                {nearestStore.address}
              </Card.Text>
              <Button
                variant="primary"
                onClick={() => handleGetDirections(nearestStore)}
              >
                Get Directions
              </Button>
            </Card.Body>
          </Card>

          <h3>Other Nearby Cash In Locations</h3>
          <div className="map-container mb-4">
            <MapContainer
              center={mapCenter}
              zoom={mapZoom}
              style={{ height: '600px', width: '100%' }}
              whenCreated={setMapInstance}
              className="leaflet-map"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {/* User's Location Marker */}
              {userLocation && !searchLocation && (
                <Marker
                  position={[userLocation.latitude, userLocation.longitude]}
                  icon={userIcon}
                >
                  <Popup>Your Location</Popup>
                </Marker>
              )}

              {/* Search Location Marker */}
              {searchLocation && (
                <Marker
                  position={[searchLocation.latitude, searchLocation.longitude]}
                  icon={userIcon}
                >
                  <Popup>Search Location</Popup>
                </Marker>
              )}

              {/* Cash In Location Markers */}
              {nearbyStores.map((store) => (
                <Marker
                  key={store.id}
                  position={[store.latitude, store.longitude]}
                  icon={storeIcon}
                >
                  <Popup>
                    <strong>{store.name}</strong>
                    <br />
                    {store.address}
                    <br />
                    <Button
                      variant="link"
                      onClick={() => handleGetDirections(store)}
                    >
                      Get Directions
                    </Button>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </>
      ) : !errorMessage ? (
        <Card>
          <Card.Body>
            <Card.Text>Retrieving your location and store data...</Card.Text>
          </Card.Body>
        </Card>
      ) : null}
    </Container>
   </div>
   </>
  );
};

export default CashInLocationsPage;
