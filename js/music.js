/* Nhạc nền nhẹ nhàng: hộp nhạc + pad mềm, tự sinh bằng Web Audio (không cần file nhạc) */
(() => {
  const btn = document.getElementById('musicBtn');
  if (!btn) return;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) { btn.hidden = true; return; }

  const KEY = 'hc_music';
  const pref = () => { try { return localStorage.getItem(KEY); } catch { return null; } };
  const setPref = (v) => { try { localStorage.setItem(KEY, v); } catch { /* bỏ qua */ } };

  const BPM = 66, BEAT = 60 / BPM, VOL = 0.5;
  const mtof = (m) => 440 * Math.pow(2, (m - 69) / 12);
  // C – Am – F – G (maj7 / m7 / maj7 / 6)
  const CHORDS = [
    { bass: 36, arp: [60, 64, 67, 71], pad: [48, 55, 59, 64] },
    { bass: 33, arp: [57, 60, 64, 67], pad: [45, 52, 55, 60] },
    { bass: 41, arp: [60, 64, 65, 69], pad: [41, 48, 52, 57] },
    { bass: 43, arp: [59, 62, 67, 69], pad: [43, 50, 55, 59] },
  ];
  const PENTA = [72, 74, 76, 79, 81, 84]; // C pentatonic cho giai điệu điểm xuyết

  let ctx, master, wet, playing = false, timer, nextTime = 0, step = 0;

  function init() {
    ctx = new AC();
    master = ctx.createGain(); master.gain.value = 0; master.connect(ctx.destination);
    const dry = ctx.createGain(); dry.gain.value = 0.75; dry.connect(master);
    // vang (reverb) tự tạo từ nhiễu suy giảm
    const len = ctx.sampleRate * 3, ir = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let c = 0; c < 2; c++) {
      const d = ir.getChannelData(c);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.6);
    }
    const conv = ctx.createConvolver(); conv.buffer = ir;
    wet = ctx.createGain(); wet.gain.value = 0.55; wet.connect(conv); conv.connect(master);
    const delay = ctx.createDelay(1); delay.delayTime.value = BEAT * 0.75;
    const fb = ctx.createGain(); fb.gain.value = 0.28; delay.connect(fb); fb.connect(delay); delay.connect(wet);
    wet.delayIn = delay; init.dry = dry;
  }

  function tone(freq, t, dur, vol, type, attack = 0.01) {
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type; o.frequency.value = freq;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(init.dry); g.connect(wet); g.connect(wet.delayIn);
    o.start(t); o.stop(t + dur + 0.05);
  }
  // âm hộp nhạc: sine + bổng bát độ nhỏ
  function bell(m, t, vol) { tone(mtof(m), t, 2.2, vol, 'sine'); tone(mtof(m) * 2, t, 0.9, vol * 0.18, 'sine'); }
  function pad(m, t, dur, vol) { tone(mtof(m), t, dur, vol, 'triangle', dur * 0.35); }

  function schedule() {
    while (nextTime < ctx.currentTime + 0.6) {
      const bar = Math.floor(step / 8) % CHORDS.length, i = step % 8, ch = CHORDS[bar];
      if (i === 0) {
        pad(ch.bass, nextTime, BEAT * 4.2, 0.16);
        ch.pad.forEach((m) => pad(m, nextTime, BEAT * 4.2, 0.05));
      }
      const order = [0, 1, 2, 3, 2, 1, 2, 1];
      bell(ch.arp[order[i]], nextTime, i % 4 === 0 ? 0.17 : 0.11);
      if ((i === 3 || i === 7) && Math.random() < 0.7) {
        bell(PENTA[Math.floor(Math.random() * PENTA.length)], nextTime + BEAT * 0.25, 0.09);
      }
      nextTime += BEAT / 2; step++;
    }
  }

  async function play() {
    if (!ctx) init();
    try { await ctx.resume(); } catch { return; }
    if (playing) return;
    playing = true;
    nextTime = ctx.currentTime + 0.15;
    master.gain.cancelScheduledValues(ctx.currentTime);
    master.gain.setValueAtTime(master.gain.value, ctx.currentTime);
    master.gain.linearRampToValueAtTime(VOL, ctx.currentTime + 2.5);
    timer = setInterval(schedule, 120); schedule();
    ui();
  }
  function stop() {
    if (!ctx || !playing) return;
    playing = false; clearInterval(timer);
    master.gain.cancelScheduledValues(ctx.currentTime);
    master.gain.setValueAtTime(master.gain.value, ctx.currentTime);
    master.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.8);
    setTimeout(() => { if (!playing) ctx.suspend(); }, 1000);
    ui();
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
    if (!ctx) init();
    await Promise.race([ctx.resume().catch(() => {}), new Promise((r) => setTimeout(r, 300))]);
    if (ctx.state === 'running') play(); else showSplash();
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
    if (!ctx || !playing) return;
    if (document.hidden) ctx.suspend(); else ctx.resume();
  });
  ui();
  autoStart();
})();
