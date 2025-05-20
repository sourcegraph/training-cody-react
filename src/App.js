import React, { useState, useEffect } from 'react';
import './App.css';
import PetList from './components/PetList';
import axios from 'axios';

function App() {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Function to load pets
  const loadPets = () => {
    setLoading(true);
    setError(null);
    
    axios.get('/api/pets/random/10')
      .then(response => {
        setPets(response.data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  };
  
  // Load pets when component mounts
  useEffect(() => {
    loadPets();
  }, []);

  return (
    <div className="App">
      <header>
        <div>
          <h1>Pet Store</h1>
          <p>Find your perfect pet companion</p>
        </div>
      </header>
      
      <div className="container-wrapper">
        <div>
          <h2>Browse Pets</h2>
        </div>
        
        <PetList pets={pets} loading={loading} error={error} />
      </div>

      <footer>
        <p>Powered by Sourcegraph Technology</p>
      </footer>
    </div>
  );
}

export default App;
