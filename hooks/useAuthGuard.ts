"use client";
import { useAuthUiStore } from '@/lib/Zustand/auth';
import React, { Dispatch, useEffect } from 'react'
type Props = {
  ShowAuthPopup: Dispatch<React.SetStateAction<boolean>>
}
export default function useAuthGuard({ ShowAuthPopup }: Props) {
  const { isAuthenticated, checkSession , sendAuthRequest , createSession , token } = useAuthUiStore();

  useEffect(() => {
    const  verifyAuthentication = async () => {
      const authenticated = await checkSession();
      if (isAuthenticated || authenticated) {
        ShowAuthPopup(false);
      }else if (!isAuthenticated && !authenticated) {
        ShowAuthPopup(true);
      }

    };

    verifyAuthentication();
  }, [token ]);

  return { isAuthenticated , sendAuthRequest , createSession };
}
