// src/components/Scanner.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

export default function Scanner({ onLookup }) {
  const [barcode, setBarcode] = useState('');
  const [query, setQuery] = useState('');
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState('');
  const qrScannerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (qrScannerRef.current) {
        try {
          qrScannerRef.current.clear();
        } catch (e) {
          console.log('Error clearing scanner:', e);
        }
      }
    };
  }, []);

  useEffect(() => {
    if (!scanning) return;

    try {
      const element = document.getElementById('qr-reader');
      if (!element) return;

      qrScannerRef.current = new Html5QrcodeScanner(
        'qr-reader',
        { 
          fps: 10, 
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0
        },
        false
      );

      qrScannerRef.current.render(
        (decodedText) => {
          setBarcode(decodedText);
          setError('');
          handleStopScanning();
          setTimeout(() => {
            onLookup({ barcode: decodedText, query: '' });
          }, 100);
        },
        (error) => {
          // Suppress most errors - they're expected during scanning
          if (!error.includes('NotFoundException')) {
            console.debug('QR scan:', error);
          }
        }
      );
    } catch (err) {
      setError('Camera access denied or not supported');
      console.error('Scanner error:', err);
      setScanning(false);
    }

    return () => {
      if (qrScannerRef.current) {
        try {
          qrScannerRef.current.clear();
        } catch (e) {
          console.log('Error clearing scanner:', e);
        }
      }
    };
  }, [scanning]);

  const handleStartScanning = () => {
    setError('');
    setScanning(true);
  };

  const handleStopScanning = () => {
    setScanning(false);
  };

  return (
    <div className="card">
      <h2>Scan or search</h2>
      {error && <div style={{ color: '#ef4444', marginBottom: '12px' }}>{error}</div>}
      {scanning && (
        <div id="qr-reader" style={{ 
          width: '100%', 
          marginBottom: '16px',
          borderRadius: '8px',
          overflow: 'hidden'
        }}></div>
      )}
      <div className="scanner-grid">
        <div className="field">
          <label>Barcode</label>
          <input
            type="text"
            placeholder="e.g., 7622210449283"
            value={barcode}
            onChange={(e) => setBarcode(e.target.value)}
          />
        </div>
        <div className="divider">or</div>
        <div className="field">
          <label>Search</label>
          <input
            type="text"
            placeholder="e.g., dark chocolate"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>
      <div style={{ display: 'flex', gap: '8px' }}>
        {!scanning ? (
          <button className="secondary" onClick={handleStartScanning}>
            📷 Scan Barcode
          </button>
        ) : (
          <button className="secondary" onClick={handleStopScanning}>
            ✕ Stop Scanning
          </button>
        )}
        <button
          className="primary"
          onClick={() => onLookup({ barcode: barcode.trim(), query: query.trim() })}
          disabled={!barcode.trim() && !query.trim()}
        >
          Fetch product
        </button>
      </div>
    </div>
  );
}