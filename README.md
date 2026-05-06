# 🌆 Urban Heat Prediction — LULC Change Modeling for Bangalore

Predicting future **Land Use / Land Cover (LULC)** changes for Bangalore using a **CA-ANN / XGBoost pipeline** with multi-temporal Landsat satellite imagery and spatial driver variables. The methodology is adapted from [Paper-2: *Remote Sensing 2025, 17, 2474*], which employs Cellular Automata coupled with Artificial Neural Networks (CA-ANN) for LULC simulation, originally applied to Gujranwala, Pakistan.

---

## 📌 Objective

1. Classify historical LULC for Bangalore across three time periods: **2005, 2015, 2025**
2. Analyze LULC change dynamics and Markov transition probabilities
3. Train a machine learning model (XGBoost / Random Forest) to predict future LULC
4. Validate predictions against ground-truth 2025 LULC
5. Project LULC for **2035** and **2045**

---

## 🗂️ Repository Structure

```
UrbanHeatPrediction/
├── Urban_model_landsat/           # Primary raster dataset
│   ├── classified_2005.tif        # LULC classification (2005)
│   ├── classified_2015.tif        # LULC classification (2015)
│   ├── classified_2025.tif        # LULC classification (2025)
│   ├── Elevation.tif              # DEM-derived elevation
│   ├── Slope.tif                  # DEM-derived slope
│   ├── Distance_metro.tif         # Euclidean distance to metro stations
│   ├── EucDist_PrimaryRoad.tif    # Distance to primary roads
│   ├── EucDist_secondaryRoads.tif # Distance to secondary roads
│   ├── EucDist_roadnetwork.tif    # Distance to road network
│   ├── EucDist_railwaySt.tif      # Distance to railway stations
│   ├── EucDist_railway.tif        # Distance to railway lines
│   ├── EucDist_waterbody.tif      # Distance to water bodies
│   ├── projected_2035.tif         # Simulated LULC (2035)
│   ├── projected_2045.tif         # Simulated LULC (2045)
│   ├── drivers_2005/              # Time-varying drivers for 2005
│   │   ├── NDVI.tif               # Normalized Difference Vegetation Index
│   │   ├── NDBI.tif               # Normalized Difference Built-up Index
│   │   ├── MNDWI.tif              # Modified Normalized Difference Water Index
│   │   ├── population.tif         # Population density
│   │   └── precipitation.tif      # Precipitation data
│   └── drivers_2015/              # Time-varying drivers for 2015
│       ├── NDVI.tif
│       ├── NDBI.tif
│       ├── MNDWI.tif
│       ├── population.tif
│       └── precipitation.tif
├── xgboost-pipeline.ipynb         # ✅ Main pipeline (best model, 68.72% OA)
├── ca_ann_pipelinev2.ipynb        # CA-ANN iterative experiments
├── ca_ann.ipynb                   # Initial CA-ANN baseline
├── Website/                       # Next.js dashboard for visualization
├── paper-1.pdf                    # Reference paper 1
├── paper-2.pdf                    # Reference paper 2 (primary methodology)
└── README.md
```

---

## 🛰️ Dataset

| Layer | Type | Source | Resolution |
|-------|------|--------|------------|
| LULC Maps (2005, 2015, 2025) | Classified rasters | Landsat 5/7/8 via GEE + Random Forest | 30 m |
| Elevation & Slope | Topographic | SRTM DEM | 30 m |
| Distance to Roads, Metro, Railway, Water | Proximity (Euclidean) | OpenStreetMap / Survey of India | 30 m |
| NDVI, NDBI, MNDWI | Earth Observation Indices | Landsat spectral bands | 30 m |
| Population Density | Socio-economic | WorldPop / Census | 30 m (resampled) |
| Precipitation | Climate | CHIRPS / IMD | 30 m (resampled) |

### LULC Classes

| Code | Class | Description |
|------|-------|-------------|
| 1 | **Built-up** | Urban/developed areas, impervious surfaces |
| 2 | **Vegetation** | Forests, parks, agricultural land |
| 3 | **Bare Land** | Exposed soil, fallow land, construction sites |
| 4 | **Water** | Rivers, lakes, reservoirs, wetlands |

---

## ⚙️ Methodology

The pipeline follows the **CA-ANN (Cellular Automata – Artificial Neural Network)** framework from Paper-2 (*Remote Sensing, 2025, 17, 2474*), originally implemented via the QGIS MOLUSCE extension. We adapt and enhance the methodology in Python using **XGBoost** gradient-boosted trees, multi-scale spatial features, and temporal change signals.

The methodology is organized into seven stages:

---

### 1. Data Acquisition & Preprocessing

**Satellite Imagery:**
Landsat satellite imagery at **30 m spatial resolution** is used to capture LULC across three time periods. The imagery was sourced via **Google Earth Engine (GEE)** in collaboration with USGS:

| Year | Sensor | Satellite |
|------|--------|-----------|
| 2005 | TM | Landsat-5 |
| 2015 | OLI/TIRS | Landsat-8 |
| 2025 | OLI/TIRS | Landsat-8 |

Each image was preprocessed on GEE to remove cloud cover (<10%) and atmospherically corrected using surface reflectance products.

**LULC Classification:**
The LULC maps for each year were generated using a **Random Forest (RF)** classifier on GEE, utilizing spectral bands (Blue, Green, Red, NIR, SWIR1, SWIR2) along with derived Earth Observation Indices (EOIs). Training samples were collected via high-resolution imagery and visual interpretation. The classification produces four classes: Built-up (1), Vegetation (2), Bare Land (3), and Water (4).

**Raster Alignment:**
Since the three classified maps may have slightly different extents (e.g., 2005 was `2069 × 2269` while 2015/2025 were `2068 × 2268`), all rasters are cropped to the **minimum common extent** to ensure pixel-to-pixel correspondence:
```
target_h = min(shape_2005[0], shape_2015[0], shape_2025[0])
target_w = min(shape_2005[1], shape_2015[1], shape_2025[1])
```

**NoData Handling:**
A valid pixel mask is constructed to exclude:
- NoData pixels (value = 255, common in Landsat edge pixels)
- Pixels outside the valid class range [1, 4]

All invalid pixels are set to 0 and excluded from training, validation, and analysis.

**Driver Normalization:**
All spatial driver variables are normalized to the range `[0, 1]` using **MinMax scaling** to ensure equal contribution during model training:

```
X_normalized = (X - X_min) / (X_max - X_min)
```

Negative nodata values in distance rasters are replaced with 0 before normalization.

---

### 2. Earth Observation Indices (EOIs)

Following the paper's methodology (Sec 3.2.1), three key spectral indices are computed from Landsat bands for each time period:

**NDVI** (Normalized Difference Vegetation Index) — quantifies vegetation health:
```
NDVI = (NIR - Red) / (NIR + Red)
```

**NDBI** (Normalized Difference Built-up Index) — highlights impervious surfaces:
```
NDBI = (SWIR1 - NIR) / (SWIR1 + NIR)
```

**MNDWI** (Modified Normalized Difference Water Index) — identifies water bodies:
```
MNDWI = (Green - SWIR1) / (Green + SWIR1)
```

These indices serve dual purposes: (a) as input features to the RF classifier that generated the LULC maps, and (b) as spatial driver variables for the LULC prediction model.

---

### 3. Pearson's Correlation Analysis (Paper Sec 3.4.1)

To determine the most relevant predictors and explore relationships among EOIs, LULC, and spatial drivers, **Pearson's Correlation Coefficient (PCC)** analysis is performed:

```
r = Σ((xi - x̄)(yi - ȳ)) / √(Σ(xi - x̄)² · Σ(yi - ȳ)²)
```

This analysis is conducted at two levels:
1. **Driver–LULC correlation**: Each driver variable is correlated with the LULC class map to identify which drivers have the strongest influence on land cover patterns. Results are sorted by `|PCC|` to rank driver importance.
2. **Inter-driver correlation**: A full correlation matrix between all driver pairs is computed and visualized as a heatmap to detect multicollinearity. Highly correlated drivers (|r| > 0.9) may introduce redundancy and could be candidates for removal.

Key findings from the analysis:
- **Prop_Bare Land** and **Dist_RoadNet** emerged as the strongest predictors
- **NDVI** and **MNDWI** showed moderate but important correlations, especially for distinguishing vegetation from water
- Proximity variables (distance to roads, metro, water bodies) capture urban gradient effects

---

### 4. Transition Probability Matrix — Markov Chain

A **Markov chain transition probability matrix (TPM)** is computed for each time step to quantify how pixels transition between LULC classes over a decade. The TPM is a `4 × 4` row-normalized matrix where entry `T[i,j]` represents the probability that a pixel of class `i` transitions to class `j`:

```
T[i,j] = count(pixels: class_i at t₁ AND class_j at t₂) / count(pixels: class_i at t₁)
```

Two TPMs are computed:
- **TPM₁** (2005 → 2015): captures the historical transition dynamics
- **TPM₂** (2015 → 2025): captures more recent transition patterns

**Dynamic Degree (DD)** — the annual rate of LULC change per class — is also calculated:
```
DD = (Area_t₂ - Area_t₁) / (Area_t₁ × ΔT) × 100%
```
where `ΔT` is the time interval in years (10 years).

The TPMs reveal critical patterns: e.g., Built-up areas show high persistence (pixels rarely revert to vegetation), while Water and Vegetation show significant bidirectional transitions, partly due to seasonal effects and spectral confusion at 30 m resolution.

---

### 5. Feature Engineering

The feature engineering stage constructs a rich **41-dimensional feature vector** for each pixel. This is the most critical stage and underwent multiple iterations of improvement.

#### 5.1 Static Spatial Drivers (8 features)
These capture the physical and infrastructural context of each pixel and remain constant across time periods:

| Feature | Source | Rationale |
|---------|--------|-----------|
| Elevation | SRTM DEM | Topographic constraint on urban expansion |
| Slope | Derived from DEM | Steep slopes resist development |
| Distance to Metro | Euclidean distance | Transit-oriented development driver |
| Distance to Primary Roads | Euclidean distance | Accessibility drives urbanization |
| Distance to Secondary Roads | Euclidean distance | Local connectivity |
| Distance to Road Network | Euclidean distance | General accessibility |
| Distance to Railway Stations | Euclidean distance | Transport node influence |
| Distance to Water Bodies | Euclidean distance | Natural boundary / attraction factor |

#### 5.2 Temporal Drivers (5 features)
These vary between time periods and capture the evolving environmental and socio-economic conditions:

| Feature | Description |
|---------|-------------|
| NDVI | Vegetation density at the base year |
| NDBI | Built-up intensity at the base year |
| MNDWI | Water presence at the base year |
| Population | Population density (WorldPop/Census, resampled to 30 m) |
| Precipitation | Rainfall data (CHIRPS/IMD, resampled to 30 m) |

#### 5.3 Temporal Delta Features (13 features)
The **change** in each driver between time periods acts as a trend/trajectory signal. For each of the 13 drivers (8 static + 5 temporal):
```
Δ_driver = driver_value(t₂) - driver_value(t₁)
```
For static drivers, the delta is zero (no change). For temporal drivers (NDVI, NDBI, MNDWI, Population, Precipitation), the delta captures meaningful trends — e.g., declining NDVI signals vegetation loss, increasing NDBI signals urbanization. This was one of the key improvements that boosted model accuracy.

#### 5.4 Normalized Coordinates (2 features)
Row and column positions are normalized to `[0, 1]` and included as features, serving as a proxy for **latitude and longitude** (as specified in Paper-2 Sec 3.4.2). This allows the model to learn spatially varying transition patterns — e.g., urban expansion may be concentrated in certain directions from the city center.

#### 5.5 Multi-Scale Class Proportions (12 features)
Instead of using raw pixel values from a neighborhood window (which proved noisy and ineffective), we compute the **proportion of each LULC class** within neighborhoods of three different scales:

| Scale | Window Size | Captures |
|-------|-------------|----------|
| Local | 3 × 3 (90 m) | Immediate pixel context |
| Medium | 7 × 7 (210 m) | Block-level land use pattern |
| Regional | 15 × 15 (450 m) | Neighborhood-scale urban structure |

For each scale, 4 proportions are computed (one per class), yielding `3 scales × 4 classes = 12` features. For example, `Prop_Built-up_7x7 = 0.6` means 60% of pixels within a 210 m radius are built-up, indicating a highly urbanized context.

This multi-scale approach was a major improvement over raw neighborhood values because:
- It captures **spatial context** at multiple granularities
- It is **class-aware** rather than treating pixel values as arbitrary numbers
- It is robust to minor misclassification in individual pixels

#### 5.6 Current Class (1 feature)
The pixel's LULC class at the base year is included as an integer feature. This is the single strongest predictor because **most pixels maintain their class** between time periods (persistence). The model uses this feature alongside the spatial context and drivers to identify which pixels are likely to transition.

---

### 6. Model Training — XGBoost (Paper Eq 24, adapted)

The paper's original methodology uses an **ANN (Artificial Neural Network)** with the following formulation (Eq 24):

```
P(K→u) = σ( Σⱼ wⱼ⁽²⁾ · φ( Σᵢ wᵢⱼ · xᵢ + bⱼ ) + b )
```

where:
- `P(K→u)` = probability of transition from class K to class u
- `xᵢ` = input driver features
- `φ` = ReLU activation (hidden layers)
- `σ` = Softmax activation (output layer)
- `wᵢⱼ`, `wⱼ` = learned weights

We initially implemented this using `sklearn.neural_network.MLPClassifier` (CA-ANN, v1–v2), achieving 61–63% OA. After systematic experimentation, we replaced the ANN with **XGBoost** (`XGBClassifier`), which consistently outperformed both the MLP and Random Forest on this tabular feature set.

**XGBoost Configuration:**

| Parameter | Value | Rationale |
|-----------|-------|-----------|
| `n_estimators` | 800 | Sufficient ensemble size for complex patterns |
| `max_depth` | 14 | Deep enough to capture non-linear interactions |
| `learning_rate` | 0.08 | Moderate learning rate for good generalization |
| `subsample` | 0.8 | Row subsampling to reduce overfitting |
| `colsample_bytree` | 0.7 | Feature subsampling per tree |
| `tree_method` | `hist` | Histogram-based splitting for speed |

**Training Data Construction:**
- Features and labels are extracted from **both** transition periods: 2005→2015 and 2015→2025
- This doubles the effective training set and exposes the model to diverse transition dynamics
- **Stratified sampling**: 100,000 pixels are randomly sampled per class to create a balanced training set of 400,000 total samples, preventing the model from being biased toward majority classes (Vegetation and Water dominate spatially)

**Prediction Mode:**
Unlike the paper's iterative CA-ANN approach (`S(t+1) = CA_transition(S_t, P(k→u), N)` — Eq 25), we use **direct single-step prediction**: the model takes 2015 features as input and directly outputs the predicted 2025 LULC class. This avoids the cascading error problem observed in iterative CA simulation, where misclassified pixels in one iteration corrupt the neighborhood features for subsequent iterations.

Predictions are made in batches of 500,000 pixels to fit within GPU/CPU memory constraints.

---

### 7. Validation & Accuracy Assessment (Paper Sec 3.4.3)

The model is validated by predicting the 2025 LULC map from 2015 inputs and comparing against the **actual classified 2025 map**.

**Metrics used:**

**Overall Accuracy (OA)** — percentage of correctly classified pixels:
```
OA = (Σ diagonal of confusion matrix) / (total pixels) × 100
```

**Cohen's Kappa Coefficient** — agreement corrected for chance:
```
κ = (OA - Pe) / (1 - Pe)
```
where `Pe` is the expected agreement by chance.

**Quantity Disagreement** (Pontius & Millones) — error due to the model predicting the wrong total number of pixels per class:
```
QD = Σ |p_row_i - p_col_i| / 2
```

**Allocation Disagreement** — error due to the model placing pixels of the right class in the wrong spatial locations:
```
AD = Σ min(omission_i, commission_i)
```

**Producer's Accuracy** — probability that a pixel of a given class in reality is correctly identified:
```
PA_i = cm[i,i] / Σ_col cm[:,i]
```

**User's Accuracy** — probability that a pixel classified as a given class actually belongs to that class:
```
UA_i = cm[i,i] / Σ_row cm[i,:]
```

**Validation Results:**

| Metric | Value |
|--------|-------|
| **Overall Accuracy** | 68.72% |
| **Kappa Coefficient** | 0.54 |
| **Quantity Disagreement** | ~6% |
| **Allocation Disagreement** | ~25% |

| Class | Producer Accuracy | User Accuracy |
|-------|-------------------|---------------|
| Built-up | ~68% | ~81% |
| Vegetation | ~74% | ~66% |
| Bare Land | ~43% | ~98% |
| Water | ~66% | ~62% |

**Key Observations:**
- **Built-up** has high User Accuracy (81%) — when the model predicts Built-up, it is usually correct
- **Bare Land** has very high User Accuracy (98%) but low Producer Accuracy (43%) — the model is conservative in predicting Bare Land but highly precise when it does
- **Water ↔ Vegetation** confusion is the dominant source of error (~760k pixels), driven by wetlands, seasonal flooding, and mixed spectral signatures at 30 m resolution
- The **persistence baseline** (copying 2015 LULC as-is) yields only 60.4% OA, meaning ~40% of pixels changed class between 2015–2025, confirming significant LULC dynamics

---

### 8. Future Projection (2035 & 2045)

Using the validated model, LULC is projected forward:
1. **2035 projection**: The trained model takes the actual 2025 LULC + 2015 drivers as input and predicts the 2035 LULC map
2. **2045 projection**: The predicted 2035 map is fed back as input to predict 2045 (iterative forward projection)

Projected maps are saved as **GeoTIFF** rasters with the same CRS, transform, and resolution as the input data, ensuring compatibility with GIS tools (QGIS, ArcGIS) for further spatial analysis and urban planning applications.

---

## 📊 Model Evolution

The pipeline went through multiple iterations to improve accuracy:

| Version | Model | Key Change | OA | Kappa |
|---------|-------|------------|-----|-------|
| v1 | CA-ANN (MLP) | Baseline — 3×3 neighborhood + drivers | 61.2% | 0.407 |
| v2 | CA-ANN (MLP) | 5×5 neighborhood + coords + dual-period training | 62.9% | 0.440 |
| v3 | Random Forest | Class proportions instead of raw pixels, direct prediction | 64.8% | 0.481 |
| v4 | RF + Markov | MOLUSCE-style transition potential + Markov allocation | 64.6% | 0.467 |
| v5 | RF (large) | Multi-scale proportions (3/7/15) + current class feature | 66.2% | 0.501 |
| **v6** | **XGBoost** | **Temporal delta features + multi-scale + XGBoost** | **68.7%** | **0.54** |

> **Note**: The persistence baseline (simply copying 2015 LULC as the 2025 prediction) yields only **60.4% OA**, indicating ~40% of pixels changed class between 2015–2025. This high rate of change is partly due to spectral confusion between Water and Vegetation in the input classified maps (seasonal flooding, wetlands, mixed pixels at 30m resolution).

---

## 🖥️ Website Dashboard

An interactive **Next.js** web dashboard is included in the `Website/` directory for visualizing:
- Historical LULC classification maps (2005–2025)
- Projected LULC maps (2035, 2045)
- LULC change statistics and class area trends

---

## 🚀 Quick Start

### Prerequisites

```bash
pip install numpy pandas rasterio scikit-learn xgboost scipy matplotlib seaborn
```

### Run the Pipeline

1. Open `xgboost-pipeline.ipynb` in Jupyter / Kaggle
2. Set `BASE` to the path containing the raster data
3. Run all cells sequentially
4. Outputs: validation metrics, projected GeoTIFFs, visualization plots

### Run the Website

```bash
cd Website
npm install
npm run dev
```

---

## 📄 References

1. **Paper-2**: *Analyzing Urban Thermal Field Variance and Land Use/Land Cover Change Using Gradient Directional Analysis and Machine Learning* — Remote Sensing, 2025, 17, 2474
   - CA-ANN methodology (Eq 24–25)
   - MOLUSCE-style simulation framework
   - Pearson Correlation for driver selection
   - Markov chain transition probability matrices

2. **Tools**: Google Earth Engine, QGIS, Rasterio, Scikit-learn, XGBoost

---

## 👥 Authors

Spatial Computing Project — Semester 6, IIIT Bangalore

---

## 📝 License

Academic use only. Satellite data sourced from USGS/Landsat via Google Earth Engine.