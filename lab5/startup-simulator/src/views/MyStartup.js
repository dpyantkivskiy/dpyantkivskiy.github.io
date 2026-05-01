import ReportRow from '../components/ReportRow';
import React, { useState, useEffect } from 'react';

function MyStartup() {
    const [companyName, setCompanyName] = useState('');
    const [sphere, setSphere] = useState('IT');
    const [isCreated, setIsCreated] = useState(false);
    const [nameError, setNameError] = useState('');

    const [selectedAction, setSelectedAction] = useState('hire');
    const [actionAmount, setActionAmount] = useState(1);
    const [actionError, setActionError] = useState('');

    const [initial, setInitial] = useState({ employees: 0, profit: 0, expenses: 0, offices: 1 });
    const [current, setCurrent] = useState({ employees: 0, profit: 0, expenses: 0, offices: 1 });

    // === ДОДАНО: GET-запит для отримання даних при завантаженні компонента ===
    useEffect(() => {
        fetch('http://localhost:5000/api/company')
            .then(res => res.json())
            .then(data => {
                // Якщо компанія вже є в базі і її назва не дефолтна
                if (data.name && data.name !== 'Новий Стартап') {
                    setCompanyName(data.name);
                    if (data.description) setSphere(data.description);
                    setIsCreated(true); // Одразу показуємо панель керування
                }
            })
            .catch(err => console.error("Помилка завантаження даних з сервера:", err));
    }, []);

    // === ОНОВЛЕНО: POST-запит для збереження компанії на сервері ===
    const createCompany = async (e) => {
        e.preventDefault();
        
        if (!companyName.trim()) {
            setNameError("Введіть назву!");
            return;
        }

        try {
            // Відправляємо дані на наш Node.js сервер
            const response = await fetch('/api/company', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    name: companyName, 
                    description: sphere // Передаємо сферу як опис
                })
            });

            const result = await response.json();

            // Якщо сервер повернув помилку (наприклад, менше 5 символів)
            if (!response.ok) {
                setNameError(result.error || "Помилка збереження");
                return; // Зупиняємо виконання, компанія не створена
            }

            // Якщо все успішно
            setIsCreated(true);
            setNameError("");
            alert(`Компанію '${companyName}' збережено на сервері!`);
            
        } catch (error) {
            console.error("Помилка з'єднання:", error);
            setNameError("Не вдалося з'єднатися з сервером. Перевірте, чи запущений Node.js");
        }
    };

    // ... інший код (simulateStep та reportRows залишаються без змін) ...
    const simulateStep = (e) => {
        e.preventDefault();
        setActionError("");
        const amt = parseInt(actionAmount, 10);
        if (isNaN(amt) || amt <= 0) {
            setActionError("Кількість має бути > 0");
            return;
        }

        let newCurrent = { ...current };

        if (selectedAction === 'hire') {
            newCurrent.employees += amt;
            newCurrent.expenses += amt * 500;
        } else if (selectedAction === 'fire') {
            if (amt > newCurrent.employees) {
                setActionError("Немає стільки людей!");
                return;
            }
            newCurrent.employees -= amt;
            newCurrent.expenses -= amt * 500;
        } else if (selectedAction === 'marketing') {
            newCurrent.profit += amt * 1000;
        } else if (selectedAction === 'office') {
            newCurrent.offices += amt;
            newCurrent.expenses += amt * 2000;
        }
        setCurrent(newCurrent);
    };

    const reportRows = [
        { key: 'employees', name: 'Працівники' },
        { key: 'profit', name: 'Прибуток ($)' },
        { key: 'expenses', name: 'Витрати ($)' },
        { key: 'offices', name: 'Офіси' }
    ].map(l => ({
        name: l.name,
        initial: initial[l.key],
        current: current[l.key],
        diff: current[l.key] - initial[l.key]
    }));

    return (
        <section id="startup">
            <h2>Мій стартап</h2>
            <div className="intro-content">
                <p>Керуйте фінансами та персоналом своєї компанії.</p>
            </div>

            <h3>Створити нову компанію:</h3>
            <form onSubmit={createCompany}>
                <label>Назва компанії:</label><br />
                <input type="text" value={companyName} onChange={e => setCompanyName(e.target.value)} disabled={isCreated} placeholder="Наприклад: Super Tech" /><br />

                <label>Сфера діяльності:</label><br />
                <select value={sphere} onChange={e => setSphere(e.target.value)} disabled={isCreated}>
                    <option>IT</option>
                    <option>Бізнес</option>
                    <option>Медицина</option>
                </select><br />

                <button type="submit" disabled={isCreated}>Створити</button>
                {nameError && <p style={{ color: 'red', marginTop: '10px' }}>{nameError}</p>}
            </form>

            {isCreated && (
                <div style={{ marginTop: '30px' }}>
                    <h3>Моделювання бізнес процесу:</h3>
                    <form onSubmit={simulateStep}>
                        <label>Виберіть дію</label><br />
                        <select value={selectedAction} onChange={e => setSelectedAction(e.target.value)}>
                            <option value="hire">Найняти працівників (+$500/міс витрат)</option>
                            <option value="fire">Звільнити працівників (-$500/міс витрат)</option>
                            <option value="marketing">Рекламна кампанія (+$1000/міс прибутку)</option>
                            <option value="office">Відкрити офіс (+$2000/міс витрат)</option>
                        </select><br /><br />
                        <label>Кількість:</label><br />
                        <input type="number" value={actionAmount} onChange={e => setActionAmount(e.target.value)} min="1" /><br /><br />
                        <button type="submit">Змоделювати крок</button>
                        {actionError && <p style={{ color: 'red' }}>{actionError}</p>}
                    </form>

                    <div className="stats">
                        <h3>Поточні параметри:</h3>
                        <ul>
                            <li>Працівники: {current.employees}</li>
                            <li>Прибуток: ${current.profit} / міс</li>
                            <li>Витрати: ${current.expenses} / міс</li>
                            <li>Офіси: {current.offices}</li>
                        </ul>
                    </div>

                    <section id="report-section" style={{ marginTop: '30px' }}>
                        <h2>Динамічний звіт: Порівняння</h2>
                        <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white' }}>
                            <thead>
                                <tr style={{ backgroundColor: '#34495e', color: 'white' }}>
                                    <th style={{ padding: '10px', border: '1px solid #ddd' }}>Параметр</th>
                                    <th style={{ padding: '10px', border: '1px solid #ddd' }}>Початкові</th>
                                    <th style={{ padding: '10px', border: '1px solid #ddd' }}>Змодельовані</th>
                                    <th style={{ padding: '10px', border: '1px solid #ddd' }}>Різниця</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reportRows.map(row => (
                                    <ReportRow
                                        key={row.name}
                                        name={row.name}
                                        initial={row.initial}
                                        current={row.current}
                                        diff={row.diff}
                                    />
                                ))}
                            </tbody>
                        </table>
                    </section>
                </div>
            )}
        </section>
    );
}

export default MyStartup;