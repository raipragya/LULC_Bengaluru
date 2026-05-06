import matplotlib.pyplot as plt
from matplotlib.patches import FancyBboxPatch, FancyArrowPatch
import matplotlib.patheffects as pe

fig, ax = plt.subplots(figsize=(16, 9))  # 16:9 slide ratio
ax.set_xlim(0, 16)
ax.set_ylim(0, 9)
ax.axis('off')
fig.patch.set_facecolor('white')

# --- Colors ---
C = {
    'inp': '#BBDEFB', 'inp_b': '#1565C0',
    'proc': '#C8E6C9', 'proc_b': '#2E7D32',
    'feat': '#FFE0B2', 'feat_b': '#E65100',
    'mdl': '#F8BBD0', 'mdl_b': '#C62828',
    'out': '#E1BEE7', 'out_b': '#6A1B9A',
}

def box(x, y, w, h, text, fc, ec, fs=7, bold=False):
    r = FancyBboxPatch((x, y), w, h, boxstyle="round,pad=0.12",
                       facecolor=fc, edgecolor=ec, linewidth=1.8, zorder=2)
    ax.add_patch(r)
    ax.text(x+w/2, y+h/2, text, ha='center', va='center', fontsize=fs,
            fontweight='bold' if bold else 'normal', multialignment='center', zorder=3)

def arrow(x1, y1, x2, y2, color='#455A64'):
    ax.annotate('', xy=(x2, y2), xytext=(x1, y1),
                arrowprops=dict(arrowstyle='->', color=color, lw=1.5), zorder=1)

# ============ TITLE ============
ax.text(8, 8.6, 'XGBoost LULC Prediction Pipeline — Methodology Flowchart',
        ha='center', fontsize=13, fontweight='bold', color='#1a237e')

# ============ ROW 1: INPUTS (y=7.2) ============
box(0.3, 7.0, 4.2, 1.2,
    '🛰️  LULC Maps (GEE)\n2005 · 2015 · 2025\nRF Classification · 4 Classes',
    C['inp'], C['inp_b'], fs=7.5)

box(5.9, 7.0, 4.2, 1.2,
    '🌍  Static Drivers (8)\nElevation · Slope\nDist: Metro, Roads, Rail, Water',
    C['inp'], C['inp_b'], fs=7.5)

box(11.5, 7.0, 4.2, 1.2,
    '⏱️  Temporal Drivers (5)\nNDVI · NDBI · MNDWI\nPopulation · Precipitation',
    C['inp'], C['inp_b'], fs=7.5)

# Arrows: 3 inputs → Preprocessing
arrow(2.4, 7.0, 5.5, 6.5)
arrow(8.0, 7.0, 8.0, 6.5)
arrow(13.6, 7.0, 10.5, 6.5)

# ============ ROW 2: PREPROCESSING (y=5.5) ============
box(3.5, 5.5, 9.0, 0.85,
    '⚙️  Preprocessing — Raster Alignment (2068×2268) · NoData Masking · MinMax Normalization [0,1]',
    C['proc'], C['proc_b'], fs=7.5)

# Arrows: Preprocessing → Analysis (split)
arrow(6.0, 5.5, 4.0, 5.0)
arrow(10.0, 5.5, 12.0, 5.0)

# ============ ROW 3: ANALYSIS (y=4.2) ============
box(0.8, 4.1, 5.5, 0.85,
    '📈  Pearson Correlation Analysis\nDriver–LULC PCC ranking · Multicollinearity heatmap',
    C['proc'], C['proc_b'], fs=7)

box(9.7, 4.1, 5.5, 0.85,
    '📊  Markov Chain TPM\n2005→2015 · 2015→2025 · Dynamic Degree (%/yr)',
    C['proc'], C['proc_b'], fs=7)

# Arrows: Analysis → Feature Engineering
arrow(3.55, 4.1, 6.5, 3.6)
arrow(12.45, 4.1, 9.5, 3.6)

# ============ ROW 4: FEATURE ENGINEERING (y=2.7) ============
box(1.5, 2.65, 13.0, 0.85,
    '🧪  Feature Engineering — 41 Features/Pixel:  '
    'Drivers(13) + Temporal Deltas(13) + Coords(2) + Multi-Scale Class Proportions(12) [3×3, 7×7, 15×15] + Current Class(1)',
    C['feat'], C['feat_b'], fs=7.5, bold=True)

# Arrow: FE → Training
arrow(8.0, 2.65, 8.0, 2.15)

# ============ ROW 5: MODEL (y=1.3) ============
box(0.5, 1.25, 7.0, 0.85,
    '🤖  XGBoost Classifier\n800 trees · depth=14 · lr=0.08 · subsample=0.8\nDual-period training · 400k stratified samples',
    C['mdl'], C['mdl_b'], fs=7.5)

arrow(7.5, 1.67, 8.5, 1.67)

# ============ ROW 5: VALIDATION + PROJECTION ============
box(8.5, 1.25, 3.5, 0.85,
    '✅  Validation\nOA=68.72% · κ=0.54\nQD≈6% · AD≈25%',
    C['out'], C['out_b'], fs=7.5, bold=True)

arrow(12.0, 1.67, 12.5, 1.67)

box(12.5, 1.25, 3.2, 0.85,
    '🔮  Projection\n2025 → 2035 → 2045\nGeoTIFF Output',
    C['out'], C['out_b'], fs=7.5)

# ============ LEGEND ============
legend = [('Input Data', C['inp']), ('Processing', C['proc']),
          ('Feature Eng.', C['feat']), ('Model', C['mdl']), ('Output', C['out'])]
for i, (label, color) in enumerate(legend):
    lx = 1.0 + i * 3.0
    r = FancyBboxPatch((lx, 0.15), 0.35, 0.35, boxstyle="round,pad=0.03",
                       facecolor=color, edgecolor='#555', linewidth=1)
    ax.add_patch(r)
    ax.text(lx + 0.5, 0.32, label, fontsize=6.5, va='center')

plt.tight_layout(pad=0.3)
plt.savefig('pipeline_flowchart_slide.png', dpi=200, bbox_inches='tight', facecolor='white')
plt.show()
print("Saved: pipeline_flowchart_slide.png")
