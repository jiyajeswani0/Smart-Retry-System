import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ListTodo, Activity, Power, Archive, Settings, Calendar } from 'lucide-react';
import './Layout.css';

const navItems = [
  { path: '/jobs', label: 'Jobs Table', icon: ListTodo },
  { path: '/backoff', label: 'Backoff Viz', icon: Activity },
];

export default function Sidebar() {
  return (
    <aside className="sidebar glass-panel-no-hover">
      <div className="sidebar-header">
        <h2>Menu</h2>
      </div>
      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink 
              key={item.path} 
              to={item.path} 
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
