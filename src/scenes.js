// Escenas SVG para "encuentra las diferencias". Cada diferencia reemplaza (alt),
// quita (alt: '') o agrega (add) un elemento en la imagen de la derecha.
// hit = [x, y, radio] en coordenadas del viewBox.

export const SCENES = {
  dimsum: {
    viewBox: '0 0 320 240',
    shapes: [
      { id: 'bg', svg: '<rect width="320" height="240" fill="#2b1d1a"/><rect y="150" width="320" height="90" fill="#5b3a29"/>' },
      { id: 'win', svg: '<rect x="120" y="22" width="80" height="70" rx="6" fill="#1b2a44" stroke="#c9a24a" stroke-width="3"/>' },
      { id: 'moon', svg: '<circle cx="160" cy="55" r="16" fill="#fff3c9"/>' },
      {
        id: 'lanternL',
        svg: '<line x1="40" y1="0" x2="40" y2="28" stroke="#c9a24a" stroke-width="2"/><rect x="34" y="26" width="12" height="4" fill="#c9a24a"/><ellipse cx="40" cy="50" rx="18" ry="22" fill="#d8334a"/><line x1="40" y1="72" x2="40" y2="88" stroke="#f2c14e" stroke-width="3"/>',
      },
      {
        id: 'lanternR',
        svg: '<line x1="280" y1="0" x2="280" y2="28" stroke="#c9a24a" stroke-width="2"/><rect x="274" y="26" width="12" height="4" fill="#c9a24a"/><ellipse cx="280" cy="50" rx="18" ry="22" fill="#d8334a"/><line x1="280" y1="72" x2="280" y2="88" stroke="#f2c14e" stroke-width="3"/>',
      },
      { id: 'bamboo', svg: '<rect x="14" y="60" width="6" height="90" fill="#5fa86b"/><rect x="26" y="75" width="6" height="75" fill="#6fba7b"/><rect x="2" y="90" width="6" height="60" fill="#5fa86b"/>' },
      { id: 'steamer1', svg: '<ellipse cx="90" cy="168" rx="38" ry="14" fill="#c99a5b"/><rect x="52" y="146" width="76" height="22" fill="#d8aa6a"/><ellipse cx="90" cy="146" rx="38" ry="10" fill="#e5bd7f"/>' },
      { id: 'steamer2', svg: '<ellipse cx="165" cy="168" rx="38" ry="14" fill="#c99a5b"/><rect x="127" y="146" width="76" height="22" fill="#d8aa6a"/><ellipse cx="165" cy="146" rx="38" ry="10" fill="#e5bd7f"/>' },
      { id: 'steam', svg: '<path d="M90 140 q-6 -14 0 -24 q6 -10 0 -22" stroke="#fff" stroke-opacity=".55" stroke-width="3" fill="none" stroke-linecap="round"/>' },
      {
        id: 'bowl',
        svg: '<ellipse cx="240" cy="182" rx="30" ry="12" fill="#eee6d6"/><path d="M210 182 Q240 210 270 182Z" fill="#eee6d6"/><circle cx="232" cy="178" r="5" fill="#d8334a"/><circle cx="246" cy="180" r="5" fill="#d8334a"/>',
      },
      { id: 'chop', svg: '<line x1="205" y1="204" x2="270" y2="217" stroke="#3b2a1a" stroke-width="3" stroke-linecap="round"/><line x1="205" y1="211" x2="270" y2="224" stroke="#3b2a1a" stroke-width="3" stroke-linecap="round"/>' },
      {
        id: 'teapot',
        svg: '<ellipse cx="60" cy="214" rx="26" ry="16" fill="#2f6b57"/><path d="M84 208 Q104 200 104 192" stroke="#2f6b57" stroke-width="6" fill="none"/><rect x="48" y="196" width="24" height="6" rx="3" fill="#3f8a71"/>',
      },
    ],
    diffs: [
      { id: 'moon', alt: '<circle cx="160" cy="55" r="16" fill="#fff3c9"/><circle cx="167" cy="51" r="13" fill="#1b2a44"/>', hit: [160, 55, 24] },
      { id: 'lanternR', alt: '<line x1="280" y1="0" x2="280" y2="28" stroke="#c9a24a" stroke-width="2"/><rect x="274" y="26" width="12" height="4" fill="#c9a24a"/><ellipse cx="280" cy="50" rx="18" ry="22" fill="#f2c14e"/><line x1="280" y1="72" x2="280" y2="88" stroke="#f2c14e" stroke-width="3"/>', hit: [280, 50, 26] },
      { id: 'bamboo', alt: '<rect x="14" y="60" width="6" height="90" fill="#5fa86b"/><rect x="26" y="75" width="6" height="75" fill="#6fba7b"/>', hit: [5, 120, 18] },
      { id: 'steamer2', alt: '', hit: [165, 156, 36] },
      {
        id: 'bowl',
        alt: '<ellipse cx="240" cy="182" rx="30" ry="12" fill="#eee6d6"/><path d="M210 182 Q240 210 270 182Z" fill="#eee6d6"/><circle cx="232" cy="178" r="5" fill="#d8334a"/><circle cx="246" cy="180" r="5" fill="#5fe3b4"/>',
        hit: [246, 180, 20],
      },
      { id: 'chop', alt: '', hit: [237, 214, 34] },
      {
        id: 'teapot',
        alt: '<ellipse cx="60" cy="214" rx="26" ry="16" fill="#2f6b57"/><path d="M84 208 Q104 200 104 192" stroke="#2f6b57" stroke-width="6" fill="none"/><rect x="48" y="196" width="24" height="6" rx="3" fill="#d8334a"/>',
        hit: [60, 199, 22],
      },
      { add: '<ellipse cx="135" cy="228" rx="14" ry="6" fill="#eee6d6"/>', hit: [135, 228, 18] },
      { id: 'steam', alt: '', hit: [90, 116, 16] },
      { id: 'win', alt: '<rect x="120" y="22" width="80" height="70" rx="6" fill="#1b2a44" stroke="#d8334a" stroke-width="3"/>', hit: [122, 40, 12] },
      { id: 'lanternL', alt: '<line x1="40" y1="0" x2="40" y2="28" stroke="#c9a24a" stroke-width="2"/><rect x="34" y="26" width="12" height="4" fill="#c9a24a"/><ellipse cx="40" cy="50" rx="18" ry="22" fill="#d8334a"/>', hit: [40, 80, 12] },
      { id: 'steamer1', alt: '<ellipse cx="90" cy="168" rx="38" ry="14" fill="#c99a5b"/><rect x="52" y="146" width="76" height="22" fill="#d8aa6a"/><ellipse cx="90" cy="146" rx="38" ry="10" fill="#d8334a"/>', hit: [90, 152, 18] },
    ],
  },

  estadio: {
    viewBox: '0 0 320 240',
    shapes: [
      { id: 'bg', svg: '<rect width="320" height="240" fill="#f2b27c"/><rect width="320" height="90" fill="#e58a6c"/>' },
      { id: 'sun', svg: '<circle cx="160" cy="112" r="26" fill="#ffe2a1"/>' },
      { id: 'mtn', svg: '<path d="M0 150 L60 90 L110 140 L170 80 L240 140 L290 100 L320 130 L320 162 L0 162Z" fill="#6b5a7e"/>' },
      { id: 'cloud1', svg: '<ellipse cx="60" cy="40" rx="26" ry="10" fill="#fff" opacity=".85"/><ellipse cx="78" cy="34" rx="18" ry="9" fill="#fff" opacity=".85"/>' },
      { id: 'cloud2', svg: '<ellipse cx="250" cy="52" rx="28" ry="10" fill="#fff" opacity=".85"/><ellipse cx="236" cy="46" rx="16" ry="8" fill="#fff" opacity=".85"/>' },
      { id: 'poleL', svg: '<rect x="22" y="70" width="6" height="92" fill="#555"/><rect x="12" y="62" width="26" height="10" fill="#fff6d8"/>' },
      { id: 'poleR', svg: '<rect x="292" y="70" width="6" height="92" fill="#555"/><rect x="282" y="62" width="26" height="10" fill="#fff6d8"/>' },
      { id: 'tree', svg: '<rect x="206" y="146" width="5" height="18" fill="#5b3a29"/><circle cx="208" cy="140" r="13" fill="#3f8a5b"/>' },
      { id: 'flag', svg: '<line x1="250" y1="128" x2="250" y2="176" stroke="#ddd" stroke-width="2"/><path d="M250 128 L278 137 L250 146Z" fill="#d8334a"/>' },
      {
        id: 'track',
        svg: '<rect y="162" width="320" height="78" fill="#b8402f"/><line x1="0" y1="186" x2="320" y2="186" stroke="#fff" stroke-width="2"/><line x1="0" y1="210" x2="320" y2="210" stroke="#fff" stroke-width="2"/><line x1="0" y1="233" x2="320" y2="233" stroke="#fff" stroke-width="2"/>',
      },
      {
        id: 'runner',
        svg: '<circle cx="150" cy="172" r="6" fill="#f1c7a3"/><rect x="144" y="178" width="12" height="18" rx="4" fill="#3de8ac"/><line x1="147" y1="196" x2="140" y2="212" stroke="#222" stroke-width="4" stroke-linecap="round"/><line x1="153" y1="196" x2="164" y2="208" stroke="#222" stroke-width="4" stroke-linecap="round"/>',
      },
      { id: 'ball', svg: '<circle cx="210" cy="206" r="8" fill="#fff" stroke="#333" stroke-width="1.5"/><path d="M205 202 l5 -3 l5 3 l-2 6 h-6z" fill="#333"/>' },
      { id: 'cone', svg: '<path d="M70 232 l8 -22 l8 22z" fill="#ff8a3c"/>' },
    ],
    diffs: [
      { id: 'sun', alt: '<circle cx="160" cy="112" r="36" fill="#ffe2a1"/>', hit: [160, 112, 34] },
      { id: 'mtn', alt: '<path d="M0 150 L60 90 L110 140 L170 104 L240 140 L290 100 L320 130 L320 162 L0 162Z" fill="#6b5a7e"/>', hit: [170, 95, 22] },
      { id: 'cloud1', alt: '', hit: [66, 38, 30] },
      { id: 'tree', alt: '', hit: [208, 146, 18] },
      { id: 'flag', alt: '<line x1="250" y1="128" x2="250" y2="176" stroke="#ddd" stroke-width="2"/><path d="M250 128 L278 137 L250 146Z" fill="#2f9d6b"/>', hit: [264, 137, 16] },
      {
        id: 'track',
        alt: '<rect y="162" width="320" height="78" fill="#b8402f"/><line x1="0" y1="186" x2="320" y2="186" stroke="#fff" stroke-width="2"/><line x1="0" y1="233" x2="320" y2="233" stroke="#fff" stroke-width="2"/>',
        hit: [260, 210, 16],
      },
      {
        id: 'runner',
        alt: '<circle cx="150" cy="172" r="6" fill="#f1c7a3"/><rect x="144" y="178" width="12" height="18" rx="4" fill="#d8334a"/><line x1="147" y1="196" x2="140" y2="212" stroke="#222" stroke-width="4" stroke-linecap="round"/><line x1="153" y1="196" x2="164" y2="208" stroke="#222" stroke-width="4" stroke-linecap="round"/>',
        hit: [150, 186, 16],
      },
      { add: '<path d="M108 62 q6 -8 12 0 q6 -8 12 0" stroke="#222" fill="none" stroke-width="2"/>', hit: [120, 60, 16] },
      { id: 'poleL', alt: '<rect x="22" y="70" width="6" height="92" fill="#555"/><rect x="12" y="62" width="26" height="10" fill="#f2c14e"/>', hit: [25, 66, 14] },
      { id: 'cloud2', alt: '<ellipse cx="250" cy="52" rx="28" ry="10" fill="#fff" opacity=".85"/>', hit: [236, 46, 14] },
      { id: 'ball', alt: '', hit: [210, 206, 13] },
      { id: 'cone', alt: '<path d="M70 232 l8 -22 l8 22z" fill="#3da0ff"/>', hit: [78, 222, 12] },
    ],
  },
};
