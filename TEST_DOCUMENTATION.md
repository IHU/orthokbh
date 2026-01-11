# Integration Test Documentation

## Overview

Comprehensive integration tests for `ContentService.byRouteV20` from the Umbraco Delivery API.

## Test File Location

`src/app/[...slug]/page.test.ts`

## Running Tests

### Run all tests (watch mode)

```bash
npm test
```

### Run tests once

```bash
npm run test:run
```

### Run tests with UI

```bash
npm run test:ui
```

## Test Configuration

### Vitest Configuration (`vitest.config.ts`)

- **Environment**: Node (no DOM needed for API tests)
- **Setup Files**: `vitest.setup.ts` (configures environment variables)
- **Module Resolution**: Resolves `@ihu/umbraco-components` from source

### Environment Setup (`vitest.setup.ts`)

- Sets Umbraco API credentials
- Configures base URL
- Disables TLS verification for self-signed certificates

## Test Coverage

### 1. Root Path Handling (2 tests)

- ✅ Fetches root/home page with "/" path
- ✅ Fetches root page with empty path

### 2. Path Resolution (2 tests)

- ✅ Fetches content by valid route path with leading slash
- ✅ Handles nested routes correctly

### 3. Error Handling (3 tests)

- ✅ Throws 404 for non-existent routes
- ✅ Throws error for invalid path format
- ✅ Throws 401 when apiKey is missing

### 4. Content Expansion (2 tests)

- ✅ Expands properties when expand parameter is provided
- ✅ Respects fields parameter to limit returned properties

### 5. Language and Segment Variants (1 test)

- ✅ Accepts language parameter for multi-language content

### 6. Preview Mode (1 test)

- ✅ Supports preview parameter for draft content

### 7. Content Structure Validation (2 tests)

- ✅ Returns valid IApiContentResponseModel structure
- ✅ Returns properties matching ContentModel types

### 8. Performance and Caching (2 tests)

- ✅ Completes requests within reasonable time (< 5 seconds)
- ✅ Handles multiple concurrent requests

### 9. Real-world Route Scenarios (2 tests)

- ✅ Handles slug array to path conversion correctly
- ✅ Handles multi-segment paths

## Test Results

```
Test Files  1 passed (1)
Tests       17 passed (17)
Duration    ~800ms
```

## Key Testing Patterns

### 1. API Configuration

```typescript
beforeAll(() => {
  OpenAPI.BASE = baseUrl;
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
});
```

### 2. Basic API Call

```typescript
const response = await ContentService.byRouteV20({
  path: "/",
  apiKey,
  startItem,
});
```

### 3. Error Testing

```typescript
await expect(
  ContentService.byRouteV20({
    path: "/non-existent-page",
    apiKey,
    startItem,
  })
).rejects.toThrow();
```

### 4. Response Validation

```typescript
expect(response).toHaveProperty("id");
expect(response).toHaveProperty("name");
expect(response).toHaveProperty("contentType");
expect(response).toHaveProperty("route");
expect(response).toHaveProperty("properties");
```

## Testing Best Practices

### ✅ Do's

- Test against live Umbraco API for integration tests
- Use try-catch for route-specific tests (content may not exist)
- Test both success and error scenarios
- Validate response structure matches TypeScript types
- Test real-world usage patterns (slug arrays, nested paths)

### ❌ Don'ts

- Don't hardcode paths that may not exist
- Don't test specific content values (they may change)
- Don't skip error handling tests
- Don't test in jsdom environment for API-only tests

## Continuous Integration

Add to your CI/CD pipeline:

```yaml
# Example GitHub Actions
- name: Run Integration Tests
  run: npm run test:run
  env:
    NEXT_APP_UMBRACO_SITE_API_KEY: ${{ secrets.UMBRACO_API_KEY }}
    NEXT_APP_UMBRACO_START_ITEM: ${{ secrets.UMBRACO_START_ITEM }}
    NEXT_APP_UMBRACO_BASE_URL: ${{ secrets.UMBRACO_BASE_URL }}
```

## Extending Tests

### Add New Test Suite

```typescript
describe("New Feature Tests", () => {
  it("should test new feature", async () => {
    const response = await ContentService.byRouteV20({
      path: "/",
      apiKey,
      startItem,
      // Add new parameters here
    });

    expect(response).toBeDefined();
  });
});
```

### Test Custom Content Types

```typescript
it("should return custom property from StartPage", async () => {
  const response = await ContentService.byRouteV20({
    path: "/",
    apiKey,
    startItem,
  });

  const props = response.properties as Record<string, any>;
  expect(props.customProperty).toBeDefined();
});
```

## Troubleshooting

### Issue: Tests fail with connection errors

**Solution**: Ensure Umbraco server is running and accessible

### Issue: TLS certificate errors

**Solution**: Environment variable `NODE_TLS_REJECT_UNAUTHORIZED=0` is set in npm scripts

### Issue: 401 Unauthorized errors

**Solution**: Verify `apiKey` is correct in `vitest.setup.ts`

### Issue: 404 errors for specific paths

**Solution**: Update test paths to match actual Umbraco content structure

## Related Files

- `vitest.config.ts` - Test framework configuration
- `vitest.setup.ts` - Test environment setup
- `package.json` - Test scripts
- `src/app/[...slug]/page.tsx` - Production code using ContentService
- `packages/core/src/api/umbraco/services/ContentService.ts` - Service being tested
