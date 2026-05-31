// 扩展 Window 接口以包含 swup 属性
declare global {
  interface Window {
    swup: { hooks: { on: (event: string, handler: EventHandler, options?: any) => void } };
  }
}
type EventHandler = (event: Event) => void;

// 存储回调函数（模块级，只设置一次）
let inHandler: EventHandler | null = null;
let outHandler: EventHandler | null = null;
let hooksRegistered = false;

// 注册 Swup 钩子（只注册一次，防止重复累积）
const registerSwupHooks = () => {
  if (hooksRegistered || !window.swup) return;
  hooksRegistered = true;

  if (inHandler) {
    let called = false;
    window.swup.hooks.on("page:view", (e: Event) => {
      if (called) return;
      called = true;
      inHandler!(e);
    });
    window.swup.hooks.on("visit:end", (e: Event) => {
      if (!called) inHandler!(e);
      called = false; // 重置，为下次导航准备
    });
  }

  if (outHandler) {
    window.swup.hooks.on("visit:start", outHandler);
  }
};

//  进入页面时触发
const inRouter = (handler: EventHandler) => {
  inHandler = handler;
  if (window.swup) {
    registerSwupHooks();
  } else {
    document.addEventListener("swup:enable", registerSwupHooks);
  }
};

// 离开当前页面时触发
const outRouter = (handler: EventHandler) => {
  outHandler = handler;
  if (window.swup) {
    registerSwupHooks();
  } else {
    document.addEventListener("swup:enable", registerSwupHooks);
  }
};

export { inRouter, outRouter };
