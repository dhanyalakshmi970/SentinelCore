import { useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  AlertTriangle, Bell, ChevronLeft, ChevronRight, ClipboardCheck, FileClock,
  LayoutDashboard, LogOut, Menu, MonitorCog, Network, Plus, Search, Shield,
  ShieldAlert, UserRound, X, Activity
} from '../components/Icons';

const items = [
  { label: 'Overview', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Assets', path: '/assets', icon: MonitorCog },
  { label: 'Alerts', path: '/alerts', icon: Bell },
  { label: 'Incidents', path: '/incidents', icon: ShieldAlert },
  { label: 'Vulnerabilities', path: '/vulnerabilities', icon: AlertTriangle },
  { label: 'Compliance', path: '/compliance', icon: ClipboardCheck },
  { label: 'Audit Logs', path: '/audit-logs', icon: FileClock },
  { label: 'Add Asset', path: '/add-asset', icon: Plus, adminOnly: true },
];

function Sidebar({ collapsed, setCollapsed, mobileOpen, setMobileOpen }) {
  const { roles, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const visible = items.filter(i => !i.adminOnly || isAdmin);
  const role = roles?.[0]?.replace('ROLE_', '') || 'VIEWER';

  return <>
    <div className={`mobile-backdrop ${mobileOpen ? 'show' : ''}`} onClick={() => setMobileOpen(false)} />
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
      <div className="brand">
        <div className="brand-mark"><Shield size={20} /></div>
        {!collapsed && <div><strong>SENTINEL</strong><span>CORE</span></div>}
        <button className="icon-btn sidebar-close" onClick={() => setMobileOpen(false)}><X size={18}/></button>
      </div>
      <div className="workspace"><div className="workspace-dot"/><div className="workspace-copy"><span>Workspace</span><b>Enterprise SOC</b></div></div>
      <nav className="nav-list">
        <div className="nav-caption">MONITORING</div>
        {visible.slice(0, 3).map(({label,path,icon:Icon}) => <NavLink key={path} to={path} onClick={() => setMobileOpen(false)} className={({isActive}) => `nav-item ${isActive ? 'active':''}`}><Icon size={18}/>{!collapsed && <span>{label}</span>}{!collapsed && label==='Alerts' && <span className="nav-badge">LIVE</span>}</NavLink>)}
        <div className="nav-caption">SECURITY OPERATIONS</div>
        {visible.slice(3).map(({label,path,icon:Icon}) => <NavLink key={path} to={path} onClick={() => setMobileOpen(false)} className={({isActive}) => `nav-item ${isActive ? 'active':''}`}><Icon size={18}/>{!collapsed && <span>{label}</span>}</NavLink>)}
      </nav>
      <div className="sidebar-bottom">
        {!collapsed && <div className="status-card"><div className="status-icon"><Activity size={16}/></div><div><b>Monitoring active</b><span>All services operational</span></div></div>}
        <button className="nav-item logout-btn" onClick={() => { logout(); navigate('/login'); }}><LogOut size={18}/>{!collapsed && <span>Sign out</span>}</button>
        <button className="collapse-btn" onClick={() => setCollapsed(!collapsed)}>{collapsed ? <ChevronRight size={18}/> : <ChevronLeft size={18}/>} {!collapsed && 'Collapse'}</button>
      </div>
    </aside>
  </>;
}

function Topbar({ onMenu }) {
  const location = useLocation();
  const { roles } = useAuth();
  const titles = { '/dashboard':'Security Overview','/assets':'Asset Inventory','/alerts':'Alert Center','/incidents':'Incident Management','/vulnerabilities':'Vulnerability Management','/compliance':'Compliance Center','/audit-logs':'Audit Trail','/add-asset':'Register Asset' };
  const title = titles[location.pathname] || 'Security Operations';
  const role = roles?.[0]?.replace('ROLE_', '') || 'VIEWER';
  return <header className="topbar">
    <button className="icon-btn menu-btn" onClick={onMenu}><Menu size={21}/></button>
    <div className="crumb"><span>SentinelCore</span><i>/</i><b>{title}</b></div>
    <div className="top-actions">
      <div className="global-search"><Search size={17}/><input placeholder="Search infrastructure..." /></div>
      <button className="icon-btn"><Bell size={19}/><span className="notification-dot"/></button>
      <div className="profile"><div className="avatar">SC</div><div className="profile-copy"><b>Security Operator</b><span>{role}</span></div></div>
    </div>
  </header>;
}

export default function AppShell() {
  const [collapsed,setCollapsed] = useState(false);
  const [mobileOpen,setMobileOpen] = useState(false);
  return <div className="app-shell"><Sidebar {...{collapsed,setCollapsed,mobileOpen,setMobileOpen}}/><div className={`main-shell ${collapsed?'sidebar-collapsed':''}`}><Topbar onMenu={() => setMobileOpen(true)}/><main className="page-content"><Outlet/></main></div></div>;
}
