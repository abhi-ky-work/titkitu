export function createPageUrl(pageName) {
  if (pageName.includes('?')) {
    const [page, query] = pageName.split('?');
    return `/${page}?${query}`;
  }
  return `/${pageName}`;
}