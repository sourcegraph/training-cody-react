import React from 'react';
import './PetCard.css';

function PetCard({ pet }) {
  // Default image if no pet image is available
  const defaultImage = 'https://via.placeholder.com/150?text=No+Image';

  // Helper function to get a valid image URL
  function getImageUrl(photoUrls) {
    if (!photoUrls || photoUrls.length === 0) {
      return defaultImage;
    }
    return photoUrls[0];
  }

  return (
    <div className="pet-card">
      <div className="pet-image">
        <img 
          src={getImageUrl(pet.photoUrls)} 
          alt={pet.name || 'Pet'} 
          onError={(e) => {
            e.target.src = defaultImage;
          }}
        />
      </div>
      
      <div className="card-header">
        <div>
          <h3>{pet.name || 'Unknown'}</h3>
          {pet.status && (
            <span className="pet-status">
              {pet.status}
            </span>
          )}
        </div>
      </div>
      
      <div className="card-content">
        {pet.category && (
          <p>
            Category: {pet.category.name || 'Unknown'}
          </p>
        )}
        
        {pet.tags && pet.tags.length > 0 && (
          <div className="tags">
            <p>Tags:</p>
            <div className="tag-list">
              {pet.tags.map(tag => (
                <span key={tag.id} className="tag">
                  {tag.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <div className="card-footer">
        <a href={`/pet/${pet.id}`}>View details</a>
      </div>
    </div>
  );
}

export default PetCard;