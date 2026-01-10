// In progress 
import { Routes, Route, Navigate } from 'react-router-dom';
import { Suspense } from 'react';
import { routes } from './routeConfig';
import RouteWrapper from './RouteWrapper';
import LoadingFallback from '../components/LoadingFallback';

const AppRoutes = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {routes.map(({ path, element, type }) => (
          <Route
            key={path}
            path={path}
            element={
              <RouteWrapper type={type}>
                {element}
              </RouteWrapper>
            }
          />
        ))}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
