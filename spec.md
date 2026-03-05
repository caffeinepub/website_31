# Smart Anganwadi – Advanced BMI Calculator Upgrade

## Current State
The app is a Smart Anganwadi platform with modules for child growth monitoring, attendance, parent view, worker dashboard, and pregnant women tracking. The app has a basic BMI calculation embedded in the children/adult assessment flow but lacks advanced BMI-specific analytics. The Motoko backend stores pregnancy records and child growth data but has no BMI history table.

## Requested Changes (Diff)

### Add
- New `BMI Calculator` tab in navigation (alongside existing tabs)
- New `BmiCalculatorPage` with a full dashboard layout
- Backend: `BmiRecord` type with fields: name, age, gender, height, weight, bmi, timestamp
- Backend: `saveBmiRecord()` – store a new BMI entry
- Backend: `getBmiHistory()` – retrieve all BMI records for trend chart
- Frontend: BMI input form (name, age, gender, height, weight, activity level)
- BMI Trend Chart: line chart (x=date, y=BMI) using recharts/shadcn chart
- Ideal Weight Suggestion card: min/max healthy weight, difference from ideal
- Body Fat Percentage card: formula-based estimate (men/women), category label
- Calorie Needs card: BMR via Mifflin-St Jeor × activity multiplier, daily kcal
- BMI History Log: table of past records with name, age, gender, height, weight, BMI, date; comparison delta vs previous
- Risk Alert banner: color-coded warning per BMI category (Underweight/Normal/Overweight/Obese), red highlight for critical
- Progress bar showing BMI on scale 10–40

### Modify
- `App.tsx`: add `"bmi-calculator"` to `AppTab` union and route to new page
- `Layout.tsx`: add BMI Calculator nav item with calculator icon
- `BottomNavigation.tsx`: add BMI Calculator icon

### Remove
- Nothing removed from existing modules

## Implementation Plan
1. Update Motoko backend: add `BmiRecord` type, `saveBmiRecord`, `getBmiHistory` functions
2. Create `BmiCalculatorPage.tsx` with:
   - Input form (name, age, gender, height, weight, activity level)
   - On submit: compute BMI, body fat %, ideal weight range, BMR/calorie needs; save to backend
   - Risk Alert banner (color-coded)
   - BMI progress bar on 10–40 scale
   - Ideal Weight Suggestion card
   - Body Fat Percentage card
   - Calorie Needs card
   - BMI Trend Chart (line chart from history)
   - BMI History Log table with comparison delta
3. Wire backend calls (saveBmiRecord, getBmiHistory) using backend.ts bindings
4. Update App.tsx, Layout.tsx, BottomNavigation.tsx to include new tab
