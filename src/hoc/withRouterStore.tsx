import { FC } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { routerStore } from 'stores/RouterStore';

const withRouterStore = (Component: FC<any>) => (props: any) => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  routerStore.setRoute(location, navigate, params);

  return <Component {...props} />;
};
export default withRouterStore;
