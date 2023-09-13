import { observer } from 'mobx-react-lite';
import { AuthStatus, authStore } from '../../stores/AuthStore';
import Auth from './Auth';
import Loading from './Loading';

const ProtectedRoute = observer(
  ({ children }: { children: React.ReactNode }) => {
    switch (authStore.status) {
      case AuthStatus.Authorized:
        return children;
      case AuthStatus.Pending:
        return <Loading />;
      case AuthStatus.Unauthorized:
        return <Auth />;
    }
  },
);
export default ProtectedRoute;
