"use client";

import { useEffect, useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const NAV_TYPES = [
  { id:"mods", label:"Mods", icon:"✦" },
  { id:"modpacks", label:"Modpacks", icon:"▦" },
  { id:"plugins", label:"Plugins", icon:"⌘" },
  { id:"resourcepacks", label:"Texture packs", icon:"▧" },
  { id:"shaders", label:"Shaders", icon:"◉" },
  { id:"datapacks", label:"Data packs", icon:"◇" }
];
const SERVICE_ITEMS = [
  { id:"server", title:"Fully developed servers", subtitle:"A ready-to-play server built around your vision.", price:"Custom quote", icon:"▣", color:"blue", kind:"Server service" },
  { id:"clone", title:"Server cloning & migration", subtitle:"Recreate a setup, move worlds and configure the stack.", price:"Custom quote", icon:"⧉", color:"purple", kind:"Server service" },
  { id:"plugin-dev", title:"Custom plugin development", subtitle:"Purpose-built mechanics, commands and integrations.", price:"Custom quote", icon:"⌘", color:"cyan", kind:"Development" },
  { id:"modpack-build", title:"Custom modpack creation", subtitle:"Curated mods, configs, quests and compatibility checks.", price:"Custom quote", icon:"▦", color:"pink", kind:"Development" },
  { id:"texture", title:"Texture pack commissions", subtitle:"Custom visual identity, icons and resource pack work.", price:"Custom quote", icon:"▧", color:"orange", kind:"Creative service" },
  { id:"support", title:"Developer support", subtitle:"Troubleshooting, optimization and ongoing maintenance.", price:"Custom quote", icon:"⌁", color:"blue", kind:"Support" }
];
const GAME_VERSIONS = ["26.3","26.2","26.1.2","1.21.11","1.21.10","1.21.8","1.21.4","1.20.1","1.19.4"];
const LOADERS = ["fabric","forge","neoforge","quilt","paper","purpur","spigot","velocity"];
const formatCount = n => n >= 1000000 ? (n/1000000).toFixed(1)+"m" : n >= 1000 ? (n/1000).toFixed(1)+"k" : String(n || 0);
const dateLabel = value => value ? new Date(value).toLocaleDateString(undefined,{month:"short",year:"numeric"}) : "—";

function ProjectCard({ project, onOpen }) {
  const cover = project.featured_gallery || (Array.isArray(project.gallery) ? project.gallery[0] : null);
  return <article className="project-card">
    <button className="project-cover" onClick={onOpen} aria-label={"Preview "+project.title}>
      {cover ? <img className="cover-image" src={cover} alt={project.title+" preview"} loading="lazy"/> : <div className="cover-placeholder"><span>{project.project_type==="modpack"?"▦":project.project_type==="shader"?"◉":"✦"}</span><i/></div>}
      <span className="free-ribbon">FREE</span>
      <span className="cover-open">View project ↗</span>
    </button>
    <div className="project-card-body">
      <div className="project-card-top">
        {project.icon_url ? <img className="project-icon" src={project.icon_url} alt="" loading="lazy"/> : <div className="project-icon icon-fallback">✦</div>}
        <div className="project-card-title"><button onClick={onOpen}>{project.title}</button><small>by {project.author || "Community creator"}</small></div>
        <span className="free-pill">FREE</span>
      </div>
      <p>{project.description}</p>
      <div className="project-meta"><span>↓ {formatCount(project.downloads)}</span><span>♡ {formatCount(project.follows)}</span><span>Updated {dateLabel(project.date_modified)}</span></div>
      <div className="project-tags">{(project.display_categories || project.categories || []).slice(0,3).map(tag=><span key={tag}>{tag}</span>)}</div>
    </div>
  </article>;
}

function PaidCard({ item, onOpen }) {
  return <article className="project-card paid-card">
    <button className={"project-cover paid-cover "+item.color} onClick={onOpen} aria-label={"Preview "+item.title}>
      {item.image ? <img src={item.image} alt={item.title}/> : <div className="cover-placeholder paid-placeholder"><span>{item.icon}</span><i/></div>}
      <span className="paid-ribbon">PAID SERVICE</span><span className="cover-open">View details ↗</span>
    </button>
    <div className="project-card-body">
      <div className="project-card-top"><div className={"project-icon icon-"+item.color}>{item.icon}</div><div className="project-card-title"><button onClick={onOpen}>{item.title}</button><small>Arctic Forge · {item.kind}</small></div><span className="paid-pill">PAID</span></div>
      <p>{item.subtitle}</p>
      <div className="project-meta"><span className="price-label">{item.price}</span><span>Made to order</span></div>
      <div className="project-tags"><span>Customizable</span><span>Developer support</span></div>
    </div>
  </article>;
}

export default function Home() {
  const [view,setView] = useState("discover");
  const [type,setType] = useState("mods");
  const [query,setQuery] = useState("");
  const [sort,setSort] = useState("downloads");
  const [loader,setLoader] = useState("");
  const [gameVersion,setGameVersion] = useState("");
  const [priceFilter,setPriceFilter] = useState("all");
  const [projects,setProjects] = useState([]);
  const [total,setTotal] = useState(0);
  const [loading,setLoading] = useState(true);
  const [apiError,setApiError] = useState("");
  const [offset,setOffset] = useState(0);
  const [selected,setSelected] = useState(null);
  const [detail,setDetail] = useState(null);
  const [versions,setVersions] = useState([]);
  const [downloadGameVersion,setDownloadGameVersion] = useState("");
  const [downloadLoader,setDownloadLoader] = useState("");
  const [detailTab,setDetailTab] = useState("description");
  const [galleryIndex,setGalleryIndex] = useState(0);
  const [serviceSelected,setServiceSelected] = useState(null);
  const [mobileNav,setMobileNav] = useState(false);
  const [drafts,setDrafts] = useState([]);
  const [productName,setProductName] = useState("");
  const [productType,setProductType] = useState("Mod");
  const [productPriceType,setProductPriceType] = useState("free");
  const [productPrice,setProductPrice] = useState("");
  const [productCurrency,setProductCurrency] = useState("BDT");
  const [productDescription,setProductDescription] = useState("");
  const [productIcon,setProductIcon] = useState("");
  const [productCover,setProductCover] = useState("");
  const [productGallery,setProductGallery] = useState([]);
  const [profileName,setProfileName] = useState("Arctic Forge");
  const [profileBio,setProfileBio] = useState("Minecraft creators building tools, mods, servers and experiences for the community.");
  const [profileAvatar,setProfileAvatar] = useState("");
  const [profileBanner,setProfileBanner] = useState("");
  const [showMedia,setShowMedia] = useState(null);

  useEffect(()=>{
    try { const saved=JSON.parse(localStorage.getItem("arcticforge-drafts")||"[]"); setDrafts(saved); } catch {}
    try { const profile=JSON.parse(localStorage.getItem("arcticforge-profile")||"{}"); if(profile.name)setProfileName(profile.name); if(profile.bio)setProfileBio(profile.bio); if(profile.avatar)setProfileAvatar(profile.avatar); if(profile.banner)setProfileBanner(profile.banner); } catch {}
  },[]);

  useEffect(()=>{
    if(priceFilter==="paid" || view!=="discover") { setProjects([]); setLoading(false); return; }
    let cancelled=false;
    setLoading(true); setApiError("");
    const timer=setTimeout(async()=>{
      try {
        const params=new URLSearchParams({type,q:query,index:sort,offset:String(offset),limit:"18"});
        if(loader)params.set("loader",loader);
        if(gameVersion)params.set("version",gameVersion);
        const response=await fetch("/api/modrinth/search?"+params.toString());
        const data=await response.json();
        if(!response.ok)throw new Error(data.error||"Discovery request failed");
        if(!cancelled){setProjects(data.hits||[]);setTotal(data.total_hits||0);}
      } catch(error){if(!cancelled){setProjects([]);setTotal(0);setApiError(error.message||"Could not load projects.");}}
      finally{if(!cancelled)setLoading(false);}
    },280);
    return ()=>{cancelled=true;clearTimeout(timer);};
  },[type,query,sort,loader,gameVersion,offset,priceFilter,view]);

  const filteredServices=useMemo(()=>SERVICE_ITEMS.filter(item=>(type==="all"||type==="services"||type==="server"||type==="development")), [type]);
  const openProject=async project=>{
    setSelected(project);setDetail(null);setVersions([]);setDetailTab("description");setGalleryIndex(0);setDownloadGameVersion("");setDownloadLoader("");
    try{
      const [a,b]=await Promise.all([fetch("/api/modrinth/project/"+project.project_id),fetch("/api/modrinth/project/"+project.project_id+"/versions")]);
      const detailData=await a.json();const versionData=await b.json();
      if(a.ok)setDetail(detailData);if(b.ok&&Array.isArray(versionData))setVersions(versionData);
    }catch{}
  };
  const addMedia=(file,setter)=>{
    if(!file)return;
    if(file.size>3*1024*1024){alert("Please keep each image under 3 MB for this preview.");return;}
    const reader=new FileReader();reader.onload=()=>setter(reader.result);reader.readAsDataURL(file);
  };
  const addGallery=files=>{
    const accepted=Array.from(files||[]).filter(file=>file.type.startsWith("image/")&&file.size<=3*1024*1024).slice(0,8);
    Promise.all(accepted.map(file=>new Promise(resolve=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.readAsDataURL(file);}))).then(images=>setProductGallery(old=>[...old,...images].slice(0,8)));
  };
  const saveDraft=()=>{
    if(!productName.trim()){alert("Enter a product name first.");return;}
    const draft={id:Date.now(),title:productName.trim(),type:productType,priceType:productPriceType,price:productPrice,currency:productCurrency,description:productDescription,icon:productIcon,cover:productCover,gallery:productGallery,createdAt:new Date().toISOString()};
    const next=[draft,...drafts];setDrafts(next);
    try{localStorage.setItem("arcticforge-drafts",JSON.stringify(next));}catch{alert("Draft is too large for local browser storage. Try fewer or smaller images.");}
    setProductName("");setProductPrice("");setProductDescription("");setProductIcon("");setProductCover("");setProductGallery([]);
  };
  const saveProfile=()=>{
    const profile={name:profileName,bio:profileBio,avatar:profileAvatar,banner:profileBanner};
    try{localStorage.setItem("arcticforge-profile",JSON.stringify(profile));alert("Profile preview saved in this browser.");}catch{alert("Profile image is too large to save locally.");}
  };
  const removeDraft=id=>{
    const next=drafts.filter(d=>d.id!==id);setDrafts(next);try{localStorage.setItem("arcticforge-drafts",JSON.stringify(next));}catch{}
  };
  const setDiscoverType=id=>{setType(id);setView("discover");setOffset(0);setPriceFilter("all");setMobileNav(false);};
  const selectView=id=>{setView(id);setMobileNav(false);setSelected(null);};

  return <main className="site-shell">
    <div className="topline"><span className="rainbow-dot"/> COMMUNITY-POWERED MINECRAFT MARKETPLACE <span className="topline-right">FREE DOWNLOADS · PREMIUM CREATOR SERVICES</span></div>
    <header className="site-header">
      <a className="brand" href="#" onClick={()=>selectView("discover")}><span className="brand-mark"><i/><i/><i/></span><span>ARCTIC<span className="brand-light">FORGE</span><small>CREATE YOUR NEXT WORLD</small></span></a>
      <button className="mobile-nav-toggle" onClick={()=>setMobileNav(!mobileNav)}>☰</button>
      <nav className={mobileNav?"main-nav nav-visible":"main-nav"}>
        <button className={view==="discover"?"nav-link current": "nav-link"} onClick={()=>selectView("discover")}>Discover</button>
        <button className={view==="services"?"nav-link current":"nav-link"} onClick={()=>{setType("services");selectView("services");}}>Services</button>
        <button className={view==="creator"?"nav-link current":"nav-link"} onClick={()=>selectView("creator")}>Creator studio</button>
        <button className={view==="profile"?"nav-link current":"nav-link"} onClick={()=>selectView("profile")}>Profile</button>
      </nav>
      <div className="header-tools"><button className="header-login" onClick={()=>selectView("profile")}>Creator profile</button><button className="header-upload" onClick={()=>selectView("creator")}>＋ Upload project</button></div>
    </header>

    {view==="discover" && <>
      <section className="discovery-hero">
        <div className="hero-backdrop"><div className="hero-orbit orbit-one"/><div className="hero-orbit orbit-two"/><div className="hero-pixel-scene"><span>✦</span><i/><b/></div></div>
        <div className="discovery-hero-copy"><div className="hero-kicker"><span className="rainbow-dot"/> THE COMMUNITY MARKETPLACE</div><h1>Make Minecraft<br/><span className="rainbow-type">your own.</span></h1><p>Discover free community projects, explore creator-made packs, or commission a world built just for you.</p>
          <div className="hero-search"><span>⌕</span><input value={query} onChange={e=>{setQuery(e.target.value);setOffset(0);}} placeholder="Search mods, plugins, modpacks and more..."/><button onClick={()=>document.getElementById("discover-results")?.scrollIntoView({behavior:"smooth"})}>Search</button></div>
          <div className="hero-stats"><span><b>FREE</b> community downloads</span><span><b>CREATOR</b> owned listings</span><span><b>MODERN</b> project previews</span></div>
        </div>
        <div className="hero-caption">YOUR IDEAS. YOUR WORLD. <span>01 — DISCOVER</span></div>
      </section>

      <section className="type-strip" aria-label="Project categories">{NAV_TYPES.map((item,i)=><button key={item.id} className={type===item.id?"type-tile selected":"type-tile"} onClick={()=>setDiscoverType(item.id)}><span className={"type-icon type-color-"+i}>{item.icon}</span><span>{item.label}</span><b>↗</b></button>)}<button className="type-tile" onClick={()=>{setView("services");setType("services");}}><span className="type-icon type-color-6">▣</span><span>Server plans</span><b>↗</b></button></section>

      <section className="discover-layout" id="discover-results">
        <aside className="filter-panel">
          <div className="filter-heading"><b>Discover projects</b><span>FILTERS</span></div>
          <label className="filter-label">CONTENT TYPE</label>
          <div className="filter-type-list">{NAV_TYPES.map(item=><button key={item.id} className={type===item.id?"filter-type active":"filter-type"} onClick={()=>setDiscoverType(item.id)}><span>{item.icon}</span>{item.label}</button>)}</div>
          <div className="filter-divider"/>
          <label className="filter-label">PRICE</label>
          <div className="price-filter"><button className={priceFilter==="all"?"chosen":""} onClick={()=>{setPriceFilter("all");setOffset(0);}}>All</button><button className={priceFilter==="free"?"chosen":""} onClick={()=>{setPriceFilter("free");setOffset(0);}}>Free</button><button className={priceFilter==="paid"?"chosen":""} onClick={()=>{setPriceFilter("paid");setOffset(0);}}>Paid</button></div>
          <div className="filter-divider"/>
          <label className="filter-label">GAME VERSION</label>
          <select value={gameVersion} onChange={e=>{setGameVersion(e.target.value);setOffset(0);}}><option value="">Any version</option>{GAME_VERSIONS.map(v=><option key={v}>{v}</option>)}</select>
          <label className="filter-label filter-spaced">LOADER / PLATFORM</label>
          <select value={loader} onChange={e=>{setLoader(e.target.value);setOffset(0);}}><option value="">Any platform</option>{LOADERS.map(v=><option key={v} value={v}>{v[0].toUpperCase()+v.slice(1)}</option>)}</select>
          <div className="filter-note"><span>✦</span><p>Community projects are free to download. Paid listings are offered separately by Arctic Forge creators.</p></div>
        </aside>

        <div className="results-area">
          <div className="results-heading"><div><div className="section-kicker">EXPLORE THE LIBRARY</div><h2>{priceFilter==="paid"?"Premium creator listings":NAV_TYPES.find(t=>t.id===type)?.label||"Minecraft projects"}</h2><p>{priceFilter==="paid"?"Custom services and paid creator-made products.": "Browse real community projects with live compatibility and version information."}</p></div>
            <label className="sort-control">Sort by <select value={sort} onChange={e=>{setSort(e.target.value);setOffset(0);}}><option value="downloads">Most downloads</option><option value="relevance">Relevance</option><option value="follows">Most followed</option><option value="newest">Newest</option><option value="updated">Recently updated</option></select></label>
          </div>
          {priceFilter==="paid" ? <div className="project-grid">{SERVICE_ITEMS.map(item=><PaidCard key={item.id} item={item} onOpen={()=>setServiceSelected(item)}/>)}</div> :
          loading ? <div className="loading-grid">{Array.from({length:9}).map((_,i)=><div className="skeleton-card" key={i}><div/><span/><i/></div>)}</div> :
          apiError ? <div className="empty-panel"><span>⚠</span><b>Could not load live projects</b><p>{apiError}</p><button onClick={()=>setOffset(0)}>Try again</button></div> :
          projects.length===0 ? <div className="empty-panel"><span>⌕</span><b>No projects found</b><p>Try another search term or remove a filter.</p><button onClick={()=>{setQuery("");setLoader("");setGameVersion("");}}>Clear filters</button></div> :
          <div className="project-grid">{projects.map(project=><ProjectCard key={project.project_id} project={project} onOpen={()=>openProject(project)}/>)}</div>}
          {priceFilter!=="paid"&&!loading&&projects.length>0&&<div className="pagination"><span>{formatCount(total)} community projects found</span><div><button disabled={offset===0} onClick={()=>setOffset(Math.max(0,offset-18))}>← Previous</button><button disabled={offset+18>=total} onClick={()=>setOffset(offset+18)}>Next →</button></div></div>}
          <div className="source-note">Free community project metadata and downloads powered by <a href="https://modrinth.com" target="_blank" rel="noreferrer">Modrinth</a>. Each project remains owned by its original creator.</div>
        </div>
      </section>

      <section className="creator-promo"><div className="promo-art"><div className="promo-orbit"/><div className="promo-cube">✦</div><span className="promo-float">YOUR CREATOR SPACE</span></div><div><div className="section-kicker">FOR CREATORS</div><h2>Build it. Share it.<br/><span className="rainbow-type">Put a value on it.</span></h2><p>Publish free projects for the community or create paid listings for your original work. Add images, GIFs, versions and clear compatibility details.</p><button className="rainbow-button" onClick={()=>selectView("creator")}>Open creator studio ↗</button></div></section>
    </>}

    {view==="services" && <section className="page-content"><div className="page-intro"><div className="section-kicker">ARCTIC FORGE SERVICES</div><h1>Bring your server<br/><span className="rainbow-type">to life.</span></h1><p>From a complete Minecraft server to a single custom plugin, choose the help you need.</p></div><div className="service-grid">{SERVICE_ITEMS.map(item=><PaidCard key={item.id} item={item} onOpen={()=>setServiceSelected(item)}/>)}</div><div className="service-contact"><div><b>Have a custom idea?</b><p>Share your requirements and request a quote.</p></div><a className="rainbow-button" href="mailto:hello@arcticforge.example?subject=Arctic%20Forge%20Project%20Enquiry">Request a quote ↗</a></div></section>}

    {view==="creator" && <section className="page-content creator-page"><div className="page-intro"><div className="section-kicker">CREATOR STUDIO · LOCAL PREVIEW</div><h1>Publish your next<br/><span className="rainbow-type">creation.</span></h1><p>Prepare a listing with a price, icon, cover art and gallery. Preview the product before it is published.</p></div>
      <div className="studio-layout"><form className="studio-form" onSubmit={e=>{e.preventDefault();saveDraft();}}>
        <div className="studio-section-title"><span>01</span><div><b>Project information</b><small>Tell the community what you made.</small></div></div>
        <label>Project name<input required value={productName} onChange={e=>setProductName(e.target.value)} placeholder="e.g. Hades Boss Expansion"/></label>
        <label>Category<select value={productType} onChange={e=>setProductType(e.target.value)}>{["Mod","Modpack","Plugin","Texture Pack","Shader","Data Pack","World / Map","Server Plan","Development Service"].map(v=><option key={v}>{v}</option>)}</select></label>
        <label>Description<textarea rows="4" value={productDescription} onChange={e=>setProductDescription(e.target.value)} placeholder="Features, requirements, compatibility and what's included..."/></label>
        <div className="studio-divider"/>
        <div className="studio-section-title"><span>02</span><div><b>Pricing</b><small>Most community projects can stay free. Set a price for your original premium work.</small></div></div>
        <div className="price-mode"><button type="button" className={productPriceType==="free"?"selected":""} onClick={()=>setProductPriceType("free")}>Free download</button><button type="button" className={productPriceType==="paid"?"selected":""} onClick={()=>setProductPriceType("paid")}>Set a price</button></div>
        {productPriceType==="paid"&&<div className="price-entry"><select value={productCurrency} onChange={e=>setProductCurrency(e.target.value)}><option>BDT</option><option>USD</option><option>EUR</option></select><input type="number" min="1" value={productPrice} onChange={e=>setProductPrice(e.target.value)} placeholder="Enter price"/></div>}
        <div className="studio-divider"/>
        <div className="studio-section-title"><span>03</span><div><b>Images & media</b><small>PNG, JPG, WEBP and GIF supported. Add screenshots so buyers can preview first.</small></div></div>
        <label className="upload-zone"><input type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={e=>addMedia(e.target.files?.[0],setProductIcon)}/><span className="upload-symbol">＋</span><b>Upload project icon</b><small>Square PNG, JPG, WEBP or GIF · max 3 MB</small></label>
        <label className="upload-zone"><input type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={e=>addMedia(e.target.files?.[0],setProductCover)}/><span className="upload-symbol">▧</span><b>Choose a cover image</b><small>Wide image for your listing</small></label>
        <label className="upload-zone"><input type="file" accept="image/png,image/jpeg,image/webp,image/gif" multiple onChange={e=>addGallery(e.target.files)}/><span className="upload-symbol">▦</span><b>Add gallery screenshots / GIFs</b><small>Up to 8 images · 3 MB each</small></label>
        {productGallery.length>0&&<div className="upload-previews">{productGallery.map((src,i)=><button type="button" key={i} onClick={()=>setShowMedia(src)}><img src={src} alt={"Gallery preview "+(i+1)}/><span>↗</span></button>)}</div>}
        <button className="rainbow-button save-draft" type="submit">Save local draft ↗</button>
        <p className="local-warning">This is a local preview studio right now. Drafts are stored only in this browser; account login, permanent file storage, publishing and payments are not connected yet.</p>
      </form>
      <aside className="studio-preview"><div className="preview-top"><span>LIVE PREVIEW</span><span className="preview-dot">● DRAFT</span></div><div className="preview-card"><div className="preview-cover">{productCover?<img src={productCover} alt="Project cover preview"/>:<span>✦</span>}</div><div className="preview-content"><span className={productPriceType==="free"?"free-pill":"paid-pill"}>{productPriceType==="free"?"FREE":"PAID"}</span><div className="preview-title-row">{productIcon?<img className="preview-icon" src={productIcon} alt="Project icon"/>:null}<h3>{productName||"Your project name"}</h3></div><p>{productDescription||"Your project description will appear here, helping players understand what they can expect."}</p><div className="preview-price">{productPriceType==="free"?"Free download":productPrice?productCurrency+" "+productPrice:"Set your price"}</div></div>{productGallery.length>0&&<div className="preview-gallery">{productGallery.slice(0,4).map((src,i)=><img key={i} src={src} alt={"Preview "+(i+1)} onClick={()=>setShowMedia(src)}/>)}</div>}</div></aside></div>
      <div className="saved-drafts"><div className="section-kicker">YOUR LOCAL DRAFTS</div><h2>Saved listings <span>{drafts.length}</span></h2>{drafts.length===0?<p>No drafts yet. Your saved previews will appear here.</p>:<div className="draft-list">{drafts.map(d=><div className="draft-row" key={d.id}><div className="draft-mini">{d.icon?<img src={d.icon} alt=""/>:"✦"}</div><div><b>{d.title}</b><small>{d.type} · {d.priceType==="free"?"Free":d.currency+" "+d.price}</small></div><button onClick={()=>removeDraft(d.id)}>Delete</button></div>)}</div>}</div>
    </section>}

    {view==="profile" && <section className="page-content profile-page"><div className="page-intro"><div className="section-kicker">CREATOR PROFILE</div><h1>Your work deserves<br/><span className="rainbow-type">a showcase.</span></h1><p>Set up the public-facing look of your Arctic Forge creator profile.</p></div><div className="profile-editor"><div className="profile-banner-preview" style={profileBanner?{backgroundImage:"url("+profileBanner+")"}:{}}><label className="banner-upload">Change banner<input type="file" accept="image/*" onChange={e=>addMedia(e.target.files?.[0],setProfileBanner)}/></label></div><div className="profile-avatar-row"><div className="profile-avatar">{profileAvatar?<img src={profileAvatar} alt="Profile avatar"/>:"AF"}</div><label className="avatar-upload">Upload avatar<input type="file" accept="image/*" onChange={e=>addMedia(e.target.files?.[0],setProfileAvatar)}/></label></div><div className="profile-fields"><label>Display name<input value={profileName} onChange={e=>setProfileName(e.target.value)}/></label><label>Bio<textarea rows="3" value={profileBio} onChange={e=>setProfileBio(e.target.value)}/></label><button className="rainbow-button" onClick={saveProfile}>Save profile preview ↗</button></div></div><div className="profile-stats"><div><b>{drafts.length}</b><span>Local drafts</span></div><div><b>—</b><span>Downloads</span></div><div><b>—</b><span>Followers</span></div><p>Public creator accounts and live statistics will be available after backend authentication is connected.</p></div></section>}

    <footer className="site-footer"><div className="footer-main"><div className="footer-brand"><a className="brand" href="#"><span className="brand-mark"><i/><i/><i/></span><span>ARCTIC<span className="brand-light">FORGE</span><small>CREATE YOUR NEXT WORLD</small></span></a><p>A community-first home for Minecraft projects, tools and creator services.</p></div><div><b>Discover</b>{NAV_TYPES.map(t=><button key={t.id} onClick={()=>setDiscoverType(t.id)}>{t.label}</button>)}</div><div><b>Marketplace</b><button onClick={()=>{setView("services");setType("services");}}>Server services</button><button onClick={()=>selectView("creator")}>Creator studio</button><button onClick={()=>selectView("profile")}>Creator profile</button></div><div><b>Resources</b><a href="https://docs.modrinth.com/api/" target="_blank" rel="noreferrer">Modrinth API</a><a href="https://modrinth.com" target="_blank" rel="noreferrer">Modrinth</a><a href="mailto:hello@arcticforge.example">Contact</a></div></div><div className="footer-bottom"><span>© 2026 Arctic Forge · Independent Minecraft marketplace</span><span>Not affiliated with Mojang or Microsoft.</span></div></footer>

    {selected&&<div className="modal-backdrop" onClick={()=>setSelected(null)}><div className="project-modal" onClick={e=>e.stopPropagation()}>
      <button className="modal-x" onClick={()=>setSelected(null)}>×</button>
      <div className="modal-project-head">{selected.icon_url?<img src={selected.icon_url} alt=""/>:<div className="modal-icon-fallback">✦</div>}<div><span className="free-pill">FREE COMMUNITY PROJECT</span><h2>{detail?.project?.title||selected.title}</h2><p>{detail?.project?.description||selected.description}</p><small>by {selected.author} · ↓ {formatCount(selected.downloads)} downloads</small></div></div>
      <div className="modal-tabs"><button className={detailTab==="description"?"active":""} onClick={()=>setDetailTab("description")}>Description</button><button className={detailTab==="versions"?"active":""} onClick={()=>setDetailTab("versions")}>Versions ({versions.length})</button><button className={detailTab==="gallery"?"active":""} onClick={()=>setDetailTab("gallery")}>Gallery ({detail?.project?.gallery?.length||selected.gallery?.length||0})</button></div>
      <div className="modal-body">
        {detailTab==="description"&&<div className="detail-columns"><div className="detail-description"><h3>About this project</h3><ReactMarkdown remarkPlugins={[remarkGfm]} components={{img:({src,alt})=><img src={src||""} alt={alt||"Project media"} className="description-media" loading="lazy"/>,a:({href,children})=><a href={href} target="_blank" rel="noreferrer">{children}</a>}}>{detail?.project?.body||selected.description}</ReactMarkdown><h3>Compatibility</h3><div className="detail-tags">{(detail?.project?.game_versions||selected.versions||[]).slice(0,12).map(v=><span key={v}>{v}</span>)}</div><h3>Categories</h3><div className="detail-tags">{(detail?.project?.categories||selected.categories||[]).slice(0,12).map(v=><span key={v}>{v}</span>)}</div></div><aside className="detail-sidebar"><b>Project details</b><span>Type · {detail?.project?.project_type||selected.project_type}</span><span>License · {detail?.project?.license?.id||selected.license||"See project page"}</span><span>Updated · {dateLabel(detail?.project?.updated||selected.date_modified)}</span><span>Client · {detail?.project?.client_side||"Unknown"}</span><span>Server · {detail?.project?.server_side||"Unknown"}</span><a href={"https://modrinth.com/"+(detail?.project?.project_type||"mod")+"/"+selected.slug} target="_blank" rel="noreferrer">Original Modrinth page ↗</a>{detail?.team?.length>0&&<div className="detail-creators"><b>Creators</b>{detail.team.slice(0,5).map((member,i)=>{const user=member.user||{};return <div className="creator-member" key={user.id||i}>{user.avatar_url?<img src={user.avatar_url} alt=""/>:<span className="creator-avatar-fallback">{(user.username||"C").slice(0,1).toUpperCase()}</span>}<span>{user.username||"Creator"}<small>{member.role||"Member"}</small></span></div>})}</div>}</aside></div>}
        {detailTab==="versions"&&<div className="version-download-panel">
          {versions.length===0?<p>Loading versions or no versions available.</p>:<>
            <div className="version-selectors">
              <label>Minecraft version<select value={downloadGameVersion} onChange={e=>{setDownloadGameVersion(e.target.value);setDownloadLoader("");}}><option value="">Choose game version</option>{[...new Set(versions.flatMap(v=>v.game_versions||[]))].sort((a,b)=>b.localeCompare(a,undefined,{numeric:true})).map(v=><option key={v} value={v}>{v}</option>)}</select></label>
              <label>Loader / platform<select value={downloadLoader} onChange={e=>setDownloadLoader(e.target.value)} disabled={!downloadGameVersion}><option value="">Choose loader</option>{[...new Set(versions.filter(v=>!downloadGameVersion||v.game_versions?.includes(downloadGameVersion)).flatMap(v=>v.loaders||[]))].sort().map(v=><option key={v} value={v}>{v[0].toUpperCase()+v.slice(1)}</option>)}</select></label>
            </div>
            {!downloadGameVersion||!downloadLoader?<p className="download-hint">Select a Minecraft version and loader to see matching releases.</p>:<div className="version-list">{versions.filter(v=>v.game_versions?.includes(downloadGameVersion)&&v.loaders?.includes(downloadLoader)).slice(0,15).map(v=><div className="version-row" key={v.id}><div><b>{v.name||v.version_number}</b><small>{(v.game_versions||[]).join(", ")} · {(v.loaders||[]).join(", ")} · {dateLabel(v.date_published)}</small></div><a href={v.files?.find(f=>f.primary)?.url||v.files?.[0]?.url||"#"} target="_blank" rel="noreferrer">Download ↗</a></div>)}{versions.filter(v=>v.game_versions?.includes(downloadGameVersion)&&v.loaders?.includes(downloadLoader)).length===0&&<p className="download-hint">No releases match this exact version and loader combination.</p>}</div>}
          </>}
        </div>}
        {detailTab==="gallery"&&<div className="detail-gallery">{(detail?.project?.gallery||selected.gallery||[]).length===0?<p>No screenshots have been added by this creator.</p>:(detail?.project?.gallery||selected.gallery||[]).map((item,i)=><button key={i} onClick={()=>setShowMedia(typeof item==="string"?item:item.url)}><img src={typeof item==="string"?item:item.url} alt={"Project screenshot "+(i+1)}/></button>)}</div>}
      </div>
      <div className="modal-footer"><span>Community project · Free download</span><a className="rainbow-button" href={"https://modrinth.com/"+(detail?.project?.project_type||"mod")+"/"+selected.slug} target="_blank" rel="noreferrer">Open project ↗</a></div>
    </div></div>}

    {serviceSelected&&<div className="modal-backdrop" onClick={()=>setServiceSelected(null)}><div className="service-modal" onClick={e=>e.stopPropagation()}><button className="modal-x" onClick={()=>setServiceSelected(null)}>×</button><div className={"service-modal-art "+serviceSelected.color}>{serviceSelected.icon}</div><span className="paid-pill">PAID SERVICE · CUSTOM QUOTE</span><h2>{serviceSelected.title}</h2><p>{serviceSelected.subtitle}</p><div className="service-includes"><span>✓ Scope confirmed before work</span><span>✓ Custom delivery plan</span><span>✓ Support and revisions discussed</span></div><a className="rainbow-button" href={"mailto:hello@arcticforge.example?subject="+encodeURIComponent("Quote request: "+serviceSelected.title)+"&body="+encodeURIComponent("Hello Arctic Forge, I would like a quote for "+serviceSelected.title+".\n\nProject details:\n")}>Request a quote ↗</a></div></div>}

    {showMedia&&<div className="media-viewer" onClick={()=>setShowMedia(null)}><button onClick={()=>setShowMedia(null)}>×</button><img src={showMedia} alt="Full-size media preview"/></div>}
  </main>;
}
