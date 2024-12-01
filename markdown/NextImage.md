# NextImage
Image yêu cầu có 4 thuộc tính:

- `src`: đường dẫn ảnh
- `alt`: mô tả ảnh
- `width`: chiều rộng ảnh
- `height`: chiều cao ảnh

Nếu không có `width` và `height` thì nên dùng `fill` để ảnh lấy kích thước của cha bao bộc.
Nhưng lúc này ảnh sẽ là `absolute` nên thành ra container của nó phải có `position: relative`.

- prio