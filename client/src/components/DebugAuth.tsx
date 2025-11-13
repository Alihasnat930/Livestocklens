import { useAuth } from '@/context/AuthContext';
import { useLocation } from 'wouter';

export function DebugAuth() {
  const { isAuthenticated, loading, user } = useAuth();
  const [location] = useLocation();

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      background: 'rgba(0,0,0,0.8)',
      color: 'white',
      padding: '10px',
      borderRadius: '5px',
      fontSize: '12px',
      zIndex: 9999,
      fontFamily: 'monospace'
    }}>
      <div>Location: {location}</div>
      <div>Loading: {loading ? 'true' : 'false'}</div>
      <div>Authenticated: {isAuthenticated ? 'true' : 'false'}</div>
      <div>User: {user ? user.name : 'null'}</div>
      <div>Role: {user ? user.role : 'null'}</div>
    </div>
  );
}