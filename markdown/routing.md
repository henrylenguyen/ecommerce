## Routing

1. Basic Routing : Thư mục có file `page.tsx` sẽ được hiểu là route của trang web.

ví dụ: `src/app/dashboard/page.tsx` sẽ là route `/dashboard`

2. Segment Dynamic Routing : Sử dụng `[` và `]` để định dạng route. Nó định dạng routing động theo segment.

ví dụ: `src/app/[username]/page.tsx` sẽ là route `/abc` hoặc 

3. Group Routes : Sử dụng thư mục để nhóm các route lại với nhau và sẽ không hiển thị trên url.

ví dụ: `src/app/(dashboard)/settings/page.tsx` sẽ là route `/settings`

4. Catch-all Routes : Sử dụng `[...slug]` để định dạng route. Đặt biệt nó cần các params để hiển thị trên url.

ví dụ: `src/app/shop/[...slug]/page.tsx` sẽ là route `/shop/abc/xyz`
Nếu không có `/abc/xyz` thì sẽ lỗi 404.

5. Optional Catch-all Routes : Sử dụng `[...slug]` để định dạng route. Nó không bắt buộc các params.

ví dụ: `src/app/shop/[...slug]/page.tsx` sẽ là route `/shop/abc/xyz` hoặc `/shop`


Lưu ý: Khi để 2 dynamic routing liền nhau thì sẽ lỗi.

ví dụ: `src/app/[username]` và `src/app/[postId]` sẽ lỗi.