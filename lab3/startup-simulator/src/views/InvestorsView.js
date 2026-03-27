import React from 'react';
import InvestorCard from '../components/InvestorCard';

function InvestorsView() {
  const investors = [
    { name: 'Ілон Маск', budget: '$1 млрд' },
    { name: 'Білл Гейтс', budget: '$500 млн' },
    { name: 'Джефф Безос', budget: '$2 млрд' },
    { name: 'Уоррен Баффет', budget: '$1.5 млрд' },
    { name: 'Чанпен Чжао', budget: '$800 млн' },
    { name: 'Віталік Бутерін', budget: '$300 млн' },
    { name: 'Пітер Тіль', budget: '$400 млн' },
    { name: 'Сем Альтман', budget: '$150 млн' }
  ];

  return (
    <section id="investors">
      <h2>Інвестори</h2>
      <div className="grid-container">
        {investors.map(i => (
          <InvestorCard key={i.name} name={i.name} budget={i.budget} />
        ))}
      </div>
    </section>
  );
}

export default InvestorsView;