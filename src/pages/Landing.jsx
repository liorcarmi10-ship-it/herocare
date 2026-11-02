import React, { useEffect, useState } from 'react';
import Modal from '../components/Modal.jsx';
import spa1 from '../images/spa1.jpg';
import spa2 from '../images/spa2.jpg';
import spa3 from '../images/spa3.jpg';
import spa4 from '../images/spa4.jpg';
import spa5 from '../images/spa5.jpg';
import spa6 from '../images/spa6.jpg';
import spa8 from '../images/spa8.jpg';
import spa9 from '../images/spa9.jpg';
import spa10 from '../images/spa10.jpg';
import soldier7 from '../images/soldier7.jpg';
import soldier9 from '../images/soldier9.jpg';
import soldier10 from '../images/soldier10.jpg';
import pressImage from '../images/press-background.jpg';

const services = [
  { img: spa1, title: 'עיסויים', text: 'רשימת מטפלים שמציעים עיסויים מרגיעים במחירים נוחים.' },
  { img: spa2, title: 'רפואה אלטרנטיבית', text: 'טיפולים אלטרנטיביים כמו דיקור סיני, ארומתרפיה ורייקי.' },
  { img: spa3, title: 'סדנאות יוגה ומדיטציה', text: 'סדנאות לשיפור הבריאות הנפשית והפיזית.' },
  { img: spa4, title: 'טיפולי פנים', text: 'טיפולי פנים לשיפור בריאות העור והענקת זוהר.' },
];
const medicine = [
  { img: spa6, title: 'דיקור סיני', text: 'טיפול שמקדם ריפוי טבעי ומפחית מתחים על ידי הכנסת מחטים לנקודות מסוימות בגוף.' },
  { img: spa9, title: 'ארומתרפיה', text: 'שימוש בשמנים אתריים טבעיים מצמחים ליצירת תחושת רוגע ותמיכה בבריאות.' },
  { img: spa10, title: 'רייקי', text: 'טיפול אנרגטי שמתבצע על ידי הנחת ידיים להעברת אנרגיה מרפאה לגוף.' },
];
const testimonials = [
  { text: 'החוויה עם HEROCARE הייתה מדהימה. מצאתי טיפולים איכותיים במחירים נוחים מאוד.', who: 'שרית' },
  { text: 'הטיפולים עזרו לי להירגע אחרי שירות אינטנסיבי. ממליץ בחום!', who: 'יואב' },
  { text: 'דיקור סיני וארומתרפיה עזרו לי להיפטר מהכאב הכרוני ולמצוא רוגע.', who: 'דניאל' },
];
const news = [
  { img: soldier7, title: 'טיפולי עיסוי חדשים', text: 'מגוון חדש של טיפולי עיסוי זמין עכשיו לחיילים ולמשרתי מילואים.' },
  { img: soldier9, title: 'סדנאות יוגה ומדיטציה', text: 'הצטרפו לסדנאות הקרובות לשיפור הבריאות הנפשית והגופנית.' },
  { img: soldier10, title: 'הנחות מיוחדות למילואימניקים', text: 'החודש: הנחות מיוחדות על כל הטיפולים למשרתי מילואים.' },
];
const press = [
  { text: 'מצוינות בשירות ומקצועיות ללא פשרות. השירותים של HEROCARE שיפרו את איכות החיים של חיילי המילואים שלנו.', src: 'עיתון צה"ל' },
  { text: 'חווית טיפול מרגיעה ונעימה במחירים נוחים לחיילים. מומלץ מאוד.', src: 'עיתון הבריאות' },
  { text: 'היכולת למצוא טיפולים איכותיים במחירים מוזלים עושה את כל ההבדל לחיילי המילואים.', src: 'עיתון הבריאות והחיים' },
];

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) { els.forEach(e => e.classList.add('visible')); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('visible'); io.unobserve(en.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    els.forEach(e => io.observe(e));
    return () => io.disconnect();
  }, []);
}

function ContactModal({ onClose }) {
  const [sent, setSent] = useState(false);
  return (
    <Modal title="צור קשר" onClose={onClose}>
      {sent ? (
        <div className="demo-success">
          <p className="big">תודה! 🙏</p>
          <p>קיבלנו את הפנייה. זוהי גרסת דמו של הפרויקט, ולכן ההודעה לא נשלחה בפועל.</p>
          <button className="btn" onClick={onClose}>סגירה</button>
        </div>
      ) : (
        <form className="stack-form" onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
          <label>שם<input name="name" required autoComplete="name" /></label>
          <label>טלפון<input name="phone" type="tel" inputMode="tel" required autoComplete="tel" /></label>
          <label>אימייל<input name="email" type="email" required autoComplete="email" /></label>
          <label>הודעה<textarea name="message" rows="4" required /></label>
          <button type="submit" className="btn btn-block">שלח</button>
        </form>
      )}
    </Modal>
  );
}

export default function Landing({ navigate }) {
  const [contactOpen, setContactOpen] = useState(false);
  useReveal();

  return (
    <div className="landing">
      <section className="hero" style={{ backgroundImage: `url(${spa8})` }}>
        <div className="hero-content">
          <h1 dir="ltr">HEROCARE <span>Wellness</span></h1>
          <p className="hero-sub">הדרך החכמה לנצל את המענק</p>
          <div className="hero-actions">
            <button className="btn btn-lg" onClick={() => navigate('find')}>מצא טיפול</button>
            <button className="btn btn-lg btn-ghost" onClick={() => navigate('quiz')}>התאם לי טיפול</button>
          </div>
        </div>
      </section>

      <div className="container">
        <section className="welcome reveal" style={{ backgroundImage: `url(${spa5})` }}>
          <div className="overlay">
            <h2>ברוכים הבאים ל-HEROCARE Wellness</h2>
            <p>אצלנו תמצאו את המטפלים הכי טובים, במחירים הכי משתלמים, ובדרך הכי נוחה! הכל כדי להקל עליכם את התהליך, שלא תצטרכו לעבוד קשה יותר משכבר עבדתם.</p>
          </div>
        </section>

        <section className="quiz-cta card reveal">
          <h2>בואו להבין מהו הטיפול שאתם מחפשים בכמה שאלות בלבד!</h2>
          <button className="btn btn-lg btn-soft" onClick={() => navigate('quiz')}>לשאלון ההכוונה שלנו</button>
        </section>

        <section className="section reveal">
          <h2 className="section-title">השירותים שלנו</h2>
          <div className="grid grid-4">
            {services.map(s => (
              <article className="card media-card" key={s.title}>
                <img src={s.img} alt="" loading="lazy" />
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section reveal">
          <h2 className="section-title">מהי רפואה אלטרנטיבית?</h2>
          <div className="grid grid-3">
            {medicine.map(s => (
              <article className="card media-card" key={s.title}>
                <img src={s.img} alt="" loading="lazy" />
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section testimonials reveal">
          <h2 className="section-title">עדויות</h2>
          <div className="grid grid-3">
            {testimonials.map(t => (
              <blockquote className="card quote" key={t.who}>
                <p>"{t.text}"</p>
                <cite>– {t.who}</cite>
              </blockquote>
            ))}
          </div>
        </section>

        <section className="section reveal">
          <h2 className="section-title">חדשות אחרונות</h2>
          <div className="grid grid-3">
            {news.map(n => (
              <article className="card media-card" key={n.title}>
                <img src={n.img} alt="" loading="lazy" />
                <h3>{n.title}</h3>
                <p>{n.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="press reveal" style={{ backgroundImage: `url(${pressImage})` }}>
          <h2>בעיתונות</h2>
          <div className="grid grid-3">
            {press.map(p => (
              <blockquote className="press-quote" key={p.src}>
                <p>"{p.text}"</p>
                <cite>– {p.src}</cite>
              </blockquote>
            ))}
          </div>
        </section>

        <div className="cta-row">
          <button className="btn btn-lg" onClick={() => navigate('find')}>לטיפולים</button>
          <button className="btn btn-lg btn-outline" onClick={() => setContactOpen(true)}>מטפלים? צרו קשר</button>
        </div>
      </div>

      <footer className="site-footer">
        <p>© 2024 HEROCARE Wellness. כל הזכויות שמורות.</p>
        <p>פרויקט סטודנטים · נתוני המטפלים באתר הם נתוני דמו</p>
      </footer>

      {contactOpen && <ContactModal onClose={() => setContactOpen(false)} />}
    </div>
  );
}
