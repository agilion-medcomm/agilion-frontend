import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import "./Stats.css";

// Basit count-up hook'u (requestAnimationFrame ile)
function useCountUp(target, duration = 2000, start = false) {
  const [value, setValue] = useState(0);
  const startRef = useRef(null);

  useEffect(() => {
    if (!start) return;
    let rafId;
    const from = 0;
    const to = Number(target) || 0;
    const d = Math.max(200, duration);

    const tick = (t) => {
      if (!startRef.current) startRef.current = t;
      const elapsed = t - startRef.current;
      const progress = Math.min(1, elapsed / d);
      const current = Math.floor(from + (to - from) * progress);
      setValue(current);
      if (progress < 1) rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [target, duration, start]);

  return value;
}

export default function Stats() {
  const { t, i18n } = useTranslation(['home']);
  const rootRef = useRef(null);
  const [inView, setInView] = useState(false);

  // Görünür olunca bir kez tetikle
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setInView(true);
            io.disconnect();
          }
        });
      },
      { threshold: 0.25 }
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Hedef sayılar (ileride API/DB’den beslenecek)
  const items = [
    { value: 52347, label: t('home:stats.happy_patients') },
    { value: 236, label: t('home:stats.experienced_doctors') },
    { value: 4386, label: t('home:stats.successful_operations') },
    { value: 9672, label: t('home:stats.lab_procedures') },
  ];

  return (
    <section className="stats-wrap" ref={rootRef}>
      <div className="stats-container">
        {items.map((it, i) => {
          const n = useCountUp(it.value, 2000, inView);
          return (
            <div key={i} className="stat-card">
              <div className="stat-number">
                {n.toLocaleString(i18n.language === 'tr' ? 'tr-TR' : 'en-US')}+
              </div>
              <div className="stat-label">{it.label}</div>
              {/* Masaüstü ayırıcıları (CSS ile konumlanıyor) */}
              <span className="divider" aria-hidden="true" />
            </div>
          );
        })}
      </div>
    </section>
  );
}
