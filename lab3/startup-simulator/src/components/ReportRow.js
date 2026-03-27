import React from 'react';

function ReportRow({ name, initial, current, diff }) {
  const diffColor = diff > 0 ? 'green' : (diff < 0 ? 'red' : 'black');
  const diffText = diff > 0 ? '+' + diff : diff;

  return (
    <tr>
      <td style={{ padding: '10px', border: '1px solid #ddd' }}>{name}</td>
      <td style={{ padding: '10px', border: '1px solid #ddd' }}>{initial}</td>
      <td style={{ padding: '10px', border: '1px solid #ddd' }}>{current}</td>
      <td style={{ color: diffColor, fontWeight: 'bold', padding: '10px', border: '1px solid #ddd' }}>
        {diffText}
      </td>
    </tr>
  );
}

export default ReportRow;