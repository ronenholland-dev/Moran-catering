import React, { useState, useEffect } from 'react';
import CustomerView from './components/CustomerView';
import AdminView from './components/AdminView';
import Cart from './components/Cart';

const STORAGE_KEY = 'moran_menu_v1';
const MORAN_WHATSAPP = '972544441436';

const defaultMenu = [
  {
    id: 1,
    name: 'סלט ירקות טרי',
    description: 'עגבנייה, מלפפון, פלפל, בצל סגול, עשבי תיבול ולימון',
    category: 'סלטים',
    price: 35,
    available: true,
    emoji: '🥗',
    customizable: true,
    options: ['ללא בצל', 'ללא פלפל', 'עם גבינה פטה', 'ללא ירוקים']
  },
  {
    id: 2,
    name: 'סלט יווני',
    description: 'מלפפון, עגבנייה, זיתים, גבינת פטה, שמן זית',
    category: 'סלטים',
    price: 42,
    available: true,
    emoji: '🫒',
    customizable: true,
    options: ['ללא פטה', 'ללא זיתים', 'עם רוקט']
  },
  {
    id: 3,
    name: 'קיש גבינות',
    description: 'בצק פריך, שלוש גבינות, ביצים וירקות עונתיים',
    category: 'קישים',
    price: 55,
    available: true,
    emoji: '🥧',
    customizable: false,
    options: []
  },
  {
    id: 4,
    name: 'קיש תרד ובטטה',
    description: 'תרד טרי, בטטה צלויה, ביצים, שמנת',
    category: 'קישים',
    price: 55,
    available: true,
    emoji: '🥧',
    customizable: false,
    options: []
  }
];

export default function App() {
  const [view, setView] = useState('customer');
  const [menu, setMenu] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : defaultMenu;
    } catch {
      return defaultMenu;
    }
  });
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(menu));
  }, [menu]);

  const addToCart = (item, note = '', selectedOptions = []) => {
    setCart(prev => {
      const existing = prev.find(c => c.id === item.id && c.note === note && JSON.stringify(c.selectedOptions) === JSON.stringify(selectedOptions));
      if (existing) {
        return prev.map(c => c.id === item.id && c.note === note ? { ...c, qty: c.qty + 1 } : c);
      }
      return [...prev, { ...item, qty: 1, note, selectedOptions }];
    });
    setShowCart(true);
    setTimeout(() => setShowCart(false), 2000);
  };

  const removeFromCart = (index) => {
    setCart(prev => prev.filter((_, i) => i !== index));
  };

  const updateQty = (index, qty) => {
    if (qty < 1) {
      removeFromCart(index);
      return;
    }
    setCart(prev => prev.map((item, i) => i === index ? { ...item, qty } : item));
  };

  const sendOrder = (customerName) => {
    const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    let msg = `🥗 הזמנה חדשה!\n\nשם: ${customerName}\n\n`;
    cart.forEach(item => {
      msg += `• ${item.emoji} ${item.name} x${item.qty}`;
      if (item.selectedOptions?.length) msg += ` (${item.selectedOptions.join(', ')})`;
      if (item.note) msg += `\n  📝 ${item.note}`;
      msg += ` — ₪${item.price * item.qty}\n`;
    });
    msg += `\n💰 סה"כ: ₪${total}`;
    const encoded = encodeURIComponent(msg);
    window.open(`https://wa.me/${MORAN_WHATSAPP}?text=${encoded}`, '_blank');
    setCart([]);
  };

  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0);

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', minHeight: '100vh', background: '#fff', position: 'relative' }}>
      <Header view={view} setView={setView} cartCount={cartCount} onCartClick={() => setShowCart(true)} />
      {view === 'customer' ? (
        <CustomerView menu={menu.filter(i => i.available)} addToCart={addToCart} />
      ) : (
        <AdminView menu={menu} setMenu={setMenu} defaultMenu={defaultMenu} />
      )}
      {showCart && cartCount > 0 && view === 'customer' && (
        <Cart
          cart={cart}
          updateQty={updateQty}
          removeFromCart={removeFromCart}
          sendOrder={sendOrder}
          onClose={() => setShowCart(false)}
        />
      )}
    </div>
  );
}

function Header({ view, setView, cartCount, onCartClick }) {
  return (
    <header style={{
      background: '#fff',
      borderBottom: '1px solid #f0ece4',
      padding: '16px 20px',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <img
          src={process.env.PUBLIC_URL + '/images/chef-logo.jpeg'}
          alt="מורן COOKING"
          style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
        />
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: '#2d6a4f' }}>מורן COOKING</h1>
          <p style={{ fontSize: 12, color: '#888', marginTop: 2 }}>אוכל טעים ובריא</p>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        {view === 'customer' && (
          <button onClick={onCartClick} style={{
            background: cartCount > 0 ? '#2d6a4f' : '#f0ece4',
            color: cartCount > 0 ? '#fff' : '#888',
            border: 'none',
            borderRadius: 20,
            padding: '8px 16px',
            fontSize: 14,
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            transition: 'all 0.2s'
          }}>
            🛒 {cartCount > 0 ? cartCount : ''}
          </button>
        )}
        <button onClick={() => setView(view === 'customer' ? 'admin' : 'customer')} style={{
          background: 'transparent',
          border: '1px solid #e0dbd0',
          borderRadius: 20,
          padding: '6px 14px',
          fontSize: 13,
          color: '#666'
        }}>
          {view === 'customer' ? '⚙️ ניהול' : '← תפריט'}
        </button>
      </div>
    </header>
  );
}
