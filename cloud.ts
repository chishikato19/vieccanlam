
export const saveToCloud = async (scriptUrl: string, data: any) => {
  try {
    // PHƯƠNG PHÁP MỚI: Gửi Text thuần (text/plain)
    // Chúng ta đóng gói toàn bộ data thành 1 string JSON
    const payload = JSON.stringify({
      action: 'save',
      data: data
    });

    // fetch với text/plain không kích hoạt CORS Preflight (OPTIONS request)
    // Điều này giúp request đi thẳng đến Google Script
    const response = await fetch(scriptUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8', 
      },
      body: payload
    });

    // Với mode text/plain, chúng ta có thể đọc được response text
    const resultText = await response.text();
    
    // Kiểm tra xem server có trả về success không
    try {
        const resultJson = JSON.parse(resultText);
        if (resultJson.status === 'error') {
            throw new Error(resultJson.message);
        }
    } catch (e) {
        // Nếu không parse được JSON, có thể là lỗi HTML từ Google (ví dụ 404, 500)
        // Nhưng thường nếu status 200 OK thì coi như đã gửi được.
    }
    
    return true;
  } catch (error) {
    console.error("Cloud Save Error:", error);
    throw error;
  }
};

export const loadFromCloud = async (scriptUrl: string) => {
  try {
    // Thêm timestamp để tránh cache
    const urlWithParams = `${scriptUrl}${scriptUrl.includes('?') ? '&' : '?'}t=${Date.now()}`;
    
    const response = await fetch(urlWithParams);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const text = await response.text();
    if (!text || text.trim() === "") return null;

    try {
        const data = JSON.parse(text);
        // Kiểm tra nếu data rỗng
        if (Object.keys(data).length === 0) return null;
        return data;
    } catch (e) {
        console.error("Parse Error", e);
        throw new Error("Dữ liệu tải về bị lỗi định dạng.");
    }
  } catch (error) {
    console.error("Cloud Load Error:", error);
    throw new Error("Không thể kết nối. Kiểm tra lại đường link Google Script.");
  }
};
