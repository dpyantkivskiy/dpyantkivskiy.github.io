import React, { useState } from 'react';
import CompetitorCard from '../components/CompetitorCard';

function CompetitorView() {
  const [filter, setFilter] = useState('All');

  const competitors = [
    { name: 'Alpha Corp', sphere: 'IT', capital: 'Високий' },
    { name: 'TechNova', sphere: 'IT', capital: 'Середній' },
    { name: 'Beta Industries', sphere: 'Бізнес', capital: 'Середній' },
    { name: 'Global Trade Partners', sphere: 'Бізнес', capital: 'Високий' },
    { name: 'Omega Group', sphere: 'Медицина', capital: 'Низький' },
    { name: 'BioHealth Labs', sphere: 'Медицина', capital: 'Середній' }
  ];

  const filteredCompetitors = filter === 'All' ? competitors : competitors.filter(c => c.sphere === filter);

  return (
    <section id="market">
      <h2>Ринок</h2>
      <div style={{ marginBottom: '20px' }}>
        <label>Фільтр за сферою: </label>
        <select value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="All">Всі</option>
          <option value="IT">IT</option>
          <option value="Бізнес">Бізнес</option>
          <option value="Медицина">Медицина</option>
        </select>
      </div>
      <div className="grid-container">
        {filteredCompetitors.map(c => (
          <CompetitorCard key={c.name} name={c.name} sphere={c.sphere} capital={c.capital} />
        ))}
      </div>
    </section>
  );
}

export default CompetitorView;