import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PetList.css';

function PetList() {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('/api/pets/random/10')
      .then(response => {
        setPets(response.data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="loading">Loading pets...</div>;
  if (error) return <div className="error">Error loading pets: {error}</div>;

  // Helper function to get status class
  const getStatusClass = (status) => {
    if (!status) return '';
    switch(status.toLowerCase()) {
      case 'available': return 'status-available';
      case 'pending': return 'status-pending';
      case 'sold': return 'status-sold';
      default: return '';
    }
  };

  // Custom style to override the grid layout for 5 cards per row
  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',
    gridGap: '20px',
    marginTop: '20px'
  };

  return (
    <div className="pet-list">
      <h2>Available Pets</h2>
      <div className="pet-grid" style={gridStyle}>
        {pets.map(pet => (
          <div key={pet.id} className="pet-card">
            {pet.photoUrls && pet.photoUrls.length > 0 && (
              <img src={pet.photoUrls[0]} alt={pet.name} />
            )}
            <h3>{pet.name}</h3>
            <p>
              <span className={`pet-status ${getStatusClass(pet.status)}`}>
                {pet.status || 'Unknown'}
              </span>
            </p>
            <p>Category: {pet.category?.name || 'Not categorized'}</p>

            {pet.tags && pet.tags.length > 0 && (
              <div className="pet-tags">
                {pet.tags.map(tag => (
                  <span key={tag.id} className="tag">{tag.name}</span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default PetList;