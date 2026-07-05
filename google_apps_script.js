const SHEET_ID = '1Q_sYf4rcb1GB98LQj19SGKxKSPDk1TQ4LL_4POoLZeY';

function doPost(e) {
  try {
    const sheet = SpreadsheetApp.openById(SHEET_ID).getActiveSheet();
    const data = JSON.parse(e.postData.contents);
    
    // หากเพิ่งสร้างชีตใหม่ ให้ใส่หัวตาราง
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["Timestamp", "Form Type", "Device", "Page", "User Agent", "Phone Number", "Score", "Interpretation"]);
    }
    
    sheet.appendRow([
      data.timestamp || new Date(),
      data.form_type || "",
      data.device || "",
      data.page || "",
      data.user_agent || "",
      data.phone || "",
      data.score || "",
      data.interpretation || ""
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({"status": "success"}))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({"status": "error", "message": error.message}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
