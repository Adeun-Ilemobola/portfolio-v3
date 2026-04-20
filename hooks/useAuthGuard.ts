"use client";
import { useAuthUiStore } from '@/lib/Zustand/auth';
import React, { useEffect } from 'react'

export default function useAuthGuard() {
  const { isAuthenticated, checkSession } = useAuthUiStore();

  useEffect(() => {
    checkSession();
  }, [checkSession]);

 
}
