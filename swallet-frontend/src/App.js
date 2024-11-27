// src/App.js

import React, { useEffect } from 'react';
import { getExampleData } from './services/api';

function App() {
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getExampleData();
        console.log('Data from backend:', data);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Welcome to Swallet Frontend</h1>
    </div>
  );
}

export default App;
