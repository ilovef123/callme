// 统一图片/头像路径补全工具
export default function getFullUrl(url: string = ''): string {
  if (!url) return '';
  if (/^https?:\/\/.+/.test(url)) {
    // 强制把 http://localhost:3001/uploads/xxx.jpg 替换为 /api/uploads/xxx.jpg
    return url.replace('http://localhost:3001/uploads/', '/api/uploads/');
  }
  if (url.startsWith('/uploads/')) return `/api${url}`;
  if (url.startsWith('uploads/')) return `/api/${url}`;
  return url;
}
