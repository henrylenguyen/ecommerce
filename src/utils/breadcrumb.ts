export const formatBreadcrumbText = (text: string): string => {
  // Xử lý text có dấu gạch ngang
  const words = text
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
  
  return words;
};

interface BreadcrumbItem {
  label: string;
  path: string;
  disabled?: boolean;
}

export const getBreadcrumbItems = (pathname: string): BreadcrumbItem[] => {
  // Xử lý query params nếu có
  const [path, query] = pathname.split('?');
  let segments = path.split('/').filter(Boolean);
  
  // Nếu có query params, xử lý để lấy giá trị sau dấu =
  if (query) {
    const queryValue = query.split('=')[1];
    if (queryValue) {
      segments = [...segments, queryValue];
    }
  }

  // Luôn bắt đầu với Home
  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Home', path: '/' }
  ];

  // Xử lý từng segment
  segments.forEach((segment, index) => {
    const path = '/' + segments.slice(0, index + 1).join('/');
    const isManage = segment === 'manage';
    
    breadcrumbs.push({
      label: formatBreadcrumbText(segment),
      path: path,
      disabled: isManage
    });
  });

  return breadcrumbs;
}; 