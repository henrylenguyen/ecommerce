import { BookOpenText, Home, LucideUserSquare2, MessageCircleMore, ShoppingCart, SwatchBookIcon } from "lucide-react"

export const sidebarItems: TSidebarItem[] = [
  {
    title: "Khám phá",
    url: "/",
    icon: <Home />,
  },
  {
    title: "Khu vực học tập",
    url: "/learning",
    icon: <BookOpenText />,
  },
  {
    title: "Quản lý khóa học",
    url: "/manage/courses",
    icon: <SwatchBookIcon />,
  },
  {
    title: "Quản lý thành viên",
    url: "/manage/members",
    icon: <LucideUserSquare2 />,
  },
  {
    title: "Quản lý comment",
    url: "/manage/comments",
    icon: <MessageCircleMore />,
  },
  {
    title: "Quản lý đơn hàng",
    url: "/manage/orders",
    icon: <ShoppingCart />,
  },
]