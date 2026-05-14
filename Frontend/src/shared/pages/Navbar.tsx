import { Link, useNavigate } from 'react-router-dom';
import { logout } from '@/features/auth/utils/auth-storage';

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="border-b">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <div className="font-bold text-lg">Task App</div>

        <nav className="flex gap-4">
          <Link to="/profile">Profile</Link>
          <Link to="/tasks">Tasks</Link>
        </nav>

        <button onClick={handleLogout} className="text-sm">
          Logout
        </button>
      </div>
    </header>
  );
}