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

      <div style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px', maxWidth: '400px', margin: '0 auto 30px' }}>
        <h3>Додати компанію на ринок</h3>
        <form onSubmit={handleAddCompetitor} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input 
            type="text" 
            placeholder="Назва компанії (напр. Alpha Corp)" 
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            required
            style={{ padding: '8px' }}
          />
          <select value={newSphere} onChange={(e) => setNewSphere(e.target.value)} style={{ padding: '8px' }}>
            <option value="IT">IT</option>
            <option value="Бізнес">Бізнес</option>
            <option value="Медицина">Медицина</option>
          </select>
          <select value={newCapital} onChange={(e) => setNewCapital(e.target.value)} style={{ padding: '8px' }}>
            <option value="Високий">Високий</option>
            <option value="Середній">Середній</option>
            <option value="Низький">Низький</option>
          </select>
          <button type="submit" style={{ padding: '10px', backgroundColor: '#007BFF', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '4px' }}>
            Додати в базу
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