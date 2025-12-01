'use client';

import { useEffect } from 'react';
import { getCurrentUser } from '@/lib/cognitoActions';
import { useAuthStore } from '@/lib/authStore';

export default function AuthInitializer() {
  const setUser = useAuthStore((state) => state.setUser);
  const setInitialized = useAuthStore((state) => state.setInitialized);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const user = await getCurrentUser();
        if (!mounted) return;
        setUser(user);
      } finally {
        if (mounted) {
          setInitialized(true);
        }
      }
    })();

    return () => {
      mounted = false;
    };
  }, [setUser, setInitialized]);

  return null;
}


