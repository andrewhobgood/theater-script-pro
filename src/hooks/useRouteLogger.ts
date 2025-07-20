import { useEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

export const useRouteLogger = () => {
  const location = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    console.log('🚀 ROUTE CHANGE:', {
      pathname: location.pathname,
      search: location.search,
      hash: location.hash,
      state: location.state,
      navigationType,
      timestamp: new Date().toISOString(),
      fullUrl: window.location.href
    });

    // Log any route-specific issues
    if (location.pathname === '/login') {
      console.log('✅ LOGIN ROUTE ACCESSED - Auth component should render');
    }

    if (location.pathname === '/auth') {
      console.log('✅ AUTH ROUTE ACCESSED - Auth component should render');
    }

    if (location.pathname === '*' || location.pathname === '/404') {
      console.log('❌ 404 ROUTE - User accessed non-existent route');
    }

    // Log current route state
    console.log('📍 Current browser location:', window.location);
    console.log('📍 React Router location:', location);
  }, [location, navigationType]);
};