import { Search, Bell, User } from 'lucide-react';
import './Layout.css';

export default function Navbar() {
  return (
    <header className="navbar glass-panel-no-hover">
      <div className="navbar-left">
        <div className="logo text-gradient">Retry System</div>
      </div>
      <div className="navbar-right">
        <div className="search-bar">
          <Search size={18} className="search-icon" />
          <input type="text" placeholder="Search..." />
        </div>
        <button className="btn-icon bell-btn">
          <Bell size={20} />
          <span className="notification-dot"></span>
        </button>
        <div className="avatar">
          <User size={20} />
        </div>
      </div>
    </header>
  );
}
