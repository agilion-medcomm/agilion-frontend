import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './BolumlerimizPage.css';

const BolumlerimizPage = () => {
  const { t } = useTranslation(['medical']);
  const location = useLocation();
  const [selectedId, setSelectedId] = useState(location.state?.selectedId || 'acil');
  const contentRef = useRef(null);

  useEffect(() => {
    if (location.state?.selectedId) {
      setSelectedId(location.state.selectedId);
    }
  }, [location.state]);

  const handleDeptClick = (deptId) => {
    setSelectedId(deptId);
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

  const departments = useMemo(() => [
    {
      id: 'acil',
      title: t('medical:departments.list.acil.title'),
      icon: '/b11.png',
      isAcil: true,
      contentTitle: t('medical:departments.list.acil.content_title'),
      content: (
        <>
          <p>{t('medical:departments.list.acil.p1')}</p>
          <p>{t('medical:departments.list.acil.p2')}</p>
          <div className="bolum-tags">
            {t('medical:departments.list.acil.tags', { returnObjects: true }).map((tag, idx) => (
              <span key={idx}>{tag}</span>
            ))}
          </div>
        </>
      )
    },
    {
      id: 'dis',
      title: t('medical:departments.list.dis.title'),
      icon: '/b22.png',
      contentTitle: t('medical:departments.list.dis.content_title'),
      content: (
        <>
          <p>{t('medical:departments.list.dis.p1')}</p>
          <div className="bolum-tags">
            {t('medical:departments.list.dis.tags', { returnObjects: true }).map((tag, idx) => (
              <span key={idx}>{tag}</span>
            ))}
          </div>
        </>
      )
    },
    {
      id: 'diyet',
      title: t('medical:departments.list.diyet.title'),
      icon: '/b3diyet.png',
      contentTitle: t('medical:departments.list.diyet.content_title'),
      content: (
        <>
          <p>{t('medical:departments.list.diyet.p1')}</p>
          <p>{t('medical:departments.list.diyet.p2')}</p>

          <h3 style={{ marginTop: '20px', marginBottom: '10px', color: '#2d7bf0ff', fontWeight: 'bold' }}>
            {t('medical:departments.list.diyet.services_header')}
          </h3>

          <div className="bolum-tags">
            {t('medical:departments.list.diyet.tags', { returnObjects: true }).map((tag, idx) => (
              <span key={idx}>{tag}</span>
            ))}
          </div>

          <div className="bolum-detail-list">
            {t('medical:departments.list.diyet.details', { returnObjects: true }).map((detail, idx) => (
              <div className="bolum-detail-card" key={idx}>
                <span className="bolum-detail-title">{detail.title}</span>
                {detail.text}
              </div>
            ))}
          </div>
        </>
      )
    },
    {
      id: 'derma',
      title: t('medical:departments.list.derma.title'),
      icon: '/b44.png',
      contentTitle: t('medical:departments.list.derma.content_title'),
      content: (
        <>
          <p>{t('medical:departments.list.derma.p1')}</p>
          <p>{t('medical:departments.list.derma.p2')}</p>

          <div className="bolum-tags">
            {t('medical:departments.list.derma.tags', { returnObjects: true }).map((tag, idx) => (
              <span key={idx}>{tag}</span>
            ))}
          </div>
        </>
      )
    },
    {
      id: 'cerrahi',
      title: t('medical:departments.list.cerrahi.title'),
      icon: '/b55.png',
      contentTitle: t('medical:departments.list.cerrahi.content_title'),
      content: (
        <>
          <p>{t('medical:departments.list.cerrahi.p1')}</p>
          <p>{t('medical:departments.list.cerrahi.p2')}</p>
          <div className="bolum-tags">
            {t('medical:departments.list.cerrahi.tags', { returnObjects: true }).map((tag, idx) => (
              <span key={idx}>{tag}</span>
            ))}
          </div>
        </>
      )
    },
    {
      id: 'goz',
      title: t('medical:departments.list.goz.title'),
      icon: '/b6goz.png',
      contentTitle: t('medical:departments.list.goz.content_title'),
      content: (
        <>
          <p>{t('medical:departments.list.goz.p1')}</p>
          <p>{t('medical:departments.list.goz.p2')}</p>
          <div className="bolum-tags">
            {t('medical:departments.list.goz.tags', { returnObjects: true }).map((tag, idx) => (
              <span key={idx}>{tag}</span>
            ))}
          </div>
        </>
      )
    },
    {
      id: 'dahiliye',
      title: t('medical:departments.list.dahiliye.title'),
      icon: '/b77.png',
      contentTitle: t('medical:departments.list.dahiliye.content_title'),
      content: (
        <>
          <p>{t('medical:departments.list.dahiliye.p1')}</p>
          <p>{t('medical:departments.list.dahiliye.p2')}</p>
          <div className="bolum-tags">
            {t('medical:departments.list.dahiliye.tags', { returnObjects: true }).map((tag, idx) => (
              <span key={idx}>{tag}</span>
            ))}
          </div>
        </>
      )
    },
    {
      id: 'kadin',
      title: t('medical:departments.list.kadin.title'),
      icon: '/b88.png',
      contentTitle: t('medical:departments.list.kadin.content_title'),
      content: (
        <>
          <p>{t('medical:departments.list.kadin.p1')}</p>
          <p>{t('medical:departments.list.kadin.p2')}</p>
          <div className="bolum-tags">
            {t('medical:departments.list.kadin.tags', { returnObjects: true }).map((tag, idx) => (
              <span key={idx}>{tag}</span>
            ))}
          </div>
        </>
      )
    }
  ], [t]);

  const selectedDept = departments.find(d => d.id === selectedId);

  return (
    <div className="bolumlerimiz-page">
      <div className="bolumlerimiz-header">
        <h1 className="bolumlerimiz-title">{t('medical:departments.title')}</h1>

        <div className="bolumlerimiz-grid">
          {departments.map((dept) => (
            <div
              key={dept.id}
              className={`bolum-card ${selectedId === dept.id ? 'selected' : ''} ${dept.isAcil ? 'is-acil' : ''}`}
              onClick={() => handleDeptClick(dept.id)}
            >
              <img src={dept.icon} alt={dept.title} className="bolum-card__icon" />
              <div className="bolum-card__title">{dept.title}</div>
              <img src="/angle-right.svg" alt="" className="card-arrow-icon" width="24" height="24" />
            </div>
          ))}
        </div>
      </div>

      {/* Content Section */}
      <div className="bolum-content-section" ref={contentRef}>
        <div className="bolum-content-container">
          <div className="bolum-content-header">
            <h2
              className="bolum-content-title"
              style={{ color: selectedDept?.isAcil ? '#cc0000' : '#0052cc' }}
            >
              {selectedDept?.contentTitle}
            </h2>
          </div>
          <div className="bolum-content-text">
            {selectedDept?.content}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BolumlerimizPage;
