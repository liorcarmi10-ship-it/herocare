# HEROCARE Wellness

אתר להתאמת טיפולים משלימים ומטפלים למשרתי מילואים. React + Vite, מותאם למובייל ולדסקטופ, RTL.

**Live:** https://liorcarmi10-ship-it.github.io/herocare/

- מאגר המטפלים באתר הוא **נתוני הדגמה** (שמות וטלפונים בדויים) – `src/therapists.js`.
- שאלון התאמה → כרטיסי טיפולים → מעבר למטפלים המסוננים במפה.
- טופס הצטרפות למטפלים (הדגמה – הפרטים לא נשמרים).

```bash
npm install
npm run dev     # פיתוח
npm run build   # בנייה ל-dist
```
כל push ל-`main` נפרס אוטומטית ל-GitHub Pages (`.github/workflows/deploy.yml`).
