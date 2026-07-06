import React, { useState } from 'react';

// סדר הקטגוריות כאשר מוצגות כל המנות יחד (טאב "הכל")
const CATEGORY_ORDER = [
  'סלטים',
  'כריכים',
  'חמים וטעים',
  'פסטות',
  'עוף ובשר',
  'ממולאים',
  'מרקים',
  'תוספות',
  'עוגות/קינוחים',
  'מגשים'
];

const CATEGORIES = ['הכל', ...CATEGORY_ORDER];

function sortByCategoryOrder(items) {
  return [...items].sort((a, b) => {
    const aIndex = CATEGORY_ORDER.indexOf(a.category);
    const bIndex = CATEGORY_ORDER.indexOf(b.category);
    const aOrder = aIndex === -1 ? CATEGORY_ORDER.length : aIndex;
    const bOrder = bIndex === -1 ? CATEGORY_ORDER.length : bIndex;
    return aOrder - bOrder;
  });
}

export default function CustomerView({ menu, addToCart }) {
  const [activeCategory, setActiveCategory] = useState('הכל');
  const [selectedItem, setSelectedItem] = useState(null);

  const filtered = activeCategory === 'הכל'
    ? sortByCategoryOrder(menu)
    : menu.filter(i => i.category === activeCategory);

  return (
    <div style={{ padding: '0 0 100px' }}>
      <div style={{
        background: 'linear-gradient(135deg, #2d6a4f 0%, #40916c 100%)',
        padding: '24px 20px 32px',
        color: '#fff'
      }}>
        <p style={{ fontSize: 15, opacity: 0.9, lineHeight: 1.6 }}>
          בחרי מה תרצי, ונשלח את ההזמנה ישירות למורן 💚
        </p>
      </div>

      <div style={{
        display: 'flex',
        gap: 8,
        padding: '16px 20px',
        overflowX: 'auto',
        background: '#fff',
        borderBottom: '1px solid #f0ece4'
      }}>
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setActiveCategory(cat)} style={{
            background: activeCategory === cat ? '#2d6a4f' : '#f5f2ec',
            color: activeCategory === cat ? '#fff' : '#555',
            border: 'none',
            borderRadius: 20,
            padding: '8px 18px',
            fontSize: 14,
            fontWeight: activeCategory === cat ? 600 : 400,
            whiteSpace: 'nowrap',
            cursor: 'pointer'
          }}>
            {cat}
          </button>
        ))}
      </div>

      <div style={{ padding: '16px 16px' }}>
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#aaa' }}>
            <p style={{ fontSize: 40 }}>🍽️</p>
            <p style={{ marginTop: 12 }}>אין מנות זמינות כרגע</p>
          </div>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtered.map(item => (
            <MenuCard key={item.id} item={item} onAdd={() => {
              if (item.customizable && item.options.length > 0) {
                setSelectedItem(item);
              } else {
                addToCart(item, '', []);
              }
            }} />
          ))}
        </div>
      </div>

      {selectedItem && (
        <CustomizeModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onAdd={(note, opts) => {
            addToCart(selectedItem, note, opts);
            setSelectedItem(null);
          }}
        />
      )}
    </div>
  );
}

function MenuCard({ item, onAdd }) {
  return (
    <div style={{
      background: '#fff',
      border: '1px solid #f0ece4',
      borderRadius: 16,
      padding: '16px',
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      boxShadow: '0 1px 4px rgba(0,0,0,0.04)'
    }}>
      <div style={{
        width: 64, height: 64,
        background: '#f5f2ec',
        borderRadius: 14,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 32, flexShrink: 0
      }}>
        {item.emoji}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: '#1a1a1a' }}>{item.name}</h3>
          <span style={{ fontSize: 15, fontWeight: 700, color: '#2d6a4f' }}>₪{item.price}</span>
        </div>
        <p style={{ fontSize: 13, color: '#888', marginTop: 4, lineHeight: 1.5 }}>{item.description}</p>
        {item.customizable && (
          <p style={{ fontSize: 11, color: '#40916c', marginTop: 4 }}>✨ ניתן להתאים אישית</p>
        )}
      </div>
      <button onClick={onAdd} style={{
        background: '#2d6a4f',
        color: '#fff',
        border: 'none',
        borderRadius: 12,
        width: 36, height: 36,
        fontSize: 22,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
        cursor: 'pointer'
      }}>+</button>
    </div>
  );
}

function CustomizeModal({ item, onClose, onAdd }) {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [note, setNote] = useState('');

  const toggleOption = (opt) => {
    setSelectedOptions(prev =>
      prev.includes(opt) ? prev.filter(o => o !== opt) : [...prev, opt]
    );
  };

  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0,
      background: 'rgba(0,0,0,0.4)',
      display: 'flex', alignItems: 'flex-end',
      zIndex: 200
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: '#fff',
        borderRadius: '20px 20px 0 0',
        padding: '24px 20px 40px',
        width: '100%',
        maxWidth: 480,
        margin: '0 auto'
      }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>{item.emoji} {item.name}</h2>
        <p style={{ fontSize: 13, color: '#888', marginBottom: 20 }}>התאמה אישית</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
          {item.options.map(opt => (
            <label key={opt} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '12px 16px',
              background: selectedOptions.includes(opt) ? '#f0f9f4' : '#f8f7f4',
              border: `1.5px solid ${selectedOptions.includes(opt) ? '#40916c' : '#e8e4dc'}`,
              borderRadius: 12, cursor: 'pointer'
            }}>
              <input
                type="checkbox"
                checked={selectedOptions.includes(opt)}
                onChange={() => toggleOption(opt)}
                style={{ accentColor: '#2d6a4f', width: 18, height: 18 }}
              />
              <span style={{ fontSize: 15 }}>{opt}</span>
            </label>
          ))}
        </div>

        <textarea
          value={note}
          onChange={e => setNote(e.target.value)}
          placeholder="הערות נוספות (אופציונלי)"
          style={{
            width: '100%', padding: '12px 14px',
            border: '1px solid #e0dbd0', borderRadius: 12,
            fontSize: 14, resize: 'none', height: 80,
            marginBottom: 16, background: '#fafaf8'
          }}
        />

        <button onClick={() => onAdd(note, selectedOptions)} style={{
          width: '100%', background: '#2d6a4f', color: '#fff',
          border: 'none', borderRadius: 14, padding: '16px',
          fontSize: 16, fontWeight: 600, cursor: 'pointer'
        }}>
          הוסף לסל 🛒
        </button>
      </div>
    </div>
  );
}
