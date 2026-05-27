// 扩展 Window 接口以包含 swup 属性
declare global {
  interface Window {
    swup: { hooks: { on: (event: string, handler: EventHandler) => void } };
  }
}
type EventHandler = (event: Event) => void;

//  进入页面时触发
const inRouter = (handler: EventHandler) => {
  const setup = () => {
    let called = false;
    const safeHandler = (e: Event) => {
      if (called) return;
      called = true;
      handler(e);
    };
    window.swup.hooks.on("page:view", safeHandler);
    // 兜底：如果 page:view 因 Swup 动画竞态未触发，visit:end 保证执行
    window.swup.hooks.on("visit:end", (e: Event) => {
      if (!called) safeHandler(e);
    });
  };
  window.swup ? setup() : document.addEventListener("swup:enable", setup);
};
// 离开当前页面时触发
const outRouter = (handler: EventHandler) => window.swup ? window.swup.hooks.on("visit:start", handler) : document.addEventListener("swup:enable", () => outRouter(handler));

export { inRouter, outRouter };
