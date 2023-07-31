import { router } from 'main';
import { observer } from 'mobx-react-lite';
import { AuthStatus, authStore } from '../../stores/AuthStore';
import Loading from './Loading';

const ProtectedRoute = observer(
  ({ children }: { children: React.ReactNode }) => {
    switch (authStore.status) {
      case AuthStatus.Authorized:
        return children;
      case AuthStatus.Pending:
        return <Loading />;
      case AuthStatus.Unauthorized:
        void router.navigate('/auth');
    }
  },
);
export default ProtectedRoute;
