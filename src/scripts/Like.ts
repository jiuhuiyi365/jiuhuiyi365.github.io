const PREFIX_LIKE = 'vh-blog-like';
const PREFIX_LIKED = 'vh-blog-liked';

const likeInit = () => {
  const btn = document.querySelector('.article-like-btn') as HTMLButtonElement;
  if (!btn) return;
  const path = window.location.pathname.replace(/\/$/, '') || '/';
  const likeKey = `${PREFIX_LIKE}${path}`;
  const likedKey = `${PREFIX_LIKED}${path}`;
  const countEl = btn.querySelector('.like-count') as HTMLElement;

  // 读取数据
  let count = parseInt(localStorage.getItem(likeKey) || '0', 10);
  let liked = localStorage.getItem(likedKey) === '1';

  // 渲染初始状态
  const render = () => {
    countEl.textContent = String(count);
    btn.classList.toggle('liked', liked);
  };
  render();

  // 点击切换
  btn.addEventListener('click', () => {
    liked = !liked;
    count += liked ? 1 : -1;
    if (count < 0) count = 0;
    localStorage.setItem(likeKey, String(count));
    localStorage.setItem(likedKey, liked ? '1' : '0');
    render();
  });
};

export default likeInit;
