
import RequireAuth from '@/components/auth/RequireAuth';
import DashboardPrestador from './DashboardPrestador';

export default function DashboardPrestadorPage() {
  return (
    <RequireAuth>
      <DashboardPrestador />
    </RequireAuth>
  );
}
