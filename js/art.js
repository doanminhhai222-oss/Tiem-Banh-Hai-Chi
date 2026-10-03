/* Minh họa món bằng SVG (không cần ảnh ngoài) */
const Art = (() => {
  let uid = 0;
  const svg = (inner) => `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true">${inner}</svg>`;
  const plate = `<ellipse cx="100" cy="166" rx="80" ry="14" fill="#fff"/><ellipse cx="100" cy="164" rx="80" ry="14" fill="none" stroke="#f1d9d3" stroke-width="3"/>`;
  const shade = (hex, amt) => {
    const n = parseInt(hex.slice(1), 16);
    const f = (v) => Math.max(0, Math.min(255, v + amt));
    return `rgb(${f(n >> 16)},${f((n >> 8) & 255)},${f(n & 255)})`;
  };

  const kinds = {
    slice({ layers, top, topping }) {
      const h = 70 / layers.length;
      const id = 'c' + ++uid;
      const rects = layers.map((c, i) => `<rect x="48" y="${80 + i * h}" width="104" height="${h + .5}" fill="${c}"/>`).join('');
      const side = layers.map((c, i) => `<polygon points="152,${80 + i * h} 174,${64 + i * h * .93} 174,${64 + (i + 1) * h * .93} 152,${80 + (i + 1) * h}" fill="${shade(c, -28)}"/>`).join('');
      let deco = '';
      if (topping === 'berry') deco = `<circle cx="112" cy="66" r="9" fill="#d6314f"/><circle cx="109" cy="63" r="2.5" fill="#fff" opacity=".7"/><path d="M112 57q4-8 10-6" stroke="#5e9c5a" stroke-width="3" fill="none" stroke-linecap="round"/>`;
      if (topping === 'crumb') deco = [...Array(9)].map((_, i) => `<circle cx="${80 + (i % 5) * 16 + (i > 4 ? 8 : 0)}" cy="${70 + (i > 4 ? 7 : 0)}" r="3.5" fill="#c0353f"/>`).join('');
      return svg(`${plate}<g><clipPath id="${id}"><rect x="48" y="80" width="104" height="70" rx="6"/></clipPath><g clip-path="url(#${id})">${rects}</g>${side}<polygon points="48,80 152,80 174,64 70,64" fill="${top}"/>${deco}</g>`);
    },
    dome({ glaze, base, berry }) {
      return svg(`${plate}<rect x="42" y="136" width="116" height="22" rx="8" fill="${base}"/><path d="M46 138 A54 62 0 0 1 154 138 Z" fill="${glaze}"/><path d="M62 118 A40 46 0 0 1 90 82" stroke="#fff" stroke-width="6" stroke-linecap="round" fill="none" opacity=".55"/>${berry ? `<circle cx="100" cy="68" r="10" fill="${berry}"/><path d="M100 58q4-9 11-7" stroke="#5e9c5a" stroke-width="3" fill="none" stroke-linecap="round"/>` : ''}`);
    },
    puff({ shell, cream, sugar }) {
      return svg(`${plate}<ellipse cx="100" cy="146" rx="58" ry="20" fill="${shade(shell, -12)}"/><path d="M40 138q10 14 30 8t30 6 30-6 30-8q-14-8-60-8t-60 8z" fill="${cream}"/><path d="M42 134 Q100 24 158 134 Q100 120 42 134Z" fill="${shell}"/>${[0, 1, 2, 3, 4, 5].map(i => `<circle cx="${72 + i * 11}" cy="${100 - Math.abs(i - 2.5) * -6 - 20 + (i % 2) * 8}" r="3" fill="${sugar}"/>`).join('')}<path d="M60 120q40-60 80 0" stroke="#fff" stroke-width="5" fill="none" opacity=".35" stroke-linecap="round"/>`);
    },
    macaron({ colors }) {
      const mac = (cx, cy, c, r = 34) => `<ellipse cx="${cx}" cy="${cy + 13}" rx="${r}" ry="12" fill="${shade(c, -18)}"/><ellipse cx="${cx}" cy="${cy + 4}" rx="${r + 3}" ry="7" fill="#fffaf0"/><ellipse cx="${cx}" cy="${cy - 4}" rx="${r}" ry="14" fill="${c}"/><path d="M${cx - r + 6} ${cy - 2}q${r - 6} 10 ${2 * r - 12} 0" stroke="${shade(c, -35)}" stroke-width="2" fill="none" opacity=".35"/>`;
      return svg(`${plate}${mac(66, 140, colors[0])}${mac(138, 136, colors[1])}${mac(102, 100, colors[2])}`);
    },
    crepe({ crepe, cream, fruit }) {
      const n = 9, h = 8;
      const layers = [...Array(n)].map((_, i) => `<rect x="48" y="${150 - (i + 1) * h * 1.15 * 1}" width="104" height="${h}" rx="4" fill="${crepe}"/><rect x="${50 + (i % 2)}" y="${150 - (i + 1) * h * 1.15 + h - 2}" width="${100 - (i % 2) * 2}" height="3.5" rx="2" fill="${cream}"/>`).join('');
      return svg(`${plate}${layers}<ellipse cx="100" cy="${150 - n * h * 1.15 - 2}" rx="50" ry="8" fill="${cream}"/>${[70, 100, 130].map((x, i) => `<path d="M${x - 11} ${64 + (i % 2) * 4}q11-16 22 0q-5 12-11 12t-11-12z" fill="${fruit}"/>`).join('')}`);
    },
    roll({ body, cream, yolk, floss }) {
      const w = [...Array(14)].map((_, i) => `<path d="M${52 + i * 7} 90q${3 + (i % 3)} -${14 + (i % 4) * 3} ${6} -${20 + (i % 3) * 3}" stroke="${floss}" stroke-width="2.6" stroke-linecap="round" fill="none"/>`).join('');
      return svg(`${plate}<rect x="44" y="92" width="112" height="56" rx="26" fill="${body}"/><rect x="44" y="98" width="112" height="12" fill="${cream}"/><circle cx="70" cy="120" r="24" fill="${shade(body, -14)}"/><circle cx="70" cy="120" r="18" fill="${cream}"/><circle cx="70" cy="120" r="11" fill="${body}"/><circle cx="70" cy="120" r="5" fill="${cream}"/>${w}${[88, 112, 136].map(x => `<circle cx="${x}" cy="88" r="6" fill="${yolk}"/><circle cx="${x - 2}" cy="86" r="2" fill="#fff" opacity=".6"/>`).join('')}`);
    },
    tiramisu({ cocoa, cream, sponge }) {
      return svg(`${plate}<rect x="42" y="86" width="116" height="64" rx="8" fill="${sponge}"/><rect x="42" y="104" width="116" height="14" fill="${cream}"/><rect x="42" y="124" width="116" height="10" fill="${cocoa}" opacity=".85"/><rect x="42" y="86" width="116" height="18" rx="8" fill="${cocoa}"/>${[58, 78, 98, 118, 138].map((x, i) => `<circle cx="${x}" cy="${93 + (i % 2) * 4}" r="2" fill="#a86f56" opacity=".7"/>`).join('')}<path d="M100 82q-6-14 4-20 6 8-4 20z" fill="#5e9c5a"/><circle cx="104" cy="78" r="3" fill="#8b5a42"/>`);
    },
    croissant({ c1, c2 }) {
      const seg = (cx, cy, rx, ry, rot, c) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" transform="rotate(${rot} ${cx} ${cy})" fill="${c}"/><path d="M${cx - rx * .4} ${cy - ry * .8}q${rx * .4} ${ry * .8} 0 ${ry * 1.6}" transform="rotate(${rot} ${cx} ${cy})" stroke="${shade(c, -35)}" stroke-width="2" fill="none" opacity=".5"/>`;
      return svg(`${plate}${seg(46, 138, 18, 26, -52, c1)}${seg(154, 138, 18, 26, 52, c1)}${seg(68, 118, 20, 32, -28, c2)}${seg(132, 118, 20, 32, 28, c2)}${seg(100, 106, 22, 36, 0, c1)}<path d="M92 82q8 4 16 0" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".4" fill="none"/>`);
    },
    cookie({ dough, chip }) {
      const chips = (cx, cy) => [[-18, -10], [4, -22], [18, -2], [-6, 6], [8, 20], [-22, 16], [24, 14]].map(([x, y]) => `<ellipse cx="${cx + x}" cy="${cy + y}" rx="6" ry="4.5" fill="${chip}"/>`).join('');
      return svg(`${plate}<circle cx="68" cy="128" r="42" fill="${shade(dough, -20)}"/><circle cx="68" cy="124" r="42" fill="${dough}"/>${chips(68, 124)}<circle cx="130" cy="110" r="42" fill="${shade(dough, -20)}"/><circle cx="130" cy="106" r="42" fill="${shade(dough, 10)}"/>${chips(130, 106)}`);
    },
    cup({ layers, foam, boba, fruit, straw }) {
      const id = 'd' + ++uid;
      const top = 62, bot = 166, H = bot - top;
      let y = bot;
      const fills = layers.map(([c, f]) => { const h = H * f; y -= h; return `<rect x="50" y="${y}" width="100" height="${h + 1}" fill="${c}"/>`; }).join('');
      const iceY = y + 4;
      const boDots = boba ? [...Array(10)].map((_, i) => `<circle cx="${70 + (i % 5) * 15}" cy="${156 - Math.floor(i / 5) * 12}" r="6" fill="#2b1810"/><circle cx="${68 + (i % 5) * 15}" cy="${154 - Math.floor(i / 5) * 12}" r="1.6" fill="#fff" opacity=".5"/>`).join('') : '';
      const ice = [[72, iceY + 8], [104, iceY + 22], [124, iceY + 6]].map(([x, yy]) => `<rect x="${x}" y="${yy}" width="22" height="22" rx="5" fill="#fff" opacity=".28" transform="rotate(${x % 17 - 8} ${x + 11} ${yy + 11})"/>`).join('');
      const slices = fruit ? [[78, iceY + 20], [112, iceY + 38]].map(([x, yy]) => `<circle cx="${x}" cy="${yy}" r="11" fill="${fruit}" opacity=".95"/><circle cx="${x}" cy="${yy}" r="6" fill="#fff" opacity=".35"/>`).join('') : '';
      return svg(`<line x1="112" y1="14" x2="122" y2="${top}" stroke="${straw}" stroke-width="8" stroke-linecap="round"/><clipPath id="${id}"><path d="M50 ${top} L150 ${top} L138 ${bot} Q100 ${bot + 8} 62 ${bot} Z"/></clipPath><g clip-path="url(#${id})"><rect x="50" y="${top}" width="100" height="${H}" fill="#fff" opacity=".35"/>${fills}${ice}${slices}${boDots}${foam ? `<rect x="50" y="${top}" width="100" height="22" fill="${foam}"/><path d="M50 ${top + 22}q12 10 25 0t25 0 25 0 25 0" fill="${foam}"/>` : ''}<path d="M62 ${top + 6}L70 ${bot - 6}" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity=".35"/></g><path d="M50 ${top} L150 ${top} L138 ${bot} Q100 ${bot + 8} 62 ${bot} Z" fill="none" stroke="#fff" stroke-width="3" opacity=".8"/><ellipse cx="100" cy="${top}" rx="52" ry="7" fill="#fff" opacity=".8"/><ellipse cx="100" cy="${top - 1}" rx="46" ry="4" fill="#f3e5df"/>`);
    },
  };

  return { render: (spec) => kinds[spec.k](spec) };
})();
