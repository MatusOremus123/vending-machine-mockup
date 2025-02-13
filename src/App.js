import React, { useState, useRef } from "react";
import { Html5QrcodeScanner, Html5Qrcode } from "html5-qrcode";
import "./App.css";

const SHAPES = ["circle", "square", "triangle", "hexagon", "star"];
const COLORS = ["red", "blue", "yellow", "green", "orange", "purple"];

const VendingMachine = () => {
  const [openTrays, setOpenTrays] = useState({});
  const [removedItems, setRemovedItems] = useState({});
  const [scanResult, setScanResult] = useState("");
  const [isScannerActive, setIsScannerActive] = useState(false);
  const [showScanner, setShowScanner] = useState(false); 
  const qrScannerRef = useRef(null);

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

  const handleScan = (result) => {
    if (result) {
      setScanResult(result);
      const trayNumbers = result.split(",").map((num) => parseInt(num.trim()) - 1);
      trayNumbers.forEach((num) => {
        if (!openTrays[num]) {
          toggleTray(num);
        }
      });
      stopScanner();
    }
  };

  const handleError = (error) => {
    console.error("QR Scanner error:", error);
  };

  const startScanner = () => {
    setIsScannerActive(true);
    const qrScanner = new Html5QrcodeScanner(
      "qr-reader",
      {
        fps: 10,
        qrbox: 250,
      },
      false
    );

    qrScanner.render(handleScan, handleError);
    qrScannerRef.current = qrScanner;
  };

  const stopScanner = () => {
    if (qrScannerRef.current) {
      qrScannerRef.current.clear();
      qrScannerRef.current = null;
    }
    setIsScannerActive(false);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const image = new Image();
        image.src = e.target.result;
        image.onload = () => {
          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");
          canvas.width = image.width;
          canvas.height = image.height;
          context.drawImage(image, 0, 0, image.width, image.height);
          const imageData = context.getImageData(0, 0, image.width, image.height);

          const html5Qrcode = new Html5Qrcode();
          html5Qrcode
            .scanFile(imageData, true)
            .then((result) => {
              handleScan(result);
            })
            .catch((error) => {
              console.error("QR Code scan failed:", error);
            });
        };
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleScanner = () => {
    setShowScanner(!showScanner);
    if (!showScanner) {
      setIsScannerActive(false);
    }
  };

  return (
    <div className="room">
      <h1>Vending Machine Room</h1>
      <div className="poster poster1"></div>
      <div className="poster poster2"></div>

      {}
      <button onClick={toggleScanner} className="small-toggle-scanner-button">
        {showScanner ? "✖" : "📷"}
      </button>

      {}
      {showScanner && (
        <div className="qr-reader-container">
          <div className="qr-reader">
            {!isScannerActive && (
              <button onClick={startScanner} className="scan-button">
                Open Camera and Scan QR Code
              </button>
            )}
            <div id="qr-reader"></div>
            <p>Scanned Result: {scanResult}</p>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="file-upload"
            />
            <p>Or upload an image of the QR code</p>
          </div>
        </div>
      )}

      {}
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
      <div className="floor"></div>
    </div>
  );
};

export default VendingMachine;