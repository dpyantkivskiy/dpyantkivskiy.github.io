import React from 'react';

function InvestorCard({ name, budget }) {
  return (
    <article className="card">
      <h3>{name}</h3>
      <p>Бюджет: {budget}</p>
    </article>
  );
}

export default InvestorCard;