// ── Lorem ipsum word bank ──────────────────────────────────────────────────

const LOREM_WORDS = `lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod
tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam quis
nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat duis
aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
nulla pariatur excepteur sint occaecat cupidatat non proident sunt in culpa qui
officia deserunt mollit anim id est laborum curabitur pretium tincidunt lacus nec
finibus augue euismod vitae pellentesque habitant morbi tristique senectus netus
malesuada fames turpis egestas faucibus orci luctus ultrices posuere cubilia curae
proin vel ante purus quisque porta volutpat lacinia erat vestibulum mattis augue
penatibus magnis dis parturient montes nascetur ridiculus mus donec quam felis
ultrices nec pellentesque eu pretium quis sem nulla consequat massa quis enim`.trim().split(/\s+/);

function loremWords(n) {
  if (n <= 0) return '';
  const out = [];
  for (let i = 0; i < n; i++) {
    out.push(LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)]);
  }
  const sentence = out.join(' ');
  return sentence.charAt(0).toUpperCase() + sentence.slice(1) + '.';
}

// 1–4 word key phrase
function randomKey() {
  const len = 1 + Math.floor(Math.random() * 4);
  const words = [];
  for (let i = 0; i < len; i++) {
    words.push(LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)]);
  }
  const raw = words.join(' ');
  return raw.charAt(0).toUpperCase() + raw.slice(1);
}

// 1–10 word value phrase
function randomValue() {
  const len = 1 + Math.floor(Math.random() * 10);
  return loremWords(len);
}

// ── Entity data ────────────────────────────────────────────────────────────

const ENTITY_TYPES = ['Study', 'Dataset', 'Publication', 'Person', 'Grant'];

const TITLES = [
  'Longitudinal Analysis of Neurodegeneration in Aging Cohorts',
  'Multi-Omic Profiling of Pediatric Brain Tumors',
  'Genomic Basis of Treatment Response in Metastatic Melanoma',
  'Single-Cell Atlas of the Human Kidney Development',
  'Population-Scale Genome Sequencing in Rare Disease Diagnosis',
  'Functional Mapping of Regulatory Elements in Cardiomyopathy',
  'Integrative Proteomics of Synaptic Plasticity',
  'CRISPR Screens Identify Novel Targets in T-Cell Lymphoma',
];

function randomEntityType() {
  return ENTITY_TYPES[Math.floor(Math.random() * ENTITY_TYPES.length)];
}

function randomTitle() {
  return TITLES[Math.floor(Math.random() * TITLES.length)];
}

// ── State ──────────────────────────────────────────────────────────────────

let state = {
  entityType: randomEntityType(),
  title: randomTitle(),
  descWords: 500,
  lineClamp: 4,
  numProps: 8,
  expanded: false,
  descText: '',
  props: [],
};

function generateContent() {
  state.descText = loremWords(state.descWords);
  state.props = Array.from({ length: state.numProps }, () => ({
    key: randomKey(),
    value: randomValue(),
  }));
}

// ── Render ─────────────────────────────────────────────────────────────────

function renderPage() {
  state.expanded = false;

  document.getElementById('entity-type').textContent = state.entityType;
  document.getElementById('entity-title').textContent = state.title;

  renderDescription();
  renderProperties();
  updateRatio();
}

function updateRatio() {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      document.fonts.ready.then(() => {
        const grid = document.querySelector('.detail-grid');
        const descCol = document.querySelector('.description-col');
        const propsCol = document.querySelector('.properties-col');
        const cutoff = parseFloat(document.getElementById('ctrl-ratio-cutoff').value) || 0.67;

        // Remove is-stacked so we always measure at the half-width SBS column
        // size. No paint occurs mid-function, so there is no visual flash.
        grid.classList.remove('is-stacked');
        const sbsLeftH = descCol.offsetHeight;
        const sbsRightH = propsCol.offsetHeight;
        const ratio = sbsLeftH / sbsRightH;
        if (ratio < cutoff) {
          grid.classList.add('is-stacked');
        }

        // Display the actual on-screen heights after the final layout is set.
        const displayLeftH = descCol.offsetHeight;
        const displayRightH = propsCol.offsetHeight;
        document.getElementById('ratio-display').textContent = ratio.toFixed(2);
        document.getElementById('left-height-display').textContent = `${displayLeftH}px`;
        document.getElementById('right-height-display').textContent = `${displayRightH}px`;
      });
    });
  });
}

function renderDescription() {
  const body = document.getElementById('description-body');
  const text = document.getElementById('description-text');
  const btn = document.getElementById('show-more-btn');

  const descText = state.descText;
  text.textContent = descText;

  // Remove inline clamp style first
  body.style.removeProperty('-webkit-line-clamp');
  body.classList.remove('is-clamped');
  btn.hidden = true;
  btn.textContent = 'Show more';

  if (!descText) return;

  if (state.lineClamp > 0) {
    // Count visual lines via Range before applying the clamp value.
    // Height-based checks are unreliable with -webkit-line-clamp.
    body.classList.add('is-clamped');
    const range = document.createRange();
    range.selectNodeContents(text);
    const lineCount = Array.from(range.getClientRects()).filter(r => r.width > 0).length;
    body.style.setProperty('-webkit-line-clamp', state.lineClamp);
    btn.hidden = lineCount <= state.lineClamp;
  }
}

function renderProperties() {
  const list = document.getElementById('property-list');
  list.innerHTML = '';

  for (const { key, value } of state.props) {
    const dt = document.createElement('dt');
    dt.className = 'prop-key';
    dt.textContent = key;

    const dd = document.createElement('dd');
    dd.className = 'prop-value';
    dd.textContent = value;

    list.appendChild(dt);
    list.appendChild(dd);
  }
}

// ── Show more / show less ──────────────────────────────────────────────────

document.getElementById('show-more-btn').addEventListener('click', () => {
  const body = document.getElementById('description-body');
  const btn = document.getElementById('show-more-btn');

  state.expanded = !state.expanded;

  if (state.expanded) {
    body.style.removeProperty('-webkit-line-clamp');
    body.classList.remove('is-clamped');
    btn.textContent = 'Show less';
  } else {
    body.classList.add('is-clamped');
    body.style.setProperty('-webkit-line-clamp', state.lineClamp);
    btn.textContent = 'Show more';
  }
});

// ── Config panel ───────────────────────────────────────────────────────────

function readInputs() {
  state.descWords = Math.max(0, parseInt(document.getElementById('ctrl-desc-words').value, 10) || 0);
  state.lineClamp = Math.max(0, parseInt(document.getElementById('ctrl-line-clamp').value, 10) || 0);
  state.numProps = Math.max(0, parseInt(document.getElementById('ctrl-num-props').value, 10) || 0);
}

document.getElementById('apply-btn').addEventListener('click', () => {
  state.entityType = randomEntityType();
  state.title = randomTitle();
  readInputs();
  generateContent();
  renderPage();
});

['ctrl-desc-words', 'ctrl-line-clamp', 'ctrl-num-props'].forEach(id => {
  document.getElementById(id).addEventListener('input', () => {
    readInputs();
    generateContent();
    renderPage();
  });
});

document.getElementById('ctrl-ratio-cutoff').addEventListener('input', updateRatio);

document.querySelectorAll('.preset-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.getElementById('ctrl-desc-words').value = btn.dataset.words;
    document.getElementById('ctrl-line-clamp').value = btn.dataset.clamp;
    document.getElementById('ctrl-num-props').value = btn.dataset.props;
    state.descWords = +btn.dataset.words;
    state.lineClamp = +btn.dataset.clamp;
    state.numProps = +btn.dataset.props;
    generateContent();
    renderPage();
  });
});

document.getElementById('ctrl-scorecard').addEventListener('change', e => {
  document.getElementById('scorecard').hidden = !e.target.checked;
  updateRatio();
});

document.getElementById('config-toggle').addEventListener('click', () => {
  document.getElementById('config-panel').classList.toggle('is-collapsed');
});

// ── Init ───────────────────────────────────────────────────────────────────

readInputs();
document.getElementById('scorecard').hidden = !document.getElementById('ctrl-scorecard').checked;
generateContent();
renderPage();
