# Next/Link

- Next Link là một component của Next.js dùng để điều hướng giữa các trang trong app.
- Nó cung cấp các tính năng như prefetching, scroll restoration, và các tùy chọn để điều hướng giữa các trang một cách hiệu quả.
- Next Link có thể được sử dụng để điều hướng giữa các trang trong app mà không cần reload toàn bộ trang.

## Cách sử dụng

```tsx

import Link from "next/link"

export default function Home() {
  return <Link href="/about">About</Link>
}

```
## Các tính năng

- **Prefetch**: Next Link tự động prefetching các trang liên quan để cải thiện trải nghiệm người dùng.

```tsx
<Link href="/about" prefetch>About</Link>

```

- **Scroll Restoration**: Next Link giữ nguyên vị trí cuộn khi người dùng chuyển đổi giữa các trang.

```tsx
<Link href="/about" scroll>About</Link>

```

- **Replace**: Next Link có thể thay thế trang hiện tại bằng trang mới mà không lưu lại lịch sử.

```tsx
<Link href="/about" replace>About</Link>

```
- **Href**: Next Link có thể được sử dụng để điều hướng giữa các trang bằng cách truyền vào một URL hoặc một object.

```tsx
<Link href="/about">About</Link>
<Link href={{ pathname: "/products", query: { slug: "iphone-15-pro-max" } }}>Products</Link>

```
