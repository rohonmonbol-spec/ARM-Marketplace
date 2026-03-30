import { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useParams, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  Store, 
  User, 
  Search, 
  Star, 
  TrendingUp, 
  LayoutDashboard, 
  PlusCircle, 
  Package, 
  LogOut,
  MapPin,
  ChevronDown
} from 'lucide-react';
import { motion } from 'framer-motion';

// --- TYPES ---
export interface Product {
  id: string;
  name: string;
  price: number;
  sellerId: string;
  sellerName: string;
  category: string;
  image: string;
  rating: number;
  reviews: Review[];
  description: string;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

interface UserProfile {
  id: string;
  name: string;
  role: 'buyer' | 'seller';
  location: string;
}

interface AppContextType {
  products: Product[];
  user: UserProfile | null;
  location: string;
  cart: {id: string, qty: number}[];
  addToCart: (pid: string) => void;
  removeFromCart: (pid: string) => void;
  addReview: (pid: string, review: Review) => void;
  addProduct: (p: Product) => void;
  updateProduct: (p: Product) => void;
  deleteProduct: (pid: string) => void;
  setUser: (u: UserProfile | null) => void;
  setLocation: (loc: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within an AppProvider');
  return context;
};

// --- MOCK DATA ---
const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Camera Drone',
    price: 74999,
    sellerId: 's1',
    sellerName: 'Nebula Tech',
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1507582020474-9a35b7d455d9?auto=format&fit=crop&q=80&w=400',
    rating: 4.8,
    reviews: [{ id: 'r1', userId: 'u1', userName: 'Alex', rating: 5, comment: 'Amazing flight stability!', date: '2024-03-10' }],
    description: 'A professional drone that records in 8K.'
  },
  {
    id: '2',
    name: 'Bamboo Lamp',
    price: 3999,
    sellerId: 's2',
    sellerName: 'GreenLiving',
    category: 'Home Decor',
    image: 'https://images.unsplash.com/photo-1534073828943-f801091bb18c?auto=format&fit=crop&q=80&w=400',
    rating: 4.5,
    reviews: [],
    description: 'Hand-made bamboo lamp for your home.'
  },
  {
    id: '3',
    name: 'Pocket Tool',
    price: 9999,
    sellerId: 's1',
    sellerName: 'Nebula Tech',
    category: 'Tools',
    image: 'https://images.unsplash.com/photo-1531844251246-9a1bfaae0d74?auto=format&fit=crop&q=80&w=400',
    rating: 4.9,
    reviews: [],
    description: 'A strong titanium tool for daily use.'
  },
  {
    id: '4',
    name: 'Wool Blanket',
    price: 5999,
    sellerId: 's3',
    sellerName: 'Arctic Loom',
    category: 'Textiles',
    image: 'https://images.unsplash.com/photo-1580301762395-21ce84d00bc6?auto=format&fit=crop&q=80&w=400',
    rating: 4.7,
    reviews: [],
    description: 'Soft wool blanket made from organic wool.'
  }
];

// --- PAGES ---

const Home = () => {
  const { products } = useAppContext();
  return (
    <div className="container" style={{ padding: '4rem 0' }}>
      <header style={{ marginBottom: '5rem', textAlign: 'center', position: 'relative' }}>
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h1 className="gradient-text" style={{ fontSize: '4.5rem', marginBottom: '1.5rem', lineHeight: 1 }}>
            India's Best <br /> Online Marketplace
          </h1>
          <p style={{ color: 'var(--text-dim)', fontSize: '1.4rem', maxWidth: '700px', margin: '0 auto 3rem' }}>
            Buy great products from our trusted sellers. Good quality, safe payment, fast delivery.
          </p>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          style={{ display: 'flex', justifyContent: 'center' }}
        >
          <div className="glass-card" style={{ display: 'flex', alignItems: 'center', padding: '0.5rem 1rem', width: '100%', maxWidth: '700px', borderRadius: '40px', background: 'rgba(255,255,255,0.05)' }}>
            <Search size={24} color="var(--primary)" style={{ marginLeft: '1rem' }} />
            <input 
              type="text" 
              placeholder="What are you looking for?" 
              style={{ background: 'transparent', border: 'none', color: 'white', padding: '1rem', width: '100%', outline: 'none', fontSize: '1.1rem' }} 
            />
            <button className="btn-primary" style={{ padding: '0.8rem 2rem', borderRadius: '30px' }}>Search</button>
          </div>
        </motion.div>

        {/* Floating background blobs */}
        <div className="orbit" style={{ top: '-100px', left: '-100px', width: '400px', height: '400px', opacity: 0.3 }} />
        <div className="orbit" style={{ bottom: '-100px', right: '-100px', background: 'radial-gradient(circle, var(--secondary) 0%, transparent 70%)', opacity: 0.2 }} />
      </header>

      <motion.div 
        className="product-grid"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{
          visible: { transition: { staggerChildren: 0.1 } },
          hidden: {}
        }}
      >
        {products.map(p => (
          <motion.div 
            key={p.id} 
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 }
            }}
            whileHover={{ y: -12, scale: 1.02 }}
            className="glass-card" 
            style={{ padding: 0, position: 'relative' }}
          >
            <div style={{ position: 'relative', height: '240px', overflow: 'hidden' }}>
              <motion.div 
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.6 }}
                style={{ height: '100%', width: '100%', background: `url(${p.image}) center/cover` }} 
              />
              <div style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(10px)', color: 'white', padding: '0.4rem 1rem', borderRadius: '20px', fontSize: '0.9rem', fontWeight: 700 }}>
                ₹{p.price}
              </div>
            </div>
            
            <div style={{ padding: '2rem' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--accent)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>{p.category}</div>
              <h3 style={{ fontSize: '1.4rem', marginBottom: '0.75rem' }}>{p.name}</h3>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '1.5rem' }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} fill={i < Math.floor(p.rating) ? "var(--primary)" : "transparent"} stroke="var(--primary)" />
                ))}
                <span style={{ marginLeft: '8px', color: 'var(--text-dim)', fontSize: '0.9rem' }}>({p.rating})</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '2rem' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--accent))' }} />
                <span style={{ fontSize: '0.9rem', color: 'var(--text-dim)' }}>Seller: <b style={{ color: 'white' }}>{p.sellerName}</b></span>
              </div>
              
              <Link to={`/product/${p.id}`} className="btn-primary" style={{ display: 'block', textAlign: 'center', textDecoration: 'none', borderRadius: '14px', padding: '1rem' }}>
                View Product
              </Link>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

const LoginPage = () => {
  const { setUser, setLocation } = useAppContext();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [userLoc, setUserLoc] = useState('New York, USA');
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setUser({ id: 'u1', name: name || email.split('@')[0], role: 'buyer', location: userLoc });
    setLocation(userLoc);
    navigate('/');
  };

  return (
    <div className="container" style={{ display: 'flex', justifyContent: 'center', padding: '10rem 0', position: 'relative' }}>
      <motion.div 
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="glass-card" 
        style={{ width: '100%', maxWidth: '480px', padding: '3.5rem' }}
      >
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>Welcome Back!</h2>
          <p style={{ color: 'var(--text-dim)' }}>Login to continue shopping.</p>
        </div>
        
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <label style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-dim)', marginLeft: '0.25rem' }}>Full Name</label>
            <input 
              type="text" required value={name} onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name" className="input-premium"
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <label style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-dim)', marginLeft: '0.25rem' }}>Email Address</label>
            <input 
              type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com" className="input-premium"
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <label style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-dim)', marginLeft: '0.25rem' }}>Location</label>
            <input 
              type="text" required value={userLoc} onChange={(e) => setUserLoc(e.target.value)}
              placeholder="City, Country" className="input-premium"
            />
          </div>
          <button type="submit" className="btn-primary" style={{ marginTop: '1rem', padding: '1.25rem' }}>
            Login
          </button>
        </form>
        
        <div style={{ marginTop: '2.5rem', textAlign: 'center', color: 'var(--text-dim)', fontSize: '0.95rem' }}>
          New here? <Link to="/signup" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 700 }}>Create Account</Link>
        </div>
      </motion.div>
      <div className="orbit" style={{ top: '20%', left: '10%', width: '300px', height: '300px', opacity: 0.2 }} />
    </div>
  );
};

const SignupPage = () => {
  const { setUser, setLocation } = useAppContext();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [userLoc, setUserLoc] = useState('New York, USA');
  
  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setUser({ id: 'sNew', name: name || 'New User', role: 'seller', location: userLoc });
    setLocation(userLoc);
    navigate('/seller');
  };

  return (
    <div className="container" style={{ display: 'flex', justifyContent: 'center', padding: '10rem 0', position: 'relative' }}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="glass-card" 
        style={{ width: '100%', maxWidth: '480px', padding: '3.5rem' }}
      >
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>Become a Seller</h2>
          <p style={{ color: 'var(--text-dim)' }}>Sell your products and earn money easily.</p>
        </div>
        
        <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <label style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-dim)' }}>Full Name</label>
            <input 
              type="text" required value={name} onChange={(e) => setName(e.target.value)}
              placeholder="John Doe" className="input-premium"
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <label style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-dim)' }}>Email Address</label>
            <input 
              type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com" className="input-premium"
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <label style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-dim)' }}>Base Location</label>
            <input 
              type="text" required value={userLoc} onChange={(e) => setUserLoc(e.target.value)}
              placeholder="City, Country" className="input-premium"
            />
          </div>
          <button type="submit" className="btn-primary" style={{ marginTop: '1rem', padding: '1.25rem' }}>
            Create Account
          </button>
        </form>
        <p style={{ marginTop: '2.5rem', textAlign: 'center', color: 'var(--text-dim)', fontSize: '0.95rem' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 700 }}>Login</Link>
        </p>
      </motion.div>
      <div className="orbit" style={{ bottom: '10%', right: '5%', width: '400px', height: '400px', opacity: 0.1, background: 'radial-gradient(circle, var(--accent) 0%, transparent 70%)' }} />
    </div>
  );
};
const SellerDashboard = () => {
  const { user, products, setUser, addProduct, updateProduct, deleteProduct, location } = useAppContext();
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<Partial<Product>>({});
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'earnings'>('dashboard');

  if (user?.role !== 'seller') {
    return (
      <div className="container" style={{ padding: '10rem 0', textAlign: 'center' }}>
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card" 
          style={{ maxWidth: '600px', margin: '0 auto', padding: '5rem' }}
        >
          <Store size={64} style={{ color: 'var(--primary)', marginBottom: '2.5rem' }} />
          <h2 style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>Start Selling</h2>
          <p style={{ color: 'var(--text-dim)', fontSize: '1.2rem', marginBottom: '3.5rem' }}>List your products and start earning money today.</p>
          <button onClick={() => setUser({ id: 's1', name: 'Nebula Tech', role: 'seller', location: location })} className="btn-primary" style={{ padding: '1.25rem 3rem' }}>
            Start Selling
          </button>
        </motion.div>
      </div>
    );
  }

  const sellerProducts = products.filter(p => p.sellerId === user.id);
  const totalRevenue = sellerProducts.reduce((sum, p) => sum + p.price * 0.95, 0);
  const totalProducts = sellerProducts.length;

  const openForm = (p?: Product) => {
    if (p) {
      setEditingProduct(p);
      setFormData(p);
    } else {
      setEditingProduct(null);
      setFormData({
        id: Math.random().toString(36).substr(2, 9),
        sellerId: user.id,
        sellerName: user.name,
        category: 'Electronics',
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=400',
        rating: 5,
        reviews: [],
        price: 7999,
        description: ''
      });
      setIsAdding(true);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const finalProduct = formData as Product;
    if (editingProduct) {
      updateProduct(finalProduct);
    } else {
      addProduct(finalProduct);
    }
    setEditingProduct(null);
    setIsAdding(false);
    setActiveTab('products');
  };

  const sidebarItems = [
    { icon: <LayoutDashboard size={22} />, label: 'Dashboard', key: 'dashboard' as const },
    { icon: <Package size={22} />, label: 'My Products', key: 'products' as const },
    { icon: <TrendingUp size={22} />, label: 'Earnings', key: 'earnings' as const }
  ];

  return (
    <div className="container stager-in" style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '4rem', padding: '6rem 0' }}>
      {/* Product Add/Edit Modal */}
      {(editingProduct || isAdding) && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(2, 6, 23, 0.95)', zIndex: 2000, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '2rem', backdropFilter: 'blur(20px)' }}>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card" 
            style={{ width: '100%', maxWidth: '650px', padding: '4rem', background: 'var(--bg-main)', maxHeight: '90vh', overflowY: 'auto' }}
          >
            <h3 style={{ fontSize: '2.5rem', marginBottom: '3rem' }}>{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {/* Product Image */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <label style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-dim)' }}>Product Photo</label>
                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
                  <div style={{ 
                    width: '120px', height: '120px', borderRadius: '16px', overflow: 'hidden',
                    border: '2px dashed var(--border-color)', flexShrink: 0,
                    backgroundColor: 'rgba(255,255,255,0.03)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    {formData.image ? (
                      <img src={formData.image} alt="Product Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <Package size={32} style={{ color: 'var(--text-muted)', opacity: 0.3 }} />
                    )}
                  </div>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <input 
                      type="url" value={formData.image || ''} 
                      onChange={e => setFormData({...formData, image: e.target.value})}
                      className="input-premium"
                      placeholder="Paste image URL here..."
                      style={{ fontSize: '0.9rem' }}
                    />
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Paste a link to your product image (e.g. from Unsplash, Imgur, etc.)</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <label style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-dim)' }}>Product Name</label>
                <input 
                  type="text" required value={formData.name || ''} 
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="input-premium"
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <label style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-dim)' }}>Price (₹)</label>
                  <input 
                    type="number" step="0.01" required value={formData.price || ''} 
                    onChange={e => setFormData({...formData, price: parseFloat(e.target.value)})}
                    className="input-premium"
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <label style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-dim)' }}>Category</label>
                  <select 
                    value={formData.category || ''} 
                    onChange={e => setFormData({...formData, category: e.target.value})}
                    className="input-premium"
                  >
                    <option value="Electronics">Electronics</option>
                    <option value="Home Decor">Home Decor</option>
                    <option value="Tools">Tools</option>
                    <option value="Textiles">Textiles</option>
                    <option value="Fashion">Fashion</option>
                    <option value="Books">Books</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <label style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-dim)' }}>Product Description</label>
                <textarea 
                  required value={formData.description || ''} 
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  className="input-premium"
                  rows={4}
                  style={{ resize: 'none' }}
                />
              </div>
              <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1rem' }}>
                 <button type="button" onClick={() => { setEditingProduct(null); setIsAdding(false); }} style={{ flex: 1, padding: '1.25rem', background: 'transparent', color: 'white', border: '1px solid var(--border-color)', borderRadius: '16px', fontWeight: 700 }}>Cancel</button>
                 <button type="submit" className="btn-primary" style={{ flex: 1 }}>Save Product</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Sidebar */}
      <aside>
        <div className="glass-card" style={{ padding: '2.5rem', position: 'sticky', top: '120px', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {sidebarItems.map((item, i) => (
            <motion.div 
              key={i}
              whileHover={{ x: 10 }}
              onClick={() => setActiveTab(item.key)}
              style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: activeTab === item.key ? 'var(--primary)' : 'var(--text-dim)', cursor: 'pointer', fontWeight: activeTab === item.key ? 800 : 600, fontSize: '1.1rem' }}
            >
              {item.icon} <span>{item.label}</span>
            </motion.div>
          ))}
          <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '0.5rem 0' }} />
          <div onClick={() => setUser(null)} style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#ff4b4b', cursor: 'pointer', fontWeight: 800, fontSize: '1.1rem' }}>
            <LogOut size={22} /> <span>Logout</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main>
        <motion.div 
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '4rem' }}
        >
          <div>
            <h2 style={{ fontSize: '3.5rem', marginBottom: '0.5rem' }}>
              {activeTab === 'dashboard' && 'Seller Dashboard'}
              {activeTab === 'products' && 'My Products'}
              {activeTab === 'earnings' && 'My Earnings'}
            </h2>
            <p style={{ color: 'var(--text-dim)', fontSize: '1.2rem' }}>Hello, <span style={{ color: 'white', fontWeight: 800 }}>{user.name}</span>! Your business is growing.</p>
          </div>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => openForm()} 
            className="btn-primary" 
            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1.25rem 2.5rem' }}
          >
            <PlusCircle size={22} /> Add New Product
          </motion.button>
        </motion.div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '2rem', marginBottom: '4rem' }}>
              <div className="glass-card" style={{ padding: '2.5rem', textAlign: 'center' }}>
                <Package size={32} style={{ color: 'var(--primary)', marginBottom: '1rem' }} />
                <div style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '0.5rem' }}>{totalProducts}</div>
                <div style={{ color: 'var(--text-dim)', fontSize: '0.95rem' }}>Total Products</div>
              </div>
              <div className="glass-card" style={{ padding: '2.5rem', textAlign: 'center' }}>
                <TrendingUp size={32} style={{ color: '#4ade80', marginBottom: '1rem' }} />
                <div style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '0.5rem' }}>₹{totalRevenue.toFixed(0)}</div>
                <div style={{ color: 'var(--text-dim)', fontSize: '0.95rem' }}>Total Earnings</div>
              </div>
              <div className="glass-card" style={{ padding: '2.5rem', textAlign: 'center' }}>
                <Star size={32} style={{ color: 'var(--accent)', marginBottom: '1rem' }} />
                <div style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '0.5rem' }}>
                  {totalProducts > 0 ? (sellerProducts.reduce((s, p) => s + p.rating, 0) / totalProducts).toFixed(1) : '0'}
                </div>
                <div style={{ color: 'var(--text-dim)', fontSize: '0.95rem' }}>Average Rating</div>
              </div>
            </div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '2rem', color: 'var(--text-dim)' }}>Recent Products</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
              {sellerProducts.slice(0, 4).map(p => (
                <div key={p.id} className="glass-card" style={{ display: 'flex', gap: '1.5rem', padding: '1.5rem', alignItems: 'center' }}>
                  <div style={{ width: '60px', height: '60px', background: `url(${p.image}) center/cover`, borderRadius: '12px', flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, marginBottom: '0.3rem' }}>{p.name}</div>
                    <div style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>₹{p.price} · {p.category}</div>
                  </div>
                  <span style={{ color: '#4ade80', fontSize: '0.75rem', background: 'rgba(74,222,128,0.1)', padding: '4px 12px', borderRadius: '20px', fontWeight: 700 }}>Active</span>
                </div>
              ))}
              {totalProducts === 0 && (
                <div className="glass-card" style={{ gridColumn: '1 / -1', padding: '5rem', textAlign: 'center', color: 'var(--text-dim)' }}>
                  No products yet. Click "Add New Product" to get started!
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* My Products Tab */}
        {activeTab === 'products' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--border-color)' }}>
                    <th style={{ padding: '2rem' }}>Product</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Earnings</th>
                    <th style={{ paddingRight: '2rem' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sellerProducts.length > 0 ? sellerProducts.map(p => (
                    <tr key={p.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '2rem' }}>
                         <div style={{ width: '60px', height: '60px', background: `url(${p.image}) center/cover`, borderRadius: '14px', border: '1px solid var(--border-color)' }} />
                         <div>
                            <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>{p.name}</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>ID: {p.id}</div>
                         </div>
                      </td>
                      <td style={{ fontWeight: 800, fontSize: '1.1rem' }}>₹{p.price.toFixed(2)}</td>
                      <td><span style={{ color: '#4ade80', fontSize: '0.8rem', background: 'rgba(74,222,128,0.1)', padding: '6px 16px', borderRadius: '30px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>Active</span></td>
                      <td style={{ color: 'var(--accent)', fontWeight: 800 }}>₹{(p.price * 0.95).toFixed(2)}</td>
                      <td style={{ paddingRight: '2rem' }}>
                        <div style={{ display: 'flex', gap: '1.5rem' }}>
                          <button onClick={() => openForm(p)} style={{ background: 'transparent', color: 'var(--primary)', fontWeight: 800, fontSize: '0.9rem' }}>Edit</button>
                          <button onClick={() => deleteProduct(p.id)} style={{ background: 'transparent', color: '#ff4b4b', fontWeight: 800, fontSize: '0.9rem' }}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                       <td colSpan={5} style={{ padding: '10rem 0', textAlign: 'center', color: 'var(--text-dim)' }}>
                         <Package size={80} style={{ opacity: 0.05, marginBottom: '2rem' }} />
                         <p style={{ fontSize: '1.1rem' }}>No products yet. Add your first product!</p>
                       </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Earnings Tab */}
        {activeTab === 'earnings' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '4rem' }}>
              <div className="glass-card" style={{ padding: '3rem' }}>
                <div style={{ color: 'var(--text-dim)', fontSize: '0.9rem', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}>Total Sales Revenue</div>
                <div style={{ fontSize: '3rem', fontWeight: 900 }}>₹{(totalRevenue * 1.05).toFixed(2)}</div>
                <div style={{ color: 'var(--text-dim)', fontSize: '0.9rem', marginTop: '0.5rem' }}>From {totalProducts} products</div>
              </div>
              <div className="glass-card" style={{ padding: '3rem' }}>
                <div style={{ color: 'var(--text-dim)', fontSize: '0.9rem', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}>Your Earnings (95%)</div>
                <div style={{ fontSize: '3rem', fontWeight: 900, color: '#4ade80' }}>₹{totalRevenue.toFixed(2)}</div>
                <div style={{ color: 'var(--text-dim)', fontSize: '0.9rem', marginTop: '0.5rem' }}>After 5% platform fee</div>
              </div>
            </div>
            
            <h3 style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>Earnings by Product</h3>
            <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
              {sellerProducts.length > 0 ? sellerProducts.map((p, i) => (
                <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem 2rem', borderBottom: i < sellerProducts.length - 1 ? '1px solid var(--border-color)' : 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <div style={{ width: '45px', height: '45px', background: `url(${p.image}) center/cover`, borderRadius: '10px' }} />
                    <div>
                      <div style={{ fontWeight: 700 }}>{p.name}</div>
                      <div style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>{p.category} · ₹{p.price}</div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 800, color: '#4ade80' }}>₹{(p.price * 0.95).toFixed(2)}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>your share</div>
                  </div>
                </div>
              )) : (
                <div style={{ padding: '5rem', textAlign: 'center', color: 'var(--text-dim)' }}>
                  No earnings yet. Start by adding products!
                </div>
              )}
            </div>

            <div className="glass-card" style={{ marginTop: '2rem', padding: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(74, 222, 128, 0.05)' }}>
              <div>
                <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>Platform Fee</div>
                <div style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>5% is deducted from each sale</div>
              </div>
              <div style={{ fontWeight: 800, color: 'var(--accent)', fontSize: '1.2rem' }}>₹{(totalRevenue * 0.05 / 0.95).toFixed(2)}</div>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
};


// ... CartView ...

// ... MAIN APP ...

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { products, addToCart, addReview, user } = useAppContext();
  const navigate = useNavigate();
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(5);
  
  const product = products.find(p => p.id === id);

  if (!product) return <div className="container" style={{ padding: '10rem 2rem', textAlign: 'center' }}><h2>Product not found</h2><Link to="/" style={{ color: 'var(--primary)' }}>Back to Home</Link></div>;

  const handleBuyNow = () => {
    addToCart(product.id);
    navigate('/cart');
  };

  const submitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert("Please sign in to leave a review.");
      return;
    }
    const review: Review = {
      id: Math.random().toString(36).substr(2, 9),
      userId: user.id,
      userName: user.name,
      rating: newRating,
      comment: newComment,
      date: new Date().toISOString().split('T')[0]
    };
    addReview(product.id, review);
    setNewComment('');
  };

  return (
    <div className="container" style={{ padding: '6rem 0' }}>
      <motion.button 
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => navigate(-1)} 
        style={{ background: 'transparent', color: 'var(--text-dim)', marginBottom: '3rem', display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1rem', fontWeight: 600 }}
      >
        <TrendingUp size={20} style={{ transform: 'rotate(-90deg)' }} /> Back
      </motion.button>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '6rem' }}>
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="glass-card" 
          style={{ padding: 0, height: '700px', position: 'relative' }}
        >
           <img src={product.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={product.name} />
           <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 60%, rgba(2, 6, 23, 0.8))' }} />
        </motion.div>
        
        <motion.div
           initial={{ opacity: 0, x: 30 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ delay: 0.2, duration: 0.8 }}
        >
          <div style={{ color: 'var(--accent)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '1.5rem', fontSize: '0.9rem' }}>{product.category}</div>
          <h1 style={{ fontSize: '3.5rem', lineHeight: 1, marginBottom: '2rem' }} className="gradient-text">{product.name}</h1>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
               <Star size={24} fill="var(--primary)" stroke="var(--primary)" />
               <span style={{ fontWeight: 800, fontSize: '1.5rem' }}>{product.rating}</span>
            </div>
            <div style={{ width: '1px', height: '30px', background: 'var(--border-color)' }} />
            <div style={{ color: 'var(--text-dim)', fontSize: '1.1rem' }}>{product.reviews.length} authentic reviews</div>
          </div>

          <div style={{ fontSize: '3.5rem', fontWeight: 900, marginBottom: '3rem', letterSpacing: '-2px' }}>₹{product.price.toFixed(2)}</div>
          
          <p style={{ color: 'var(--text-dim)', fontSize: '1.25rem', marginBottom: '4rem', lineHeight: 1.8 }}>{product.description}</p>
          
          <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '4rem' }}>
             <motion.button 
               whileHover={{ scale: 1.02 }}
               whileTap={{ scale: 0.98 }}
               onClick={() => addToCart(product.id)} 
               style={{ flex: 1, padding: '1.5rem', background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid var(--border-color)', borderRadius: '16px', fontWeight: 700, fontSize: '1.1rem' }}
             >
               Add to Cart
             </motion.button>
             <motion.button 
               whileHover={{ scale: 1.02 }}
               whileTap={{ scale: 0.98 }}
               onClick={handleBuyNow} 
               className="btn-primary" 
               style={{ flex: 1, padding: '1.5rem', fontSize: '1.1rem' }}
             >
               Buy Now
             </motion.button>
          </div>

          <div className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem 2rem', background: 'rgba(99, 102, 241, 0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--accent))' }} />
              <div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '1px' }}>Curated by</div>
                <div style={{ fontWeight: 800, fontSize: '1.2rem' }}>{product.sellerName}</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#4ade80', fontWeight: 700, fontSize: '0.9rem' }}>
               <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#4ade80' }} />
               Verified Seller
            </div>
          </div>
        </motion.div>
      </div>
      
      <div style={{ marginTop: '8rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8rem' }}>
        <div>
          <h3 style={{ fontSize: '2.5rem', marginBottom: '3rem' }}>Customer Reviews</h3>
          <div className="stagger-in">
            {product.reviews.length > 0 ? product.reviews.map(r => (
              <motion.div key={r.id} className="glass-card" style={{ marginBottom: '2rem', padding: '2.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--card-bg)' }} />
                    <span style={{ fontWeight: 800, fontSize: '1.1rem' }}>{r.userName}</span>
                  </div>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{r.date}</span>
                </div>
                <div style={{ marginBottom: '1.5rem', color: 'var(--primary)', display: 'flex', gap: '4px' }}>
                  {[...Array(5)].map((_, i) => <Star key={i} size={16} fill={i < r.rating ? "currentColor" : "transparent"} stroke="currentColor" />)}
                </div>
                <p style={{ lineHeight: 1.8, color: 'var(--text-dim)', fontSize: '1.1rem' }}>{r.comment}</p>
              </motion.div>
            )) : (
              <div className="glass-card" style={{ textAlign: 'center', padding: '5rem', color: 'var(--text-dim)' }}>
                 No reviews yet. Be the first to review!
              </div>
            )}
          </div>
        </div>

        <div>
          <h3 style={{ fontSize: '2.5rem', marginBottom: '3rem' }}>Write a Review</h3>
          <form onSubmit={submitReview} className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', padding: '3rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <label style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-dim)', marginLeft: '0.5rem' }}>Your Rating</label>
              <select 
                value={newRating} 
                onChange={(e) => setNewRating(Number(e.target.value))}
                className="input-premium"
                style={{ appearance: 'none' }}
              >
                {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} Star{n > 1 ? 's' : ''} - {n === 5 ? 'Excellent' : n === 4 ? 'Good' : n === 3 ? 'Average' : n === 2 ? 'Poor' : 'Very Bad'}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <label style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-dim)', marginLeft: '0.5rem' }}>Your Review</label>
              <textarea 
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                required
                rows={6}
                className="input-premium"
                style={{ resize: 'none' }}
                placeholder="Share your experience..."
              />
            </div>
            <button type="submit" className="btn-primary" style={{ padding: '1.25rem' }}>Submit Review</button>
          </form>
        </div>
      </div>
    </div>
  );
};

const CartView = () => {
  const { cart, products, removeFromCart, location } = useAppContext();
  
  const cartItems = useMemo(() => cart.map(c => {
    const p = products.find(prod => prod.id === c.id);
    return p ? { ...p, qty: c.qty } : null;
  }).filter((i): i is Product & { qty: number } => i !== null), [cart, products]);

  const total = useMemo(() => cartItems.reduce((acc, item) => acc + item.price * item.qty, 0), [cartItems]);

  return (
    <div className="container" style={{ padding: '8rem 0' }}>
      <motion.h2 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ fontSize: '4rem', marginBottom: '4rem', letterSpacing: '-3px' }}
      >
        Your Cart
      </motion.h2>
      
      {cartItems.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 420px', gap: '6rem' }}>
          <div className="stagger-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {cartItems.map((item, i) => (
              <motion.div 
                key={i} 
                className="glass-card" 
                style={{ display: 'flex', gap: '3rem', alignItems: 'center', padding: '2rem' }}
              >
                <div style={{ position: 'relative' }}>
                  <img src={item.image} style={{ width: '160px', height: '160px', objectFit: 'cover', borderRadius: '20px' }} alt={item.name} />
                  <div style={{ position: 'absolute', top: '-10px', left: '-10px', background: 'var(--primary)', color: 'white', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.9rem', boxShadow: '0 4px 12px var(--primary-glow)' }}>
                    {item.qty}
                  </div>
                </div>
                
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--accent)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>{item.category}</div>
                  <h4 style={{ fontSize: '1.8rem', marginBottom: '0.75rem' }}>{item.name}</h4>
                  <div style={{ color: 'var(--text-dim)', fontWeight: 600, fontSize: '1.1rem' }}>By {item.sellerName}</div>
                  
                  <motion.button 
                    whileHover={{ scale: 1.05, color: '#ff4b4b' }}
                    onClick={() => removeFromCart(item.id)} 
                    style={{ background: 'transparent', color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '1.5rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}
                  >
                    REMOVE
                  </motion.button>
                </div>
                
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '2.2rem', fontWeight: 900, color: 'white', letterSpacing: '-1.5px' }}>₹{(item.price * item.qty).toFixed(2)}</div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600 }}>Secure Delivery Inbound</div>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div>
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-card" 
              style={{ position: 'sticky', top: '120px', padding: '3.5rem' }}
            >
              <h3 style={{ marginBottom: '3rem', fontSize: '2rem' }}>Order Summary</h3>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '20px', marginBottom: '3rem', border: '1px solid var(--border-color)' }}>
                <MapPin size={24} color="var(--primary)" />
                <div>
                   <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '1px' }}>Deliver To</div>
                   <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>{location}</div>
                </div>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '3rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem' }}>
                  <span style={{ color: 'var(--text-dim)' }}>Subtotal</span>
                  <span style={{ fontWeight: 700 }}>₹{total.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem' }}>
                  <span style={{ color: 'var(--text-dim)' }}>Delivery Charge</span>
                  <span style={{ color: '#4ade80', fontWeight: 800 }}>FREE</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem' }}>
                  <span style={{ color: 'var(--text-dim)' }}>Tax</span>
                  <span style={{ color: 'var(--text-muted)' }}>Included</span>
                </div>
              </div>
              
              <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '2rem 0' }} />
              
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4rem' }}>
                <span style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-dim)' }}>Total Amount</span>
                <span style={{ fontSize: '2.8rem', fontWeight: 950, letterSpacing: '-2px' }}>₹{total.toFixed(2)}</span>
              </div>
              
              <button 
                className="btn-primary" 
                style={{ width: '100%', padding: '1.5rem', fontSize: '1.2rem' }}
                onClick={() => alert('Order placed successfully! It will arrive soon.')}
              >
                PLACE ORDER
              </button>
              
              <div style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4ade80' }} />
                100% SAFE PAYMENT
              </div>
            </motion.div>
          </div>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card" 
          style={{ textAlign: 'center', padding: '10rem 2rem' }}
        >
           <ShoppingBag size={100} style={{ color: 'rgba(255,255,255,0.05)', marginBottom: '3rem' }} />
           <p style={{ color: 'var(--text-dim)', fontSize: '1.5rem', marginBottom: '4rem' }}>Your cart is empty. Start adding items!</p>
           <Link to="/" className="btn-primary" style={{ textDecoration: 'none', padding: '1.25rem 4rem', display: 'inline-block', fontSize: '1.1rem' }}>Start Shopping</Link>
        </motion.div>
      )}
    </div>
  );
};

// --- MAIN APP ---

const App = () => {
  const [allProducts, setAllProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [cart, setCart] = useState<{id: string, qty: number}[]>([]);
  const [locationLoading, setLocationLoading] = useState(true);
  const [locationError, setLocationError] = useState(false);
  const [location, setLocation] = useState<string>('Detecting...');

  const addToCart = (pid: string) => {
    setCart(prev => {
      const exists = prev.find(item => item.id === pid);
      if (exists) return prev.map(item => item.id === pid ? { ...item, qty: item.qty + 1 } : item);
      return [...prev, { id: pid, qty: 1 }];
    });
  };

  const removeFromCart = (pid: string) => {
    setCart(prev => prev.filter(item => item.id !== pid));
  };

  const addReview = (pid: string, review: Review) => {
    setAllProducts(prev => prev.map(p =>
      p.id === pid ? { ...p, reviews: [review, ...p.reviews], rating: Number(((p.rating * p.reviews.length + review.rating) / (p.reviews.length + 1)).toFixed(1)) } : p
    ));
  };

  const addProduct = (p: Product) => setAllProducts(prev => [p, ...prev]);
  const updateProduct = (p: Product) => setAllProducts(prev => prev.map(item => item.id === p.id ? p : item));
  const deleteProduct = (pid: string) => setAllProducts(prev => prev.filter(p => p.id !== pid));


  const detectLocation = () => {
    if (!navigator.geolocation) {
      setLocation('Location not supported');
      setLocationLoading(false);
      setLocationError(true);
      return;
    }
    setLocationLoading(true);
    setLocationError(false);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
            { headers: { 'Accept-Language': 'en' } }
          );
          const data = await res.json();
          const city = data.address?.city || data.address?.town || data.address?.village || data.address?.county || 'Unknown City';
          const country = data.address?.country || '';
          setLocation(`${city}, ${country}`);
        } catch {
          setLocation('Location fetch failed');
          setLocationError(true);
        } finally {
          setLocationLoading(false);
        }
      },
      () => {
        setLocation('Location denied');
        setLocationLoading(false);
        setLocationError(true);
      },
      { timeout: 10000, maximumAge: 60000 }
    );
  };

  useEffect(() => { detectLocation(); }, []);

  return (
    <AppContext.Provider value={{ products: allProducts, user, location, cart, addToCart, removeFromCart, addReview, addProduct, updateProduct, deleteProduct, setUser, setLocation }}>
      <HashRouter>
        <div className="hero-mesh" />
        <nav style={{ background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(10px)', position: 'sticky', top: 0, zIndex: 100, borderBottom: '1px solid var(--border-color)' }}>
          <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '90px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4rem' }}>
              <Link to="/" style={{ textDecoration: 'none', color: 'white', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <motion.div 
                  whileHover={{ rotate: 10, scale: 1.1 }}
                  style={{ background: 'linear-gradient(135deg, var(--primary), var(--accent))', padding: '12px', borderRadius: '18px', boxShadow: '0 8px 16px var(--primary-glow)' }}
                >
                  <Store size={28} />
                </motion.div>
                <span className="gradient-text" style={{ fontSize: '1.8rem', fontWeight: 950, letterSpacing: '-1.5px' }}>VENDORA</span>
              </Link>
              
              <motion.div 
                whileHover={{ scale: 1.05 }}
                onClick={detectLocation}
                style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-dim)', fontSize: '0.9rem', background: 'rgba(255,255,255,0.03)', padding: '0.6rem 1.25rem', borderRadius: '30px', border: `1px solid ${locationError ? 'rgba(255,100,100,0.4)' : 'var(--border-color)'}` }}
              >
                {locationLoading ? (
                  <motion.div
                    animate={{ scale: [1, 1.3, 1], opacity: [1, 0.5, 1] }}
                    transition={{ repeat: Infinity, duration: 1.2 }}
                  >
                    <MapPin size={18} color="var(--primary)" />
                  </motion.div>
                ) : (
                  <MapPin size={18} color={locationError ? '#ff6464' : 'var(--primary)'} />
                )}
                <span>
                  <span style={{ color: 'var(--text-muted)' }}>Deliver to:</span>{' '}
                  <b style={{ color: locationLoading ? 'var(--text-dim)' : 'white' }}>
                    {locationLoading ? 'Detecting...' : location}
                  </b>
                </span>
                <ChevronDown size={14} />
              </motion.div>
            </div>
            
            <div style={{ display: 'flex', gap: '3rem', alignItems: 'center' }}>
              <Link to="/seller" style={{ color: 'white', textDecoration: 'none', fontSize: '1rem', fontWeight: 600 }}>Sell on Vendora</Link>
              <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                <Link to="/cart" style={{ color: 'white', position: 'relative' }}>
                  <ShoppingBag size={26} />
                  {cart.length > 0 && (
                    <motion.span 
                      initial={{ scale: 0 }} 
                      animate={{ scale: 1 }} 
                      style={{ position: 'absolute', top: '-8px', right: '-12px', background: 'var(--secondary)', color: 'white', fontSize: '11px', fontWeight: 900, borderRadius: '50%', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--bg-darker)', boxShadow: '0 4px 8px rgba(236, 72, 153, 0.4)' }}
                    >
                      {cart.reduce((a, b) => a + b.qty, 0)}
                    </motion.span>
                  )}
                </Link>
                <div style={{ width: '1px', height: '30px', background: 'var(--border-color)' }} />
                {user ? (
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setUser(null)} 
                    style={{ background: 'transparent', color: 'white', display: 'flex', alignItems: 'center', gap: '1rem' }}
                  >
                    <div style={{ width: '40px', height: '40px', background: 'rgba(255,255,255,0.1)', border: '1px solid var(--border-color)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <User size={22} />
                    </div>
                    <span style={{ fontSize: '1rem', fontWeight: 700 }}>{user.name}</span>
                  </motion.button>
                ) : (
                  <Link to="/login" style={{ textDecoration: 'none', color: 'white', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '40px', height: '40px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <User size={22} />
                    </div>
                    <span style={{ fontSize: '1rem', fontWeight: 700 }}>Launch App</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </nav>

        <main style={{ flex: 1, position: 'relative' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/seller" element={<SellerDashboard />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<CartView />} />
          </Routes>
        </main>

        <footer style={{ borderTop: '1px solid var(--border-color)', padding: '5rem 0', background: 'rgba(0,0,0,0.3)', marginTop: '4rem' }}>
          <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '4rem', marginBottom: '4rem' }}>
               <div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '1.5rem' }}>VENDORA 🛒</div>
                  <p style={{ color: 'var(--text-dim)', lineHeight: 1.6 }}>India's own online marketplace connecting sellers and buyers.</p>
               </div>
               <div>
                  <h4 style={{ marginBottom: '1.5rem' }}>Marketplace</h4>
                  <ul style={{ listStyle: 'none', color: 'var(--text-dim)', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                     <li>All Products</li>
                     <li>Popular Sellers</li>
                     <li>Seller Program</li>
                  </ul>
               </div>
               <div>
                  <h4 style={{ marginBottom: '1.5rem' }}>Help</h4>
                  <ul style={{ listStyle: 'none', color: 'var(--text-dim)', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                     <li>Help Center</li>
                     <li>Contact Us</li>
                  </ul>
               </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-dim)', fontSize: '0.9rem', borderTop: '1px solid var(--border-color)', paddingTop: '2rem' }}>
              <div>© 2026 Vendora — Made with ❤️ in India</div>
              <div style={{ display: 'flex', gap: '2rem' }}>
                 <span>Instagram</span>
                 <span>Twitter</span>
              </div>
            </div>
          </div>
        </footer>
      </HashRouter>
    </AppContext.Provider>
  );
};

export default App;
