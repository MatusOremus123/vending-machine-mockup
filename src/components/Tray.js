import React from 'react';
import './Tray.css'; // Use the CSS styling we provided above

function Tray({ items }) {
  return (
    <div className="tray-container">
      {items.map((item, index) => (
        <div className="item" key={index}>
          <h3>{item.name}</h3>
          <p>{item.price}€</p>
        </div>
      ))}
    </div>
  );
}

export default Tray;
