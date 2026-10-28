// Bunyi sederhana lewat Web Audio (tanpa file audio). Browser mewajibkan ada interaksi pengguna dulu.
let ctx;
const getCtx = () => (ctx ??= new (window.AudioContext || window.webkitAudioContext)());

export function siapkanBunyi() {
  try {
    getCtx().resume();
  } catch {
    /* tidak didukung */
  }
}

// Nada gamelan-ish: dua nada turun, dipantulkan
export function bunyiSiap(ulang = 2) {
  try {
    const c = getCtx();
    const nada = [880, 659.25, 880, 659.25];
    const mulai = c.currentTime;
    for (let r = 0; r < ulang; r++) {
      nada.forEach((f, i) => {
        const t = mulai + r * 1.4 + i * 0.28;
        const o = c.createOscillator();
        const g = c.createGain();
        o.type = "triangle";
        o.frequency.value = f;
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(0.35, t + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.6);
        o.connect(g).connect(c.destination);
        o.start(t);
        o.stop(t + 0.65);
      });
    }
  } catch {
    /* abaikan */
  }
}

export function bunyiMasuk() {
  try {
    const c = getCtx();
    const t = c.currentTime;
    [523.25, 783.99].forEach((f, i) => {
      const o = c.createOscillator();
      const g = c.createGain();
      o.type = "sine";
      o.frequency.value = f;
      g.gain.setValueAtTime(0.0001, t + i * 0.16);
      g.gain.exponentialRampToValueAtTime(0.3, t + i * 0.16 + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + i * 0.16 + 0.5);
      o.connect(g).connect(c.destination);
      o.start(t + i * 0.16);
      o.stop(t + i * 0.16 + 0.55);
    });
  } catch {
    /* abaikan */
  }
}
