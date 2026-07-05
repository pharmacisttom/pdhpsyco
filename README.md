# PDH Mental Health Screening

แอปพลิเคชันเว็บแบบ Static สำหรับคัดกรองสุขภาพจิตประชาชนของโรงพยาบาลปลวกแดง

## วิธีการนำไปใช้งานบน GitHub Pages

1. โค้ดถูก push ไปที่ repository: `https://github.com/pharmacisttom/pdhpsyco`
2. เข้าไปที่ Settings ของ Repository > Pages
3. เลือก Source เป็น `GitHub Actions`
4. จากนั้นไปที่แท็บ Actions แล้วเลือก `Static HTML` หรือ `Node.js` workflow (ถ้าใช้ Vite ให้ใช้ workflow สำหรับ build Vite: `npm install` -> `npm run build` แล้ว deploy โฟลเดอร์ `dist`)

### แนะนำ: วิธีตั้งค่า GitHub Actions สำหรับ Vite

สร้างไฟล์ `.github/workflows/deploy.yml` ด้วยโค้ดนี้:

```yaml
name: Deploy static content to Pages
on:
  push:
    branches: ['main']
permissions:
  contents: read
  pages: write
  id-token: write
concurrency:
  group: 'pages'
  cancel-in-progress: true
jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Set up Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - name: Install dependencies
        run: npm ci
      - name: Build
        run: npm run build
      - name: Setup Pages
        uses: actions/configure-pages@v4
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

## วิธีการติดตั้งระบบหลังบ้าน (Admin Dashboard) บน Google Apps Script

ระบบนี้ใช้สำหรับเก็บสถิติและเป็นระบบหลังบ้านสำหรับเจ้าหน้าที่

1. เปิด Google Sheet ของคุณ (สร้าง Tab ชื่อ `usage_log` และ `user` ให้เรียบร้อย)
2. ไปที่เมนู **ส่วนขยาย (Extensions)** > **Apps Script**
3. **ไฟล์ Code.gs:** คัดลอกโค้ดทั้งหมดจากไฟล์ `google_apps_script.js` ในโฟลเดอร์นี้ ไปวางทับโค้ดเดิมใน `Code.gs`
4. **ไฟล์ Index.html:** 
   - กดปุ่ม `+` เพิ่มไฟล์ใหม่ เลือก **HTML**
   - ตั้งชื่อไฟล์ว่า `Index` (ตัว I พิมพ์ใหญ่)
   - คัดลอกโค้ดทั้งหมดจากไฟล์ `admin_dashboard.html` ไปวางทับในไฟล์ `Index.html`
5. กดปุ่ม **ทำให้ใช้งานได้ (Deploy)** > **การทำให้ใช้งานได้รายการใหม่ (New deployment)**
6. เลือกประเภท: **เว็บแอป (Web app)**
7. สิทธิ์การเข้าถึง (Who has access): เลือก **ทุกคน (Anyone)**
8. กด **ทำให้ใช้งานได้ (Deploy)** (กดยอมรับสิทธิ์ตามที่ระบบแจ้ง)
9. คัดลอก **URL ของเว็บแอป (Web app URL)**
10. นำ URL ไปวางในไฟล์ `src/config.js` ในตัวแปร `GOOGLE_SCRIPT_URL` แล้ว Commit/Push โค้ดอีกครั้ง
11. **สำหรับเจ้าหน้าที่:** สามารถใช้ URL ของเว็บแอป (Web app URL) นี้เปิดในเบราว์เซอร์ เพื่อเข้าสู่ระบบหลังบ้าน (Admin Dashboard) ได้เลย

## การสร้าง QR Code
หลังจากนำขึ้น GitHub Pages สำเร็จ จะได้ URL เช่น `https://pharmacisttom.github.io/pdhpsyco/` 
สามารถนำ URL นี้ไปแปลงเป็น QR Code ผ่านเว็บสร้าง QR Code ทั่วไป และนำไปติดที่โรงพยาบาลได้ทันที
