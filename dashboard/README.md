# Patient Placement Analytics

A Streamlit portfolio project by Josh Homan, comparing transfer-center and emergency department admissions through volume, care mix, and length of stay.

The public demo always generates 6,000 fictional adult encounters in memory, with a fixed random seed. It does not load local CSV extracts, require secrets, or connect to Epic.

## Run locally

Use Python 3.12 and run from this folder:

```bash
python -m venv .venv
# Windows: .venv\Scripts\activate
# macOS / Linux: source .venv/bin/activate
pip install -r requirements.txt
streamlit run app.py
```

Dependencies are pinned to the versions verified in the development environment. The theme lives in `.streamlit/config.toml`.

## Explore

- **Overview:** encounter counts, transfer share, median LOS gap, full-encounter bed-days, monthly admissions, and care mix.
- **Care mix:** percentages within each admission source, service lines, care levels, and fictional referring facilities.
- **Length of stay:** medians, distributions, subgroup counts, and 90th percentiles within each care level.
- **Encounter explorer:** literal-text search, source selection, and CSV download of exactly the displayed cohort.
- **Methods:** metric definitions, simulation assumptions, limitations, and a conceptual Epic-oriented data dictionary.

Global filters cover admission dates (inclusive end date), hospital service, level of care, and patient class. Empty selections show a recoverable message; missing source statistics stay missing rather than becoming zero. Monthly time series include zero-count months.

## Analytical limits

Differences between sources are deliberately encoded in the simulation. The generator uses a 27% transfer probability, source-specific care and service distributions, and right-skewed LOS with a higher transfer mean at each care level. Service and care level are sampled independently. LOS baseline parameters are means before clipping, not medians. Observation status is sampled among shorter stays.

Each encounter has a single care-level label. Comparing within levels provides descriptive context, not complete acuity adjustment, causal evidence, or a validated clinical benchmark. Diagnosis, severity, comorbidities, discharge barriers, prior-facility days, and bed movements are not modeled. All stays are discharged; there is no censoring.

Encounter bed-days sum full stays for admissions in the selected window, including days outside that window. They do not measure daily census, bed occupancy, or staffed capacity. Inpatient and observation encounters are both included by default.

The field dictionary describes reporting concepts. Actual Epic schemas, joins, and code sets must be institutionally validated; no integration or affiliation is claimed.

## Verify

```bash
python -m unittest test_dashboard -v
```

Checks cover reproducibility, timestamp consistency, inclusive end dates, missing cohorts, percentage denominators, zero-count months, every navigation view, empty selections, reset, and search behavior.

## Publish on Streamlit Community Cloud

The portfolio repository contains this app at `dashboard/`. Deploy with:

- Repository: `Joshdhoman/clinical-analytics`
- Branch: `main`
- Entry point: `dashboard/app.py`
- Python: **3.12**
- Secrets: **none**

The repository-root `.streamlit/config.toml` supplies the same theme when Cloud starts from the repository root. `dashboard/requirements.txt` supplies the Python dependencies. Select an available app subdomain in Streamlit Cloud, then verify the resulting URL before adding it to the portfolio.

The portfolio's `NEXT_PUBLIC_PLACEMENT_DEMO_URL` setting enables the live-app buttons on the homepage and `/projects/patient-placement`. Without that setting, the case study and source links remain available. No placeholder URL is advertised as a live demo.

Official guide: https://docs.streamlit.io/deploy/streamlit-community-cloud/deploy-your-app/deploy

## Files

- `app.py`: presentation, navigation, filters, and export.
- `analytics.py`: pure cohort calculations.
- `data_generator.py`: repeatable simulation. Running it directly optionally writes a synthetic CSV under `data/`; the public app does not read that file.
- `test_dashboard.py`: calculation and app regression checks.

Synthetic demonstration only. No real patient records. Not for clinical use.
