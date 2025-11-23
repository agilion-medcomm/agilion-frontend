// src/components/Layout/ProtectedStaffRoute.jsx (GÜNCEL)

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useStaffAuth } from '../../context/StaffAuthContext';

export default function ProtectedStaffRoute() {
  let user, contextError = null;
  try {
    ({ user } = useStaffAuth());
  } catch (e) {
    contextError = e;
  }

  if (contextError) {
    return (
      <div style={{padding:40, color:'red', fontWeight:'bold', fontSize:20}}>
        Personel oturum context'i bulunamadı!<br/>
        Lütfen <code>StaffAuthProvider</code>'ı en dışta kullan ve importları kontrol et.<br/>
        <pre>{String(contextError)}</pre>
      </div>
    );
  }

  if (!user) {
    // Login sayfasına geri at ve geçmişi sil.
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}