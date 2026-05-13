'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Cookies from 'js-cookie';

const PUBLIC_ROUTES = ['/login'];

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // Check if current route is public
    console.log('Checking auth for route:', pathname);
    if (PUBLIC_ROUTES.includes(pathname)) {
      setIsAuthorized(true);
      setIsChecking(false);
      return;
    }

    // Check for token
    const token = Cookies.get('access_token');

    if (token) {
      setIsAuthorized(true);
      setIsChecking(false);
    } else {
      // Redirect only once - not on every render
      router.replace(`/login?redirectTo=${pathname}`);
      setIsChecking(false);
    }
  }, [pathname, router]);

  // Don't render children while checking or if not authorized
  if (isChecking || !isAuthorized) {
    return null;
  }

  return <>{children}</>;
}
