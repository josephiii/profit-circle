// ===== Carousel =====
const track = document.getElementById('track');
const slides = track.children;
const totalSlides = slides.length;
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const counterText = document.getElementById('counterText');
const dotsContainer = document.getElementById('dots');

let currentIndex = 0;

// Build dot indicators dynamically
for (let i = 0; i < totalSlides; i++) {
  const dot = document.createElement('div');
  dot.className = 'dot-indicator' + (i === 0 ? ' active' : '');
  dot.addEventListener('click', () => goToSlide(i));
  dotsContainer.appendChild(dot);
}
const dots = dotsContainer.children;

function goToSlide(index) {
  currentIndex = (index + totalSlides) % totalSlides;
  track.style.transform = `translateX(-${currentIndex * 100}%)`;
  counterText.textContent =
    String(currentIndex + 1).padStart(2, '0') + ' / ' + String(totalSlides).padStart(2, '0');
  for (let i = 0; i < dots.length; i++) {
    dots[i].classList.toggle('active', i === currentIndex);
  }
}

prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));

// Arrow key navigation
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') goToSlide(currentIndex - 1);
  if (e.key === 'ArrowRight') goToSlide(currentIndex + 1);
});

// ===== Modal =====
const modal = document.getElementById('modalOverlay');
const applyBtn = document.getElementById('applyBtn');
const modalClose = document.getElementById('modalClose');

applyBtn.addEventListener('click', () => modal.classList.add('active'));
modalClose.addEventListener('click', () => modal.classList.remove('active'));

// Click outside modal to close
modal.addEventListener('click', (e) => {
  if (e.target === modal) modal.classList.remove('active');
});

// Escape key to close modal
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') modal.classList.remove('active');
});

// ===== Footprint Rain =====
// Generates falling columns of footprint-chart style volume numbers
// behind the content. Re-seeds on resize to fill the viewport.

const rainContainer = document.getElementById('footprintRain');
const COLUMN_WIDTH = 44;          // must match .rain-column width in CSS
const MIN_COL_CHARS = 18;         // min numbers per column
const MAX_COL_CHARS = 34;         // max numbers per column

// Generate one footprint-style volume value.
// Mix of: small integers (retail size), mid integers, and formatted 'k' values (institutional size).
function randomVolume() {
  const r = Math.random();
  if (r < 0.35) {
    // small: single or double digit (e.g. 4, 27, 83)
    return String(Math.floor(Math.random() * 99) + 1);
  } else if (r < 0.75) {
    // mid: three digit (e.g. 127, 842, 356)
    return String(Math.floor(Math.random() * 900) + 100);
  } else if (r < 0.92) {
    // big: thousand-scale with decimal (e.g. 1.2k, 3.8k, 2.4k)
    const n = (Math.random() * 9 + 1).toFixed(1);
    return n + 'k';
  } else {
    // very big: round thousands (e.g. 12k, 45k)
    return (Math.floor(Math.random() * 90) + 10) + 'k';
  }
}

// Build the full content of one column: a stack of newline-separated volume values.
function buildColumnContent(charCount) {
  const lines = [];
  for (let i = 0; i < charCount; i++) {
    lines.push(randomVolume());
  }
  return lines.join('\n');
}

function seedRain() {
  rainContainer.innerHTML = '';

  const vw = window.innerWidth;
  const columnCount = Math.floor(vw / COLUMN_WIDTH);

  for (let i = 0; i < columnCount; i++) {
    const col = document.createElement('div');
    col.className = 'rain-column';
    col.style.left = (i * COLUMN_WIDTH) + 'px';

    // Each column: random duration (slow-ish so it reads as ambient, not frantic)
    const duration = 8 + Math.random() * 10;   // 8s – 18s per fall
    const delay = -Math.random() * duration;   // negative delay staggers entry

    col.style.animationDuration = duration + 's';
    col.style.animationDelay = delay + 's';

    const charCount = Math.floor(
      Math.random() * (MAX_COL_CHARS - MIN_COL_CHARS) + MIN_COL_CHARS
    );
    col.textContent = buildColumnContent(charCount);

    rainContainer.appendChild(col);
  }
}

seedRain();

// Re-seed on resize (debounced) so the rain fills the new viewport width.
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(seedRain, 250);
});