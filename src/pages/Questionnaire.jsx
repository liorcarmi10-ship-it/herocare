import React, { useMemo, useState } from 'react';
import TreatmentsList from '../treatments.js';
import therapists from '../therapists.js';

const QUESTIONS = [
  { key: 'category', question: 'באיזה תחום תרצו לטפל?', options: ['רגשי', 'גופני', 'תזונתי', 'פונקציונלי', 'רפואה אלטרנטיבית', 'רוגע', 'שינה', 'אבחון'] },
  { key: 'length', question: 'טיפול קצר או ארוך?', options: ['קצר', 'ארוך'] },
  { key: 'homework', question: 'מוכנים לעבודת בית בין המפגשים?', options: ['כן', 'לא'] },
];

function match(answers) {
  const byCat = TreatmentsList.filter(t => t.category === answers.category);
  const exact = byCat.filter(t => t.length === answers.length && t.homework === answers.homework);
  if (exact.length) return { list: exact, exact: true };
  const byLen = byCat.filter(t => t.length === answers.length);
  if (byLen.length) return { list: byLen, exact: false };
  return { list: byCat, exact: false };
}

const countFor = (type) => therapists.filter(t => t.categories.includes(type)).length;

export default function Questionnaire({ navigate }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const done = step >= QUESTIONS.length;
  const result = useMemo(() => (done ? match(answers) : null), [done, answers]);

  const answer = (opt) => {
    setAnswers(a => ({ ...a, [QUESTIONS[step].key]: opt }));
    setStep(s => s + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const restart = () => { setStep(0); setAnswers({}); };
  const progress = Math.round((Math.min(step, QUESTIONS.length) / QUESTIONS.length) * 100);

  return (
    <div className="quiz container-narrow">
      <div className="progress" role="progressbar" aria-valuenow={progress} aria-valuemin="0" aria-valuemax="100">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>

      {!done ? (
        <section className="card quiz-card">
          <p className="step-label">שאלה {step + 1} מתוך {QUESTIONS.length}</p>
          <h1>{QUESTIONS[step].question}</h1>
          <div className={`options ${QUESTIONS[step].options.length > 2 ? 'options-grid' : ''}`}>
            {QUESTIONS[step].options.map(o => (
              <button key={o} className={`option ${answers[QUESTIONS[step].key] === o ? 'chosen' : ''}`} onClick={() => answer(o)}>{o}</button>
            ))}
          </div>
          <div className="quiz-nav">
            <button className="btn btn-sm btn-outline" onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0}>→ חזור</button>
          </div>
        </section>
      ) : (
        <section className="quiz-results">
          <h1>הטיפולים שמתאימים לך</h1>
          <p className="hint">
            {result.exact ? `בחרת: ${answers.category} · ${answers.length} · עבודת בית: ${answers.homework}`
              : `לא מצאנו התאמה מדויקת לכל התשובות, אז הנה הטיפולים בתחום "${answers.category}".`}
          </p>
          <div className="result-grid">
            {result.list.map(t => {
              const n = countFor(t.type);
              return (
                <article className="card result-card" key={t.type}>
                  <h3>{t.type}</h3>
                  <p>{t.description}</p>
                  <button className="btn btn-sm btn-outline" disabled={!n}
                    onClick={() => navigate('find', [t.type])}>{n > 1 ? `הצג ${n} מטפלים` : n === 1 ? 'הצג מטפל/ת מתאים/ה' : 'אין עדיין מטפלים'}</button>
                </article>
              );
            })}
          </div>
          <div className="cta-row">
            <button className="btn btn-lg" onClick={() => navigate('find', result.list.map(t => t.type))}>קח אותי למטפלים המתאימים</button>
            <button className="btn btn-lg btn-outline" onClick={restart}>התחל מחדש</button>
          </div>
        </section>
      )}
    </div>
  );
}
