// src/services/api.js

const API_URL = process.env.REACT_APP_API_URL;

export const getExampleData = async () => {
  try {
    const response = await fetch(`${API_URL}/example-endpoint`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};
