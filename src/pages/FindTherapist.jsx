import React, { useMemo, useRef, useState } from 'react';
import TherapistMap from '../components/TherapistMap.jsx';
import allTherapists, { cities } from '../therapists.js';

const GENDERS = ['אישה', 'גבר'];
const allTypes = [...new Set(allTherapists.flatMap(t => t.categories))].sort((a, b) => a.localeCompare(b, 'he'));

function distanceKm(a, b) {
  const R = 6371, toRad = (d) => d * Math.PI / 180;
  const dLat = toRad(b.lat - a.lat), dLng = toRad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

function initials(name) { return name.split(/[\s-]+/).filter(Boolean).slice(0, 2).map(w => w[0]).join(''); }

export default function FindTherapist({ initialTypes = [] }) {
  const [city, setCity] = useState('');
  const [gender, setGender] = useState('');
  const [types, setTypes] = useState(initialTypes);
  const [filterOpen, setFilterOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [locMsg, setLocMsg] = useState('');
  const mapRef = useRef(null);

  const results = useMemo(() => {
    let list = allTherapists.filter(t =>
      (!city || t.city === city) &&
      (!gender || t.gender === gender) &&
      (types.length === 0 || t.categories.some(c => types.includes(c))));
    if (userLocation) list = list.map(t => ({ ...t, dist: distanceKm(userLocation, t) })).sort((a, b) => a.dist - b.dist);
    return list;
  }, [city, gender, types, userLocation]);

  const activeCount = (city ? 1 : 0) + (gender ? 1 : 0) + types.length;
  const clear = () => { setCity(''); setGender(''); setTypes([]); setSelected(null); };
  const toggleType = (t) => setTypes(ts => ts.includes(t) ? ts.filter(x => x !== t) : [...ts, t]);

  const select = (t) => {
    setSelected(t);
    if (window.matchMedia('(max-width: 899px)').matches) mapRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const locate = () => {
    if (!navigator.geolocation) { setLocMsg('הדפדפן לא תומך באיתור מיקום.'); return; }
    setLocMsg('מאתרים את המיקום שלך…');
    navigator.geolocation.getCurrentPosition(
      (p) => { setUserLocation({ lat: p.coords.latitude, lng: p.coords.longitude }); setSelected(null); setLocMsg('הרשימה ממוינת לפי מרחק ממך.'); },
      () => setLocMsg('לא הצלחנו לאתר מיקום. אפשר לסנן לפי עיר במקום.'),
      { timeout: 8000 });
  };

  return (
    <div className="find">
      <div className="find-map" ref={mapRef}>
        <TherapistMap therapists={results} selected={selected} onSelect={setSelected} userLocation={userLocation} />
      </div>

      <aside className="find-panel">
        <div className="find-toolbar">
          <h1>מצא מטפל/ת</h1>
          <div className="toolbar-actions">
            <button className={`btn btn-sm ${filterOpen ? '' : 'btn-outline'}`} aria-expanded={filterOpen}
              aria-controls="filters" onClick={() => setFilterOpen(o => !o)}>
              {filterOpen ? 'הסתר סינון' : 'סינון'}{activeCount > 0 && <span className="badge">{activeCount}</span>}
            </button>
            <button className="btn btn-sm btn-outline" onClick={locate}>📍 קרוב אליי</button>
          </div>
        </div>
        {locMsg && <p className="hint" role="status">{locMsg}</p>}

        {filterOpen && (
          <div id="filters" className="filters card">
            <label>עיר
              <select value={city} onChange={(e) => { setCity(e.target.value); setSelected(null); }}>
                <option value="">כל הערים</option>
                {cities.map(c => <option key={c}>{c}</option>)}
              </select>
            </label>
            <label>מגדר המטפל/ת
              <select value={gender} onChange={(e) => { setGender(e.target.value); setSelected(null); }}>
                <option value="">לא משנה</option>
                {GENDERS.map(g => <option key={g}>{g}</option>)}
              </select>
            </label>
            <fieldset>
              <legend>סוג הטיפול</legend>
              <div className="chips">
                {allTypes.map(t => (
                  <button type="button" key={t} className={`chip ${types.includes(t) ? 'on' : ''}`}
                    aria-pressed={types.includes(t)} onClick={() => { toggleType(t); setSelected(null); }}>{t}</button>
                ))}
              </div>
            </fieldset>
            <div className="filter-actions">
              <button className="btn btn-sm" onClick={() => setFilterOpen(false)}>הצג {results.length} תוצאות</button>
              <button className="btn btn-sm btn-outline" onClick={clear}>נקה סינון</button>
            </div>
          </div>
        )}

        {!filterOpen && types.length > 0 && (
          <div className="active-types">
            <span>מסננים לפי:</span>
            {types.map(t => <button key={t} className="chip on" onClick={() => toggleType(t)} aria-label={`הסר ${t}`}>{t} ×</button>)}
          </div>
        )}

        <p className="result-count" role="status">{results.length} מטפלים נמצאו</p>

        {results.length === 0 ? (
          <div className="empty card">
            <p>לא נמצאו מטפלים שתואמים לסינון.</p>
            <button className="btn btn-sm" onClick={clear}>הצג את כל המטפלים</button>
          </div>
        ) : (
          <ul className="therapist-list">
            {results.map(t => (
              <li key={t.id}>
                <article className={`therapist-card ${selected?.id === t.id ? 'selected' : ''}`}>
                  <button className="tc-main" onClick={() => select(t)} aria-label={`הצג את ${t.name} על המפה`}>
                    <span className="avatar" aria-hidden="true">{initials(t.name)}</span>
                    <span className="tc-text">
                      <strong>{t.name}</strong>
                      <span className="tc-loc">{t.address}, {t.city}{t.dist != null && ` · ${t.dist.toFixed(0)} ק"מ`}</span>
                    </span>
                  </button>
                  <p className="tc-about">{t.about}</p>
                  <div className="tc-tags">
                    {t.categories.slice(0, 4).map(c => <span key={c} className={`tag ${types.includes(c) ? 'match' : ''}`}>{c}</span>)}
                  </div>
                  <div className="tc-foot">
                    <span className="discount">🎁 {t.discount}</span>
                    <a className="btn btn-sm" href={`tel:${t.phone.replace(/-/g, '')}`}>📞 {t.phone}</a>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        )}
        <p className="demo-note">* כל המטפלים ברשימה הם נתוני דמו (שמות וטלפונים בדויים).</p>
      </aside>
    </div>
  );
}
