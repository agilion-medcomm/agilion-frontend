// src/components/Layout/ProtectedPersonnelRoute.jsx (GÜNCEL)

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { usePersonnelAuth } from '../../context/PersonnelAuthContext';

export default function ProtectedPersonnelRoute() {
  let user, contextError = null;
  try {
    ({ user } = usePersonnelAuth());
  } catch (e) {
    contextError = e;
  }

  if (contextError) {
    return (
      <div style={{padding:40, color:'red', fontWeight:'bold', fontSize:20}}>
        Personel oturum context'i bulunamadı!<br/>
        Lütfen <code>PersonnelAuthProvider</code>'ı en dışta kullan ve importları kontrol et.<br/>
        <pre>{String(contextError)}</pre>
      </div>
    );
  }

  if (!user) {
    // DÜZELTME: Personel oturumu yoksa, personel giriş sayfasına yönlendir.
    return <Navigate to="/personelLogin" replace />;
  }

  return <Outlet />;
}