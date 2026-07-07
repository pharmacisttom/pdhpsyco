const SHEET_ID = '1Q_sYf4rcb1GB98LQj19SGKxKSPDk1TQ4LL_4POoLZeY';

// ==========================================
// 1. รับข้อมูลจากเว็บไซต์แบบฟอร์ม (doPost)
// ==========================================
function doPost(e) {
  try {
    const doc = SpreadsheetApp.openById(SHEET_ID);
    let sheet = doc.getSheetByName('usage_log');
    
    // ถ้าไม่มีชีต usage_log ให้สร้างใหม่
    if (!sheet) {
      sheet = doc.insertSheet('usage_log');
    }
    
    const data = JSON.parse(e.postData.contents);
    
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["Timestamp", "Form Type", "Device", "Page", "User Agent", "Phone Number", "Score", "Interpretation", "Status", "Name"]);
    }
    
    sheet.appendRow([
      data.timestamp || new Date(),
      data.form_type || "",
      data.device || "",
      data.page || "",
      data.user_agent || "",
      data.phone ? "'" + data.phone : "", // ใส่ ' นำหน้าเพื่อให้ Google Sheet มองเป็นข้อความ (ไม่ตัดเลข 0)
      data.score || "",
      data.interpretation || "",
      "รอดำเนินการ", // ค่าเริ่มต้นสำหรับ Status
      data.name || ""
    ]);
    
    // แจ้งเตือน Telegram เมื่อมีการส่งเบอร์โทรศัพท์
    if (data.phone) {
      sendTelegramNotification(data);
    }
    
    return ContentService.createTextOutput(JSON.stringify({"status": "success"}))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({"status": "error", "message": error.message}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ==========================================
// 2. แสดงหน้าเว็บ Dashboard (doGet)
// ==========================================
function doGet(e) {
  // ดึงไฟล์ Index.html มาแสดงเป็นหน้าเว็บ
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('PDH Admin Dashboard')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

// ==========================================
// 3. ฟังก์ชันตรวจสอบ Login
// ==========================================
function checkLogin(username, password) {
  const doc = SpreadsheetApp.openById(SHEET_ID);
  const userSheet = doc.getSheetByName('user');
  
  if (!userSheet) return false;
  
  const data = userSheet.getDataRange().getValues();
  // ข้ามหัวตาราง (แถวที่ 1)
  for (let i = 1; i < data.length; i++) {
    const rowUser = String(data[i][1]).trim();
    const rowPass = String(data[i][2]).trim();
    
    if (rowUser === username && rowPass === password) {
      return true; // ล็อกอินสำเร็จ
    }
  }
  return false; // ล็อกอินไม่สำเร็จ
}

// ==========================================
// 4. ฟังก์ชันดึงข้อมูลคนไข้ที่มีเบอร์โทร
// ==========================================
function getDashboardData() {
  const doc = SpreadsheetApp.openById(SHEET_ID);
  const sheet = doc.getSheetByName('usage_log');
  
  if (!sheet) return [];
  
  const data = sheet.getDataRange().getValues();
  const result = [];
  
  // ข้ามแถวที่ 1 (หัวตาราง)
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const phoneRaw = row[5]; // คอลัมน์ F (Index 5)
    
    // ดึงเฉพาะคนที่มีเบอร์โทร
    if (phoneRaw && String(phoneRaw).trim() !== "") {
      let phoneStr = String(phoneRaw).trim();
      
      // เผื่อกรณีข้อมูลเก่าที่โดน Google Sheet ตัดเลข 0 ไปแล้ว (เหลือ 9 หลัก) ให้เติม 0 กลับเข้าไป
      if (phoneStr.length === 9 && !phoneStr.startsWith('0')) {
        phoneStr = '0' + phoneStr;
      }

      result.push({
        rowNumber: i + 1, // เก็บเลขแถวไว้ใช้ตอนอัปเดตสถานะ
        timestamp: row[0],
        formType: row[1],
        phone: phoneStr,
        score: row[6],
        interpretation: row[7],
        status: row[8] || "รอดำเนินการ",
        name: row[9] || "-"
      });
    }
  }
  
  // เรียงลำดับเอาข้อมูลใหม่ล่าสุดขึ้นก่อน
  return result.reverse();
}

// ==========================================
// 5. ฟังก์ชันอัปเดตสถานะ "ติดต่อแล้ว"
// ==========================================
function markAsContacted(rowNumber, isContacted) {
  const doc = SpreadsheetApp.openById(SHEET_ID);
  const sheet = doc.getSheetByName('usage_log');
  
  if (!sheet) return false;
  
  // คอลัมน์ Status คือคอลัมน์ที่ 9 (I)
  const statusCol = 9;
  const newStatus = isContacted ? "ติดต่อแล้ว" : "รอดำเนินการ";
  
  sheet.getRange(rowNumber, statusCol).setValue(newStatus);
  return newStatus;
}

// ==========================================
// 6. ฟังก์ชันดึงสถิติผู้ใช้งาน
// ==========================================
function getStatistics() {
  const doc = SpreadsheetApp.openById(SHEET_ID);
  const sheet = doc.getSheetByName('usage_log');
  
  if (!sheet) return null;
  
  const data = sheet.getDataRange().getValues();
  
  let totalVisits = 0;
  let formCounts = { "2Q-9Q": 0, "SPST-20": 0, "THI-15": 0 };
  let deviceCounts = { "mobile": 0, "desktop": 0, "tablet": 0 };
  
  // ข้ามหัวตารางแถวแรก
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    // ถ้าแถวว่าง ไม่มี timestamp ถือว่าไม่มีข้อมูล
    if (!row[0]) continue; 
    
    totalVisits++;
    
    const formType = String(row[1]).trim();
    if (formCounts[formType] !== undefined) {
      formCounts[formType]++;
    } else if (formType) {
      formCounts[formType] = 1; // แบบประเมินอื่นๆ เผื่อมี
    }
    
    const device = String(row[2]).trim().toLowerCase();
    if (deviceCounts[device] !== undefined) {
      deviceCounts[device]++;
    }
  }
  
  return {
    total: totalVisits,
    forms: formCounts,
    devices: deviceCounts
  };
}

// ==========================================
// 7. แจ้งเตือนผ่าน Telegram
// ==========================================
// *** กรุณาใส่ Token และ Chat ID ของคุณ ***
const TELEGRAM_BOT_TOKEN = '8951608283:AAGXgl-4FXYmFhRUN_LueZfuCdMj_Z76Khs';
const TELEGRAM_CHAT_ID = '7120624882';

function sendTelegramNotification(data) {
  if (!TELEGRAM_BOT_TOKEN || TELEGRAM_BOT_TOKEN === 'YOUR_TELEGRAM_BOT_TOKEN') {
    return; // ยังไม่ได้ตั้งค่า Token
  }
  
  const text = `🚨 <b>มีการขอรับคำปรึกษาใหม่ (มีเบอร์โทร)</b>\n\n` +
               `<b>ชื่อผู้ติดต่อ:</b> ${data.name || '-'}\n` +
               `<b>แบบประเมิน:</b> ${data.form_type || '-'}\n` +
               `<b>คะแนน:</b> ${data.score || '-'}\n` +
               `<b>ผลประเมิน:</b> ${data.interpretation || '-'}\n` +
               `<b>เบอร์ติดต่อ:</b> ${data.phone}\n` +
               `<b>เวลา:</b> ${data.timestamp || new Date().toLocaleString()}`;
               
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  
  const payload = {
    chat_id: TELEGRAM_CHAT_ID,
    text: text,
    parse_mode: "HTML"
  };
  
  const options = {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };
  
  try {
    UrlFetchApp.fetch(url, options);
  } catch (e) {
    console.error("Telegram Error: " + e.message);
  }
}
