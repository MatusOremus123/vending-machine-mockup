import React, { useState } from 'react';
import './App.css';

function App() {
  const [openTrays, setOpenTrays] = useState([]);
  const [items, setItems] = useState({
    1: [{ color: 'red', shape: 'circle' }, { color: 'blue', shape: 'square' }],
    2: [{ color: 'green', shape: 'triangle' }],
    3: [{ color: 'yellow', shape: 'circle' }],
    4: [{ color: 'purple', shape: 'square' }],
    5: [{ color: 'orange', shape: 'triangle' }],
    6: [{ color: 'pink', shape: 'circle' }],
    7: [{ color: 'brown', shape: 'triangle' }],
    8: [{ color: 'black', shape: 'square' }],
    9: [{ color: 'white', shape: 'circle' }],
  });

  const toggleTray = (trayNumber) => {
    if (openTrays.includes(trayNumber)) {
      setOpenTrays(openTrays.filter((num) => num !== trayNumber));
    } else {
      setOpenTrays([...openTrays, trayNumber]);
    }
  };

  const removeItem = (trayNumber, itemIndex) => {
    setItems({
      ...items,
      [trayNumber]: items[trayNumber].filter((_, index) => index !== itemIndex),
    });
  };

  return (
    <div className="App">
      <h1>Vending Machine Mockup</h1>
      <div className="vending-machine">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((trayNumber) => (
          <div key={trayNumber} className="tray">
            <div
              className={`door ${openTrays.includes(trayNumber) ? 'open' : 'closed'}`}
              onClick={() => toggleTray(trayNumber)}
            >
              <span className="tray-number">{trayNumber}</span>
              {openTrays.includes(trayNumber) && (
                <button className="close-btn" onClick={() => toggleTray(trayNumber)}>
                  X
                </button>
              )}
            </div>
            {openTrays.includes(trayNumber) && (
              <div className="items">
                {items[trayNumber]?.map((item, index) => (
                  <div
                    key={index}
                    className={`item ${item.shape}`}
                    style={{ backgroundColor: item.color }}
                    onClick={() => removeItem(trayNumber, index)}
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;