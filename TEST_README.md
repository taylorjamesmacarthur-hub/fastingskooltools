# Fasting Skool Test Suite Documentation

## Overview
This document describes the comprehensive test suite for the Fasting Skool application, including unit tests for calculation functions and Playwright integration tests.

## Test Structure

```
fasting-skool/
├── client/src/lib/
│   ├── calculations.test.ts      # Unit tests for BMR/TDEE calculations
│   ├── mealPlanGenerator.test.ts # Unit tests for meal planning
│   └── macroTracking.test.ts     # Unit tests for macro tracking
├── client/src/test/
│   └── setup.ts                   # Test setup and configuration
├── tests/
│   └── fasting-app.spec.ts       # Playwright E2E integration tests
├── vitest.config.ts               # Vitest configuration
├── playwright.config.ts           # Playwright configuration
└── run-tests.sh                   # Test runner script
```

## Running Tests

### Quick Start

```bash
# Run all tests
./run-tests.sh all

# Run unit tests only
./run-tests.sh unit

# Run E2E tests only
./run-tests.sh e2e

# Open test UIs
./run-tests.sh unit:ui    # Vitest UI
./run-tests.sh e2e:ui     # Playwright UI
```

### Using NPX Commands Directly

```bash
# Unit Tests
npx vitest                 # Run in watch mode
npx vitest run            # Run once
npx vitest --ui           # Open UI
npx vitest run --coverage # With coverage

# E2E Tests
npx playwright test                # Run all E2E tests
npx playwright test --ui          # Open Playwright UI
npx playwright test --debug       # Debug mode
npx playwright test --headed      # Show browser
```

## Unit Tests

### 1. Calculations Tests (`calculations.test.ts`)

Tests the core calculation functions for the fasting app:

- **BMR Calculations**
  - Male/Female formulas (Mifflin-St Jeor equation)
  - Katch-McArdle formula with body fat percentage
  - Edge cases (very low/high weights, different ages)

- **TDEE Calculations**
  - Activity level multipliers (sedentary to very active)
  - Proper calorie scaling

- **Macro Distribution**
  - Balanced diet (30/40/30 protein/carbs/fat)
  - Low-carb diet (35/10/55)
  - High-protein diet (40/35/25)

- **Unit Conversions**
  - kg ↔ lbs conversions
  - cm ↔ inches conversions

- **Fasting Hours Calculation**
  - Normal eating windows (e.g., 12pm-8pm)
  - Overnight windows (e.g., 8pm-4am)
  - OMAD (One Meal A Day)

- **Calorie & Protein Targets**
  - Activity-adjusted calorie targets
  - Body weight-based protein requirements

- **Green Day Logic**
  - Meeting fasting/eating criteria
  - Step count requirements
  - Both/either rule handling

### 2. Meal Plan Generator Tests (`mealPlanGenerator.test.ts`)

Tests meal planning and food suggestion features:

- **Meal Distribution**
  - Calories across 1-4 meals per day
  - Time-based portion sizing
  - OMAD handling

- **Day Plan Generation**
  - Matching target calories (±5% tolerance)
  - Meeting protein targets
  - Diet type preferences (balanced, low-carb, high-protein)
  - Meal timing calculations

- **7-Day Plan Generation**
  - Consecutive day planning
  - Variety in protein sources
  - Consistent macro distribution

- **Meal Swapping**
  - Finding macro-equivalent alternatives
  - Category prioritization
  - Edge case handling

- **Recipe Filtering**
  - Category-based filtering
  - Tag-based filtering (vegetarian, keto, etc.)

### 3. Macro Tracking Tests (`macroTracking.test.ts`)

Tests real-time macro tracking and suggestions:

- **Remaining Macros Calculation**
  - On-track vs lagging detection
  - Exceeded status handling
  - Missing data handling

- **Protein Suggestions**
  - Efficiency-based sorting
  - Calorie budget filtering
  - Category variety

- **Nudge System**
  - Small/medium/large deficit handling
  - Time-based recommendations
  - Evening protein requirements

## Integration Tests (Playwright)

### Test A: Calculator Auto-Save Flow
1. Navigate to Calculator page
2. Enter user data (age, weight, height, sex, activity)
3. Calculate BMR/TDEE
4. Save calculation
5. Navigate to Profile
6. Verify saved values persist

### Test B: Meal Plan Generation Flow
1. Set up calculator data
2. Navigate to Planner
3. Configure meal preferences
4. Generate 7-day plan
5. Verify meal distribution
6. Test meal swapping functionality

### Test C: Logging Integration Flow
1. Set up baseline data
2. Navigate to Daily Log
3. Log breakfast meal
4. Verify remaining macros update
5. Trigger protein suggestions
6. Test quick-add functionality

### Test D: Mobile Responsiveness
1. Set mobile viewport
2. Test navigation menu
3. Verify form usability
4. Test touch interactions
5. Verify responsive layout

### Test E: Data Persistence
1. Save calculation data
2. Log daily entries
3. Refresh/new session
4. Verify data persists

### Test F: Error Handling
1. Test form validation
2. Invalid input handling
3. Range validation
4. API error simulation

## Test Data

### Sample User Profiles

```javascript
// Standard Male User
{
  age: 30,
  weight: 180, // lbs
  height: 70,  // inches
  sex: 'M',
  activity: 'moderate'
}
// Expected: BMR ~1729, TDEE ~2680

// Standard Female User
{
  age: 25,
  weight: 140,
  height: 65,
  sex: 'F',
  activity: 'light'
}
// Expected: BMR ~1394, TDEE ~1917
```

### Sample Meal Plans

```javascript
// High-Protein Day
{
  calories: 2000,
  protein: 150,  // 30%
  carbs: 200,    // 40%
  fat: 67        // 30%
}

// Low-Carb Day
{
  calories: 2000,
  protein: 175,  // 35%
  carbs: 50,     // 10%
  fat: 122       // 55%
}
```

## Coverage Goals

- **Unit Tests**: >80% code coverage for calculation functions
- **Integration Tests**: Cover all critical user flows
- **Edge Cases**: Handle invalid inputs, API errors, edge values

## CI/CD Integration

Tests can be integrated into CI/CD pipelines:

```yaml
# Example GitHub Actions workflow
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: npx playwright install
      - run: npm run test:run
      - run: npm run test:e2e
```

## Debugging Tests

### Unit Tests
```bash
# Debug specific test file
npx vitest calculations.test.ts

# Run with verbose output
npx vitest --reporter=verbose

# Run specific test suite
npx vitest -t "calcBMR"
```

### E2E Tests
```bash
# Debug mode with Playwright Inspector
npx playwright test --debug

# Specific test file
npx playwright test tests/fasting-app.spec.ts

# Specific test
npx playwright test -g "Calculator Auto-Save"

# With screenshots on failure
npx playwright test --screenshot=only-on-failure
```

## Best Practices

1. **Test Independence**: Each test should be independent and not rely on others
2. **Clear Assertions**: Use descriptive expect statements
3. **Realistic Data**: Use production-like test data
4. **Error Scenarios**: Test both success and failure paths
5. **Performance**: Keep tests fast by minimizing unnecessary waits
6. **Maintainability**: Use data-testid attributes for reliable element selection

## Troubleshooting

### Common Issues

1. **Playwright browsers not installed**
   ```bash
   npx playwright install
   ```

2. **Port conflicts**
   - Ensure port 5000 is available
   - Stop any running dev server

3. **Test timeouts**
   - Increase timeout in playwright.config.ts
   - Check for slow API responses

4. **Flaky tests**
   - Add proper wait conditions
   - Use waitForLoadState('networkidle')
   - Avoid hard-coded timeouts

## Future Enhancements

- [ ] Add visual regression testing
- [ ] Implement API mocking for faster tests
- [ ] Add performance benchmarks
- [ ] Create test data factories
- [ ] Add accessibility testing
- [ ] Implement cross-browser testing matrix

## Support

For issues or questions about the test suite, please refer to:
- Vitest Documentation: https://vitest.dev/
- Playwright Documentation: https://playwright.dev/
- Project README: ./README.md