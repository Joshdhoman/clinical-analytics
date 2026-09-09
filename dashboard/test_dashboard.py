import unittest
from datetime import date
from pathlib import Path

import pandas as pd
from streamlit.testing.v1 import AppTest

from analytics import ED, TRANSFER, SOURCES, LEVELS, cohort_mix, filter_cohort, monthly_volume, prepare, source_summary
from data_generator import generate, SERVICES


class CohortTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.df = prepare(generate())

    def test_reproducible_and_temporally_valid(self):
        pd.testing.assert_frame_equal(generate(), generate())
        df = self.df
        self.assertEqual(len(df), 6000)
        self.assertTrue(df.encounter_csn.is_unique)
        self.assertTrue((df.discharge_datetime >= df.admit_datetime).all())
        derived = (df.discharge_datetime - df.admit_datetime).dt.total_seconds() / 86400
        self.assertLess((derived - df.los_days).abs().max(), 1 / 1440)
        self.assertEqual(df.admit_datetime.max().date(), date(2025, 12, 31))

    def test_dates_include_end_day_but_not_next_day(self):
        df = self.df.iloc[:3].copy()
        df['admit_datetime'] = pd.to_datetime(['2025-03-01 00:00', '2025-03-31 23:59', '2025-04-01 00:00'])
        actual = filter_cohort(df, SERVICES, LEVELS, ['Inpatient', 'Observation'], (date(2025, 3, 1), date(2025, 3, 31)))
        self.assertEqual(len(actual), 2)
        self.assertTrue(filter_cohort(df, SERVICES, LEVELS, ['Inpatient'], (date(2025, 3, 1),)).empty)

    def test_missing_source_is_not_zero_los(self):
        only_ed = self.df[self.df.source.eq(ED)]
        result = source_summary(only_ed)
        self.assertEqual(result.loc[TRANSFER, 'encounters'], 0)
        self.assertTrue(pd.isna(result.loc[TRANSFER, 'median_los']))
        mix = cohort_mix(only_ed, 'level_of_care', LEVELS)
        self.assertTrue(mix.loc[mix.source.eq(TRANSFER), 'share'].isna().all())

    def test_mix_denominators_and_zero_months(self):
        mix = cohort_mix(self.df, 'level_of_care', LEVELS)
        for total in mix.groupby('source').share.sum():
            self.assertAlmostEqual(total, 100)
        jan = self.df[self.df.admit_datetime.dt.month.eq(1)]
        result = monthly_volume(jan, (date(2025, 1, 1), date(2025, 3, 31)))
        self.assertEqual(len(result), 6)
        self.assertEqual(result[result.admit_month.dt.month.eq(2)].encounters.sum(), 0)
        self.assertEqual(result.encounters.sum(), len(jan))


class AppTests(unittest.TestCase):
    def test_navigation_filters_search_and_reset(self):
        app = AppTest.from_file(str(Path(__file__).parent / 'app.py'), default_timeout=30).run()
        self.assertEqual(len(app.exception), 0)
        self.assertEqual(app.metric[0].value, '6,000')
        for view in ['Care mix', 'Length of stay', 'Encounter explorer', 'Methods', 'Overview']:
            app.radio(key='view').set_value(view).run()
            self.assertEqual(len(app.exception), 0, view)
        app.multiselect(key='services').set_value([]).run()
        self.assertEqual(len(app.metric), 0)
        self.assertIn('No encounters match', app.info[0].value)
        app.button[0].click().run()
        self.assertEqual(app.metric[0].value, '6,000')
        app.radio(key='view').set_value('Encounter explorer').run()
        app.text_input(key='search').set_value('does-not-exist').run()
        self.assertEqual(len(app.dataframe[0].value), 0)
        app.text_input(key='search').set_value('[').run()
        self.assertEqual(len(app.exception), 0)
        app.button[0].click().run()
        app.selectbox(key='detail_source').set_value(TRANSFER).run()
        self.assertTrue(app.dataframe[0].value.admission_source.eq('Transfer Center (External Facility)').all())


if __name__ == '__main__':
    unittest.main()
