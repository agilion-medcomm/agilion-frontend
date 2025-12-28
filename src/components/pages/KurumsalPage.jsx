import React from 'react';
import { useTranslation } from 'react-i18next';
import './KurumsalPage.css';
import Stats from '../Stats/Stats';

const KurumsalPage = () => {
  const { t } = useTranslation(['kurumsal']);

  const valuesItems = t('kurumsal:values.items', { returnObjects: true });

  return (
    <div className="kurumsal-page">

      <section className="kurumsal-hero">
        <div className="kurumsal-hero__content">
          <picture>
            <source media="(max-width: 768px)" srcSet="/k1.png" />
            <img src="/kurumsal.png" alt="Kurumsal" className="kurumsal-hero__image" />
          </picture>
          <h1 className="kurumsal-hero__title"></h1>
        </div>
      </section>

      <div className="kurumsal-content">

        <div className="kurumsal-intro">
          <p>
            {t('kurumsal:intro.p1')}
          </p>
          <p>
            {t('kurumsal:intro.p2')}
          </p>
          <p>
            {t('kurumsal:intro.p3')}
          </p>
        </div>

        <section>
          <h2 className="kurumsal-section-header">{t('kurumsal:about.title')}</h2>
          <div className="kurumsal-text-block">
            <p>
              {t('kurumsal:about.text')}
            </p>
            <p>
              {t('kurumsal:about.text2')}
            </p>
          </div>
        </section>

        <section>
          <h2 className="kurumsal-section-header">{t('kurumsal:values.title')}</h2>
          <div className="kurumsal-text-block">
            <p className="values-description">{t('kurumsal:values.description')}</p>
            <ul>
              {valuesItems.map((item, index) => (
                <li key={index}><strong>{item.bold}</strong>{item.text}</li>
              ))}
            </ul>
          </div>
        </section>

        <section>
          <h2 className="kurumsal-section-header">{t('kurumsal:mission.title')}</h2>
          <div className="kurumsal-text-block">
            <p>
              {t('kurumsal:mission.text')}
            </p>
            <p>
              {t('kurumsal:mission.text2')}
            </p>
          </div>
        </section>

        <section>
          <h2 className="kurumsal-section-header">{t('kurumsal:vision.title')}</h2>
          <div className="kurumsal-text-block">
            <p>
              {t('kurumsal:vision.text')}
            </p>
            <p>
              {t('kurumsal:vision.text2')}
            </p>
          </div>
        </section>
      </div>

      <Stats />
    </div>
  );
};

export default KurumsalPage;
