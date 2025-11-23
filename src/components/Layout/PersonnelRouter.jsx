// src/components/Layout/PersonnelRouter.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';

// Bu bileşen, /personelLogin altındaki tüm rotaların (panellerin)
// yükleneceği boş bir kapsayıcı görevi görür.
export default function PersonnelRouter() {
  return <Outlet />; 
}