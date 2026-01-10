// In progress 
import ProtectedRoute from '../components/ProtectedRoute';
import CreatorRoute from '../components/CreatorRoute';
import { ROUTE_TYPES } from './routeConfig';

const RouteWrapper = ({ type, children }) => {
  if (type === ROUTE_TYPES.PROTECTED) {
    return <ProtectedRoute>{children}</ProtectedRoute>;
  }

  if (type === ROUTE_TYPES.CREATOR) {
    return <CreatorRoute>{children}</CreatorRoute>;
  }

  return children; // Public
};

export default RouteWrapper;
