import React, { useState } from 'react';

const EMOJIS = ['🥗', '🥧', '🫒', '🥙', '🥕', '🥑', '🍅', '🧆', '🫕', '🥦', '🧀', '🍳'];
const CATEGORIES = ['סלטים', 'קישים', 'מרקים', 'עוגות', 'שאר'];

export default function AdminView({ menu, setMenu, defaultMenu }) {
  const [editingItem, setEditingItem] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const toggleAvailable = (id) => {
    setMenu(prev => prev.map(i => i.id === id ? { ...i, available: !i.available } : i));
  };

  const deleteItem = (id) => {
    if (window.confirm('למחוק מנה זו?')) {
      setMenu(prev => prev.filter(i => i.id !== id));
    }
  };

  const saveItem = (item) => {
    if (item.id) {
      setMenu(prev => prev.map(i => i.id === item.id ? item : i));
    } else {
      const newId = Date.now();
      setMenu(prev => [...prev, { ...item, id: newId }]);
    }
    setEditingItem(null);
    setShowAddForm(false);
  };

  const resetToDefault = () => {
    if (window.confirm('לאפס את התפריט לברירת המחדל?')) {
      setMenu(defaultMenu);
    }
  };

  if (editingItem !== null || showAddForm) {
    return (
      <ItemForm
        item={editingItem}
        onSave={saveItem}
        onCancel={() => { setEditingItem(null); setShowAddForm(false); }}
      />
    );
  }

  return (
    <div style={{ padding: '20px 16px 100px' }}>
      <div style={{
        background: '#fff8f0', border: '1px solid #fde8c8',
        borderRadius: 14, padding: '14px 16px', marginBottom: 20
      }}>
        <p style={{ fontSize: 14, color: '#a0522d', fontWeight: 600 }}>⚙️ מצב ניהול</p>
        <p style={{ fontSize: 13, color: '#888', marginTop: 4 }}>כאן את מנהלת את התפריט. הלקוחות לא רואים עמוד זה.</p>
      </div>

      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        <button onClick={() => setShowAddForm(true)} style={{
          flex: 1, background: '#2d6a4f', color: '#fff',
          border: 'none', borderRadius: 12, padding: '12px',
          fontSize: 15, fontWeight: 600, cursor: 'pointer'
        }}>+ הוסף מנה</button>
        <button onClick={resetToDefault} style={{
          background: '#f5f2ec', border: '1px solid #e0dbd0',
          borderRadius: 12, padding: '12px 14px',
          fontSize: 13, color: '#888', cursor: 'pointer'
        }}>🔄 אפס</button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {menu.map(item => (
          <div key={item.id} style={{
            background: '#fff',
            border: `1px solid ${item.available ? '#e0f0e8' : '#f0ece4'}`,
            borderRadius: 14, padding: '14px 16px',
            opacity: item.available ? 1 : 0.6
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 28 }}>{item.emoji}</span>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 15, fontWeight: 600 }}>{item.name}</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: '#2d6a4f' }}>₪{item.price}</span>
                </div>
                <p style={{ fontSize: 12, color: '#888', marginTop: 2 }}>{item.category}</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              <button onClick={() => toggleAvailable(item.id)} style={{
                flex: 1,
                background: item.available ? '#f0f9f4' : '#f8f7f4',
                border: `1px solid ${item.available ? '#40916c' : '#ddd'}`,
                borderRadius: 10, padding: '8px',
                fontSize: 13, fontWeight: 600,
                color: item.available ? '#2d6a4f' : '#aaa',
                cursor: 'pointer'
              }}>
                {item.available ? '✅ זמין' : '⛔ לא זמין'}
              </button>
              <button onClick={() => setEditingItem(item)} style={{
                background: '#f5f2ec', border: '1px solid #e0dbd0',
                borderRadius: 10, padding: '8px 14px',
                fontSize: 13, cursor: 'pointer'
              }}>✏️ עריכה</button>
              <button onClick={() => deleteItem(item.id)} style={{
                background: '#fff5f5', border: '1px solid #ffd0d0',
                borderRadius: 10, padding: '8px 12px',
                fontSize: 13, cursor: 'pointer', color: '#c0392b'
              }}>🗑️</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ItemForm({ item, onSave, onCancel }) {
  const [form, setForm] = useState(item || {
    name: '', description: '', category: 'סלטים',
    price: '', available: true, emoji: '🥗',
    customizable: false, options: []
  });
  const [newOption, setNewOption] = useState('');

  const set = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  const addOption = () => {
    if (!newOption.trim()) return;
    set('options', [...(form.options || []), newOption.trim()]);
    setNewOption('');
  };

  const removeOption = (i) => {
    set('options', form.options.filter((_, idx) => idx !== i));
  };

  const handleSave = () => {
    if (!form.name || !form.price) {
      alert('יש למלא שם ומחיר');
      return;
    }
    onSave({ ...form, price: Number(form.price) });
  };

  return (
    <div style={{ padding: '20px 16px 100px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <button onClick={onCancel} style={{
          background: '#f5f2ec', border: 'none', borderRadius: 10,
          padding: '8px 14px', fontSize: 14, cursor: 'pointer'
        }}>← חזרה</button>
        <h2 style={{ fontSize: 18, fontWeight: 700 }}>{item ? 'עריכת מנה' : 'מנה חדשה'}</h2>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div>
          <label style={labelStyle}>אמוג'י</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 6 }}>
            {EMOJIS.map(e => (
              <button key={e} onClick={() => set('emoji', e)} style={{
                fontSize: 24, background: form.emoji === e ? '#f0f9f4' : '#f8f7f4',
                border: `2px solid ${form.emoji === e ? '#40916c' : 'transparent'}`,
                borderRadius: 10, padding: '6px 10px', cursor: 'pointer'
              }}>{e}</button>
            ))}
          </div>
        </div>

        <div>
          <label style={labelStyle}>שם המנה *</label>
          <input value={form.name} onChange={e => set('name', e.target.value)}
            placeholder="לדוגמה: סלט ירקות טרי"
            style={inputStyle} />
        </div>

        <div>
          <label style={labelStyle}>תיאור</label>
          <textarea value={form.description} onChange={e => set('description', e.target.value)}
            placeholder="רשימת מרכיבים..."
            style={{ ...inputStyle, height: 80, resize: 'none' }} />
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>קטגוריה</label>
            <select value={form.category} onChange={e => set('category', e.target.value)} style={inputStyle}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>מחיר (₪) *</label>
            <input type="number" value={form.price} onChange={e => set('price', e.target.value)}
              placeholder="0" style={inputStyle} />
          </div>
        </div>

        <div>
          <label style={{ ...labelStyle, display: 'flex', alignItems: 'center', gap: 10 }}>
            <input type="checkbox" checked={form.customizable}
              onChange={e => set('customizable', e.target.checked)}
              style={{ width: 18, height: 18, accentColor: '#2d6a4f' }} />
            <span>ניתן להתאמה אישית</span>
          </label>
        </div>

        {form.customizable && (
          <div>
            <label style={labelStyle}>אפשרויות התאמה</label>
            <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
              <input value={newOption} onChange={e => setNewOption(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addOption()}
                placeholder="לדוגמה: ללא בצל"
                style={{ ...inputStyle, flex: 1, marginBottom: 0 }} />
              <button onClick={addOption} style={{
                background: '#2d6a4f', color: '#fff', border: 'none',
                borderRadius: 10, padding: '0 16px', fontSize: 20, cursor: 'pointer'
              }}>+</button>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 10 }}>
              {(form.options || []).map((opt, i) => (
                <span key={i} style={{
                  background: '#f0f9f4', border: '1px solid #40916c',
                  borderRadius: 20, padding: '4px 12px', fontSize: 13,
                  color: '#2d6a4f', display: 'flex', alignItems: 'center', gap: 6
                }}>
                  {opt}
                  <button onClick={() => removeOption(i)} style={{
                    background: 'none', border: 'none', color: '#aaa',
                    cursor: 'pointer', padding: 0, fontSize: 14
                  }}>✕</button>
                </span>
              ))}
            </div>
          </div>
        )}

        <button onClick={handleSave} style={{
          background: '#2d6a4f', color: '#fff', border: 'none',
          borderRadius: 14, padding: '16px', fontSize: 16,
          fontWeight: 600, cursor: 'pointer', marginTop: 10
        }}>
          💾 שמור מנה
        </button>
      </div>
    </div>
  );
}

const labelStyle = {
  fontSize: 13, fontWeight: 600, color: '#555', display: 'block', marginBottom: 6
};

const inputStyle = {
  width: '100%', padding: '12px 14px',
  border: '1.5px solid #e0dbd0', borderRadius: 12,
  fontSize: 15, background: '#fafaf8', marginBottom: 0
};
