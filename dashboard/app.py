"""
Transfer Center vs. Emergency Department dashboard (Epic-oriented).

Run:
    pip install -r requirements.txt
    streamlit run app.py

On first run it auto-generates a synthetic Epic-shaped extract into
data/transfer_center_encounters.csv. Delete that file to regenerate.

Visual system: THQ Exhibit Style, light / warm-paper base
(see THQ_EXHIBIT_STYLE_GUIDE.md) — editorial, restrained, hairline rules,
serif headline, monospace numerals. No stat cards, borders, or shadows.
"""

from __future__ import annotations

import os

import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
import streamlit as st

import data_generator

# --- THQ Exhibit Style: light theme tokens (style guide §4) ---------------
BG = "#f6f4ef"     # warm paper canvas
PANEL = "#efeae0"  # sidebar / secondary surface
INK = "#141c26"    # headline line 1, key numbers
SEC = "#4b5867"    # deck copy, axis labels
MUT = "#8b95a2"    # eyebrow, footer, muted annotations
RULE = "#e2ddd2"   # hairlines, chart spines
A1 = "#0f8f83"     # primary series / primary claim (deep teal)
A2 = "#a9781a"     # secondary / contrast series (gold)
STEEL = "#5c7086"  # neutral marks
GRID = "#ece7db"   # faint chart gridlines
DASH = "#c7c0b2"   # reference / threshold lines

# Qualitative order is fixed so multi-series charts read as a system (§5).
ACCENTS = ["#0f8f83", "#a9781a", "#b04a5c", "#5c66c2", "#5f8f52"]

# Font stacks. Numbers are always monospace, no exceptions (§3).
SERIF = "'Lora', Georgia, 'Times New Roman', serif"
SANS = "-apple-system, BlinkMacSystemFont, 'Helvetica Neue', 'Segoe UI', Arial, sans-serif"
MONO = "ui-monospace, 'SF Mono', 'DejaVu Sans Mono', Menlo, Consolas, monospace"

SOURCE_COLORS = {
    "Transfer Center (External Facility)": A1,
    "Emergency Department": A2,
}
LEVEL_ORDER = ["ICU", "Stepdown / Intermediate", "Telemetry", "Med-Surg / Acute"]

DATA_PATH = "data/transfer_center_encounters.csv"

st.set_page_config(
    page_title="Transfer Center | Patient Placement Analytics",
    page_icon=":material/monitor_heart:",
    layout="wide",
)

# --- CSS: carry the THQ system into Streamlit's chrome -------------------
st.markdown(
    f"""
    <style>
    @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,500;0,600;1,500&display=swap');

    .stApp {{ background-color: {BG}; }}
    section[data-testid="stSidebar"] {{
        background-color: {PANEL};
        border-right: 1px solid {RULE};
    }}
    .block-container {{ padding-top: 2.4rem; max-width: 1200px; }}

    /* Body / deck / labels: Helvetica-like sans (§3) */
    html, body, .stApp, .stApp p, .stApp label, .stApp span, .stApp li,
    [data-testid="stMarkdownContainer"] {{
        font-family: {SANS};
        color: {INK};
    }}

    /* Section titles: serif, restrained (§3) */
    .stApp h1, .stApp h2, .stApp h3, .stApp h4 {{
        font-family: {SERIF};
        color: {INK};
        font-weight: 600;
        letter-spacing: 0;
    }}
    .stApp h2 {{ font-size: 1.3rem; margin: 0.6rem 0 0.2rem; }}
    .stApp h3 {{ font-size: 1.05rem; }}

    /* Masthead: eyebrow row, hairline, two-line serif headline, deck */
    .thq-eyebrow {{
        display: flex; justify-content: space-between;
        font-family: {MONO}; font-size: 0.70rem; font-weight: 600;
        letter-spacing: 0.28em; text-transform: uppercase; color: {MUT};
    }}
    .thq-rule {{ border: 0; border-top: 1px solid {RULE}; margin: 0.55rem 0 1.1rem; }}
    .thq-headline {{
        font-family: {SERIF}; font-size: 2.0rem; line-height: 1.18;
        font-weight: 600; color: {INK}; margin: 0;
    }}
    .thq-headline .l2 {{ color: {A1}; }}
    .thq-deck {{
        color: {SEC}; font-size: 0.97rem; line-height: 1.5;
        max-width: 66ch; margin-top: 0.55rem;
    }}

    /* KPI strip: no cards, no borders, no shadows — hairline-topped blocks
       with monospace numerals (§1, §3) */
    .kpi-label {{
        color: {MUT}; font-size: 0.68rem; font-weight: 600;
        letter-spacing: 0.14em; text-transform: uppercase; margin-bottom: 0.35rem;
    }}
    .kpi-value {{
        color: {INK}; font-family: {MONO};
        font-size: 1.55rem; font-weight: 500; line-height: 1.1; letter-spacing: -0.01em;
    }}
    /* Two-cohort comparison: one row per source, colour-keyed to the charts */
    .kpi-pair {{ display: flex; align-items: baseline; gap: 0.4rem; margin-bottom: 0.15rem; }}
    .kpi-pair .num {{
        font-family: {MONO}; font-size: 1.4rem; font-weight: 500;
        line-height: 1.2; letter-spacing: -0.01em;
    }}
    .kpi-pair .tag {{
        font-family: {SANS}; font-size: 0.63rem; font-weight: 600;
        letter-spacing: 0.12em; text-transform: uppercase;
    }}
    .kpi-sub {{ color: {SEC}; font-size: 0.77rem; margin-top: 0.35rem; }}

    /* Monospace numerals in the detail table */
    [data-testid="stDataFrame"] {{ font-family: {MONO}; }}

    .thq-foot {{
        color: {MUT}; font-size: 0.74rem; letter-spacing: 0.02em;
        border-top: 1px solid {RULE}; padding-top: 0.8rem; margin-top: 1.6rem;
    }}
    </style>
    """,
    unsafe_allow_html=True,
)


@st.cache_data
def load_data() -> pd.DataFrame:
    if not os.path.exists(DATA_PATH):
        os.makedirs("data", exist_ok=True)
        data_generator.generate().to_csv(DATA_PATH, index=False)
    df = pd.read_csv(DATA_PATH, parse_dates=["admit_datetime", "discharge_datetime"])
    df["admit_month"] = df["admit_datetime"].dt.to_period("M").dt.to_timestamp()
    return df


def style_fig(fig: go.Figure, height: int = 360) -> go.Figure:
    fig.update_layout(
        paper_bgcolor=BG,
        plot_bgcolor=BG,
        colorway=ACCENTS,
        font=dict(color=SEC, family=SANS, size=13),
        margin=dict(l=8, r=8, t=34, b=8),
        height=height,
        legend=dict(
            orientation="h", yanchor="bottom", y=1.02, x=0,
            font=dict(family=SANS, size=12, color=SEC),
        ),
    )
    axis = dict(
        gridcolor=GRID,
        zerolinecolor=RULE,
        linecolor=RULE,
        tickfont=dict(family=MONO, size=11, color=MUT),  # numbers are mono (§3)
        title_font=dict(family=SANS, size=12, color=SEC),
    )
    fig.update_xaxes(**axis)
    fig.update_yaxes(**axis)
    return fig


df = load_data()

# --- Masthead ------------------------------------------------------------
st.markdown(
    """
    <div class="thq-eyebrow"><span>The Homan Quant</span><span>Patient Placement</span></div>
    <hr class="thq-rule"/>
    <div class="thq-headline">Transfer Center vs. Emergency Department<br/>
      <span class="l2">inpatient placement analytics</span></div>
    <div class="thq-deck">Encounters that arrive through the transfer center (external
      facility transfers) compared against emergency department admits, across hospital
      service, level of care, and length of stay.</div>
    """,
    unsafe_allow_html=True,
)
st.markdown("<hr class='thq-rule'/>", unsafe_allow_html=True)

# --- Sidebar filters ---------------------------------------------------
with st.sidebar:
    st.header("Filters")
    services = st.multiselect(
        "Hospital service", sorted(df["hospital_service"].unique()),
        default=sorted(df["hospital_service"].unique()),
    )
    levels = st.multiselect(
        "Level of care", LEVEL_ORDER, default=LEVEL_ORDER,
    )
    pclass = st.multiselect(
        "Patient class", sorted(df["patient_class"].unique()),
        default=sorted(df["patient_class"].unique()),
    )
    min_d = df["admit_datetime"].min().date()
    max_d = df["admit_datetime"].max().date()
    date_range = st.date_input(
        "Admit date range", value=(min_d, max_d),
        min_value=min_d, max_value=max_d,
    )
    st.caption("Synthetic data. No real PHI. See README for Epic field mapping.")

# Apply filters
f = df[
    df["hospital_service"].isin(services)
    & df["level_of_care"].isin(levels)
    & df["patient_class"].isin(pclass)
].copy()
if isinstance(date_range, (list, tuple)) and len(date_range) == 2:
    lo, hi = pd.Timestamp(date_range[0]), pd.Timestamp(date_range[1]) + pd.Timedelta(days=1)
    f = f[(f["admit_datetime"] >= lo) & (f["admit_datetime"] < hi)]

if f.empty:
    st.warning("No encounters match the current filters. Widen the selection.")
    st.stop()

# --- KPI row ----------------------------------------------------------
total = len(f)
xfer = f[f["admission_source"] == "Transfer Center (External Facility)"]
ed = f[f["admission_source"] == "Emergency Department"]
xfer_pct = len(xfer) / total * 100 if total else 0
median_los_xfer = xfer["los_days"].median() if len(xfer) else 0
median_los_ed = ed["los_days"].median() if len(ed) else 0
icu_rate_xfer = (xfer["level_of_care"] == "ICU").mean() * 100 if len(xfer) else 0
icu_rate_ed = (ed["level_of_care"] == "ICU").mean() * 100 if len(ed) else 0


def kpi(col, label, value, sub):
    col.markdown(
        f"<div class='kpi-label'>{label}</div>"
        f"<div class='kpi-value'>{value}</div>"
        f"<div class='kpi-sub'>{sub}</div>",
        unsafe_allow_html=True,
    )


def kpi2(col, label, v_xfer, v_ed, sub):
    """Comparison KPI: transfer on top in teal, ED below in gold — same
    colour key as every chart legend, so the two numbers are unambiguous."""
    col.markdown(
        f"<div class='kpi-label'>{label}</div>"
        f"<div class='kpi-pair'><span class='num' style='color:{A1}'>{v_xfer}</span>"
        f"<span class='tag' style='color:{A1}'>transfer</span></div>"
        f"<div class='kpi-pair'><span class='num' style='color:{A2}'>{v_ed}</span>"
        f"<span class='tag' style='color:{A2}'>ED</span></div>"
        f"<div class='kpi-sub'>{sub}</div>",
        unsafe_allow_html=True,
    )


c1, c2, c3, c4 = st.columns(4)
kpi(c1, "Total encounters", f"{total:,}",
    f"<span style='color:{A1}'>{len(xfer):,} transfer</span> &middot; "
    f"<span style='color:{A2}'>{len(ed):,} ED</span>")
kpi(c2, "Via transfer center", f"{xfer_pct:.0f}%", "share of inpatient admits")
kpi2(c3, "Median LOS", f"{median_los_xfer:.1f}d", f"{median_los_ed:.1f}d",
     "unadjusted for case mix")
kpi2(c4, "ICU level of care", f"{icu_rate_xfer:.0f}%", f"{icu_rate_ed:.0f}%",
     "share of each source's encounters")

st.markdown("<hr class='thq-rule'/>", unsafe_allow_html=True)

# --- Row 1: volume trend + level of care mix -------------------------
r1c1, r1c2 = st.columns([3, 2])

with r1c1:
    st.subheader("Monthly volume by admission source")
    vol = (
        f.groupby(["admit_month", "admission_source"])
        .size().reset_index(name="encounters")
    )
    fig = px.line(
        vol, x="admit_month", y="encounters", color="admission_source",
        color_discrete_map=SOURCE_COLORS, markers=True,
    )
    fig.update_layout(legend_title_text="", xaxis_title="", yaxis_title="Encounters")
    st.plotly_chart(style_fig(fig), width="stretch")

with r1c2:
    st.subheader("Level of care mix")
    loc = (
        f.groupby(["admission_source", "level_of_care"])
        .size().reset_index(name="n")
    )
    loc["pct"] = loc.groupby("admission_source")["n"].transform(lambda s: s / s.sum() * 100)
    fig = px.bar(
        loc, x="pct", y="level_of_care", color="admission_source",
        orientation="h", barmode="group", color_discrete_map=SOURCE_COLORS,
        category_orders={"level_of_care": LEVEL_ORDER},
    )
    fig.update_layout(legend_title_text="", xaxis_title="% of source cohort", yaxis_title="")
    st.plotly_chart(style_fig(fig), width="stretch")

# --- Row 2: service line mix ----------------------------------------
st.subheader("Service line mix by admission source")
svc = f.groupby(["hospital_service", "admission_source"]).size().reset_index(name="n")
svc["pct"] = svc.groupby("admission_source")["n"].transform(lambda s: s / s.sum() * 100)
fig = px.bar(
    svc, x="hospital_service", y="pct", color="admission_source",
    barmode="group", color_discrete_map=SOURCE_COLORS,
)
fig.update_layout(legend_title_text="", xaxis_title="", yaxis_title="% of source cohort")
fig.update_xaxes(tickangle=-35)
st.plotly_chart(style_fig(fig, height=420), width="stretch")

# --- Row 3: the key LOS view, stratified by level of care ------------
st.subheader("Length of stay: the comparison that controls for acuity")
st.markdown(
    "<div class='thq-deck'>Transfers run higher acuity, so an overall LOS gap is partly "
    "just case mix. Stratifying by level of care shows whether transfers stay longer "
    "<i>at the same level of care</i>.</div>",
    unsafe_allow_html=True,
)
st.write("")

r3c1, r3c2 = st.columns(2)

with r3c1:
    st.markdown("#### Median LOS by level of care")
    med = (
        f.groupby(["level_of_care", "admission_source"])["los_days"]
        .median().reset_index()
    )
    fig = px.bar(
        med, x="level_of_care", y="los_days", color="admission_source",
        barmode="group", color_discrete_map=SOURCE_COLORS,
        category_orders={"level_of_care": LEVEL_ORDER},
    )
    fig.update_layout(legend_title_text="", xaxis_title="", yaxis_title="Median LOS (days)")
    st.plotly_chart(style_fig(fig), width="stretch")

with r3c2:
    st.markdown("#### LOS distribution (box plot)")
    fig = px.box(
        f, x="level_of_care", y="los_days", color="admission_source",
        color_discrete_map=SOURCE_COLORS,
        category_orders={"level_of_care": LEVEL_ORDER},
    )
    fig.update_layout(legend_title_text="", xaxis_title="", yaxis_title="LOS (days)")
    st.plotly_chart(style_fig(fig), width="stretch")

# --- Detail table + download ---------------------------------------
with st.expander("Encounter-level detail and download"):
    show = f[[
        "encounter_csn", "patient_age", "admission_source", "referring_facility",
        "hospital_service", "level_of_care", "patient_class",
        "admit_datetime", "discharge_datetime", "los_days",
    ]].sort_values("admit_datetime", ascending=False)
    st.dataframe(show, width="stretch", height=320)
    st.download_button(
        "Download filtered extract (CSV)",
        show.to_csv(index=False).encode("utf-8"),
        file_name="transfer_center_filtered.csv",
        mime="text/csv",
    )

with st.expander("Epic data mapping (where these fields come from)"):
    st.markdown(
        """
This demo runs on a synthetic extract, but every column maps to a real Epic
reporting concept so it would plug into a live pull with minimal remapping:

| Dashboard field | Epic source (Clarity / Caboodle) |
|---|---|
| `encounter_csn` | `PAT_ENC_HSP.PAT_ENC_CSN_ID` (Contact Serial Number) |
| `admission_source` | Admission source / point of origin; transfer center flag from the Transfer Center (Grand Central) module |
| `hospital_service` | `CLARITY_ADT` / hospital service (treatment team) |
| `level_of_care` | Bed / accommodation level of care from ADT bed movements |
| `patient_class` | `PAT_ENC_HSP` patient class (Inpatient vs Observation) |
| `admit_datetime` / `discharge_datetime` | `PAT_ENC_HSP.HOSP_ADMSN_TIME` / `HOSP_DISCH_TIME` |
| `los_days` | Derived: discharge minus admit |
| `referring_facility` | Transferring facility captured in the transfer center workflow |

In Caboodle, the same lives in dimensional form (e.g. `HospitalAdmissionFact`
with `AdmissionSourceDim`, `DepartmentDim`, and date dimensions).
        """
    )

st.markdown(
    "<div class='thq-foot'>The Homan Quant &middot; synthetic demonstration data "
    "&middot; not for clinical use</div>",
    unsafe_allow_html=True,
)
