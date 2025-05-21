import React from 'react';
import PetCard from './PetCard';
import './PetList.css';

function PetList({ pets = [], loading = false, error = null, onPetClick }) {
  return (
    <div className="pet-grid-wrapper">
      {loading ? (
        <div className="status-container loading-container">
          <p>Loading pets...</p>
        </div>
      ) : error ? (
        <div className="status-container error-container">
          <p className="text-red-500">Error: {error}</p>
        </div>
      ) : pets.length === 0 ? (
        <div className="status-container empty-container">
          <p>No pets found.</p>
        </div>
      ) : (
        <div className="pet-cards-grid">
          {pets.map(pet => (
            <div key={pet.id} className="pet-card-wrapper">
              <PetCard pet={pet} onClick={onPetClick} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PetList;