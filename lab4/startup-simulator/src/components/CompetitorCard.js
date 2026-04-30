import React from 'react';

function CompetitorCard({ name, sphere, capital }) {
  return (
    <article className="card">
      <h3>{name}</h3>
      <p>Сфера: {sphere}</p>
      <p>Капітал: {capital}</p>
    </article>
  );
}

export default CompetitorCard;