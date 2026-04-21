"use client";
import { useAuthUiStore } from '@/lib/Zustand/auth';
import React, { Dispatch, useEffect } from 'react'
type Props = {
  ShowAuthPopup: Dispatch<React.SetStateAction<boolean>>
}
export default function useAuthGuard({ ShowAuthPopup }: Props) {
  const { isAuthenticated, checkSession , sendAuthRequest , createSession } = useAuthUiStore();

  useEffect(() => {
    const  verifyAuthentication = async () => {
      const authenticated = await checkSession();
      if (!authenticated) {
        ShowAuthPopup(true);
      }
    };

    verifyAuthentication();
  }, [checkSession]);

  return { isAuthenticated , sendAuthRequest , createSession };
}
