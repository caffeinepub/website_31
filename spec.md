# Smart Anganwadi

## Current State
A multi-module ICDS digital platform with 6 tabs: Dashboard, Growth Monitoring, Attendance, Parent View, Pregnant Women, BMI Calculator. The app is feature-rich but visually complex with many components, cards, and dense information.

## Requested Changes (Diff)

### Add
- Nothing new

### Modify
- Simplify overall UI: reduce visual clutter, improve whitespace, cleaner card styles
- Simplify navigation: consolidate labels, reduce visual weight of nav
- Simplify each page: remove redundant headers/descriptions, streamline layouts
- Simplify WorkerDashboard: cleaner stats cards, less decorative elements
- Simplify BmiCalculatorPage: cleaner form layout, less nested visual complexity
- Simplify all pages: consistent minimal style, easier to read at a glance

### Remove
- Excessive decorative elements and icon containers
- Redundant subtitles and descriptions on page headers
- Overly nested card structures where a simpler layout suffices

## Implementation Plan
1. Simplify Layout.tsx - cleaner header, simpler nav
2. Simplify BottomNavigation.tsx - cleaner mobile nav
3. Simplify WorkerDashboard.tsx - remove excess decoration
4. Simplify BmiCalculatorPage.tsx - cleaner form and results
5. Review and simplify other pages for consistency
