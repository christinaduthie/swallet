// src/pages/CashInLocationsPage.js

import React, { useEffect, useState, useCallback } from 'react';
import { Container, Button, Card, Alert } from 'react-bootstrap';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import * as geolib from 'geolib'; // Updated import
import Papa from 'papaparse';
import proj4 from 'proj4';

import 'leaflet/dist/leaflet.css';

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

const sourceProj = 'EPSG:3857'; // Adjust based on your data
const destProj = 'WGS84';

const CashInLocationsPage = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [nearestStore, setNearestStore] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [walmartStores, setWalmartStores] = useState([]);

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
    },
    [walmartStores]
  );

  useEffect(() => {
    if (userLocation && walmartStores.length > 0) {
      findNearestStore(userLocation.latitude, userLocation.longitude);
    }
  }, [userLocation, walmartStores, findNearestStore]);

  const handleGetDirections = (store) => {
    const destination = `${store.latitude},${store.longitude}`;
    const origin = userLocation
      ? `${userLocation.latitude},${userLocation.longitude}`
      : '';
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${destination}&origin=${origin}`;

    window.open(googleMapsUrl, '_blank');
  };

  return (
    <Container>
      <h2>Cash In Locations</h2>
      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

      {userLocation && walmartStores.length > 0 ? (
        <>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Nearest Walmart Store</Card.Title>
              {nearestStore ? (
                <>
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
                </>
              ) : (
                <Card.Text>Loading nearest store...</Card.Text>
              )}
            </Card.Body>
          </Card>

          <h3>Other Nearby Walmart Stores</h3>
          <MapContainer
            center={[userLocation.latitude, userLocation.longitude]}
            zoom={12}
            style={{ height: '400px', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {/* User's Location Marker */}
            <Marker position={[userLocation.latitude, userLocation.longitude]}>
              <Popup>Your Location</Popup>
            </Marker>
            {/* Walmart Stores Markers */}
            {walmartStores.map((store) => (
              <Marker key={store.id} position={[store.latitude, store.longitude]}>
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
        </>
      ) : (
        <Card>
          <Card.Body>
            <Card.Text>Retrieving your location and store data...</Card.Text>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default CashInLocationsPage;
