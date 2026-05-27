const PREFIX = 'vh-blog-pv';
const VISITED_PREFIX = 'vh-blog-pv-visited';

const pageviewInit = () => {
  const el = document.querySelector('.article-pageview .pageview-count') as HTMLElement;
  if (!el) return;
  const path = window.location.pathname.replace(/\/$/, '') || '/';
  const key = `${PREFIX}${path}`;
  const visitedKey = `${VISITED_PREFIX}${path}`;
  // 获取当前浏览量
  let count = parseInt(localStorage.getItem(key) || '0', 10);
  // 本次会话未访问过则 +1
  if (!sessionStorage.getItem(visitedKey)) {
    count++;
    localStorage.setItem(key, String(count));
    sessionStorage.setItem(visitedKey, '1');
  }
  el.textContent = String(count);
};

export default pageviewInit;
