"""Pure cohort calculations shared by the dashboard and regression checks."""
from __future__ import annotations

import pandas as pd

TRANSFER = "Transfer center"
ED = "Emergency department"
SOURCES = [TRANSFER, ED]
LEVELS = ["ICU", "Stepdown / Intermediate", "Telemetry", "Med-Surg / Acute"]
SOURCE_LABELS = {
    "Transfer Center (External Facility)": TRANSFER,
    "Emergency Department": ED,
}


def prepare(df: pd.DataFrame) -> pd.DataFrame:
    result = df.copy()
    result["source"] = result.admission_source.map(SOURCE_LABELS)
    result["admit_month"] = result.admit_datetime.dt.to_period("M").dt.to_timestamp()
    return result


def filter_cohort(df, services, levels, classes, dates):
    if len(dates) != 2:
        return df.iloc[0:0].copy()
    start, end = pd.Timestamp(dates[0]), pd.Timestamp(dates[1]) + pd.Timedelta(days=1)
    mask = (df.hospital_service.isin(services) & df.level_of_care.isin(levels)
            & df.patient_class.isin(classes) & df.admit_datetime.ge(start)
            & df.admit_datetime.lt(end))
    return df.loc[mask].copy()


def source_summary(df):
    result = df.groupby("source").agg(
        encounters=("los_days", "size"), median_los=("los_days", "median"),
        mean_los=("los_days", "mean"), bed_days=("los_days", "sum"),
        icu_share=("level_of_care", lambda x: x.eq("ICU").mean() * 100),
    ).reindex(SOURCES)
    result["encounters"] = result.encounters.fillna(0).astype(int)
    return result


def monthly_volume(df, dates):
    months = pd.date_range(pd.Timestamp(dates[0]).to_period("M").start_time,
                           pd.Timestamp(dates[1]).to_period("M").start_time, freq="MS")
    index = pd.MultiIndex.from_product([months, SOURCES], names=["admit_month", "source"])
    return df.groupby(["admit_month", "source"]).size().reindex(index, fill_value=0).rename("encounters").reset_index()


def cohort_mix(df, field, categories):
    index = pd.MultiIndex.from_product([categories, SOURCES], names=[field, "source"])
    result = df.groupby([field, "source"]).size().reindex(index, fill_value=0).rename("encounters").reset_index()
    totals = result.groupby("source").encounters.transform("sum")
    result["share"] = result.encounters.div(totals.where(totals.gt(0))) * 100
    return result


def los_by_level(df):
    return df.groupby(["level_of_care", "source"]).agg(
        median_los=("los_days", "median"), encounters=("los_days", "size"),
        p90_los=("los_days", lambda x: x.quantile(.9)),
    ).reset_index()
