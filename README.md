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

## วิธีการรับ URL ของ Google Apps Script

เพื่อเก็บสถิติการเข้าใช้งาน (ไม่เก็บข้อมูลส่วนบุคคล) ไปยัง Google Sheet ของคุณ (ID: `1Q_sYf4rcb1GB98LQj19SGKxKSPDk1TQ4LL_4POoLZeY`):

1. เปิด Google Sheet ของคุณ
2. ไปที่เมนู **ส่วนขยาย (Extensions)** > **Apps Script**
3. คัดลอกโค้ดด้านล่างไปวางทับโค้ดเดิมทั้งหมด:

```javascript
const SHEET_ID = '1Q_sYf4rcb1GB98LQj19SGKxKSPDk1TQ4LL_4POoLZeY';

function doPost(e) {
  try {
    const sheet = SpreadsheetApp.openById(SHEET_ID).getActiveSheet();
    const data = JSON.parse(e.postData.contents);
    
    // หากเพิ่งสร้างชีตใหม่ ให้ใส่หัวตาราง
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["Timestamp", "Form Type", "Device", "Page", "User Agent"]);
    }
    
    sheet.appendRow([
      data.timestamp || new Date(),
      data.form_type || "",
      data.device || "",
      data.page || "",
      data.user_agent || ""
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({"status": "success"}))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({"status": "error", "message": error.message}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

4. กดปุ่ม **ทำให้ใช้งานได้ (Deploy)** > **การทำให้ใช้งานได้รายการใหม่ (New deployment)**
5. เลือกประเภท: **เว็บแอป (Web app)**
6. สิทธิ์การเข้าถึง (Who has access): เลือก **ทุกคน (Anyone)**
7. กด **ทำให้ใช้งานได้ (Deploy)** (อาจจะต้องกดยอมรับสิทธิ์)
8. คัดลอก **URL ของเว็บแอป (Web app URL)**
9. นำ URL ไปวางในไฟล์ `src/config.js` ในตัวแปร `GOOGLE_SCRIPT_URL` แล้ว Commit/Push โค้ดอีกครั้ง

## การสร้าง QR Code
หลังจากนำขึ้น GitHub Pages สำเร็จ จะได้ URL เช่น `https://pharmacisttom.github.io/pdhpsyco/` 
สามารถนำ URL นี้ไปแปลงเป็น QR Code ผ่านเว็บสร้าง QR Code ทั่วไป และนำไปติดที่โรงพยาบาลได้ทันที
