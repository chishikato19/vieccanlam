
export const saveToCloud = async (scriptUrl: string, data: any) => {
  try {
    // SỬA ĐỔI: Sử dụng text/plain thay vì application/json
    // Điều này giúp trình duyệt không gửi yêu cầu OPTIONS (pre-flight)
    // Google Apps Script sẽ nhận được chuỗi raw text và parse trong doPost
    const response = await fetch(scriptUrl, {
      method: 'POST',
      mode: 'no-cors', 
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify({
        action: 'save',
        data: data
      })
    });
    return true;
  } catch (error) {
    console.error("Cloud Save Error:", error);
    // Với mode no-cors, chúng ta không bắt được lỗi server trả về,
    // nhưng catch này sẽ bắt lỗi mạng (mất mạng, sai url domain...)
    throw error;
  }
};

export const loadFromCloud = async (scriptUrl: string) => {
  try {
    // Với GET, Google Script sẽ redirect (302), fetch mặc định sẽ follow redirect.
    // Nếu lỗi Failed to fetch ở đây -> Kiểm tra lại quyền "Anyone" trong Google Script Deploy.
    const response = await fetch(scriptUrl);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Cloud Load Error:", error);
    throw error;
  }
};
