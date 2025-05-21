import React, { useState, useEffect, useTransition } from 'react';
import './App.css';
import PetList from './components/PetList';
import PetDetails from './components/PetDetails';

function App() {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentView, setCurrentView] = useState('list');
  const [selectedPetId, setSelectedPetId] = useState(null);
  const [isPending, startTransition] = useTransition();
  
  // Check if URL contains a pet ID on load
  useEffect(() => {
    const path = window.location.pathname;
    const match = path.match(/\/pet\/(\d+)/);
    if (match && match[1]) {
      setSelectedPetId(match[1]);
      setCurrentView('details');
    } else {
      loadPets();
    }
    
    // Setup navigation event listener
    window.addEventListener('popstate', handleNavigation);
    return () => window.removeEventListener('popstate', handleNavigation);
  }, []);
  
  const handleNavigation = () => {
    const path = window.location.pathname;
    const match = path.match(/\/pet\/(\d+)/);
    if (match && match[1]) {
      setSelectedPetId(match[1]);
      setCurrentView('details');
    } else {
      setCurrentView('list');
      if (pets.length === 0) loadPets();
    }
  };
  
  // Function to load pets using React 19 Actions
  const loadPets = () => {
    setLoading(true);
    startTransition(async () => {
      try {
        const response = await fetch('/api/pets/random/10');
        if (!response.ok) {
          throw new Error(`Failed to fetch pets: ${response.statusText}`);
        }
        const data = await response.json();
        setPets(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    });
  };
  
  // Function to navigate to pet details
  const navigateToPet = (petId) => {
    startTransition(() => {
      setSelectedPetId(petId);
      setCurrentView('details');
      window.history.pushState({}, '', `/pet/${petId}`);
    });
  };
  
  // Function to navigate back to list
  const navigateToList = () => {
    startTransition(() => {
      setCurrentView('list');
      window.history.pushState({}, '', '/');
    });
  };

  return (
    <div className="App">
      <header>
        <div>
          <h1>Pet Store</h1>
          <p>Find your perfect pet companion</p>
        </div>
      </header>
      
      <div className="container-wrapper">
        {currentView === 'list' ? (
          <>
            <div>
              <h2>Browse Pets</h2>
            </div>
            <PetList 
              pets={pets} 
              loading={loading || isPending} 
              error={error}
              onPetClick={navigateToPet}
            />
          </>
        ) : (
          <PetDetails 
            petId={selectedPetId} 
            onBack={navigateToList}
          />
        )}
      </div>

      <footer>
        <p>Powered by Sourcegraph Technology</p>
      </footer>
    </div>
  );
}

export default App;
