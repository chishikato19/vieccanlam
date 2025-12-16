
export const saveToCloud = async (scriptUrl: string, data: any) => {
  try {
    const response = await fetch(scriptUrl, {
      method: 'POST',
      mode: 'no-cors', // Google Apps Script yêu cầu no-cors hoặc xử lý redirect phức tạp, no-cors là cách đơn giản nhất để gửi data đi
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'save',
        data: data
      })
    });
    // Lưu ý: Mode 'no-cors' sẽ không trả về response body đọc được. 
    // Chúng ta giả định gửi thành công nếu không có lỗi mạng.
    return true;
  } catch (error) {
    console.error("Cloud Save Error:", error);
    throw error;
  }
};

export const loadFromCloud = async (scriptUrl: string) => {
  try {
    const response = await fetch(scriptUrl);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Cloud Load Error:", error);
    throw error;
  }
};
