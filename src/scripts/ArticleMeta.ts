const PREFIX_PV = 'vh-blog-pv';
const PREFIX_LIKE = 'vh-blog-like';
const PREFIX_COMMENTS = 'vh-blog-comments';

const articleMetaInit = () => {
  document.querySelectorAll<HTMLElement>('.vh-article-meta').forEach((el) => {
    const id = el.dataset.id;
    if (!id) return;
    const path = `/article/${id}`;
    // 浏览量
    const pv = localStorage.getItem(`${PREFIX_PV}${path}`) || '0';
    const pvEl = el.querySelector('.meta-pv em');
    if (pvEl) pvEl.textContent = pv;
    // 点赞数
    const like = localStorage.getItem(`${PREFIX_LIKE}${path}`) || '0';
    const likeEl = el.querySelector('.meta-like em');
    if (likeEl) likeEl.textContent = like;
    // 评论数
    const commentsRaw = localStorage.getItem(`${PREFIX_COMMENTS}${path}`);
    let commentCount = 0;
    if (commentsRaw) {
      try { commentCount = JSON.parse(commentsRaw).length; } catch { commentCount = 0; }
    }
    const cmtEl = el.querySelector('.meta-cmt em');
    if (cmtEl) cmtEl.textContent = String(commentCount);
  });
};

export default articleMetaInit;
