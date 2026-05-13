'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Cookies from 'js-cookie';

const PUBLIC_ROUTES = ['/login'];

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (PUBLIC_ROUTES.includes(pathname)) return;

    const token = Cookies.get('access_token');

    if (!token) {
      router.replace(`/login?redirectTo=${pathname}`);
    }
  }, [router, pathname]);

  return <>{children}</>;
}
