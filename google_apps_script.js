
/**
 * GOOGLE APPS SCRIPT FOR KIDDO QUEST
 * Hướng dẫn:
 * 1. Mở một Google Sheet mới.
 * 2. Vào Tiện ích mở rộng (Extensions) -> Apps Script.
 * 3. Xóa hết mã cũ và dán mã này vào.
 * 4. Nhấn biểu tượng Lưu.
 * 5. Nhấn "Triển khai" (Deploy) -> "Triển khai mới" (New deployment).
 * 6. Chọn loại là "Ứng dụng web" (Web app).
 * 7. Cấu hình: 
 *    - Execute as: Me (Tài khoản của bạn).
 *    - Who has access: Anyone (Bất kỳ ai - để App có thể gửi dữ liệu lên).
 * 8. Copy URL nhận được và dán vào phần "Đồng bộ Đám mây" trong App.
 */

function doPost(e) {
  try {
    // Nhận dữ liệu từ App gửi lên (dưới dạng text/plain để tránh lỗi CORS)
    var contents = e.postData.contents;
    var payload = JSON.parse(contents);
    var action = payload.action;
    var data = payload.data;

    // Truy cập Sheet hiện tại
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheets()[0]; // Lấy sheet đầu tiên

    if (action === 'save') {
      // Lưu toàn bộ dữ liệu JSON vào ô A1
      // Chuyển object thành string để lưu trữ
      sheet.getRange("A1").setValue(JSON.stringify(data));
      
      // Ghi lại thời gian cập nhật cuối cùng vào ô B1 (tùy chọn)
      sheet.getRange("B1").setValue("Last updated: " + new Date().toLocaleString());

      return ContentService.createTextOutput(JSON.stringify({ 
        status: 'success', 
        message: 'Data saved successfully' 
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    return ContentService.createTextOutput(JSON.stringify({ 
      status: 'error', 
      message: 'Invalid action' 
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    // Trả về lỗi nếu có vấn đề khi lưu
    return ContentService.createTextOutput(JSON.stringify({ 
      status: 'error', 
      message: err.toString() 
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheets()[0];
    
    // Đọc dữ liệu từ ô A1
    var dataString = sheet.getRange("A1").getValue();
    
    // Nếu ô A1 trống, trả về object rỗng
    if (!dataString) {
      dataString = "{}";
    }

    // Trả về dữ liệu JSON cho App
    return ContentService.createTextOutput(dataString)
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ 
      status: 'error', 
      message: err.toString() 
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
