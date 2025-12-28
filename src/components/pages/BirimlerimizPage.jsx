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

  const handleCardClick = (unitId) => {
    setSelectedId(unitId);

    setTimeout(() => {
      if (contentRef.current) {
        const headerOffset = 100;
        const elementPosition = contentRef.current.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }, 100);
  };

  const renderUnitContent = (unitId) => {
    const text = t(`medical:units.list.${unitId}.text`);
    const text2 = t(`medical:units.list.${unitId}.text2`, { defaultValue: '' });
    const text3 = t(`medical:units.list.${unitId}.text3`, { defaultValue: '' });
    const tags = t(`medical:units.list.${unitId}.tags`, { returnObjects: true, defaultValue: [] });

    return (
      <>
        <p>{text}</p>
        {text2 && <p>{text2}</p>}
        {text3 && <p>{text3}</p>}
        {Array.isArray(tags) && tags.length > 0 && (
          <div className="birim-tags">
            {tags.map((tag, idx) => (
              <span key={idx}>{tag}</span>
            ))}
          </div>
        )}
      </>
    );
  };

  const units = useMemo(() => [
    {
      id: 'anestezi',
      title: t('medical:units.list.anestezi.title'),
      icon: '/d1.png',
      contentTitle: t('medical:units.list.anestezi.content_title'),
    },
    {
      id: 'ameliyathane',
      title: t('medical:units.list.ameliyathane.title'),
      icon: '/d2.png',
      contentTitle: t('medical:units.list.ameliyathane.content_title'),
    },
    {
      id: 'dogumhane',
      title: t('medical:units.list.dogumhane.title'),
      icon: '/d3.png',
      contentTitle: t('medical:units.list.dogumhane.content_title'),
    },
    {
      id: 'rontgen',
      title: t('medical:units.list.rontgen.title'),
      icon: '/d4.png',
      contentTitle: t('medical:units.list.rontgen.content_title'),
    },
    {
      id: 'laboratuvar',
      title: t('medical:units.list.laboratuvar.title'),
      icon: '/d5.png',
      contentTitle: t('medical:units.list.laboratuvar.content_title'),
    },
    {
      id: 'fizik',
      title: t('medical:units.list.fizik.title'),
      icon: '/d1.png',
      contentTitle: t('medical:units.list.fizik.content_title'),
    },
    {
      id: 'saglik_raporlari',
      title: t('medical:units.list.saglik_raporlari.title'),
      icon: '/d6.png',
      contentTitle: t('medical:units.list.saglik_raporlari.content_title'),
    },
    {
      id: 'ultrason',
      title: t('medical:units.list.ultrason.title'),
      icon: '/d7.png',
      contentTitle: t('medical:units.list.ultrason.content_title'),
    },
    {
      id: 'solunum',
      title: t('medical:units.list.solunum.title'),
      icon: '/d8.png',
      contentTitle: t('medical:units.list.solunum.content_title'),
    },
    {
      id: 'odyometri',
      title: t('medical:units.list.odyometri.title'),
      icon: '/d9.png',
      contentTitle: t('medical:units.list.odyometri.content_title'),
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
              onClick={() => handleCardClick(unit.id)}
            >
              <img src={unit.icon} alt={unit.title} className="birim-card__icon" />
              <div className="birim-card__title">{unit.title}</div>
              <img src="/angle-right.svg" alt="" className="birim-card-arrow-icon" width="24" height="24" />
            </div>
          ))}
        </div>
      </div>

      <div className="birim-content-section" ref={contentRef}>
        <div className="birim-content-container">
          <div className="birim-content-header">
            <h2 className="birim-content-title">
              {selectedUnit?.contentTitle}
            </h2>
          </div>
          <div className="birim-content-text">
            {selectedUnit && renderUnitContent(selectedUnit.id)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BirimlerimizPage;
