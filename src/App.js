import React, { useState, useRef } from "react";
import QrScanner from 'react-qr-scanner';
import jsQR from 'jsqr';
import "./App.css";

const VendingMachine = () => {
  const [openTrays, setOpenTrays] = useState({});
  const [removedItems, setRemovedItems] = useState({});
  const [scanResult, setScanResult] = useState("");
  const [showScanner, setShowScanner] = useState(false);
  const fileInputRef = useRef(null);

  
  const ITEMS = {
    pen: "https://www.freeiconspng.com/uploads/bic-pen-png-picture-10.png",
    snack: "https://cdn-icons-png.flaticon.com/512/3076/3076094.png",
    coffee: "https://cdn-icons-png.flaticon.com/512/924/924514.png",
    umbrella: "https://cdn-icons-png.flaticon.com/512/744/744503.png",
    book: "https://cdn-icons-png.flaticon.com/512/2702/2702134.png",
    phone: "https://cdn-icons-png.flaticon.com/512/1239/1239711.png"
  };

  const trays = [
    { items: ["pen", "pen", "pen"], label: "Pens" },
    { items: ["book", "book", "book"], label: "Books" },
    { items: ["coffee", "coffee", "coffee"], label: "Coffee" },
    { items: ["umbrella", "umbrella", "umbrella"], label: "Umbrellas" },
    { items: ["phone", "phone", "phone"], label: "Phones" },
    { items: ["snack", "snack", "snack"], label: "Snacks" },
    { items: ["snack", "snack", "snack"], label: "Snacks" },
    { items: ["book", "book", "book"], label: "Books" },
    { items: ["pen", "pen", "pen"], label: "Pens" }
  ];

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

  const handleScan = (result) => {
    if (result) {
      setScanResult(result.text);
      const trayNumbers = result.text.split(",").map(num => parseInt(num.trim()) - 1);
      trayNumbers.forEach(num => {
        if (!openTrays[num]) toggleTray(num);
      });
    }
  };

  const handleError = (error) => {
    console.error("QR Scanner error:", error);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height);
          if (code) handleScan({ text: code.data });
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleScanner = () => {
    setShowScanner(!showScanner);
  };

  return (
    <div className="room">
      <h1>Vending Machine Room</h1>
      <div className="poster poster1"></div>
      <div className="poster poster2"></div>

      <button onClick={toggleScanner} className="small-toggle-scanner-button">
        {showScanner ? "✖ Close" : "Scan your QR"}
      </button>

      {showScanner && (
        <div className="qr-reader-container">
          <div className="qr-reader">
            <QrScanner
              onScan={handleScan}
              onError={handleError}
              style={{
                width: '100%',
                maxWidth: '300px',
                margin: '0 auto',
                borderRadius: '10px',
                overflow: 'hidden'
              }}
            />
            <p>Scanned Result: {scanResult}</p>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              ref={fileInputRef}
              className="file-upload"
            />
            <p>Or upload an image of the QR code</p>
          </div>
        </div>
      )}

      <div className="vending-machine">
        {trays.map((tray, index) => (
          <div key={index} className="tray">
            <div
              className={`door ${openTrays[index] ? "open" : "closed"}`}
              onClick={() => {
                if (openTrays[index]) {
                  toggleTray(index);
                }
              }}
            >
              {openTrays[index] ? "" : <span className="tray-number">{index + 1}</span>}
            </div>
            {openTrays[index] && (
              <div className="items">
                {tray.items.map((item, i) =>
                  isItemRemoved(index, i) ? null : (
                    <div
                      key={i}
                      className="item"
                      onClick={() => removeItem(index, i)}
                    >
                      <img 
                        src={ITEMS[item]} 
                        alt={tray.label}
                        className="item-image"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="floor"></div>
    </div>
  );
};

export default VendingMachine;