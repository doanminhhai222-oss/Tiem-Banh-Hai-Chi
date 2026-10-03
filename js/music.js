/* Nhạc nền: phát file assets/nhac-nen.mp3 */
(() => {
  const btn = document.getElementById('musicBtn');
  if (!btn) return;

  const KEY = 'hc_music';
  const pref = () => { try { return localStorage.getItem(KEY); } catch { return null; } };
  const setPref = (v) => { try { localStorage.setItem(KEY, v); } catch { /* bỏ qua */ } };

  // Nhạc nền: file MP3 trong assets/, phát lặp, âm lượng nhỏ và tăng/giảm dần
  const VOL = 0.35;
  const audio = new Audio('assets/nhac-nen.mp3');
  audio.loop = true; audio.preload = 'auto'; audio.volume = 0;
  let playing = false, fade;

  function ramp(to, ms, done) {
    clearInterval(fade);
    const from = audio.volume, t0 = performance.now();
    fade = setInterval(() => {
      const k = Math.min(1, (performance.now() - t0) / ms);
      audio.volume = Math.max(0, Math.min(1, from + (to - from) * k));
      if (k >= 1) { clearInterval(fade); if (done) done(); }
    }, 50);
  }
  async function play() {
    if (playing) return;
    try { await audio.play(); } catch { return; }
    playing = true; ramp(VOL, 2500); ui();
  }
  function stop() {
    if (!playing) return;
    playing = false; ramp(0, 700, () => { if (!playing) audio.pause(); }); ui();
  }
  function ui() {
    btn.classList.toggle('on', playing);
    btn.setAttribute('aria-pressed', playing);
    btn.setAttribute('aria-label', playing ? 'Tắt nhạc nền' : 'Bật nhạc nền');
    btn.title = playing ? 'Tắt nhạc nền' : 'Bật nhạc nền';
  }

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (playing) { setPref('off'); stop(); } else { setPref('on'); play(); }
  });

  // Trình duyệt chặn tiếng khi chưa có tương tác. Thử phát ngay khi mở trang;
  // nếu bị chặn thì hiện màn chào "Vào tiệm" để lấy cú chạm đầu tiên rồi phát nhạc.
  let splash;
  function hideSplash() { const s = splash; if (s) { splash = null; s.classList.add('hide'); setTimeout(() => s.remove(), 600); } }
  function showSplash() {
    if (splash || playing) return;
    splash = document.createElement('div');
    splash.className = 'splash';
    splash.innerHTML = '<div class="splash-box"><img src="' + (document.querySelector('.brand-logo') || {}).src + '" alt=""><h2>Chào mừng đến <span class="script">Hải Chi Bakery</span></h2><p>Ngọt ngào từng lát bánh, ấm áp từng cốc trà</p><button class="btn" type="button">♪ Vào tiệm</button><small>Chạm để bật nhạc nền nhẹ nhàng</small></div>';
    splash.addEventListener('click', () => { setPref('on'); play(); hideSplash(); });
    document.body.appendChild(splash);
    splash.querySelector('button').focus({ preventScroll: true });
  }
  async function autoStart() {
    if (pref() === 'off') return;
    await play();
    if (!playing) showSplash();
  }
  // nếu khách chạm/gõ phím trước khi màn chào kịp hiện thì phát luôn
  const gestures = ['click', 'pointerup', 'touchend', 'keydown'];
  const onGesture = (e) => {
    if (e.target && e.target.closest && e.target.closest('#musicBtn')) return;
    if (pref() !== 'off' && !playing) { play(); hideSplash(); }
    if (playing) gestures.forEach((g) => document.removeEventListener(g, onGesture, true));
  };
  gestures.forEach((g) => document.addEventListener(g, onGesture, true));

  document.addEventListener('visibilitychange', () => {
    if (!playing) return;
    if (document.hidden) audio.pause(); else audio.play().catch(() => {});
  });
  ui();
  autoStart();
})();
