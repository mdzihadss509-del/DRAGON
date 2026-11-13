"use client";

import { useMemo, useState } from "react";

const categories = ["All Products", "Server Plans", "Ready Servers", "Mods & Modpacks", "Plugins", "Texture Packs", "Shaders", "Worlds & Maps", "Development"];
const products = [
  { id:1, name:"Frost SMP — Complete Server", type:"Ready Servers", price:"$89.00", tag:"BEST SELLER", color:"blue", desc:"A polished survival experience with a custom spawn, balanced economy and ready-to-play configuration.", icon:"✦" },
  { id:2, name:"Modpack: Beyond Realms", type:"Mods & Modpacks", price:"$14.00", tag:"NEW", color:"purple", desc:"A curated adventure modpack with exploration, progression and challenging encounters.", icon:"◈" },
  { id:3, name:"Nexus Essentials", type:"Plugins", price:"$19.00", tag:"POPULAR", color:"cyan", desc:"A configurable plugin bundle for permissions, moderation, economy and server quality of life.", icon:"⌘" },
  { id:4, name:"Aurora 128x Resource Pack", type:"Texture Packs", price:"$8.00", tag:"CREATOR PICK", color:"pink", desc:"A crisp visual refresh with carefully tuned details for a distinctive Minecraft look.", icon:"▧" },
  { id:5, name:"Performance Server Plan", type:"Server Plans", price:"$6.00/mo", tag:"STARTER", color:"blue", desc:"A straightforward starter hosting plan. Final hardware and location details are confirmed at checkout.", icon:"⌁" },
  { id:6, name:"Skybound Adventure Map", type:"Worlds & Maps", price:"$12.00", tag:"FEATURED", color:"orange", desc:"A custom-built world ready to adapt for your next multiplayer adventure.", icon:"⌖" },
  { id:7, name:"Custom Shader Configuration", type:"Shaders", price:"$9.00", tag:"VISUAL", color:"purple", desc:"A tuned shader preset with balanced atmosphere, lighting and performance options.", icon:"✧" },
  { id:8, name:"Custom Plugin Development", type:"Development", price:"From $35", tag:"MADE TO ORDER", color:"cyan", desc:"A scoped development service for custom mechanics, integrations and server workflows.", icon:"⌘" }
];

function Mark({ children }) { return <span className="mark">{children}</span>; }

export default function Home() {
  const [active, setActive] = useState("All Products");
  const [query, setQuery] = useState("");
  const [cart, setCart] = useState([]);
  const [selected, setSelected] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const filtered = useMemo(() => products.filter(p => (active === "All Products" || p.type === active) && (p.name + " " + p.type + " " + p.desc).toLowerCase().includes(query.toLowerCase())), [active, query]);
  const addToCart = (p) => setCart(old => [...old, p]);
  return (
    <main>
      <div className="announcement"><span className="rainbow-dot"/> BUILT FOR YOUR NEXT WORLD <span className="announce-sep">·</span> PREMIUM MINECRAFT DIGITAL GOODS & SERVICES <span className="announce-arrow">↗</span></div>
      <header className="header">
        <a className="brand" href="#"><span className="brand-cube"><i/><i/><i/></span><span>ARCTIC<span className="brand-light">FORGE</span><small>MINECRAFT MARKETPLACE</small></span></a>
        <nav className={menuOpen ? "nav nav-open" : "nav"}>
          <a href="#marketplace" onClick={()=>setMenuOpen(false)}>Marketplace</a>
          <a href="#services" onClick={()=>setMenuOpen(false)}>Services</a>
          <a href="#how" onClick={()=>setMenuOpen(false)}>How it works</a>
          <a href="#support" onClick={()=>setMenuOpen(false)}>Support</a>
        </nav>
        <div className="header-actions"><button className="icon-btn" aria-label="Shopping cart" onClick={()=>document.getElementById("cart-panel")?.scrollIntoView({behavior:"smooth"})}>Bag <span className="cart-count">{cart.length}</span></button><a className="header-cta" href="#marketplace">Explore shop <span>↗</span></a></div>
        <button className="mobile-menu" onClick={()=>setMenuOpen(!menuOpen)} aria-label="Toggle menu">☰</button>
      </header>

      <section className="hero">
        <video className="hero-video" autoPlay muted loop playsInline poster="/hero-poster.jpg">
          <source src="/minecraft-hero.mp4" type="video/mp4"/>
        </video>
        <div className="hero-fallback"/>
        <div className="hero-grid"/>
        <div className="hero-content">
          <div className="eyebrow"><span className="live-dot"/> THE NEXT LEVEL STARTS HERE</div>
          <h1>Make your<br/><span className="gradient-text">Minecraft</span> more.</h1>
          <p className="hero-copy">Powerful servers. Hand-picked mods. Custom plugins.<br className="desktop-break"/> Everything you need to build something unforgettable.</p>
          <div className="hero-buttons"><a className="button button-rainbow" href="#marketplace">Explore marketplace <span>↗</span></a><a className="button button-glass" href="#services">Explore services <span>→</span></a></div>
          <div className="hero-proof"><div className="proof-avatars"><span>✦</span><span>◈</span><span>⌘</span></div><span>Made for creators, server owners & players</span></div>
        </div>
        <div className="hero-side-note"><span>01 / 03</span><i/> BUILT TO CREATE</div>
        <div className="hero-bottom"><span>EXPLORE WITHOUT LIMITS</span><span className="scroll-line"/> SCROLL TO DISCOVER</div>
        <div className="hero-glow glow-one"/><div className="hero-glow glow-two"/>
      </section>

      <section className="trust-strip"><div><b className="trust-icon">✦</b><span><strong>Curated quality</strong><small>Products made with care</small></span></div><div><b className="trust-icon">◈</b><span><strong>Creator focused</strong><small>Built for your vision</small></span></div><div><b className="trust-icon">⌘</b><span><strong>Expert support</strong><small>Help when you need it</small></span></div><div><b className="trust-icon">↗</b><span><strong>Instant-ready files</strong><small>Clear product details</small></span></div></section>

      <section className="market section-wrap" id="marketplace">
        <div className="section-heading"><div><div className="eyebrow dark-eyebrow"><span className="rainbow-dot"/> THE MARKETPLACE</div><h2>Find your next <span className="gradient-text">upgrade.</span></h2><p>Digital tools and services to take your Minecraft experience further.</p></div><a className="text-link" href="#services">Need something custom? <span>↗</span></a></div>
        <div className="shop-toolbar"><div className="category-scroll">{categories.map(c=><button key={c} className={active===c?"category active":"category"} onClick={()=>setActive(c)}>{c}</button>)}</div><label className="search"><span>⌕</span><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search the shop..."/></label></div>
        <div className="product-grid">{filtered.map(p=><article className="product-card" key={p.id}><button className="product-art" onClick={()=>setSelected(p)} aria-label={"View "+p.name}><span className={"art-orb "+p.color}>{p.icon}</span><span className="art-grid-lines"/><span className="product-tag">{p.tag}</span><span className="art-view">Quick view ↗</span></button><div className="product-info"><div className="product-type">{p.type}</div><button className="product-name" onClick={()=>setSelected(p)}>{p.name}</button><p>{p.desc}</p><div className="product-bottom"><strong>{p.price}</strong><button className="add-btn" onClick={()=>addToCart(p)} aria-label={"Add "+p.name+" to bag"}>+</button></div></div></article>)}</div>
        {filtered.length===0&&<div className="empty-state">No products match that search. Try another keyword or category.</div>}
        <div className="market-bottom"><span>Showing {filtered.length} curated items</span><span>More products added regularly <b>✦</b></span></div>
      </section>

      <section className="feature-band" id="services"><div className="feature-visual"><div className="feature-ring ring-a"/><div className="feature-ring ring-b"/><div className="feature-cube"><i/><i/><i/><i/></div><span className="float-label label-a">CUSTOM BUILDS <b>✦</b></span><span className="float-label label-b">YOUR WORLD. YOUR RULES.</span></div><div className="feature-copy"><div className="eyebrow"><span className="rainbow-dot"/> BEYOND THE DOWNLOAD</div><h2>Have a bigger<br/>idea in mind?</h2><p>From a fully configured server to a one-of-a-kind plugin, bring your idea to our development desk. Tell us what you need and we’ll help shape the next step.</p><div className="service-list"><div><span>01</span> Fully developed servers <b>↗</b></div><div><span>02</span> Server cloning & setup <b>↗</b></div><div><span>03</span> Custom mods & plugins <b>↗</b></div><div><span>04</span> Developer support & fixes <b>↗</b></div></div><a className="button button-rainbow" href="mailto:hello@arcticforge.example">Start a project <span>↗</span></a></div></section>

      <section className="steps section-wrap" id="how"><div className="eyebrow dark-eyebrow"><span className="rainbow-dot"/> SIMPLE BY DESIGN</div><h2>From discovery to <span className="gradient-text">your world.</span></h2><div className="step-grid"><div><span className="step-no">01</span><b>Explore</b><p>Browse the marketplace and find the right product or service.</p></div><div><span className="step-no">02</span><b>Choose</b><p>Review what’s included, compatibility and delivery details.</p></div><div><span className="step-no">03</span><b>Create</b><p>Get your files or work with a developer on a custom build.</p></div></div></section>

      <section className="cta-panel" id="support"><div className="cta-rainbow"/><div><div className="eyebrow"><span className="live-dot"/> NEED A HAND?</div><h2>Your next great world<br/>starts with a conversation.</h2><p>Questions about compatibility, setup or a custom project? Let’s talk.</p></div><a className="button button-white" href="mailto:hello@arcticforge.example">Contact support <span>↗</span></a></section>

      <section className="cart-panel section-wrap" id="cart-panel"><div><div className="eyebrow dark-eyebrow"><span className="rainbow-dot"/> YOUR BAG</div><h2>Selected for your world.</h2></div><div className="cart-items">{cart.length===0?<p>Your bag is empty. Add a product from the marketplace to see it here.</p>:<>{cart.map((p,i)=><div className="cart-row" key={p.id+"-"+i}><span>{p.name}</span><strong>{p.price}</strong><button onClick={()=>setCart(old=>old.filter((_,n)=>n!==i))}>Remove</button></div>)}<p className="cart-note">Demo cart only — secure checkout and payment processing are not connected yet.</p></>}</div></section>

      <footer className="footer"><a className="brand footer-brand" href="#"><span className="brand-cube"><i/><i/><i/></span><span>ARCTIC<span className="brand-light">FORGE</span><small>MINECRAFT MARKETPLACE</small></span></a><span>© 2026 Arctic Forge. Independent Minecraft marketplace concept.</span><div><a href="#marketplace">Shop</a><a href="#services">Services</a><a href="#support">Support</a></div><small className="disclaimer">Not affiliated with or endorsed by Mojang or Microsoft.</small></footer>

      {selected&&<div className="modal-backdrop" onClick={()=>setSelected(null)}><div className="quick-modal" onClick={e=>e.stopPropagation()}><button className="modal-close" onClick={()=>setSelected(null)}>×</button><div className={"modal-art "+selected.color}><span>{selected.icon}</span></div><div className="product-type">{selected.type}</div><h3>{selected.name}</h3><p>{selected.desc}</p><div className="modal-bottom"><strong>{selected.price}</strong><button className="button button-rainbow" onClick={()=>{addToCart(selected);setSelected(null)}}>Add to bag <span>+</span></button></div></div></div>}
    </main>
  );
}