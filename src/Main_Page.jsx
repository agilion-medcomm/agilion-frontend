// Main_Page.jsx (YENİ KOD - SADELEŞTİRİLMİŞ)

import React from 'react';
import './Main_Page.css';
import ExpertSection from "./components/ExpertSection/ExpertSection";
import Bolumler from "./components/Bolumler/Bolumler";
import FAQ from "./components/FAQ/FAQ";
import Doctors from "./components/Doctors/Doctors";
import Stats from "./components/Stats/Stats";
import Hero from './components/Hero_Img/Hero';
import FloatingButtons from './components/FloatingButtons/FloatingButtons';

export default function MainPage() {
  return (
    <>
      <Hero />
      <ExpertSection />
      <Bolumler />
      <FAQ />
      <Doctors />
      <Stats />
      <FloatingButtons />
    </>
  );
}