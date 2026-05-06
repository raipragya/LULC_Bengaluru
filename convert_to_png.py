import rasterio
import matplotlib.pyplot as plt
import matplotlib.colors as mcolors
import numpy as np
import os

tif_files = [
    r"Urban_model_landsat\projected_2035.tif",
    r"Urban_model_landsat\projected_2045.tif"
]
out_dir = r"Website\public"

cmap = mcolors.ListedColormap(['black', '#e41a1c', '#4daf4a', '#377eb8', '#984ea3'])
bounds = [0, 1, 2, 3, 4, 5]
norm = mcolors.BoundaryNorm(bounds, cmap.N)

def save_clean_png(data, filename):
    fig = plt.figure(figsize=(10, 10), frameon=False)
    ax = plt.Axes(fig, [0., 0., 1., 1.])
    ax.set_axis_off()
    fig.add_axes(ax)
    ax.imshow(data, cmap=cmap, norm=norm, interpolation='nearest')
    fig.savefig(filename, dpi=300, bbox_inches='tight', pad_inches=0, transparent=True)
    plt.close(fig)

for tif in tif_files:
    print(f"Processing {tif}...")
    if not os.path.exists(tif):
        print(f"File not found: {tif}")
        continue
    with rasterio.open(tif) as src:
        data = src.read(1)
        base_name = os.path.basename(tif).replace('.tif', '.png')
        out_path = os.path.join(out_dir, base_name)
        save_clean_png(data, out_path)
        print(f"Saved {out_path}")
