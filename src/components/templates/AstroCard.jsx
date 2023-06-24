import React from 'react';

const AstroCard = ({ title, image, description }) => {
  return (
    <div className="astro-card">
      <img src={image} alt={title} />
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  );
};

export default AstroCard;
