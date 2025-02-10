import React, { useState } from "react";
import "./App.css";

const SHAPES = ["circle", "square", "triangle", "hexagon", "star"];
const COLORS = ["red", "blue", "yellow", "green", "orange", "purple"];

const VendingMachine = () => {
  const [openTrays, setOpenTrays] = useState({});
  const [removedItems, setRemovedItems] = useState({});

  const trays = Array.from({ length: 9 }, (_, index) => {
    const shape = SHAPES[index % SHAPES.length];
    const colors = Array.from({ length: 3 }, () => COLORS[Math.floor(Math.random() * COLORS.length)]);
    return { shape, colors };
  });

  const toggleTray = (index) => {
    setOpenTrays((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const removeItem = (trayIndex, itemIndex) => {
    setRemovedItems((prev) => {
      const updatedTray = prev[trayIndex] ? [...prev[trayIndex]] : [];
      updatedTray.push(itemIndex);
      return { ...prev, [trayIndex]: updatedTray };
    });
  };

  const isItemRemoved = (trayIndex, itemIndex) => {
    return removedItems[trayIndex]?.includes(itemIndex);
  };

  return (
    <div className="room">
      <h1>Vending Machine Room</h1>
      <div className="poster poster1"></div>
      <div className="poster poster2"></div>
      <div className="vending-machine">
        {trays.map((tray, index) => (
          <div key={index} className="tray">
            <div
              className={`door ${openTrays[index] ? "open" : "closed"}`}
              onClick={() => toggleTray(index)}
            >
              {openTrays[index] ? "" : <span className="tray-number">{index + 1}</span>}
            </div>
            {openTrays[index] && (
              <div className="items">
                {tray.colors.map((color, i) =>
                  isItemRemoved(index, i) ? null : (
                    <div
                      key={i}
                      className={`item ${tray.shape}`}
                      style={{ backgroundColor: color }}
                      onClick={() => removeItem(index, i)}
                    ></div>
                  )
                )}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="floor"></div> {/* Wooden floor added */}
    </div>
  );
};

export default VendingMachine;
