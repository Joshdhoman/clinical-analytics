"""Patient placement analytics: reproducible, synthetic portfolio demonstration."""
import pandas as pd
import plotly.express as px
import streamlit as st

from analytics import (ED, TRANSFER, SOURCES, LEVELS, cohort_mix, filter_cohort,
                       los_by_level, monthly_volume, prepare, source_summary)
from data_generator import generate, SERVICES

st.set_page_config(page_title="Patient placement | Josh Homan", page_icon=":material/monitor_heart:", layout="wide")
COLORS = {TRANSFER: "#2f6f4e", ED: "#71869b"}
SHORT_LEVELS = {"ICU": "ICU", "Stepdown / Intermediate": "Stepdown", "Telemetry": "Telemetry", "Med-Surg / Acute": "Med-surg"}


@st.cache_data(max_entries=1)
def load_data():
    # Always generate the public demo in memory. Never publish a local extract.
    return prepare(generate())


def plot(fig, height=340, left_margin=60):
    fig.update_layout(
        height=height, paper_bgcolor="rgba(0,0,0,0)", plot_bgcolor="rgba(0,0,0,0)",
        font=dict(family="Arial, sans-serif", size=12, color="#53645a"),
        margin=dict(l=left_margin, r=18, t=16, b=65), legend_title_text="",
        legend=dict(orientation="h", y=-.22, x=0),
        hoverlabel=dict(bgcolor="white"), bargap=.28,
    )
    fig.update_xaxes(gridcolor="#e5ebe5", zeroline=False, title_font_size=12)
    fig.update_yaxes(gridcolor="#e5ebe5", zeroline=False, title_font_size=12, automargin=True)
    st.plotly_chart(fig, width="stretch", config={"displayModeBar": False}, theme=None)


def fmt(value, suffix="", digits=1):
    return "—" if pd.isna(value) else f"{value:,.{digits}f}{suffix}"


def reset_filters():
    for key in ("services", "levels", "classes", "dates", "search", "detail_source"):
        st.session_state.pop(key, None)


def mix_chart(frame, field, categories, height=340):
    mix = cohort_mix(frame, field, categories)
    if field == "level_of_care":
        mix[field] = mix[field].map(SHORT_LEVELS)
        categories = [SHORT_LEVELS[x] for x in categories]
    fig = px.bar(mix, x="share", y=field, color="source", orientation="h",
                 barmode="group", color_discrete_map=COLORS,
                 category_orders={field: categories, "source": SOURCES},
                 custom_data=["encounters"], labels={"share": "Share of each source (%)", field: ""})
    fig.update_traces(hovertemplate="%{y}<br>%{x:.1f}% · %{customdata[0]:,} encounters<extra>%{fullData.name}</extra>")
    plot(fig, height, left_margin=190 if field == "hospital_service" else 85)


st.caption("JOSH HOMAN  /  CLINICAL ANALYTICS  /  01")
st.title("Patient placement, in perspective.")
st.write("Compare **transfer-center** and **emergency department** admissions. Explore who arrives, the care they need, and how long they stay.")
with st.container(horizontal=True, gap="small"):
    st.badge("Synthetic data", icon=":material/science:", color="green")
    st.caption("6,000 fictional encounters · Jan–Dec 2025 · No real patient records")

df = load_data()
min_date, max_date = pd.Timestamp("2025-01-01").date(), pd.Timestamp("2025-12-31").date()
with st.sidebar:
    st.subheader(":material/monitor_heart: Placement analytics")
    st.caption("A clinical operations workbench")
    view = st.radio("Explore", ["Overview", "Care mix", "Length of stay", "Encounter explorer", "Methods"], key="view")
    st.divider()
    st.markdown("**Define your cohort**")
    dates = st.date_input("Admission dates", value=(min_date, max_date), min_value=min_date, max_value=max_date, key="dates")
    with st.expander("Hospital services", expanded=False):
        services = st.multiselect("Include services", sorted(SERVICES), default=sorted(SERVICES), key="services")
    with st.expander("Levels of care", expanded=False):
        levels = st.multiselect("Include care levels", LEVELS, default=LEVELS, key="levels")
    classes = st.pills("Patient class", ["Inpatient", "Observation"], selection_mode="multi", default=["Inpatient", "Observation"], key="classes")
    st.button("Reset filters", icon=":material/restart_alt:", on_click=reset_filters, width="stretch")
    st.caption("Filters apply across every analytical view. Length of stay is measured over the full encounter.")
    st.link_button("Source & documentation", "https://github.com/Joshdhoman/clinical-analytics/tree/main/dashboard", icon=":material/code:")

if view == "Methods":
    st.header("How to read this dashboard")
    st.write("This is a reproducible analytics demonstration. All encounters are generated with a fixed seed; differences between sources are simulation assumptions, not findings about a real hospital.")
    with st.expander("Cohorts and denominators", expanded=True):
        st.markdown("""
- **Transfer center:** admissions from a fictional external facility. **Emergency department:** admissions through the ED.
- **Transfer share:** transfer encounters divided by all filtered encounters. Both inpatient and observation encounters are included unless filtered out.
- **Care and service mix:** percentages within each admission source, after all filters. ICU share also uses each source's filtered cohort as its denominator.
- **Median LOS gap:** transfer median minus ED median. Missing cohorts display an em dash, never a false zero.
- **Encounter bed-days:** sum of full encounter LOS, including days after the selected admission window. This is not occupied beds or census within that window.
- **Monthly volumes:** count by admission month; months with no encounters appear as zero. Boundary months may be partial.
""")
    with st.expander("Simulation and analytical limits", expanded=True):
        st.write("6,000 adult encounters are generated for 2025 using NumPy seed 42. Transfers have a 27% sampling probability and a higher ICU probability. LOS follows a right-skewed log-normal distribution with a deliberately higher transfer mean at each level of care. Service and care level are sampled independently; these combinations are not a validated clinical model.")
        st.write("Comparing within a level of care describes case mix but does not fully adjust for acuity. Diagnosis, severity, comorbidities, treatment, discharge barriers, and prior-facility days are not modeled. No causal effects, real-world benchmarks, or operational savings can be inferred. Small subgroups are descriptive and can be unstable.")
        st.write("Each encounter has one synthetic care-level label, not a history of bed movements. All generated encounters are discharged; there is no censoring of ongoing stays. Referring facility names are fictional.")
    with st.expander("Epic-oriented data dictionary"):
        st.caption("Conceptual reporting fields only. Actual tables, joins, codes, and definitions require validation against the institution's licensed data dictionary; no Epic integration is implemented.")
        st.dataframe(pd.DataFrame([
            ["encounter_csn", "Synthetic encounter identifier", "Hospital encounter record"],
            ["admission_source", "Transfer center or ED", "Admission origin / transfer workflow"],
            ["hospital_service", "Assigned service line", "Hospital service / treatment team"],
            ["level_of_care", "Single encounter care category", "ADT accommodation / bed movements"],
            ["patient_class", "Inpatient or observation", "Encounter patient class"],
            ["admit_datetime / discharge_datetime", "Encounter timestamps", "Hospital admission / discharge"],
            ["los_days", "Full stay in days", "Discharge minus admission, rounded"],
            ["referring_facility", "Fictional transferring hospital", "Transfer workflow facility"],
        ], columns=["Field", "Meaning", "Reporting concept"]), hide_index=True, width="stretch")
    st.stop()

if len(dates) != 2:
    st.info("Choose both a start and an end date to update the cohort.", icon=":material/date_range:")
    st.stop()
f = filter_cohort(df, services, levels, classes, dates)
if f.empty:
    st.info("No encounters match these filters. Add a service, level of care, or patient class, or reset the filters.", icon=":material/filter_alt_off:")
    st.stop()
summary = source_summary(f)
tc, ed = summary.loc[TRANSFER], summary.loc[ED]
gap = tc.median_los - ed.median_los
volume = monthly_volume(f, dates)
st.caption(f"{dates[0]:%b %d, %Y} – {dates[1]:%b %d, %Y}  ·  {len(f):,} of {len(df):,} encounters  ·  {len(services)} services  ·  {', '.join(classes)}")

with st.container():
    metrics = [
        ("Encounters", f"{len(f):,}", f"{int(tc.encounters):,} transfer · {int(ed.encounters):,} ED"),
        ("Transfer share", f"{tc.encounters / len(f):.1%}", "Of all selected encounters"),
        ("Median LOS gap", fmt(gap, " d"), "Transfer minus ED · unadjusted"),
        ("Encounter bed-days", f"{f.los_days.sum():,.0f}", "Full stays for selected admissions"),
    ]
    for column, (label, value, detail) in zip(st.columns(4), metrics):
        with column.container(border=True):
            st.metric(label, value)
            st.caption(detail)

if (summary.encounters == 0).any():
    st.warning("Only one admission source is represented. Cross-source LOS comparisons are unavailable for this selection.")
elif summary.encounters.min() < 30:
    st.caption("Small cohort: at least one source has fewer than 30 encounters. Interpret descriptive comparisons cautiously.")

if view == "Overview":
    with st.container(border=True):
        st.subheader("The comparison needs context")
        if pd.notna(gap):
            direction = "longer" if gap >= 0 else "shorter"
            st.write(f"Transfer admissions have a **{abs(gap):.1f}-day {direction} median stay** in this selection. ICU represents **{fmt(tc.icu_share, '%')}** of transfers and **{fmt(ed.icu_share, '%')}** of ED admissions.")
            st.caption("Read the care mix alongside the LOS gap. The Length of stay view compares within care levels; it is not a full risk adjustment.")
        else:
            st.write("Include both admission sources to compare length of stay and care mix.")
    left, right = st.columns([3, 2], gap="medium")
    with left:
        st.subheader("Admissions over time")
        st.caption("Monthly encounter counts · selected admission dates")
        fig = px.line(volume, x="admit_month", y="encounters", color="source", markers=True,
                      color_discrete_map=COLORS, category_orders={"source": SOURCES},
                      labels={"admit_month": "", "encounters": "Encounters"})
        fig.update_traces(line_width=3, marker_size=7, hovertemplate="%{x|%b %Y}<br>%{y:,} encounters<extra>%{fullData.name}</extra>")
        fig.update_xaxes(dtick="M2", tickformat="%b")
        plot(fig)
    with right:
        st.subheader("Where care is delivered")
        st.caption("Share within each admission source")
        mix_chart(f, "level_of_care", [x for x in LEVELS if x in levels])
    st.subheader("Two routes into the hospital")
    comparison = summary.reset_index().rename(columns={"source": "Admission source", "encounters": "Encounters", "median_los": "Median LOS", "mean_los": "Mean LOS", "icu_share": "ICU share", "bed_days": "Encounter bed-days"})
    st.dataframe(comparison, hide_index=True, width="stretch", column_config={
        "Median LOS": st.column_config.NumberColumn(format="%.1f d"),
        "Mean LOS": st.column_config.NumberColumn(format="%.1f d"),
        "ICU share": st.column_config.NumberColumn(format="%.1f%%"),
        "Encounter bed-days": st.column_config.NumberColumn(format="%.0f"),
    })

elif view == "Care mix":
    st.header("Different routes. Different care needs.")
    st.caption("Percentages use each source's selected cohort as the denominator. Hover for encounter counts.")
    left, right = st.columns([3, 2], gap="medium")
    with left:
        st.subheader("Service-line composition")
        order = f.hospital_service.value_counts().index.tolist()
        mix_chart(f, "hospital_service", order, 510)
    with right:
        st.subheader("Level-of-care composition")
        mix_chart(f, "level_of_care", [x for x in LEVELS if x in levels], 370)
        st.caption("Care level is one descriptive category per encounter. It does not capture changes in acuity during a stay.")
    st.subheader("The transfer network")
    facilities = f[f.source.eq(TRANSFER)].groupby("referring_facility").agg(Encounters=("los_days", "size"), Median_LOS=("los_days", "median")).reset_index().sort_values("Encounters", ascending=False)
    if facilities.empty:
        st.info("No transfer encounters in this selection.")
    else:
        st.dataframe(facilities.rename(columns={"referring_facility": "Referring facility", "Median_LOS": "Median LOS"}), hide_index=True, width="stretch", column_config={"Median LOS": st.column_config.NumberColumn(format="%.1f d")})
        st.caption("Fictional facilities; counts describe selected admissions, not referral conversion rates.")

elif view == "Length of stay":
    st.header("Compare within a level of care.")
    st.write("A single overall median can obscure differences in care mix. Start with the medians below, then inspect the spread and subgroup sizes.")
    med = los_by_level(f)
    med["care"] = med.level_of_care.map(SHORT_LEVELS)
    order = [SHORT_LEVELS[x] for x in LEVELS if x in levels]
    left, right = st.columns(2, gap="medium")
    with left:
        st.subheader("Median stay")
        fig = px.bar(med, x="care", y="median_los", color="source", barmode="group", color_discrete_map=COLORS,
                     category_orders={"care": order, "source": SOURCES}, custom_data=["encounters"],
                     labels={"care": "", "median_los": "Median LOS (days)"})
        fig.update_traces(hovertemplate="%{x}<br>%{y:.1f} days · n=%{customdata[0]:,}<extra>%{fullData.name}</extra>")
        plot(fig, 390)
    with right:
        st.subheader("Spread of stays")
        fig = px.box(f.assign(care=f.level_of_care.map(SHORT_LEVELS)), x="care", y="los_days", color="source", color_discrete_map=COLORS,
                     category_orders={"care": order, "source": SOURCES}, points=False,
                     labels={"care": "", "los_days": "LOS (days)"})
        plot(fig, 390)
        st.caption("Box: middle 50%. Line: median. Whiskers: values within 1.5× IQR. Individual outlier markers are hidden; all stays contribute to the calculations.")
    st.subheader("Check the denominators")
    st.dataframe(med.drop(columns="care").rename(columns={"level_of_care": "Level of care", "source": "Admission source", "median_los": "Median LOS", "encounters": "Encounters", "p90_los": "90th percentile LOS"}), hide_index=True, width="stretch", column_config={"Median LOS": st.column_config.NumberColumn(format="%.1f d"), "90th percentile LOS": st.column_config.NumberColumn(format="%.1f d")})
    st.caption("Stratification is descriptive, not causal or fully risk-adjusted. Differences are intentionally built into the synthetic generator.")

elif view == "Encounter explorer":
    st.header("From the pattern to the encounter.")
    with st.container(horizontal=True, vertical_alignment="bottom"):
        search = st.text_input("Find an encounter or facility", placeholder="Encounter ID or referring facility", key="search", width=400)
        selected_source = st.selectbox("Admission source", ["Both sources"] + SOURCES, key="detail_source", width=250)
    detail = f.copy()
    if selected_source != "Both sources":
        detail = detail[detail.source.eq(selected_source)]
    if search.strip():
        query = search.strip()
        detail = detail[detail.encounter_csn.astype(str).str.contains(query, regex=False) | detail.referring_facility.fillna("").str.contains(query, case=False, regex=False)]
    columns = ["encounter_csn", "patient_age", "admission_source", "referring_facility", "hospital_service", "level_of_care", "patient_class", "admit_datetime", "discharge_datetime", "los_days"]
    detail = detail[columns].sort_values("admit_datetime", ascending=False)
    st.caption(f"{len(detail):,} matching encounters · search and source selection also apply to the download")
    st.download_button("Download these encounters", detail.to_csv(index=False).encode("utf-8"), file_name="synthetic_placement_encounters.csv", mime="text/csv", icon=":material/download:", disabled=detail.empty, on_click="ignore")
    st.dataframe(detail, hide_index=True, width="stretch", height=480, column_config={
        "encounter_csn": st.column_config.NumberColumn("Encounter", format="%d"),
        "patient_age": "Age", "admission_source": "Admission source", "referring_facility": "Referring facility",
        "hospital_service": "Hospital service", "level_of_care": "Level of care", "patient_class": "Patient class",
        "admit_datetime": st.column_config.DatetimeColumn("Admitted", format="MMM DD, YYYY HH:mm"),
        "discharge_datetime": st.column_config.DatetimeColumn("Discharged", format="MMM DD, YYYY HH:mm"),
        "los_days": st.column_config.NumberColumn("LOS", format="%.2f d"),
    })

st.caption("Built by Josh Homan · Synthetic demonstration · Not for clinical use")
