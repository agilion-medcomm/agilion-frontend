import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/ThemeContext';

export default function ClarificationTextPage() {
    const { t } = useTranslation(['legal']);
    const { theme } = useTheme();

    const styles = {
        container: {
            padding: '40px 20px',
            maxWidth: '800px',
            margin: '0 auto',
            backgroundColor: theme === 'light' ? '#ffffff' : '#121212',
            color: theme === 'light' ? '#1a1a1a' : '#f8f9fa',
            minHeight: '100vh',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
            lineHeight: '1.6'
        },
        title: {
            textAlign: 'left',
            marginBottom: '40px',
            fontSize: '2rem',
            fontWeight: 'bold',
            color: theme === 'light' ? '#000000' : '#ffffff'
        },
        sectionTitle: {
            marginTop: '30px',
            marginBottom: '15px',
            fontSize: '1.4rem',
            fontWeight: '600',
            color: theme === 'light' ? '#000000' : '#ffffff'
        },
        list: {
            paddingLeft: '20px',
            marginBottom: '15px'
        },
        paragraph: {
            marginBottom: '15px',
            color: theme === 'light' ? '#333333' : '#ffffff'
        }
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>{t('legal:kvkk.title')}</h1>

            <h2 style={styles.sectionTitle}>{t('legal:kvkk.section1_title')}</h2>
            <p style={styles.paragraph}>{t('legal:kvkk.section1_text')}</p>
            <div style={styles.paragraph}>
                <div>{t('legal:kvkk.address')}</div>
                <div>{t('legal:kvkk.email')}</div>
                <div>{t('legal:kvkk.phone')}</div>
            </div>

            <h2 style={styles.sectionTitle}>{t('legal:kvkk.section2_title')}</h2>
            <p style={styles.paragraph}>{t('legal:kvkk.section2_text')}</p>

            <h2 style={styles.sectionTitle}>{t('legal:kvkk.section3_title')}</h2>
            <ul style={styles.list}>
                {t('legal:kvkk.section3_items', { returnObjects: true })?.map((item, index) => (
                    <li key={index} style={{ marginBottom: '8px' }}>{item}</li>
                ))}
            </ul>

            <h2 style={styles.sectionTitle}>{t('legal:kvkk.section4_title')}</h2>
            <p style={styles.paragraph}>{t('legal:kvkk.section4_text')}</p>

            <h2 style={styles.sectionTitle}>{t('legal:kvkk.section5_title')}</h2>
            <p style={styles.paragraph}>{t('legal:kvkk.section5_text')}</p>

            <h2 style={styles.sectionTitle}>{t('legal:kvkk.section6_title')}</h2>
            <p style={styles.paragraph}>{t('legal:kvkk.section6_subtitle')}</p>
            <ul style={styles.list}>
                {t('legal:kvkk.section6_items', { returnObjects: true })?.map((item, index) => (
                    <li key={index} style={{ marginBottom: '8px' }}>{item}</li>
                ))}
            </ul>

            <h2 style={styles.sectionTitle}>{t('legal:kvkk.section7_title')}</h2>
            <p style={styles.paragraph}>{t('legal:kvkk.section7_text')}</p>
        </div>
    );
}
