import React, { useState, useEffect, useTransition } from 'react';
import './App.css';
import PetList from './components/PetList';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  const [pets, setPets] = useState([]);
  const [error, setError] = useState(null);
  const [isPending, startTransition] = useTransition();
  
  // Function to load pets using React 19 Actions
  const loadPets = () => {
    setError(null);
    
    startTransition(async () => {
      try {
        const response = await fetch('/api/pets/random/10');
        if (!response.ok) {
          throw new Error(`Failed to fetch pets: ${response.statusText}`);
        }
        const data = await response.json();
        setPets(data);
      } catch (err) {
        setError(err.message);
      }
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
        <div className="section-header">
          <h2>Browse Pets</h2>
          <button onClick={loadPets} disabled={isPending}>
            {isPending ? 'Refreshing...' : 'Refresh Pets'}
          </button>
        </div>
        
        <ErrorBoundary>
          <PetList pets={pets} loading={isPending} error={error} />
        </ErrorBoundary>
      </div>

      <footer>
        <p>Powered by Sourcegraph Technology</p>
      </footer>
    </div>
  );
}

export default App;
