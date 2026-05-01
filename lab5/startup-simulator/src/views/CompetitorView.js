import React, { useState, useEffect } from 'react';
import CompetitorCard from '../components/CompetitorCard';
import { collection, getDocs, addDoc } from "firebase/firestore";
import { db } from '../firebase';

function CompetitorView() {
  const [filter, setFilter] = useState('All');
  const [competitors, setCompetitors] = useState([]);
  const [loading, setLoading] = useState(true);

  const [newName, setNewName] = useState('');
  const [newSphere, setNewSphere] = useState('IT');
  const [newCapital, setNewCapital] = useState('Середній');

  const fetchCompetitors = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "competitors"));
      const competitorsData = [];
      querySnapshot.forEach((doc) => {
        competitorsData.push({ id: doc.id, ...doc.data() });
      });
      setCompetitors(competitorsData);
      setLoading(false);
    } catch (error) {
      console.error("Помилка при завантаженні ринку:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompetitors();
  }, []);

  const handleAddCompetitor = async (e) => {
    e.preventDefault();
    if (newName.trim() === '') return;

    try {
      await addDoc(collection(db, "competitors"), {
        name: newName,
        sphere: newSphere,
        capital: newCapital
      });

      setNewName('');
      setNewSphere('IT');
      setNewCapital('Середній');

      fetchCompetitors();
      alert("Компанію успішно додано на ринок!");
    } catch (error) {
      console.error("Помилка при додаванні компанії:", error);
      alert("Помилка: " + error.message);
    }
  };

  const filteredCompetitors = filter === 'All'
    ? competitors
    : competitors.filter(c => c.sphere === filter);

  return (
    <section id="market">
      <h2>Ринок</h2>

      <div style={{ padding: '30px', border: '1px solid #e0e0e0', borderRadius: '12px', maxWidth: '400px', margin: '0 auto 40px', backgroundColor: '#fdfdfd', boxShadow: '0 8px 16px rgba(0,0,0,0.08)' }}>
        <h3 style={{ marginTop: '0', textAlign: 'center', color: '#333', marginBottom: '20px' }}>Додати компанію на ринок</h3>
        <form onSubmit={handleAddCompetitor} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input
            type="text"
            placeholder="Назва компанії (напр. Alpha Corp)"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            required
            style={{ padding: '12px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box', width: '100%', fontSize: '15px' }}
          />
          <select value={newSphere} onChange={(e) => setNewSphere(e.target.value)} style={{ padding: '12px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box', width: '100%', fontSize: '15px' }}>
            <option value="IT">IT</option>
            <option value="Бізнес">Бізнес</option>
            <option value="Медицина">Медицина</option>
          </select>
          <select value={newCapital} onChange={(e) => setNewCapital(e.target.value)} style={{ padding: '12px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box', width: '100%', fontSize: '15px' }}>
            <option value="Високий">Високий</option>
            <option value="Середній">Середній</option>
            <option value="Низький">Низький</option>
          </select>
          {/* Змінена кнопка: по центру, зелена, напис "Додати" */}
          <button type="submit" style={{ padding: '12px', backgroundColor: '#28a745', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '6px', fontSize: '16px', fontWeight: 'bold', transition: '0.2s', marginTop: '10px', width: '200px', alignSelf: 'center' }}>
            Додати
          </button>
        </form>
      </div>

      <div style={{ marginBottom: '20px', textAlign: 'center' }}>
        <label><strong>Фільтр за сферою: </strong></label>
        <select value={filter} onChange={e => setFilter(e.target.value)} style={{ padding: '5px', borderRadius: '4px' }}>
          <option value="All">Всі</option>
          <option value="IT">IT</option>
          <option value="Бізнес">Бізнес</option>
          <option value="Медицина">Медицина</option>
        </select>
      </div>

      {loading ? (
        <p style={{ textAlign: 'center' }}>Завантаження даних з бази...</p>
      ) : filteredCompetitors.length > 0 ? (
        <div className="grid-container">
          {filteredCompetitors.map(c => (
            <CompetitorCard
              key={c.id}
              name={c.name}
              sphere={c.sphere}
              capital={c.capital}
            />
          ))}
        </div>
      ) : (
        <p style={{ textAlign: 'center' }}>Наразі компаній у цій сфері немає.</p>
      )}
    </section>
  );
}

export default CompetitorView;