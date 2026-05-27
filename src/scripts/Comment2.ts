const PREFIX = 'vh-blog-comments';

interface Comment {
  nick: string;
  mail: string;
  content: string;
  time: number;
  id: string;
}

function getComments(path: string): Comment[] {
  const raw = localStorage.getItem(`${PREFIX}${path}`);
  if (!raw) return [];
  try { return JSON.parse(raw); } catch { return []; }
}

function saveComments(path: string, comments: Comment[]) {
  localStorage.setItem(`${PREFIX}${path}`, JSON.stringify(comments));
}

function getAvatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return `hsl(${hash % 360}, 55%, 65%)`;
}

function formatTime(ts: number): string {
  const d = new Date(ts);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function renderComments(container: HTMLElement, comments: Comment[], path: string) {
  if (!comments.length) {
    container.innerHTML = '<p class="comment-empty">暂无评论，来抢沙发吧~</p>';
    return;
  }
  container.innerHTML = comments.map((c) => `
    <div class="comment-item" data-id="${c.id}">
      <div class="comment-avatar" style="background-color:${getAvatarColor(c.nick)}">${c.nick.charAt(0).toUpperCase()}</div>
      <div class="comment-body">
        <div class="comment-header">
          <strong class="comment-nick">${escapeHtml(c.nick)}</strong>
          <time>${formatTime(c.time)}</time>
        </div>
        <p class="comment-text">${escapeHtml(c.content)}</p>
        <button class="comment-delete" data-id="${c.id}" title="删除">删除</button>
      </div>
    </div>
  `).join('');
  // 绑定删除事件
  container.querySelectorAll('.comment-delete').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = (btn as HTMLElement).dataset.id!;
      const updated = comments.filter((c) => c.id !== id);
      saveComments(path, updated);
      const info = document.querySelector('.comment-count-info');
      if (info) info.textContent = `${updated.length} 条评论`;
      renderComments(container, updated, path);
    });
  });
}

function escapeHtml(str: string): string {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

const comment2Init = () => {
  const section = document.querySelector('.vh-comment2');
  if (!section) return;
  const path = window.location.pathname.replace(/\/$/, '') || '/';
  const form = section.querySelector('.comment-form') as HTMLFormElement;
  const listEl = section.querySelector('.comment-list') as HTMLElement;
  const infoEl = section.querySelector('.comment-count-info') as HTMLElement;
  const nickInput = section.querySelector('.comment-nick') as HTMLInputElement;
  const mailInput = section.querySelector('.comment-mail') as HTMLInputElement;
  const contentInput = section.querySelector('.comment-content') as HTMLTextAreaElement;

  // 恢复上次昵称和邮箱
  const savedNick = localStorage.getItem('vh-blog-comment-nick') || '';
  const savedMail = localStorage.getItem('vh-blog-comment-mail') || '';
  if (savedNick) nickInput.value = savedNick;
  if (savedMail) mailInput.value = savedMail;

  // 渲染已有评论
  let comments = getComments(path);
  infoEl.textContent = `${comments.length} 条评论`;
  renderComments(listEl, comments, path);

  // 提交评论
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const nick = nickInput.value.trim();
    const mail = mailInput.value.trim();
    const content = contentInput.value.trim();
    if (!nick || !content) return;
    const comment: Comment = {
      nick,
      mail,
      content,
      time: Date.now(),
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
    };
    comments.push(comment);
    saveComments(path, comments);
    localStorage.setItem('vh-blog-comment-nick', nick);
    if (mail) localStorage.setItem('vh-blog-comment-mail', mail);
    contentInput.value = '';
    infoEl.textContent = `${comments.length} 条评论`;
    renderComments(listEl, comments, path);
  });
};

export default comment2Init;
