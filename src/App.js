import React, { useState } from "react";
import "./App.css";

const SHAPES = ["circle", "square", "triangle", "hexagon", "star"];
const COLORS = ["red", "blue", "yellow", "green", "orange", "purple"];

const VendingMachine = () => {
  const [trays, setTrays] = useState(() =>
    Array.from({ length: 9 }, (_, index) => {
      const shape = SHAPES[index % SHAPES.length];
      return {
        shape,
        colors: Array.from({ length: 3 }, () => COLORS[Math.floor(Math.random() * COLORS.length)]),
      };
    })
  );

  const [openTrays, setOpenTrays] = useState({});

  const toggleTray = (index) => {
    setOpenTrays((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const removeItem = (trayIndex, itemIndex) => {
    setTrays((prevTrays) =>
      prevTrays.map((tray, index) =>
        index === trayIndex
          ? { ...tray, colors: tray.colors.filter((_, i) => i !== itemIndex) }
          : tray
      )
    );
  };

  return (
    <div className="App">
      <h1>Vending Machine Mockup</h1>
      <div className="vending-machine">
        {trays.map((tray, trayIndex) => (
          <div key={trayIndex} className="tray">
            <div
              className={`door ${openTrays[trayIndex] ? "open" : "closed"}`}
              onClick={() => toggleTray(trayIndex)}
            >
              {openTrays[trayIndex] ? "" : <span className="tray-number">{trayIndex + 1}</span>}
            </div>
            {openTrays[trayIndex] && (
              <div className="items">
                {tray.colors.length > 0 ? (
                  tray.colors.map((color, itemIndex) => (
                    <div
                      key={itemIndex}
                      className={`item ${tray.shape}`}
                      style={{ backgroundColor: color }}
                      onClick={() => removeItem(trayIndex, itemIndex)}
                    ></div>
                  ))
                ) : (
                  <p className="empty-tray">Empty Tray</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default VendingMachine;
