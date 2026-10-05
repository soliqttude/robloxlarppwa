'use client';

import {useEffect,useMemo,useState} from 'react';

type Tab='home'|'discover'|'avatar'|'profile';
type Modal='menu'|'settings'|'edit'|'notifications'|'messages'|'friends'|'game'|'inventory'|'avatar'|null;
type Game={name:string;players:string;genre:string};
type Item={name:string;type:string};

const games:Game[]=[
 {name:'Brookhaven RP',players:'1.2M',genre:'Roleplay'},{name:'Blox Fruits',players:'890K',genre:'Adventure'},
 {name:'Fisch',players:'340K',genre:'Adventure'},{name:'Da Hood',players:'210K',genre:'Action'},
 {name:'Adopt Me!',players:'180K',genre:'Roleplay'},{name:'Murder Mystery 2',players:'95K',genre:'Survival'}
];
const items:Item[]=[{name:'Classic Cap',type:'Hat'},{name:'Black Hoodie',type:'Shirt'},{name:'Classic Pants',type:'Pants'},{name:'Smile',type:'Face'}];
const defaults={name:'Rari',display:'Rari',robux:10000,description:'welcome to my profile',friends:128,followers:542,following:91};

export default function Home(){
 const[tab,setTab]=useState<Tab>('home');
 const[name,setName]=useState(defaults.name),[display,setDisplay]=useState(defaults.display),[robux,setRobux]=useState(defaults.robux),[description,setDescription]=useState(defaults.description);
 const[search,setSearch]=useState(''),[modal,setModal]=useState<Modal>(null),[toast,setToast]=useState(''),[selectedGame,setSelectedGame]=useState<Game|null>(null);
 const[avatar,setAvatar]=useState({skin:'#d6a574',shirt:'#202020',hat:true});
 useEffect(()=>{try{const x=JSON.parse(localStorage.getItem('rlp-state')||'null');if(x){setName(x.name??defaults.name);setDisplay(x.display??defaults.display);setRobux(x.robux??defaults.robux);setDescription(x.description??defaults.description);setAvatar(x.avatar??avatar)}}catch{}},[]);
 useEffect(()=>{localStorage.setItem('rlp-state',JSON.stringify({name,display,robux,description,avatar}))},[name,display,robux,description,avatar]);
 useEffect(()=>{if(!toast)return;const t=setTimeout(()=>setToast(''),1800);return()=>clearTimeout(t)},[toast]);
 const filtered=useMemo(()=>games.filter(g=>g.name.toLowerCase().includes(search.toLowerCase())),[search]);
 const openGame=(g:Game)=>{setSelectedGame(g);setModal('game')};
 return <main className="phone">
  <header className="topbar">
   <button className="iconBtn" onClick={()=>setModal('menu')} aria-label="Menu"><Icon name="menu"/></button>
   <div className="brand"><span className="brandMark">R</span><span>Roblox</span></div>
   <div className="topActions"><button className="iconBtn" onClick={()=>setModal('notifications')} aria-label="Notifications"><Icon name="bell"/></button><button className="iconBtn" onClick={()=>setModal('messages')} aria-label="Messages"><Icon name="chat"/></button></div>
  </header>
  <section className="content">
   {tab==='home'&&<HomeScreen name={display} robux={robux} setTab={setTab} onEdit={()=>setModal('edit')} openGame={openGame}/>}
   {tab==='discover'&&<Discover search={search} setSearch={setSearch} games={filtered} openGame={openGame}/>}
   {tab==='avatar'&&<AvatarScreen name={display} avatar={avatar} onCustomize={()=>setModal('avatar')} onInventory={()=>setModal('inventory')}/>}
   {tab==='profile'&&<Profile name={name} display={display} robux={robux} description={description} onEdit={()=>setModal('edit')} onFriends={()=>setModal('friends')} />}
  </section>
  <nav className="nav">
   <NavButton active={tab==='home'} icon="home" label="Home" onClick={()=>setTab('home')}/>
   <NavButton active={tab==='discover'} icon="search" label="Discover" onClick={()=>setTab('discover')}/>
   <NavButton active={tab==='avatar'} icon="avatar" label="Avatar" onClick={()=>setTab('avatar')}/>
   <NavButton active={tab==='profile'} icon="user" label="Profile" onClick={()=>setTab('profile')}/>
  </nav>

  {modal==='menu'&&<Sheet title="Menu" close={()=>setModal(null)}>
   <SheetRow icon="♙" title="Avatar" sub="Customize your simulated avatar" onClick={()=>{setTab('avatar');setModal(null)}}/>
   <SheetRow icon="▦" title="Inventory" sub="View simulated items" onClick={()=>setModal('inventory')}/>
   <SheetRow icon="●" title="Profile" sub="View your public profile" onClick={()=>{setTab('profile');setModal(null)}}/>
   <SheetRow icon="♙" title="Friends" sub="Manage simulated friends" onClick={()=>setModal('friends')}/>
   <SheetRow icon="⚙" title="Settings" sub="Simulator preferences" onClick={()=>setModal('settings')}/>
  </Sheet>}
  {modal==='settings'&&<Sheet title="Settings" close={()=>setModal(null)}>
   <div className="setting"><span>Simulator mode</span><b>ON</b></div><div className="setting"><span>Local persistence</span><b>ON</b></div><div className="setting"><span>Mobile layout</span><b>ON</b></div>
   <button className="wideBtn" onClick={()=>{localStorage.removeItem('rlp-state');location.reload()}}>Reset simulated account</button>
  </Sheet>}
  {modal==='edit'&&<Sheet title="Edit Profile" close={()=>setModal(null)}>
   <label className="field">Username<input value={name} onChange={e=>setName(e.target.value)}/></label>
   <label className="field">Display name<input value={display} onChange={e=>setDisplay(e.target.value)}/></label>
   <label className="field">Robux<input type="number" min="0" value={robux} onChange={e=>setRobux(Math.max(0,Number(e.target.value)||0))}/></label>
   <label className="field">About<input value={description} onChange={e=>setDescription(e.target.value)}/></label>
   <button className="primaryBtn" onClick={()=>{setToast('Profile saved');setModal(null)}}>Save changes</button>
  </Sheet>}
  {modal==='notifications'&&<Sheet title="Notifications" close={()=>setModal(null)}><Notification text="Your profile was updated" time="Just now"/><Notification text="You have 3 new friend requests" time="5m"/><Notification text="Fisch is having a new event" time="1h"/></Sheet>}
  {modal==='messages'&&<Sheet title="Messages" close={()=>setModal(null)}><Message name="Builderman" text="welcome back!" time="2m"/><Message name="Alex" text="wanna play?" time="18m"/><Message name="Sam" text="check out this game" time="1h"/></Sheet>}
  {modal==='friends'&&<Sheet title="Friends" close={()=>setModal(null)}><div className="friendCount">128 Friends</div>{['Alex','Sam','Noah','Mika','Jay'].map(n=><Friend name={n} key={n}/>)}</Sheet>}
  {modal==='inventory'&&<Sheet title="Inventory" close={()=>setModal(null)}><div className="inventoryGrid">{items.map(i=><div className="item" key={i.name}><div className="itemVisual">▦</div><b>{i.name}</b><small>{i.type}</small></div>)}</div></Sheet>}
  {modal==='avatar'&&<Sheet title="Customize Avatar" close={()=>setModal(null)}>
   <div className="previewSmall"><AvatarFigure avatar={avatar} name={display}/></div>
   <p className="fieldTitle">Skin tone</p><div className="swatches">{['#f1c27d','#d6a574','#8d5524','#5c3830'].map(c=><button key={c} style={{background:c}} className="swatch" onClick={()=>setAvatar(a=>({...a,skin:c}))}/>)}</div>
   <p className="fieldTitle">Shirt</p><div className="swatches">{['#202020','#3d5a80','#7b1e1e','#f1f1f1'].map(c=><button key={c} style={{background:c}} className="swatch" onClick={()=>setAvatar(a=>({...a,shirt:c}))}/>)}</div>
   <button className="wideBtn" onClick={()=>setAvatar(a=>({...a,hat:!a.hat}))}>{avatar.hat?'Remove hat':'Add hat'}</button>
  </Sheet>}
  {modal==='game'&&selectedGame&&<Sheet title={selectedGame.name} close={()=>setModal(null)}>
   <div className="gameHero"><span className="playTile">▶</span></div><h2>{selectedGame.name}</h2><p className="muted">{selectedGame.genre} · {selectedGame.players} playing</p>
   <button className="primaryBtn" onClick={()=>{setToast('Launch simulated experience');setModal(null)}}>▶ Play</button>
   <div className="detailRow"><span>Rating</span><b>96%</b></div><div className="detailRow"><span>Visits</span><b>24.8M</b></div><div className="detailRow"><span>Created by</span><b>Simulator Studio</b></div>
  </Sheet>}
  {toast&&<div className="toast">{toast}</div>}
 </main>
}

function Icon({name}:{name:string}){const paths:Record<string,string>={menu:'M4 7h16M4 12h16M4 17h16',bell:'M6 17h12l-1.5-2.2V10a4.5 4.5 0 0 0-9 0v4.8L6 17Zm3.5 3h5',chat:'M5 6h14v10H9l-4 3v-3H5z',home:'M3 10.5 12 3l9 7.5V21h-6v-6h-6v6H3z',search:'m19 19-4-4m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0',avatar:'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 9a7 7 0 0 1 14 0',user:'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 9a7 7 0 0 1 14 0',box:'M4 7l8-4 8 4-8 4-8-4Zm0 0v10l8 4 8-4V7M8 9l8 4',settings:'M12 15.2a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4ZM12 3v2m0 14v2M3 12h2m14 0h2'};return <svg className="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[name]||paths.user}/></svg>}
function NavButton({active,icon,label,onClick}:{active:boolean;icon:string;label:string;onClick:()=>void}){return <button className={'navBtn '+(active?'active':'')} onClick={onClick}><Icon name={icon}/><small>{label}</small></button>}
function HomeScreen({name,robux,setTab,onEdit,openGame}:{name:string;robux:number;setTab:(t:Tab)=>void;onEdit:()=>void;openGame:(g:Game)=>void}){return <><div className="hero"><div><p className="eyebrow">WELCOME BACK</p><h1>{name}</h1><p className="muted">What are you playing today?</p></div><div className="balance"><span>R$</span>{robux.toLocaleString()}</div></div><SectionTitle title="Continue" action="See All" onClick={()=>setTab('discover')}/><div className="gameScroller">{games.slice(0,4).map(g=><GameCard game={g} key={g.name} onClick={()=>openGame(g)}/>)}</div><SectionTitle title="Recommended" action="See All" onClick={()=>setTab('discover')}/><div className="list">{games.slice(2).map(g=><GameRow game={g} key={g.name} onClick={()=>openGame(g)}/>)}</div><button className="editBar" onClick={onEdit}>⚙ <span>Edit simulated account</span><b>›</b></button></>}
function Discover({search,setSearch,games,openGame}:{search:string;setSearch:(s:string)=>void;games:Game[];openGame:(g:Game)=>void}){return <><h1>Discover</h1><div className="search"><span>⌕</span><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search experiences"/></div><div className="chips"><span className="chip selected">For You</span><span className="chip">Popular</span><span className="chip">Top Rated</span></div><div className="discoverGrid">{games.map(g=><GameCard game={g} key={g.name} onClick={()=>openGame(g)}/>)}</div>{games.length===0&&<div className="empty">No experiences found.</div>}</>}
function AvatarScreen({name,avatar,onCustomize,onInventory}:{name:string;avatar:{skin:string;shirt:string;hat:boolean};onCustomize:()=>void;onInventory:()=>void}){return <><h1>Avatar</h1><div className="avatarStage"><AvatarFigure avatar={avatar} name={name}/><p className="muted">Classic simulated avatar</p></div><div className="card"><b>Customize</b><div className="customGrid"><button onClick={onCustomize}>Body<span>›</span></button><button onClick={onCustomize}>Clothing<span>›</span></button><button onClick={onCustomize}>Accessories<span>›</span></button><button onClick={onCustomize}>Animations<span>›</span></button></div></div><button className="editBar" onClick={onInventory}>▦ <span>Open inventory</span><b>›</b></button></>}
function AvatarFigure({avatar,name}:{avatar:{skin:string;shirt:string;hat:boolean};name:string}){return <div className="avatarFigure">{avatar.hat&&<div className="hat"/>}<div className="head" style={{background:avatar.skin}}>{name.slice(0,1)}</div><div className="body" style={{background:avatar.shirt}}/></div>}
function Profile({name,display,robux,description,onEdit,onFriends}:{name:string;display:string;robux:number;description:string;onEdit:()=>void;onFriends:()=>void}){return <><div className="profileHead"><div className="bigAvatar">{display.slice(0,1)}</div><h1>{display}</h1><p className="muted">@{name}</p><button className="outlineBtn" onClick={onEdit}>Edit Profile</button></div><div className="stats"><button onClick={onFriends}><b>128</b><span>Friends</span></button><div><b>542</b><span>Followers</span></div><div><b>91</b><span>Following</span></div></div><div className="card"><b>About</b><p>{description}</p><span className="pill">R$ {robux.toLocaleString()}</span></div><div className="card"><b>Inventory</b><p className="muted">Open the menu or Avatar tab to browse simulated items.</p></div></>}
function SectionTitle({title,action,onClick}:{title:string;action:string;onClick:()=>void}){return <div className="sectionTitle"><h2>{title}</h2><button onClick={onClick}>{action}</button></div>}
function GameCard({game,onClick}:{game:Game;onClick:()=>void}){return <button className="gameCard" onClick={onClick}><div className="thumb"><span className="playTile">▶</span></div><b>{game.name}</b><small>{game.genre}</small><small className="muted">{game.players} playing</small></button>}
function GameRow({game,onClick}:{game:Game;onClick:()=>void}){return <button className="gameRow" onClick={onClick}><div className="miniThumb"><span className="playTile small">▶</span></div><div><b>{game.name}</b><small>{game.genre}</small><small className="muted">{game.players} playing</small></div><span>›</span></button>}
function Notification({text,time}:{text:string;time:string}){return <div className="notice"><span className="dot"/><div><b>{text}</b><small>{time}</small></div></div>}
function Message({name,text,time}:{name:string;text:string;time:string}){return <div className="notice"><div className="messageAvatar">{name.slice(0,1)}</div><div><b>{name}</b><small>{text} · {time}</small></div></div>}
function Friend({name}:{name:string}){return <div className="notice"><div className="messageAvatar">{name.slice(0,1)}</div><div><b>{name}</b><small>Friend</small></div><button className="miniBtn">View</button></div>}
function Sheet({title,close,children}:{title:string;close:()=>void;children:React.ReactNode}){return <div className="overlay" onClick={close}><div className="sheet" onClick={e=>e.stopPropagation()}><div className="grab"/><div className="sheetHead"><b>{title}</b><button onClick={close}>×</button></div>{children}</div></div>}
function SheetRow({icon,title,sub,onClick}:{icon:string;title:string;sub:string;onClick:()=>void}){return <button className="sheetRow" onClick={onClick}><span className="sheetIcon">{icon}</span><span><b>{title}</b><small>{sub}</small></span><i>›</i></button>}
