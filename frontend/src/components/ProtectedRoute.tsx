import { Navigate, Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks/useAuth';

export function ProtectedRoute() {
  const { t } = useTranslation();
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <div>{t('common.loading')}</div>;

  return isAuthenticated ? <Outlet /> : <Navigate to="/welcome" />;
}
