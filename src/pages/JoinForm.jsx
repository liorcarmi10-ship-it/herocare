import React, { useState } from 'react';
import TreatmentsList from '../treatments.js';

const CITIES = ['אשדוד', 'אשקלון', 'באר שבע', 'בית שמש', 'בני ברק', 'הרצליה', 'חדרה', 'חולון', 'חיפה', 'טבריה', 'ירושלים', 'כפר סבא', 'מודיעין', 'נהריה', 'נתניה', 'עפולה', 'פתח תקווה', 'קריית שמונה', 'ראשון לציון', 'רחובות', 'רמת גן', 'רעננה', 'תל אביב', 'אילת'].sort((a, b) => a.localeCompare(b, 'he'));
const TYPES = [...new Set(TreatmentsList.map(t => t.type))].sort((a, b) => a.localeCompare(b, 'he'));
const STEPS = ['קצת עליי', 'מה אני מציע/ה?', 'חשוב לדעת עליי'];

export default function JoinForm({ navigate }) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({ name: '', phone: '', gender: '', categories: [], city: '', address: '', about: '', discount: '' });
  const [errors, setErrors] = useState({});
  const [typeQuery, setTypeQuery] = useState('');
  const [done, setDone] = useState(false);

  const set = (k) => (e) => setData(d => ({ ...d, [k]: e.target.value }));
  const toggle = (t) => setData(d => ({ ...d, categories: d.categories.includes(t) ? d.categories.filter(x => x !== t) : [...d.categories, t] }));

  const validate = () => {
    const e = {};
    if (step === 0) {
      if (!data.name.trim()) e.name = 'נא למלא שם';
      if (!/^0\d{1,2}-?\d{7}$|^0\d{8,9}$/.test(data.phone.replace(/[\s-]/g, ''))) e.phone = 'נא למלא מספר טלפון תקין';
      if (!data.gender) e.gender = 'נא לבחור';
    } else if (step === 1) {
      if (!data.categories.length) e.categories = 'נא לבחור לפחות תחום טיפול אחד';
      if (!data.city) e.city = 'נא לבחור עיר';
      if (!data.address.trim()) e.address = 'נא למלא כתובת';
    } else if (!data.about.trim()) e.about = 'ספרו לנו קצת על עצמכם';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    if (step < 2) setStep(s => s + 1); else setDone(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (done) {
    return (
      <div className="container-narrow join">
        <section className="card join-done">
          <p className="big">🎉</p>
          <h1>תודה, {data.name.split(' ')[0]}!</h1>
          <p>הפרטים התקבלו. זוהי גרסת דמו של הפרויקט, ולכן הפרטים לא נשמרו במאגר בפועל.</p>
          <div className="cta-row">
            <button className="btn" onClick={() => navigate('find')}>לרשימת המטפלים</button>
            <button className="btn btn-outline" onClick={() => navigate('home')}>לדף הבית</button>
          </div>
        </section>
      </div>
    );
  }

  const filteredTypes = TYPES.filter(t => t.includes(typeQuery.trim()));
  const err = (k) => errors[k] && <span className="field-error" role="alert">{errors[k]}</span>;

  return (
    <div className="container-narrow join">
      <h1 className="page-title">הצטרפות כמטפל/ת</h1>
      <ol className="steps">
        {STEPS.map((s, i) => <li key={s} className={i === step ? 'active' : i < step ? 'done' : ''}><span>{i + 1}</span>{s}</li>)}
      </ol>
      <form className="card stack-form" onSubmit={next} noValidate>
        {step === 0 && <>
          <h2>בואו נכיר</h2>
          <label>שם מלא *<input value={data.name} onChange={set('name')} autoComplete="name" aria-invalid={!!errors.name} />{err('name')}</label>
          <label>טלפון *<input type="tel" inputMode="tel" placeholder="050-0000000" value={data.phone} onChange={set('phone')} aria-invalid={!!errors.phone} />{err('phone')}</label>
          <label>מגדר *
            <select value={data.gender} onChange={set('gender')} aria-invalid={!!errors.gender}>
              <option value="">בחר/י</option><option>אישה</option><option>גבר</option><option>אחר</option><option>מעדיף/ה לא לומר</option>
            </select>{err('gender')}
          </label>
        </>}

        {step === 1 && <>
          <h2>קצת על הטיפולים שלי</h2>
          <fieldset>
            <legend>תחומי טיפול * {data.categories.length > 0 && <small>({data.categories.length} נבחרו)</small>}</legend>
            <input className="chip-search" placeholder="חיפוש תחום…" value={typeQuery} onChange={(e) => setTypeQuery(e.target.value)} aria-label="חיפוש תחום טיפול" />
            <div className="chips chips-scroll">
              {filteredTypes.map(t => (
                <button type="button" key={t} className={`chip ${data.categories.includes(t) ? 'on' : ''}`} aria-pressed={data.categories.includes(t)} onClick={() => toggle(t)}>{t}</button>
              ))}
            </div>
            {err('categories')}
          </fieldset>
          <label>עיר *
            <select value={data.city} onChange={set('city')} aria-invalid={!!errors.city}>
              <option value="">בחר/י עיר</option>{CITIES.map(c => <option key={c}>{c}</option>)}
            </select>{err('city')}
          </label>
          <label>כתובת הקליניקה *<input value={data.address} onChange={set('address')} autoComplete="street-address" aria-invalid={!!errors.address} />{err('address')}</label>
        </>}

        {step === 2 && <>
          <h2>פרטים נוספים</h2>
          <label>אודות *<textarea rows="4" value={data.about} onChange={set('about')} aria-invalid={!!errors.about} />{err('about')}</label>
          <label>הטבה למשרתי מילואים<input placeholder="לדוגמה: 20% הנחה" value={data.discount} onChange={set('discount')} /></label>
          <label>תמונת פרופיל (לא חובה)<input type="file" accept="image/*" /></label>
        </>}

        <div className="form-nav">
          {step > 0 && <button type="button" className="btn btn-outline" onClick={() => { setErrors({}); setStep(s => s - 1); }}>הקודם</button>}
          <button type="submit" className="btn">{step < 2 ? 'הבא' : 'שליחה'}</button>
        </div>
      </form>
    </div>
  );
}
