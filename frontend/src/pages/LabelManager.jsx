import React, { useState, useEffect } from 'react';
import './LabelManager.css'; // <--- import the CSS file

export default function LabelManager({ token, onSelectLabel }) {
  const [labels, setLabels] = useState([]);
  const [newLabel, setNewLabel] = useState('');
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    if (!token) return;
    fetch('/api/labels', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(setLabels)
      .catch(() => setLabels([]));
  }, [token]);

  const createLabel = async () => {
    if (!newLabel.trim()) return;
    await fetch('/api/labels', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ name: newLabel })
    });
    setNewLabel('');
    setShowDialog(false);
    fetch('/api/labels', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(setLabels);
  };

  return (
    <div style={{ marginTop: 20 }}>
      <b>Labels</b>
      <ul style={{ paddingLeft: 10 }}>
        {labels.map(label => (
          <li key={label.id} style={{ cursor: 'pointer' }} onClick={() => onSelectLabel(label.name)}>
            🏷️ {label.name}
          </li>
        ))}
      </ul>
      <button
        className="label-btn"
        onClick={() => setShowDialog(true)}
      >
        + New label
      </button>
      {showDialog && (
        <div
          style={{
            position: "fixed",
            top: 0, left: 0, right: 0, bottom: 0,
            background: "rgba(0,0,0,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000
          }}
          onClick={() => setShowDialog(false)}
        >
          <div
            style={{
              background: "white",
              borderRadius: "10px",
              boxShadow: "0 2px 12px #2225",
              padding: "2em",
              minWidth: "250px"
            }}
            onClick={e => e.stopPropagation()}
          >
            <h3 style={{marginTop:0}}>Create new label</h3>
            <input
              type="text"
              placeholder="Label name"
              value={newLabel}
              onChange={e => setNewLabel(e.target.value)}
              style={{ width: "100%", padding: "0.5em", fontSize: "1em", marginBottom: "1em" }}
              autoFocus
              onKeyDown={e => e.key === 'Enter' && createLabel()}
            />
            <div style={{display:"flex", gap:8}}>
              <button
                style={{
                  background: "#cafc43",
                  color: "#226",
                  border: "none",
                  borderRadius: "18px",
                  padding: "0.5em 1.5em",
                  fontWeight: "bold"
                }}
                onClick={createLabel}
              >Add</button>
              <button
                style={{
                  background: "#eee",
                  color: "#333",
                  border: "none",
                  borderRadius: "18px",
                  padding: "0.5em 1.5em"
                }}
                onClick={() => setShowDialog(false)}
              >Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
