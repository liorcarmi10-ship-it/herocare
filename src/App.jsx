import React, { useEffect, useState, useCallback } from 'react';
import Header from './components/Header.jsx';
import Landing from './pages/Landing.jsx';
import FindTherapist from './pages/FindTherapist.jsx';
import Questionnaire from './pages/Questionnaire.jsx';
import JoinForm from './pages/JoinForm.jsx';

const PAGES = ['home', 'find', 'quiz', 'join'];

function parseHash() {
  const raw = window.location.hash.replace(/^#\/?/, '');
  const [page, query = ''] = raw.split('?');
  const params = new URLSearchParams(query);
  return { page: PAGES.includes(page) ? page : 'home', types: params.getAll('type') };
}

export default function App() {
  const [route, setRoute] = useState(parseHash);

  useEffect(() => {
    const onHash = () => {
      setRoute(parseHash());
      window.scrollTo({ top: 0 });
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const navigate = useCallback((page, types = []) => {
    const qs = types.length ? '?' + types.map(t => 'type=' + encodeURIComponent(t)).join('&') : '';
    const next = `#/${page === 'home' ? '' : page}${qs}`;
    if (window.location.hash === next) { window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
    window.location.hash = next;
  }, []);

  return (
    <div className="app" dir="rtl">
      <Header current={route.page} navigate={navigate} />
      <main className={`page page-${route.page}`}>
        {route.page === 'home' && <Landing navigate={navigate} />}
        {route.page === 'find' && <FindTherapist initialTypes={route.types} key={route.types.join('|')} />}
        {route.page === 'quiz' && <Questionnaire navigate={navigate} />}
        {route.page === 'join' && <JoinForm navigate={navigate} />}
      </main>
    </div>
  );
}
