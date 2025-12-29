import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './BirimlerimizPage.css';

const BirimlerimizPage = () => {
  const { t } = useTranslation(['medical']);
  const location = useLocation();
  const [selectedId, setSelectedId] = useState(location.state?.selectedId || 'anestezi');
  const contentRef = useRef(null);

  useEffect(() => {
    if (location.state?.selectedId) {
      setSelectedId(location.state.selectedId);
    }
  }, [location.state]);

  const handleUnitClick = (unitId) => {
    setSelectedId(unitId);
    // Scroll to content section with offset for header
    setTimeout(() => {
      if (contentRef.current) {
        const headerOffset = 100; // Navbar yüksekliği için offset
        const elementPosition = contentRef.current.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }, 100);
  };

  const units = useMemo(() => [
    {
      id: 'anestezi',
      title: t('medical:units.list.anestezi.title'),
      icon: '/d1.png',
      contentTitle: t('medical:units.list.anestezi.content_title'),
      content: <p>{t('medical:units.list.anestezi.text')}</p>
    },
    {
      id: 'ameliyathane',
      title: t('medical:units.list.ameliyathane.title'),
      icon: '/d2.png',
      contentTitle: t('medical:units.list.ameliyathane.content_title'),
      content: <p>{t('medical:units.list.ameliyathane.text')}</p>
    },
    {
      id: 'dogumhane',
      title: t('medical:units.list.dogumhane.title'),
      icon: '/d3.png',
      contentTitle: t('medical:units.list.dogumhane.content_title'),
      content: <p>{t('medical:units.list.dogumhane.text')}</p>
    },
    {
      id: 'rontgen',
      title: t('medical:units.list.rontgen.title'),
      icon: '/d4.png',
      contentTitle: t('medical:units.list.rontgen.content_title'),
      content: <p>{t('medical:units.list.rontgen.text')}</p>
    },
    {
      id: 'laboratuvar',
      title: t('medical:units.list.laboratuvar.title'),
      icon: '/d5.png',
      contentTitle: t('medical:units.list.laboratuvar.content_title'),
      content: <p>{t('medical:units.list.laboratuvar.text')}</p>
    },
    {
      id: 'fizik',
      title: t('medical:units.list.fizik.title'),
      icon: '/d1.png',
      contentTitle: t('medical:units.list.fizik.content_title'),
      content: <p>{t('medical:units.list.fizik.text')}</p>
    },
    {
      id: 'saglik_raporlari',
      title: t('medical:units.list.saglik_raporlari.title'),
      icon: '/d6.png',
      contentTitle: t('medical:units.list.saglik_raporlari.content_title'),
      content: (
        <>
          <p>{t('medical:units.list.saglik_raporlari.text')}</p>
          <div className="birim-tags">
            {t('medical:units.list.saglik_raporlari.tags', { returnObjects: true }).map((tag, idx) => (
              <span key={idx}>{tag}</span>
            ))}
          </div>
        </>
      )
    },
    {
      id: 'ultrason',
      title: t('medical:units.list.ultrason.title'),
      icon: '/d7.png',
      contentTitle: t('medical:units.list.ultrason.content_title'),
      content: <p>{t('medical:units.list.ultrason.text')}</p>
    },
    {
      id: 'solunum',
      title: t('medical:units.list.solunum.title'),
      icon: '/d8.png',
      contentTitle: t('medical:units.list.solunum.content_title'),
      content: <p>{t('medical:units.list.solunum.text')}</p>
    },
    {
      id: 'odyometri',
      title: t('medical:units.list.odyometri.title'),
      icon: '/d9.png',
      contentTitle: t('medical:units.list.odyometri.content_title'),
      content: <p>{t('medical:units.list.odyometri.text')}</p>
    }
  ], [t]);

  const selectedUnit = units.find(u => u.id === selectedId);

  return (
    <div className="birimlerimiz-page">
      <div className="birimlerimiz-header">
        <h1 className="birimlerimiz-title">{t('medical:units.title')}</h1>

        <div className="birimlerimiz-grid">
          {units.map((unit) => (
            <div
              key={unit.id}
              className={`birim-card ${selectedId === unit.id ? 'selected' : ''}`}
              onClick={() => handleUnitClick(unit.id)}
            >
              <img src={unit.icon} alt={unit.title} className="birim-card__icon" />
              <div className="birim-card__title">{unit.title}</div>
              <img src="/angle-right.svg" alt="" className="birim-card-arrow-icon" width="24" height="24" />
            </div>
          ))}
        </div>
      </div>

      {/* Content Section */}
      <div className="birim-content-section" ref={contentRef}>
        <div className="birim-content-container">
          <div className="birim-content-header">
            <h2 className="birim-content-title">
              {selectedUnit?.contentTitle}
            </h2>
          </div>
          <div className="birim-content-text">
            {selectedUnit?.content}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BirimlerimizPage;
