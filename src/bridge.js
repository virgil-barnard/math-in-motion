/* Portable document contract v1. Parent identity is checked; no network access. */
const MotionBridge = (() => {
  const channel = 'mathematics-in-motion/v1';
  let hooks = null;
  const lesson = document.documentElement.dataset.lesson;
  const embedded = window.parent !== window;
  if (embedded) document.documentElement.classList.add('embedded');
  function send(type, extra = {}) {
    if (embedded) window.parent.postMessage({channel, lesson, type, ...extra}, '*');
  }
  function changed() { if (hooks) send('state', {state: hooks.snapshot()}); }
  window.addEventListener('message', event => {
    if (!embedded || event.source !== window.parent || event.data?.channel !== channel || !hooks) return;
    const data = event.data;
    if (data.type === 'restore') {
      if (data.state) hooks.restore(data.state);
      hooks.pause();
      changed();
      send('restored', {request: data.request, state: hooks.snapshot()});
    } else if (data.type === 'pause') {
      hooks.pause();
      send('paused', {request: data.request, state: hooks.snapshot()});
    }
  });
  return {
    connect(value) { hooks = value; if (embedded) hooks.pause(); send('ready', {acknowledgesRestore: true}); },
    changed,
    explored() { send('explored'); }
  };
})();
