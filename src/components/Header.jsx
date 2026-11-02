import React, { useEffect, useState } from 'react';
import logo from '../images/logo-mark.png';

const LINKS = [
  { page: 'home', label: 'בית' },
  { page: 'find', label: 'מצא טיפול' },
  { page: 'quiz', label: 'התאם לי טיפול' },
  { page: 'join', label: 'הירשם כמטפל' },
];

export default function Header({ current, navigate }) {
  const [open, setOpen] = useState(false);
  useEffect(() => { setOpen(false); }, [current]);
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const go = (page) => { setOpen(false); navigate(page); };

  return (
    <header className={`site-header ${open ? 'is-open' : ''}`}>
      <div className="header-inner">
        <button className="brand" onClick={() => go('home')} aria-label="HEROCARE – לדף הבית">
          <img src={logo} alt="" width="36" height="36" />
          <span>HEROCARE</span>
        </button>
        <nav className="nav-desktop" aria-label="ניווט ראשי">
          {LINKS.map(l => (
            <button key={l.page} className={`nav-link ${current === l.page ? 'active' : ''}`}
              aria-current={current === l.page ? 'page' : undefined} onClick={() => go(l.page)}>{l.label}</button>
          ))}
        </nav>
        <button className="hamburger" aria-label={open ? 'סגירת תפריט' : 'פתיחת תפריט'} aria-expanded={open}
          aria-controls="mobile-nav" onClick={() => setOpen(o => !o)}>
          <span /><span /><span />
        </button>
      </div>
      <nav id="mobile-nav" className="nav-mobile" aria-label="ניווט ראשי (נייד)" hidden={!open}>
        {LINKS.map(l => (
          <button key={l.page} className={`nav-link ${current === l.page ? 'active' : ''}`}
            aria-current={current === l.page ? 'page' : undefined} onClick={() => go(l.page)}>{l.label}</button>
        ))}
      </nav>
      {open && <div className="nav-backdrop" onClick={() => setOpen(false)} />}
    </header>
  );
}
