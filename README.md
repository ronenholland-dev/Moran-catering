# 🥗 מורן קייטרינג

אפליקציית הזמנות אוכל למורן.

## התקנה ופריסה

### דרישות
- Node.js מותקן
- חשבון GitHub: ronenholland-dev

### שלב 1 – יצירת Repository ב-GitHub
1. היכנס ל-github.com
2. לחץ "New repository"
3. שם: `moran-catering`
4. Public (חשוב לגיטהאב פייג'ס)
5. אל תוסיף README – לחץ "Create repository"

### שלב 2 – העלאת הקוד
```bash
cd moran-catering
git init
git add .
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/ronenholland-dev/moran-catering.git
git push -u origin main
```

### שלב 3 – התקנת תלויות ופריסה
```bash
npm install
npm run deploy
```

### שלב 4 – הפעלת GitHub Pages
1. ב-GitHub, לך ל: Settings → Pages
2. Source: "Deploy from a branch"
3. Branch: `gh-pages` / `root`
4. שמור

### הקישור הסופי
https://ronenholland-dev.github.io/moran-catering

## עדכון בעתיד
בכל פעם שרוצים לעדכן:
```bash
npm run deploy
```

## פיצ'רים
- 🥗 תפריט שבועי עם קטגוריות
- ✨ התאמה אישית של מנות
- 🛒 סל קניות
- 📱 שליחת הזמנה בוואטסאפ ישירות למורן
- ⚙️ פאנל ניהול – מורן מוסיפה/מסירה מנות
- 💾 שמירה מקומית בדפדפן
