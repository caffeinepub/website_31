# Specification

## Summary
**Goal:** Add a Pregnant Women module to the Smart Anganwadi app, enabling staff to register and track pregnant women's health data.

**Planned changes:**
- Add a `PregnantWoman` backend data model with fields for personal info, LMP, EDD, gestational age, vitals (weight, hemoglobin, blood pressure), trimester, risk level, and visit history
- Add a "Pregnant Women" tab to both desktop and mobile navigation
- Create a `PregnantWomenPage` with summary cards (total count, by trimester, by risk level), a searchable/filterable list, and forms for registering a new woman or recording a new visit
- Create a `PregnantWomanCard` component with collapsed (name, gestational age, trimester badge, color-coded risk level badge, EDD) and expanded (visit history, latest vitals) states
- Add seed data for at least 5 pregnant women across different trimesters and risk levels, each with at least 2 visit history entries, in `pregnantWomenData.ts`
- Add gestational calculation utilities in `gestationalCalculations.ts` for computing gestational age in weeks, trimester classification, and EDD from LMP date

**User-visible outcome:** Staff can navigate to a new "Pregnant Women" section, view a dashboard of registered pregnant women categorized by trimester and risk level, register new women, and log follow-up visit data including weight, blood pressure, and hemoglobin.
