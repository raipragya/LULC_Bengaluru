import rasterio
import numpy as np
import os

CLASS_NAMES = ['Built-up', 'Vegetation', 'Bare Land', 'Water']

tif_map = {
    2005: r"Urban_model_landsat\classified_2005.tif",
    2015: r"Urban_model_landsat\classified_2015.tif",
    2025: r"Urban_model_landsat\classified_2025.tif",
    2035: r"Urban_model_landsat\projected_2035.tif",
    2045: r"Urban_model_landsat\projected_2045.tif",
}

# Load all rasters and build a common valid mask
data = {}
shapes = {}
for year, path in tif_map.items():
    with rasterio.open(path) as src:
        arr = src.read(1)
        data[year] = arr
        shapes[year] = arr.shape
        print(f"{year}: shape={arr.shape}, unique values={np.unique(arr)}")

# Build valid mask from 2025 (which should represent all valid pixels)
ref = data[2025]
valid_mask = (ref >= 1) & (ref <= 4)
total_valid = np.sum(valid_mask)
print(f"\nTotal valid pixels (from 2025 reference): {total_valid:,}")

# For each year, compute per-class pixel counts and percentages
print("\n" + "="*80)
print("LULC CLASS DISTRIBUTION BY YEAR")
print("="*80)
print(f"{'Year':<8}", end="")
for cn in CLASS_NAMES:
    print(f"  {cn:>15s}", end="")
print()
print("-"*80)

stats = {}
for year in sorted(data.keys()):
    arr = data[year]
    # Use valid mask based on pixels valid in this specific raster
    mask = (arr >= 1) & (arr <= 4)
    total = np.sum(mask)
    counts = {}
    for cls_id, cls_name in enumerate(CLASS_NAMES, start=1):
        counts[cls_name] = np.sum(arr[mask] == cls_id)
    stats[year] = (counts, total)
    
    print(f"{year:<8}", end="")
    for cn in CLASS_NAMES:
        pct = counts[cn] / total * 100
        print(f"  {pct:>14.2f}%", end="")
    print()

# Compute changes between consecutive periods
print("\n" + "="*80)
print("PERCENTAGE POINT CHANGE BETWEEN PERIODS")
print("="*80)
periods = [(2005, 2015), (2015, 2025), (2025, 2035), (2035, 2045), (2025, 2045)]
for y_from, y_to in periods:
    counts_from, total_from = stats[y_from]
    counts_to, total_to = stats[y_to]
    print(f"\n{y_from} -> {y_to}:")
    print(f"  {'Class':<15s}  {'% in '+str(y_from):>12s}  {'% in '+str(y_to):>12s}  {'Change (pp)':>12s}")
    print(f"  {'-'*55}")
    for cn in CLASS_NAMES:
        pct_from = counts_from[cn] / total_from * 100
        pct_to = counts_to[cn] / total_to * 100
        change = pct_to - pct_from
        sign = "+" if change > 0 else ""
        print(f"  {cn:<15s}  {pct_from:>11.2f}%  {pct_to:>11.2f}%  {sign}{change:>10.2f} pp")

# Also compute absolute pixel changes for 2025->2035 and 2025->2045
print("\n" + "="*80)
print("ABSOLUTE PIXEL COUNT CHANGES (Future Projections)")
print("="*80)
for y_from, y_to in [(2025, 2035), (2035, 2045), (2025, 2045)]:
    counts_from, total_from = stats[y_from]
    counts_to, total_to = stats[y_to]
    print(f"\n{y_from} -> {y_to}:")
    print(f"  {'Class':<15s}  {'Pixels '+str(y_from):>14s}  {'Pixels '+str(y_to):>14s}  {'Δ Pixels':>14s}  {'% Change':>10s}")
    print(f"  {'-'*70}")
    for cn in CLASS_NAMES:
        delta = int(counts_to[cn]) - int(counts_from[cn])
        if counts_from[cn] > 0:
            pct_change = delta / int(counts_from[cn]) * 100
        else:
            pct_change = float('inf')
        sign = "+" if delta > 0 else ""
        print(f"  {cn:<15s}  {int(counts_from[cn]):>14,}  {int(counts_to[cn]):>14,}  {sign}{delta:>13,}  {sign}{pct_change:>9.2f}%")
