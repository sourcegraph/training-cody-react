import React, { useState, useTransition } from 'react';
import './PetDetails.css';

function PetDetails({ petId }) {
  const [pet, setPet] = useState(null);
  const [error, setError] = useState(null);
  const [isPending, startTransition] = useTransition();
  
  // Default image if no pet image is available
  const defaultImage = 'https://via.placeholder.com/150?text=No+Image';

  // Load pet data using React 19 Actions (async functions in transitions)
  const loadPet = () => {
    startTransition(async () => {
      try {
        const response = await fetch(`/api/pets/${petId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch pet details');
        }
        const data = await response.json();
        setPet(data);
      } catch (err) {
        setError(err.message);
      }
    });
  };

  // Load pet when component mounts
  React.useEffect(() => {
    loadPet();
  }, [petId]);

  if (isPending && !pet) {
    return <div className="pet-details-loading">Loading pet details...</div>;
  }

  if (error) {
    return <div className="pet-details-error">Error: {error}</div>;
  }

  if (!pet) {
    return <div className="pet-details-empty">Pet not found</div>;
  }

  // Get the first image URL or use default
  const imageUrl = pet.photoUrls && pet.photoUrls.length > 0 
    ? pet.photoUrls[0] 
    : defaultImage;

  return (
    <div className="pet-details">
      <div className="pet-details-header">
        <h2>{pet.name}</h2>
        {pet.status && <span className="pet-status">{pet.status}</span>}
      </div>

      <div className="pet-image">
        <img 
          src={imageUrl} 
          alt={`${pet.name}`} 
          onError={(e) => {
            e.target.src = defaultImage;
          }}
        />
      </div>

      <div className="pet-details-info">
        {pet.category && (
          <div className="info-item">
            <span className="label">Category:</span>
            <span className="value">{pet.category.name}</span>
          </div>
        )}

        {pet.tags && pet.tags.length > 0 && (
          <div className="info-item">
            <span className="label">Tags:</span>
            <div className="tags-container">
              {pet.tags.map(tag => (
                <span key={tag.id} className="tag">
                  {tag.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <button 
        className="back-button" 
        onClick={() => window.history.back()}
        disabled={isPending}
      >
        Back to pets
      </button>

      <button 
        className="refresh-button"
        onClick={loadPet}
        disabled={isPending}
      >
        Refresh
      </button>
    </div>
  );
}

export default PetDetails;