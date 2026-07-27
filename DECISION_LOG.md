# Decision Log

## [16:35] - Phân tích đề bài và chọn phạm vi

### Tình huống

Workspace ban đầu chỉ có README. Tôi cần xác định chính xác các màn hình, API, dữ liệu, Docker và tài liệu phải nộp trong giới hạn 24 giờ.

### Các phương án đã cân nhắc

- Phương án A: Chỉ dựng UI và dùng dữ liệu tĩnh trong frontend.
- Phương án B: Dựng đủ frontend, Mockoon CRUD API, token mock và Docker Compose.

### Quyết định

Chọn phương án B vì đề yêu cầu rõ các lệnh gọi `/api/login`, `/api/product`, `/api/product/{id}`, `/api/logout` và phải nộp `mockoon-data.json`.

### Kết quả

Phạm vi được chia thành login, product list, product detail, logout, responsive, Mockoon, Docker và tài liệu.

## [16:38] - Nếu dùng AI

### Prompt đã dùng

> giúp tôi làm bài này với ạ ,đọc theo yêu cầu và hướng dẫn tôi làm nhé

### Kết quả AI trả về

AI đọc toàn bộ PDF, tổng hợp yêu cầu bắt buộc, chỉ ra các điểm dễ mất như token, filter, Docker networking và đề xuất kiến trúc triển khai.

### Đánh giá của tôi

Phần tổng hợp khớp với nội dung PDF. Tôi giữ lại hướng dùng Mockoon CRUD route và API proxy, đồng thời giới hạn tính năng ngoài phạm vi để phù hợp thời gian làm bài.

## [16:49] - Chọn cách giao tiếp giữa hai container

### Tình huống

JavaScript chạy trong trình duyệt không thể phân giải hostname nội bộ Docker `mock-api`.

### Các phương án đã cân nhắc

- Cho trình duyệt gọi `http://localhost:3001`.
- Dùng Nginx reverse proxy.
- Dùng catch-all API route trong frontend để proxy sang Mockoon.

### Quyết định

Chọn API route proxy. Frontend luôn gọi URL tương đối `/api`, còn server frontend dùng biến `MOCK_API_URL=http://mock-api:3000` khi chạy Docker.

### Kết quả

Cùng một mã frontend chạy được cả local và Docker, không phụ thuộc CORS hoặc hostname nội bộ ở phía trình duyệt.

## [16:50] - Nếu dùng AI

### Prompt đã dùng

> Bước tiếp theo có thể bắt đầu dựng toàn bộ skeleton React, Mockoon API và Docker ngay trong workspace này.

### Kết quả AI trả về

AI tạo bộ khung React/TypeScript, giao diện NEXA, Mockoon API với 120 sản phẩm, Dockerfile, Docker Compose và tài liệu dự án.

### Đánh giá của tôi

Tôi kiểm tra lại bằng production build và gọi trực tiếp các endpoint. Login đúng trả 200, login sai trả 401, filter/pagination trả đúng số lượng, product detail trả đúng sản phẩm và logout trả 204.

## [17:02] - Tìm kiếm và lọc sản phẩm

### Tình huống

Mockoon có tham số `search`, nhưng tham số này tìm trên mọi giá trị của sản phẩm trong khi đề yêu cầu search theo product name.

### Các phương án đã cân nhắc

- Dùng `search`.
- Lọc client-side sau khi tải toàn bộ 120 sản phẩm.
- Dùng `name_like` của CRUD route.

### Quyết định

Dùng `name_like` cho ô search; dùng `category_eq`, `brand_eq`, `inStock_eq`, `sort`, `order`, `page` và `limit` cho các điều kiện còn lại.

### Kết quả

Search chỉ tác động lên tên, còn filter, sort và pagination vẫn được xử lý phía mock API.

## [19:50] - Nếu dùng AI

### Prompt đã dùng

> cho tôi các skeleton đi ạ

### Kết quả AI trả về

AI tách loading state thành ba component riêng: kiểm tra phiên đăng nhập, danh sách sản phẩm và chi tiết sản phẩm. Các skeleton mô phỏng đúng bố cục thật thay vì chỉ hiển thị một khối màu chung.

### Đánh giá của tôi

Tôi giữ cách triển khai này vì component tái sử dụng rõ ràng, có thông báo dành cho screen reader, hỗ trợ reduced motion và giúp hạn chế layout shift trong khi tải dữ liệu.....

