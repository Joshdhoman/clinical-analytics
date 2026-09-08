# Transfer Center vs. Emergency Department Dashboard

An Epic-oriented Streamlit dashboard for inpatient patient-placement analytics.
It compares encounters that arrive through the **Transfer Center** (external
facility transfers) against those admitted through the **Emergency Department**,
across three dimensions: **hospital service**, **level of care**, and
**length of stay (LOS)**.

Built as a portfolio piece sitting at the intersection of bedside operations and
data science. All data is synthetic. No real PHI is used.

## Why the comparison is built this way

Transfer-center patients tend to be higher acuity than ED admits, so a raw LOS
comparison is confounded by case mix. The LOS section therefore **stratifies by
level of care**, answering the sharper operational question: do transfers stay
longer *at the same level of care*, or does the overall gap just reflect more
ICU admissions? That distinction is the analytical core of the dashboard.

## Run it

From inside the project folder, in the VS Code terminal:

```bash
python -m venv .venv
.venv\Scripts\activate          # Windows
# source .venv/bin/activate     # macOS / Linux
pip install -r requirements.txt
streamlit run app.py
```

It opens at http://localhost:8501. Stop it with Ctrl+C.

Use a virtual environment rather than the base Anaconda environment. It keeps
this project's package versions isolated so a change here cannot break your
other work. After creating `.venv`, point VS Code at it with Ctrl+Shift+P,
"Python: Select Interpreter", then pick the one inside `.venv`.

On first launch the app generates a synthetic Epic-shaped extract into
`data/transfer_center_encounters.csv`. Delete that file to regenerate, or run
the generator directly:

```bash
python data_generator.py
```

Verified working on Streamlit 1.62, pandas 3.0, numpy 2.4, plotly 7.0.
`requirements.txt` carries upper bounds so a future major release cannot
silently break the app.

## What's in it

- KPI strip: total encounters, transfer-center share, median LOS (transfer vs ED), share of each source's encounters at ICU level of care
- Monthly volume trend by admission source
- Level-of-care mix by source
- Service line mix by source
- LOS stratified by level of care (median bars + distribution box plots)
- Filterable encounter-level table with CSV export
- In-app Epic field-mapping reference

Filters (service, level of care, patient class, date range) apply to every panel.

## Epic data mapping

The synthetic columns mirror real Epic reporting concepts so the app would plug
into a live extract with minimal remapping.

| Dashboard field | Epic source (Clarity / Caboodle) |
|---|---|
| `encounter_csn` | `PAT_ENC_HSP.PAT_ENC_CSN_ID` (Contact Serial Number) |
| `admission_source` | Admission source / point of origin; transfer flag from the Transfer Center (Grand Central) module |
| `hospital_service` | `CLARITY_ADT` / hospital service (treatment team) |
| `level_of_care` | Bed / accommodation level of care from ADT bed movements |
| `patient_class` | `PAT_ENC_HSP` patient class (Inpatient vs Observation) |
| `admit_datetime` / `discharge_datetime` | `PAT_ENC_HSP.HOSP_ADMSN_TIME` / `HOSP_DISCH_TIME` |
| `los_days` | Derived: discharge minus admit |
| `referring_facility` | Transferring facility captured in the transfer-center workflow |

In Caboodle the same data lives in dimensional form, e.g. `HospitalAdmissionFact`
joined to `AdmissionSourceDim`, `DepartmentDim`, and date dimensions.

## Adapting to real data

Swap the generator for your own extract by writing a CSV with the same column
names to `data/transfer_center_encounters.csv`. Nothing downstream needs to
change. Keep the extract de-identified and off any shared environment.

---
The Homan Quant · synthetic demonstration data · not for clinical use

## Changelog

**2026-08-28** — Restyled to the THQ Exhibit Style (light / warm-paper base):
editorial masthead with serif headline, hairline rules instead of stat cards,
monospace numerals, teal/gold accent pair, warm `#f6f4ef` canvas. No changes to
the analysis logic.

**2026-08-28** — Compatibility pass against current package versions.
Replaced the deprecated `use_container_width=True` argument with `width="stretch"`
(Streamlit deprecated the old form and will remove it). Added version bounds to
`requirements.txt`. No changes to the analysis logic.
