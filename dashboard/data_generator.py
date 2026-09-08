"""
Synthetic transfer center encounter generator (Epic-oriented).

This produces a flat extract shaped like what you would pull from Epic's
reporting layer (Clarity / Caboodle) for inpatient encounters, restricted to
two admission sources: the Transfer Center (external facility transfers) and
the Emergency Department.

No real patient data is used. Every row is synthetic. The field names and
value sets are chosen to mirror common Epic concepts so the dashboard reads as
something that would plug into a real extract with minimal remapping. See
README.md for the Epic source-column mapping.
"""

from __future__ import annotations

import numpy as np
import pandas as pd

RNG = np.random.default_rng(42)

# Value sets chosen to look like Epic "Hospital Service" / treatment team names.
SERVICES = [
    "Hospitalist / General Medicine",
    "Cardiology",
    "Pulmonary / Critical Care",
    "Neurology",
    "Neurosurgery",
    "General Surgery",
    "Trauma Surgery",
    "Hematology / Oncology",
    "Nephrology",
    "Gastroenterology",
]

# Epic "Level of Care" / accommodation grouping.
LEVELS = ["ICU", "Stepdown / Intermediate", "Telemetry", "Med-Surg / Acute"]

# A handful of fake referring hospitals for the transfer cohort.
REFERRING_FACILITIES = [
    "St. Aldric Community Hospital",
    "Prairie Valley Medical Center",
    "Lakeview Regional",
    "Mercy County Hospital",
    "Northfield General",
    "Cedar Ridge Memorial",
]

# Per-source weighting. Transfers skew toward higher acuity services and levels,
# ED admits skew toward general medicine and lower acuity. This is the clinical
# pattern the dashboard is built to surface.
SERVICE_WEIGHTS = {
    "Transfer Center (External Facility)": np.array(
        [0.10, 0.20, 0.16, 0.10, 0.10, 0.07, 0.08, 0.09, 0.05, 0.05]
    ),
    "Emergency Department": np.array(
        [0.34, 0.10, 0.08, 0.07, 0.02, 0.08, 0.05, 0.04, 0.07, 0.15]
    ),
}

LEVEL_WEIGHTS = {
    "Transfer Center (External Facility)": np.array([0.34, 0.22, 0.20, 0.24]),
    "Emergency Department": np.array([0.12, 0.13, 0.25, 0.50]),
}

# Median length of stay (days) baseline by level of care. Transfers get a
# modest additive bump even at the same level of care, because they arrive
# further into an illness course. The dashboard stratifies by level of care so
# this real difference is visible rather than hidden by the acuity mix.
LOS_BASE = {
    "ICU": 5.2,
    "Stepdown / Intermediate": 3.8,
    "Telemetry": 3.0,
    "Med-Surg / Acute": 2.6,
}
TRANSFER_LOS_BUMP = 1.25  # extra days at matched level of care


def generate(n_encounters: int = 6000, start: str = "2025-01-01", end: str = "2025-12-31") -> pd.DataFrame:
    sources = np.array(
        ["Transfer Center (External Facility)", "Emergency Department"]
    )
    # Roughly a quarter of inpatient admits come through the transfer center.
    source = RNG.choice(sources, size=n_encounters, p=[0.27, 0.73])

    service = np.empty(n_encounters, dtype=object)
    level = np.empty(n_encounters, dtype=object)
    for s in sources:
        mask = source == s
        k = int(mask.sum())
        service[mask] = RNG.choice(SERVICES, size=k, p=SERVICE_WEIGHTS[s])
        level[mask] = RNG.choice(LEVELS, size=k, p=LEVEL_WEIGHTS[s])

    # Length of stay: log-normal around a level-of-care baseline, plus a
    # transfer bump, with mild service-driven noise.
    los = np.empty(n_encounters, dtype=float)
    for i in range(n_encounters):
        base = LOS_BASE[level[i]]
        if source[i] == "Transfer Center (External Facility)":
            base += TRANSFER_LOS_BUMP
        # log-normal keeps it positive and right-skewed like real LOS
        sigma = 0.55
        mu = np.log(max(base, 0.5)) - (sigma**2) / 2
        los[i] = float(np.exp(RNG.normal(mu, sigma)))
    los = np.clip(np.round(los, 2), 0.25, 60.0)

    # Admit timestamps spread across the year; discharge = admit + LOS.
    start_ts = pd.Timestamp(start)
    end_ts = pd.Timestamp(end)
    span_seconds = (end_ts - start_ts).total_seconds()
    admit_offsets = RNG.uniform(0, span_seconds, size=n_encounters)
    admit_dt = start_ts + pd.to_timedelta(admit_offsets, unit="s")
    discharge_dt = admit_dt + pd.to_timedelta(los, unit="D")

    # Patient class: most are inpatient, a slice are observation (shorter stays).
    patient_class = np.where(
        (los < 2.0) & (RNG.random(n_encounters) < 0.45), "Observation", "Inpatient"
    )

    # Age, skewed older for higher-acuity / transfer encounters.
    base_age = RNG.normal(64, 17, n_encounters)
    base_age += np.where(source == "Transfer Center (External Facility)", 4, 0)
    age = np.clip(np.round(base_age), 18, 99).astype(int)

    referring = np.where(
        source == "Transfer Center (External Facility)",
        RNG.choice(REFERRING_FACILITIES, size=n_encounters),
        "",
    )

    df = pd.DataFrame(
        {
            "encounter_csn": 200000000 + np.arange(n_encounters),
            "mrn": RNG.integers(1_000_000, 9_999_999, size=n_encounters),
            "patient_age": age,
            "admission_source": source,
            "referring_facility": referring,
            "hospital_service": service,
            "level_of_care": level,
            "patient_class": patient_class,
            "admit_datetime": admit_dt.floor("min"),
            "discharge_datetime": discharge_dt.floor("min"),
            "los_days": los,
        }
    )
    return df.sort_values("admit_datetime").reset_index(drop=True)


if __name__ == "__main__":
    out = generate()
    out.to_csv("data/transfer_center_encounters.csv", index=False)
    print(f"Wrote {len(out):,} encounters to data/transfer_center_encounters.csv")
