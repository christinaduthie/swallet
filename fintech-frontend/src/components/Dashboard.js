import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Dashboard() {
    const [message, setMessage] = useState('');

    useEffect(() => {
        axios.get('http://localhost:3000/api/users')
            .then(response => setMessage(response.data.message))
            .catch(error => console.error(error));
    }, []);

    return (
        <div>
            <h2>Dashboard</h2>
            <p>{message}</p>
        </div>
    );
}

export default Dashboard;
