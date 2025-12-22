import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    // 1. Tema belirleme mantığı: LocalStorage > Sistem Tercihi > 'light'
    const getInitialTheme = () => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) return savedTheme;

        // Sistem dark mode kullanıyorsa 'dark', değilse 'light'
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    };

    const [theme, setTheme] = useState(getInitialTheme);

    // 2. Tema değiştiğinde işlemleri yap
    useEffect(() => {
        localStorage.setItem('theme', theme);
        document.body.setAttribute('data-theme', theme);

        // body'ye dark class'ı da ekleyelim (index.css'teki body.dark kuralları için)
        if (theme === 'dark') {
            document.body.classList.add('dark');
        } else {
            document.body.classList.remove('dark');
        }
    }, [theme]);

    // 3. Sistem teması değiştiğinde otomatik güncelle (Eğer kullanıcı manuel bir seçim yapmadıysa)
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

        const handleChange = (e) => {
            // Sadece kullanıcı localStorage üzerinde manuel bir seçim kaydetmediyse sistem takibi yap
            if (!localStorage.getItem('theme_manual')) {
                setTheme(e.matches ? 'dark' : 'light');
            }
        };

        // Modern tarayıcılar için listener
        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    const toggleTheme = () => {
        setTheme((prevTheme) => {
            const newTheme = prevTheme === 'light' ? 'dark' : 'light';
            // Kullanıcı manuel tıkladığı için bunu işaretliyoruz ki sistem teması onu ezmesin
            localStorage.setItem('theme_manual', 'true');
            return newTheme;
        });
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
