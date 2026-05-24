'use client';

import { useState, useRef, useTransition, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getProducts, createProduct, updateProduct, deleteProduct, type Product } from '@/app/actions/products';
import styles from './page.module.css';

const PRESET_COLORS = ['#c0392b','#e67e22','#f1c40f','#27ae60','#2980b9','#8e44ad','#1abc9c','#2c3e50','#ecf0f1','#ffffff','#000000','#d4a96a'];
const PRESET_SIZES = ['XS','S','M','L','XL','Free Size'];
const CATEGORIES = ['Home Decor','Textiles','Woodcraft','Brass','Jewelry','Block Print','Pottery','Leather'];

const metrics = [
  { label: 'Total Revenue', value: '₹28.4L', change: '+12.3%', icon: '💰', barWidth: 78 },
  { label: 'Active Orders', value: '1,284', change: '+8.7%', icon: '📦', barWidth: 65 },
  { label: 'Partner Buyers', value: '342', change: '+5.2%', icon: '🤝', barWidth: 54 },
  { label: 'Artisan Suppliers', value: '1,204', change: '+2.1%', icon: '🏺', barWidth: 82 },
];

const recentOrders = [
  { id: '#ORD-2841', buyer: 'Maison Decor Ltd', country: 'France 🇫🇷', items: 'Terra Vase × 200', value: '₹96,000', status: 'Shipped', st: 'shipped' },
  { id: '#ORD-2840', buyer: 'Nordic Home AS', country: 'Norway 🇳🇴', items: 'Dhurrie Rug × 30', value: '₹1,35,000', status: 'Processing', st: 'processing' },
  { id: '#ORD-2839', buyer: 'Artcraft USA Inc', country: 'USA 🇺🇸', items: 'Block Print × 150', value: '₹84,000', status: 'Confirmed', st: 'confirmed' },
  { id: '#ORD-2838', buyer: 'Tokyo Imports KK', country: 'Japan 🇯🇵', items: 'Brass Figurine × 50', value: '₹75,000', status: 'Delivered', st: 'delivered' },
];

const navItems = [
  { icon: '📊', label: 'Dashboard' },
  { icon: '🛒', label: 'Products' },
  { icon: '📦', label: 'Orders' },
  { icon: '🏺', label: 'Suppliers' },
  { icon: '📈', label: 'Analytics' },
  { icon: '⚙️', label: 'Settings' },
];

type LotTier = { qty: string; price: string };

export default function AdminClient() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [activeNav, setActiveNav] = useState('Dashboard');
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Detect if Supabase is configured using the public env var (available client-side)
  const isConfigured = typeof process !== 'undefined' &&
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_URL !== 'your_supabase_project_url_here';

  // Fetch products on mount via server action
  useEffect(() => {
    getProducts()
      .then(data => setProducts(data))
      .catch(err => console.error('Failed to load products:', err))
      .finally(() => setLoading(false));
  }, []);

  // Form state
  const [name, setName] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [origin, setOrigin] = useState('');
  const [stock, setStock] = useState('In Stock');
  const [colors, setColors] = useState<string[]>([]);
  const [sizes, setSizes] = useState<string[]>([]);
  const [customColor, setCustomColor] = useState('#1976d2');
  const [customSize, setCustomSize] = useState('');
  const [lots, setLots] = useState<LotTier[]>([{ qty: '', price: '' }]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  function showToast(msg: string, type: 'success' | 'error') {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }

  function resetForm() {
    setName(''); setCategory(CATEGORIES[0]); setPrice(''); setDescription('');
    setOrigin(''); setStock('In Stock'); setColors([]); setSizes([]);
    setLots([{ qty: '', price: '' }]); setImageFile(null);
    setImagePreview(''); setImageUrl(''); setEditProduct(null);
  }

  function openNew() { resetForm(); setShowForm(true); }

  function openEdit(p: Product) {
    setName(p.name); setCategory(p.category); setPrice(String(p.base_price));
    setDescription(p.description); setOrigin(p.origin ?? ''); setStock(p.stock_status);
    setColors(p.colors ?? []); setSizes(p.sizes ?? []);
    setLots(p.lots?.map(l => ({ qty: String(l.qty), price: String(l.price) })) ?? [{ qty: '', price: '' }]);
    setImageFile(null); setImagePreview(p.image_url ?? ''); setImageUrl(p.image_url ?? '');
    setEditProduct(p); setShowForm(true);
  }

  function handleImageFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  function toggleColor(c: string) { setColors(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]); }
  function toggleSize(s: string) { setSizes(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]); }
  function addLot() { setLots(prev => [...prev, { qty: '', price: '' }]); }
  function removeLot(i: number) { setLots(prev => prev.filter((_, idx) => idx !== i)); }
  function updateLot(i: number, field: 'qty' | 'price', val: string) {
    setLots(prev => prev.map((l, idx) => idx === i ? { ...l, [field]: val } : l));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    startTransition(async () => {
      try {
        // Step 1: Upload image via API route if a file was selected
        let uploadedUrl = editProduct ? (editProduct.image_url ?? '') : imageUrl;
        let uploadedFileId = editProduct ? (editProduct.imagekit_file_id ?? '') : '';

        if (imageFile) {
          const uploadFd = new FormData();
          uploadFd.append('file', imageFile);

          const uploadRes = await fetch('/api/upload', {
            method: 'POST',
            body: uploadFd,
          });

          if (!uploadRes.ok) {
            const err = await uploadRes.json();
            showToast(`Image upload failed: ${err.error}`, 'error');
            return;
          }

          const uploadData = await uploadRes.json();
          uploadedUrl = uploadData.url;
          uploadedFileId = uploadData.fileId;
        } else if (!editProduct && imageUrl) {
          // If creating new and pasting a URL instead of a file
          uploadedUrl = imageUrl;
        }

        // Step 2: Call server action with text-only FormData (no File)
        const fd = new FormData();
        fd.append('name', name);
        fd.append('category', category);
        fd.append('description', description);
        fd.append('base_price', price);
        fd.append('origin', origin);
        fd.append('stock_status', stock);
        fd.append('colors', JSON.stringify(colors));
        fd.append('sizes', JSON.stringify(sizes));
        fd.append('lots', JSON.stringify(lots.filter(l => l.qty && l.price).map(l => ({ qty: Number(l.qty), price: Number(l.price) }))));
        fd.append('image_url', uploadedUrl);
        fd.append('imagekit_file_id', uploadedFileId);

        let result;
        if (editProduct) {
          fd.append('existing_image_url', editProduct.image_url ?? '');
          fd.append('existing_imagekit_file_id', editProduct.imagekit_file_id ?? '');
          result = await updateProduct(editProduct.id, fd);
        } else {
          result = await createProduct(fd);
        }

        if (result.success) {
          showToast(editProduct ? '✓ Product updated!' : '✓ Product uploaded!', 'success');
          resetForm(); setShowForm(false);
          getProducts().then(setProducts).catch(console.error);
        } else {
          showToast(`Error: ${result.error}`, 'error');
        }
      } catch (err) {
        showToast(`Error: ${(err as Error).message}`, 'error');
      }
    });
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this product? This cannot be undone.')) return;
    startTransition(async () => {
      const result = await deleteProduct(id);
      if (result.success) {
        showToast('Product deleted.', 'success');
        // Re-fetch products after deletion
        getProducts().then(setProducts).catch(console.error);
      } else {
        showToast(`Error: ${result.error}`, 'error');
      }
    });
  }

  return (
    <div className={styles.adminLayout}>
      {/* SIDEBAR */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarLogo}>
          <div className={styles.logoIcon}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
            </svg>
          </div>
          <div><div className={styles.logoName}>BharatCraft</div><div className={styles.logoRole}>Admin Panel</div></div>
        </div>
        <nav className={styles.sidebarNav}>
          {navItems.map(item => (
            <button key={item.label} id={`sidebar-${item.label.toLowerCase()}`}
              className={`${styles.navItem} ${activeNav === item.label ? styles.navActive : ''}`}
              onClick={() => { setActiveNav(item.label); setShowForm(false); }}>
              <span className={styles.navIcon}>{item.icon}</span><span>{item.label}</span>
            </button>
          ))}
        </nav>
        <div className={styles.sidebarFooter}>
          <Link href="/" id="go-to-website-btn" className={styles.websiteBtn}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
            </svg>
            View Website
          </Link>
          <div className={styles.adminUser}>
            <div className={styles.userAvatar}>AK</div>
            <div><div className={styles.userName}>Arjun Kumar</div><div className={styles.userRole}>Super Admin</div></div>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <div className={styles.mainArea}>
        <header className={styles.topBar}>
          <div>
            <h1 className={styles.pageTitle}>{activeNav === 'Products' ? 'Product Management' : activeNav}</h1>
            <p className={styles.pageSubtitle}>
              {activeNav === 'Products' ? `${products.length} products in catalog` : 'Welcome back, Arjun.'}
            </p>
          </div>
          <div className={styles.topBarRight}>
            {toast && (
              <span className={styles.savedBadge} style={{ background: toast.type === 'error' ? '#fee2e2' : undefined, color: toast.type === 'error' ? '#dc2626' : undefined }}>
                {toast.msg}
              </span>
            )}
            {isPending && <span style={{ fontSize: '0.8125rem', color: 'var(--on-surface-variant)' }}>Saving…</span>}
            {activeNav === 'Products' && !showForm && (
              <button className="btn-primary" id="add-product-btn" onClick={openNew} disabled={isPending}>+ Upload Product</button>
            )}
            {activeNav === 'Products' && showForm && (
              <button className="btn-secondary" onClick={() => { resetForm(); setShowForm(false); }}>← Back to List</button>
            )}
            <div className={styles.notifBell}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
              <span className={styles.notifDot}/>
            </div>
          </div>
        </header>

        <div className={styles.content}>
          {/* Setup banner when credentials not configured */}
          {!isConfigured && (
            <div style={{ background:'#fef9c3', border:'1px solid #fde047', borderRadius:'var(--radius-md)', padding:'14px 20px', display:'flex', alignItems:'flex-start', gap:'12px', marginBottom:'8px' }}>
              <span style={{ fontSize:'1.25rem' }}>⚠️</span>
              <div>
                <strong style={{ fontSize:'0.9rem' }}>Supabase not configured</strong>
                <p style={{ fontSize:'0.8125rem', marginTop:'4px', color:'var(--on-surface-variant)' }}>
                  Open <code>.env.local</code> and replace the placeholder values with your real Supabase URL, service role key, and ImageKit credentials. Then restart the dev server.
                </p>
              </div>
            </div>
          )}
          {/* ══ DASHBOARD ══ */}
          {activeNav === 'Dashboard' && (
            <>
              <div className={styles.metricsGrid}>
                {metrics.map(m => (
                  <div key={m.label} className={styles.metricCard}>
                    <div className={styles.metricTop}><span className={styles.metricIcon}>{m.icon}</span><span className={`${styles.metricChange} ${styles.changeUp}`}>↑ {m.change}</span></div>
                    <div className={styles.metricValue}>{m.value}</div>
                    <div className={styles.metricLabel}>{m.label}</div>
                    <div className={styles.metricBar}><div className={styles.metricBarFill} style={{ width: `${m.barWidth}%` }}/></div>
                  </div>
                ))}
              </div>
              <div className={styles.chartsRow}>
                <div className={styles.chartCard}>
                  <div className={styles.chartHeader}><h3 className={styles.chartTitle}>Monthly Revenue</h3></div>
                  <div className={styles.barChart}>
                    {[{month:'Dec',val:62},{month:'Jan',val:75},{month:'Feb',val:58},{month:'Mar',val:88},{month:'Apr',val:72},{month:'May',val:95}].map(bar => (
                      <div key={bar.month} className={styles.barGroup}>
                        <div className={styles.barWrap}><div className={styles.bar} style={{ height:`${bar.val}%` }}><span className={styles.barTooltip}>₹{(bar.val*0.3).toFixed(1)}L</span></div></div>
                        <span className={styles.barLabel}>{bar.month}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className={styles.chartCard}>
                  <div className={styles.chartHeader}><h3 className={styles.chartTitle}>Sales by Category</h3></div>
                  <div className={styles.categoryBreakdown}>
                    {[{name:'Textiles',pct:34,color:'#1976d2'},{name:'Home Decor',pct:28,color:'#f59e0b'},{name:'Brass',pct:18,color:'#10b981'},{name:'Woodcraft',pct:12,color:'#8b5cf6'},{name:'Jewelry',pct:8,color:'#ef4444'}].map(cat => (
                      <div key={cat.name} className={styles.catBreakItem}>
                        <div className={styles.catBreakHeader}><div className={styles.catBreakDot} style={{ background:cat.color }}/><span className={styles.catBreakName}>{cat.name}</span><span className={styles.catBreakPct}>{cat.pct}%</span></div>
                        <div className={styles.catBreakBar}><div className={styles.catBreakFill} style={{ width:`${cat.pct}%`, background:cat.color }}/></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className={styles.tableCard}>
                <div className={styles.tableHeader}><h3 className={styles.chartTitle}>Recent Orders</h3><button className="btn-ghost" onClick={() => setActiveNav('Orders')}>View all →</button></div>
                <div className={styles.tableWrap}>
                  <table className={styles.table}>
                    <thead><tr><th>Order ID</th><th>Buyer</th><th>Items</th><th>Value</th><th>Status</th></tr></thead>
                    <tbody>
                      {recentOrders.map(o => (
                        <tr key={o.id} className={styles.tableRow}>
                          <td className={styles.orderId}>{o.id}</td>
                          <td><div className={styles.buyerName}>{o.buyer}</div><div className={styles.buyerCountry}>{o.country}</div></td>
                          <td className={styles.orderItems}>{o.items}</td>
                          <td className={styles.orderValue}>{o.value}</td>
                          <td><span className={`${styles.statusBadge} ${styles[`status_${o.st}`]}`}>{o.status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* ══ PRODUCTS LIST ══ */}
          {activeNav === 'Products' && !showForm && (
            <div className={styles.productListWrap}>
              {loading && <div className={styles.emptyProducts}><span>⏳</span><p>Loading products…</p></div>}
              {!loading && products.length === 0 && (
                <div className={styles.emptyProducts}><span>📦</span><p>No products yet. Click <strong>Upload Product</strong> to add your first one.</p></div>
              )}
              <div className={styles.productListGrid}>
                {products.map((p: Product) => (
                  <div key={p.id} className={styles.productListCard}>
                    <div className={styles.plcImage}>{p.image_url ? <img src={p.image_url} alt={p.name}/> : <span>🖼️</span>}</div>
                    <div className={styles.plcBody}>
                      <div className={styles.plcCategory}>{p.category}</div>
                      <div className={styles.plcName}>{p.name}</div>
                      <div className={styles.plcOrigin}>📍 {p.origin || '—'}</div>
                      <div className={styles.plcMeta}>
                        <span className={styles.plcPrice}>₹{p.base_price}/unit</span>
                        <span className={`${styles.stockBadge} ${p.stock_status === 'Low Stock' ? styles.lowStock : styles.inStock}`}>{p.stock_status}</span>
                      </div>
                      {p.colors?.length > 0 && <div className={styles.plcColors}>{p.colors.map(c => <span key={c} className={styles.plcColorDot} style={{ background:c }} title={c}/>)}</div>}
                      {p.sizes?.length > 0 && <div className={styles.plcColors} style={{ gap:'4px' }}>{p.sizes.map(s => <span key={s} className={styles.plcSizeChip}>{s}</span>)}</div>}
                      {p.lots?.length > 0 && <div className={styles.plcLots}>{p.lots.map((l, i) => <span key={i} className={styles.plcLot}>MOQ {l.qty} → ₹{l.price}</span>)}</div>}
                    </div>
                    <div className={styles.plcActions}>
                      <button className={styles.editBtn} onClick={() => openEdit(p)} disabled={isPending}>✏️ Edit</button>
                      <button className={styles.deleteBtn} onClick={() => handleDelete(p.id)} disabled={isPending}>🗑️ Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ══ PRODUCT FORM (Create / Edit) ══ */}
          {activeNav === 'Products' && showForm && (
            <form className={styles.uploadForm} onSubmit={handleSubmit} id="product-upload-form">
              <div className={styles.formGrid}>
                {/* LEFT — image + colors + sizes */}
                <div className={styles.formLeft}>
                  <div className={styles.imageUploadBox} onClick={() => fileRef.current?.click()}>
                    {imagePreview
                      ? <img src={imagePreview} alt="preview" className={styles.imagePreview}/>
                      : <div className={styles.imagePlaceholder}>
                          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                          <p>Click to upload product image</p><span>PNG, JPG, WEBP · Max 5MB</span>
                        </div>}
                    <input ref={fileRef} type="file" accept="image/*" style={{ display:'none' }} onChange={handleImageFile} id="image-file-input"/>
                  </div>
                  <div className={styles.formGroup} style={{ marginTop:16 }}>
                    <label className={styles.formLabel}>Or paste image URL</label>
                    <input className="input" placeholder="https://example.com/image.jpg" value={imageUrl}
                      onChange={e => { setImageUrl(e.target.value); setImagePreview(e.target.value); }} id="image-url-input"/>
                  </div>

                  {/* Colors */}
                  <div className={styles.formGroup} style={{ marginTop:20 }}>
                    <label className={styles.formLabel}>Available Colors</label>
                    <div className={styles.colorGrid}>
                      {PRESET_COLORS.map(c => (
                        <button type="button" key={c} className={`${styles.colorSwatch} ${colors.includes(c) ? styles.colorSelected : ''}`} style={{ background:c }} onClick={() => toggleColor(c)}/>
                      ))}
                    </div>
                    <div className={styles.customColorRow}>
                      <label className={styles.formLabel} style={{ marginBottom:0 }}>Custom:</label>
                      <input type="color" value={customColor} onChange={e => setCustomColor(e.target.value)} className={styles.colorPicker}/>
                      <button type="button" className="btn-secondary" style={{ padding:'6px 14px', fontSize:'0.8125rem' }}
                        onClick={() => { if (!colors.includes(customColor)) setColors(prev => [...prev, customColor]); }}>Add</button>
                    </div>
                    {colors.length > 0 && (
                      <div className={styles.selectedColors}>
                        {colors.map(c => <div key={c} className={styles.selectedColorChip}><span className={styles.plcColorDot} style={{ background:c }}/><span style={{ fontSize:'0.75rem' }}>{c}</span><button type="button" onClick={() => toggleColor(c)} className={styles.removeColor}>×</button></div>)}
                      </div>
                    )}
                  </div>

                  {/* Sizes */}
                  <div className={styles.formGroup} style={{ marginTop:20 }}>
                    <label className={styles.formLabel}>Available Sizes</label>
                    <div className={styles.sizeGrid}>
                      {PRESET_SIZES.map(s => (
                        <button type="button" key={s} className={`${styles.sizeSwatch} ${sizes.includes(s) ? styles.sizeSelected : ''}`} onClick={() => toggleSize(s)}>{s}</button>
                      ))}
                    </div>
                    <div className={styles.customColorRow}>
                      <label className={styles.formLabel} style={{ marginBottom:0 }}>Custom:</label>
                      <input type="text" value={customSize} onChange={e => setCustomSize(e.target.value)} className="input" placeholder='e.g. 18x18"' style={{ padding:'6px', width:'110px' }}/>
                      <button type="button" className="btn-secondary" style={{ padding:'6px 14px', fontSize:'0.8125rem' }}
                        onClick={() => { if (customSize && !sizes.includes(customSize)) { setSizes(prev => [...prev, customSize]); setCustomSize(''); } }}>Add</button>
                    </div>
                    {sizes.length > 0 && (
                      <div className={styles.selectedColors}>
                        {sizes.map(s => <div key={s} className={styles.selectedColorChip}><span style={{ fontSize:'0.75rem', fontWeight:600 }}>{s}</span><button type="button" onClick={() => toggleSize(s)} className={styles.removeColor}>×</button></div>)}
                      </div>
                    )}
                  </div>
                </div>

                {/* RIGHT — text fields + lots */}
                <div className={styles.formRight}>
                  <div className={styles.formRow2}>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel} htmlFor="field-name">Product Name *</label>
                      <input id="field-name" className="input" placeholder="e.g. Hand-Glazed Terra Vase" value={name} onChange={e => setName(e.target.value)} required/>
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel} htmlFor="field-category">Category *</label>
                      <select id="field-category" className="input" value={category} onChange={e => setCategory(e.target.value)}>
                        {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel} htmlFor="field-desc">Description *</label>
                    <textarea id="field-desc" className="input" rows={4} placeholder="Describe the product…" value={description} onChange={e => setDescription(e.target.value)} style={{ resize:'vertical' }} required/>
                  </div>
                  <div className={styles.formRow2}>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel} htmlFor="field-price">Base Price (₹/unit) *</label>
                      <input id="field-price" className="input" type="number" min="0" placeholder="480" value={price} onChange={e => setPrice(e.target.value)} required/>
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel} htmlFor="field-origin">Origin / Artisan Cluster</label>
                      <input id="field-origin" className="input" placeholder="e.g. Jaipur, Rajasthan" value={origin} onChange={e => setOrigin(e.target.value)}/>
                    </div>
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel} htmlFor="field-stock">Stock Status</label>
                    <select id="field-stock" className="input" value={stock} onChange={e => setStock(e.target.value)}>
                      <option>In Stock</option><option>Low Stock</option><option>Out of Stock</option><option>Pre-Order</option>
                    </select>
                  </div>
                  <div className={styles.formGroup}>
                    <div className={styles.lotHeader}>
                      <label className={styles.formLabel}>Lot Sizes / MOQ Tiers</label>
                      <button type="button" className={styles.addLotBtn} onClick={addLot} id="add-lot-btn">+ Add Tier</button>
                    </div>
                    <div className={styles.lotList}>
                      {lots.map((lot, i) => (
                        <div key={i} className={styles.lotRow}>
                          <div className={styles.lotField}><span className={styles.lotLabel}>Min. Qty</span><input className="input" type="number" min="1" placeholder="50" value={lot.qty} onChange={e => updateLot(i,'qty',e.target.value)}/></div>
                          <div className={styles.lotField}><span className={styles.lotLabel}>Price (₹/unit)</span><input className="input" type="number" min="0" placeholder="480" value={lot.price} onChange={e => updateLot(i,'price',e.target.value)}/></div>
                          {lots.length > 1 && <button type="button" className={styles.removeLotBtn} onClick={() => removeLot(i)}>×</button>}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className={styles.formActions}>
                    <button type="submit" className="btn-primary" id="save-product-btn" disabled={isPending} style={{ padding:'12px 36px' }}>
                      {isPending ? '⏳ Saving…' : editProduct ? '💾 Update Product' : '📤 Upload Product'}
                    </button>
                    <button type="button" className="btn-secondary" onClick={() => { resetForm(); setShowForm(false); }}>Cancel</button>
                  </div>
                </div>
              </div>
            </form>
          )}

          {/* ══ OTHER SECTIONS ══ */}
          {!['Dashboard','Products'].includes(activeNav) && (
            <div className={styles.placeholderSection}><span>🚧</span><h3>{activeNav}</h3><p>This section is coming soon.</p></div>
          )}
        </div>
      </div>
    </div>
  );
}
