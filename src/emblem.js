// Elementos visuales de marca: retrato (foto con respaldo), anillo de progreso y medalla de jade.

export function portrait(shape = 'rect') {
  const wrap = document.createElement('div');
  wrap.className = `portrait ${shape}`;
  wrap.innerHTML = '<div class="monogram"><span>P</span></div>';
  const img = new Image();
  img.alt = 'Piyi';
  img.src = 'assets/hero-piyi.jpg';
  img.onload = () => wrap.classList.add('has-photo');
  img.onerror = () => img.remove();
  wrap.append(img);
  return wrap;
}

export function ringSVG(done, total) {
  const r = 46;
  const c = 2 * Math.PI * r;
  const filled = (done / total) * c;
  return `
<svg class="ring-svg" viewBox="0 0 100 100" aria-hidden="true">
  <circle cx="50" cy="50" r="${r}" fill="none" stroke="rgba(243,237,225,.14)" stroke-width="2.5"/>
  <circle cx="50" cy="50" r="${r}" fill="none" stroke="#7fd1b0" stroke-width="3" stroke-linecap="round"
    stroke-dasharray="${filled} ${c}" transform="rotate(-90 50 50)"/>
</svg>`;
}

export function medalSVG(label) {
  return `
<svg class="medal" viewBox="0 0 100 100" role="img" aria-label="Medalla ${label}">
  <defs>
    <radialGradient id="jadeFill" cx=".35" cy=".3" r=".9">
      <stop offset="0" stop-color="#b7ead3"/>
      <stop offset=".55" stop-color="#5fb593"/>
      <stop offset="1" stop-color="#2c7a60"/>
    </radialGradient>
  </defs>
  <circle cx="50" cy="50" r="46" fill="url(#jadeFill)"/>
  <circle cx="50" cy="50" r="46" fill="none" stroke="#d9bd7e" stroke-width="1.6"/>
  <circle cx="50" cy="50" r="38" fill="none" stroke="#e9fff5" stroke-opacity=".45" stroke-width="1"/>
  <text x="50" y="62" text-anchor="middle" font-family="ui-serif, Georgia, serif" font-size="34" font-weight="600" fill="#0e3a2b">${label}</text>
</svg>`;
}
