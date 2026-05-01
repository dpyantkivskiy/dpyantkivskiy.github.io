import React, { useState, useEffect } from 'react';
import InvestorCard from '../components/InvestorCard';
import { collection, getDocs, addDoc } from "firebase/firestore";
import { db } from '../firebase';

function InvestorsView() {
  const [investors, setInvestors] = useState([]);
  const [loading, setLoading] = useState(true);

  const [newName, setNewName] = useState('');
  const [newBudget, setNewBudget] = useState('');

  const fetchInvestors = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "investors"));
      const investorsData = [];
      querySnapshot.forEach((doc) => {
        investorsData.push({ id: doc.id, ...doc.data() });
      });
      setInvestors(investorsData);
      setLoading(false);
    } catch (error) {
      console.error("Помилка при завантаженні інвесторів:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvestors();
  }, []);

  const handleAddInvestor = async (e) => {
    e.preventDefault();
    if (newName.trim() === '' || newBudget.trim() === '') return;

    try {
      await addDoc(collection(db, "investors"), {
        name: newName,
        budget: newBudget
      });

      setNewName('');
      setNewBudget('');

      fetchInvestors();
      alert("Інвестора успішно додано!");
    } catch (error) {
      console.error("Помилка при додаванні інвестора:", error);
      alert("Помилка: " + error.message);
    }
  };

  return (
    <section id="investors">
      <h2>Інвестори</h2>

      <div style={{ padding: '30px', border: '1px solid #e0e0e0', borderRadius: '12px', maxWidth: '400px', margin: '0 auto 40px', backgroundColor: '#fdfdfd', boxShadow: '0 8px 16px rgba(0,0,0,0.08)' }}>
        <h3 style={{ marginTop: '0', textAlign: 'center', color: '#333', marginBottom: '20px' }}>Додати інвестора</h3>
        <form onSubmit={handleAddInvestor} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input
            type="text"
            placeholder="Ім'я інвестора (напр. Ілон Маск)"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            required
            style={{ padding: '12px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box', width: '100%', fontSize: '15px' }}
          />
          <input
            type="text"
            placeholder="Бюджет (напр. $1 млрд)"
            value={newBudget}
            onChange={(e) => setNewBudget(e.target.value)}
            required
            style={{ padding: '12px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box', width: '100%', fontSize: '15px' }}
          />
          {/* Змінена кнопка: по центру, зелена, напис "Додати" */}
          <button type="submit" style={{ padding: '12px', backgroundColor: '#28a745', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '6px', fontSize: '16px', fontWeight: 'bold', transition: '0.2s', marginTop: '10px', width: '200px', alignSelf: 'center' }}>
            Додати
          </button>
        </form>
      </div>

      {loading ? (
        <p style={{ textAlign: 'center' }}>Завантаження даних з бази...</p>
      ) : investors.length > 0 ? (
        <div className="grid-container">
          {investors.map(i => (
            <InvestorCard
              key={i.id}
              name={i.name}
              budget={i.budget}
            />
          ))}
        </div>
      ) : (
        <p style={{ textAlign: 'center' }}>Наразі інвесторів у базі немає.</p>
      )}
    </section>
  );
}

export default InvestorsView;