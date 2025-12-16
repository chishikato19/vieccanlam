
export const saveToCloud = async (scriptUrl: string, data: any) => {
  try {
    // SỬA ĐỔI: Sử dụng URLSearchParams (Form Data Standard)
    // Đây là cách "chuẩn" nhất để gửi dữ liệu lên Google Forms/Sheets thông qua Script
    // Giúp tránh các lỗi liên quan đến CORS Pre-flight check
    const formData = new URLSearchParams();
    formData.append('action', 'save');
    // Chuyển data thành chuỗi JSON trước khi gửi
    formData.append('data', JSON.stringify(data));

    // Sử dụng no-cors để trình duyệt cho phép gửi đi mà không chặn
    // Lưu ý: no-cors nghĩa là ta gửi đi nhưng không đọc được phản hồi "success"
    // nhưng Google Script vẫn sẽ nhận được và xử lý.
    await fetch(scriptUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString()
    });
    
    return true;
  } catch (error) {
    console.error("Cloud Save Error:", error);
    throw error;
  }
};

export const loadFromCloud = async (scriptUrl: string) => {
  try {
    // Thêm tham số timestamp để tránh bị trình duyệt cache dữ liệu cũ
    const urlWithParams = `${scriptUrl}${scriptUrl.includes('?') ? '&' : '?'}action=load&t=${Date.now()}`;
    
    const response = await fetch(urlWithParams, {
        method: 'GET'
        // Không set header Content-Type ở GET request để tránh pre-flight
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Cloud Load Error:", error);
    // Nếu lỗi Failed to fetch xảy ra ở đây, 99% là do chưa set quyền "Anyone" trong Google Script
    throw new Error("Không thể kết nối. Vui lòng kiểm tra: 1. Quyền 'Bất kỳ ai' (Anyone). 2. URL Script chính xác.");
  }
};
