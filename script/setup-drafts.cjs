// 创建 drafts 符号链接，使 drafts/ 目录可在本地开发时预览
const fs = require('fs');
const path = require('path');

const link = path.join(__dirname, '..', 'src', 'content', 'blog', '_drafts');
const target = path.join(__dirname, '..', 'drafts');

// 如果链接已存在，跳过
if (fs.existsSync(link)) {
  console.log('_drafts 链接已存在，跳过');
  process.exit(0);
}

// 如果目标目录不存在，创建
if (!fs.existsSync(target)) {
  fs.mkdirSync(target, { recursive: true });
}

try {
  // Windows 使用 junction（不需要管理员权限），Unix 使用 symlink
  if (process.platform === 'win32') {
    fs.symlinkSync(target, link, 'junction');
  } else {
    fs.symlinkSync(target, link, 'dir');
  }
  console.log('已创建 _drafts 符号链接，drafts/ 文章现在可以本地预览');
} catch (err) {
  console.error('创建符号链接失败:', err.message);
  process.exit(1);
}
