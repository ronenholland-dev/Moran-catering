import React, { useState } from 'react';

export default function Cart({ cart, updateQty, removeFromCart, sendOrder, onClose }) {
  const [name, setName] = useState('');
  const [step, setStep] = useState('cart');
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const handleSend = () => {
    if (!name.trim()) {
      alert('נא להזין שם לפני שליחת ההזמנה');
      return;
    }
    sendOrder(name);
    setStep('done');
  };

  if (step === 'done') {
    return (
      <div style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 300
      }}>
        <div style={{
          background: '#fff', borderRadius: 20, padding: '40px 30px',
          textAlign: 'center', margin: '0 20px'
        }}>
          <div style={{ fontSize: 60, marginBottom: 16 }}>✅</div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#2d6a4f', marginBottom: 8 }}>ההזמנה נשלחה!</h2>
          <p style={{ color: '#666', fontSize: 15, lineHeight: 1.6 }}>ההזמנה נשלחה למורן בוואטסאפ.<br />היא תאשר בקרוב 🥗</p>
          <button onClick={onClose} style={{
            marginTop: 24, background: '#2d6a4f', color: '#fff',
            border: 'none', borderRadius: 12, padding: '14px 32px',
            fontSize: 15, fontWeight: 600, cursor: 'pointer'
          }}>תודה! 💚</button>
        </div>
      </div>
    );
  }

  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
      display: 'flex', alignItems: 'flex-end', zIndex: 200
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: '#fff',
        borderRadius: '20px 20px 0 0',
        padding: '24px 20px 40px',
        width: '100%', maxWidth: 480, margin: '0 auto',
        maxHeight: '80vh', overflowY: 'auto'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700 }}>🛒 הסל שלי</h2>
          <button onClick={onClose} style={{
            background: '#f0ece4', border: 'none', borderRadius: 20,
            width: 32, height: 32, fontSize: 16, cursor: 'pointer'
          }}>✕</button>
        </div>

        {cart.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#aaa', padding: '30px 0' }}>הסל ריק</p>
        ) : (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
              {cart.map((item, i) => (
                <div key={i} style={{
                  background: '#f8f7f4', borderRadius: 14,
                  padding: '12px 14px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 15, fontWeight: 600 }}>{item.emoji} {item.name}</span>
                    <span style={{ fontSize: 14, fontWeight: 700, color: '#2d6a4f' }}>₪{item.price * item.qty}</span>
                  </div>
                  {item.selectedOptions?.length > 0 && (
                    <p style={{ fontSize: 12, color: '#40916c', marginTop: 4 }}>
                      {item.selectedOptions.join(' • ')}
                    </p>
                  )}
                  {item.note && (
                    <p style={{ fontSize: 12, color: '#888', marginTop: 2 }}>📝 {item.note}</p>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 10 }}>
                    <button onClick={() => updateQty(i, item.qty - 1)} style={{
                      background: '#e8e4dc', border: 'none', borderRadius: 8,
                      width: 28, height: 28, fontSize: 16, cursor: 'pointer'
                    }}>−</button>
                    <span style={{ fontSize: 15, fontWeight: 600, minWidth: 20, textAlign: 'center' }}>{item.qty}</span>
                    <button onClick={() => updateQty(i, item.qty + 1)} style={{
                      background: '#2d6a4f', color: '#fff', border: 'none', borderRadius: 8,
                      width: 28, height: 28, fontSize: 16, cursor: 'pointer'
                    }}>+</button>
                    <button onClick={() => removeFromCart(i)} style={{
                      background: 'transparent', border: 'none',
                      color: '#ccc', fontSize: 18, cursor: 'pointer', marginRight: 'auto'
                    }}>🗑️</button>
                  </div>
                </div>
              ))}
            </div>

            <div style={{
              background: '#f0f9f4', borderRadius: 14, padding: '14px 16px',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              marginBottom: 20
            }}>
              <span style={{ fontSize: 16, fontWeight: 600 }}>סה״כ</span>
              <span style={{ fontSize: 22, fontWeight: 700, color: '#2d6a4f' }}>₪{total}</span>
            </div>

            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="השם שלך"
              style={{
                width: '100%', padding: '14px 16px',
                border: '1.5px solid #e0dbd0', borderRadius: 12,
                fontSize: 15, marginBottom: 14, background: '#fafaf8'
              }}
            />

            <button onClick={handleSend} style={{
              width: '100%', background: '#25D366', color: '#fff',
              border: 'none', borderRadius: 14, padding: '16px',
              fontSize: 16, fontWeight: 700, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
            }}>
              <span>שלח הזמנה בוואטסאפ</span>
              <span style={{ fontSize: 20 }}>📱</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
}
