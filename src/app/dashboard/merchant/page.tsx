
import RequireAuth from '@/components/auth/RequireAuth';
import DashboardMerchant from './DashboardMerchant';

export default function DashboardMerchantPage() {
  return (
    <RequireAuth>
      <DashboardMerchant />
    </RequireAuth>
  );
}
