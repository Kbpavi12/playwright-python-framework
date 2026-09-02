---
description: Guidelines for Playwright test automation generation and execution
---

# Playwright Test Automation Instructions

## Objective

Generate, maintain, and execute Playwright test scripts efficiently, reliably, and securely.

## General Rules

- Use Playwright as the primary automation framework.
- Implement automation step-by-step.
- Do not skip validation steps.
- Use stable locators whenever possible.
- Prefer:
  - data-testid
  - id
  - aria-label
  - role
- Avoid fragile XPath selectors unless no alternative exists.

## Test Creation

When creating a test:

1. Understand the business scenario first.
2. Break the scenario into logical steps.
3. Generate reusable functions when appropriate.
4. Follow Page Object Model (POM) patterns for larger test suites.
5. Add meaningful assertions.
6. Handle waits correctly using Playwright wait mechanisms.

Do NOT:
- Use hard-coded waits (waitForTimeout) unless explicitly required.
- Use random delays.
- Generate flaky selectors.

## Test Execution

Before execution:

- Verify application URL accessibility.
- Verify required environment configuration.
- Verify authentication requirements.
- Verify test data availability.

During execution:

- Execute one major step at a time.
- Report progress clearly.
- Capture screenshots on failures.
- Capture console errors when failures occur.

After execution:

- Summarize:
  - Passed steps
  - Failed steps
  - Blocked steps
  - Screenshots collected
  - Recommended fixes

## Blockers

If blocked:

- Stop execution at the failing step.
- Clearly explain:
  - Root cause
  - Affected functionality
  - Possible resolution

Examples:

- Element not found
- Iframe not loaded
- Authentication failure
- API unavailable
- Network issue
- Permission issue

Do not repeatedly retry the same failing step.

## Salesforce Experience Cloud / Agentforce

When automating Salesforce websites:

- Check if the target element is inside an iframe.
- Use frameLocator when required.
- Wait for embeddedMessagingFrame to load completely.
- Verify chat widget visibility before interacting.
- Verify user authentication state before executing customer-specific actions.

For Agentforce conversations:

- Validate agent readiness.
- Wait for response completion.
- Capture agent response text.
- Report if the agent requests additional user information.

## MCP Execution

When using Playwright MCP:

- Prefer browser interaction over code generation when validating UI behavior.
- Explain actions before executing them.
- Report each completed action.
- Report blockers immediately.

## Performance Guidelines

If execution appears slow:

- Use fast mode where possible.
- Reduce redundant page reloads.
- Reuse browser sessions.
- Avoid repeated authentication.
- Avoid unnecessary screenshots.

Always prefer the quickest reliable path.

## Security

Immediately flag:

- Hardcoded passwords
- API keys
- Access tokens
- Client secrets
- OAuth credentials
- Personally identifiable information

Never expose secrets in generated code.

Replace secrets with:

- Environment variables
- Secure vault references
- Configuration files

## Test Data

Use:

- Mock data
- Non-production data
- Sanitized customer records

Do not use real customer information.

## Reporting Format

For every execution provide:

### Test Summary
- Scenario
- Result
- Execution Time

### Passed
- Step list

### Failed
- Step list

### Blocked
- Step list

### Security Observations
- Any risks found

### Recommendations
- Suggested fixes
- Stability improvements

## Communication

- Be concise.
- Inform immediately when blocked.
- Suggest alternatives when a failure occurs.
- If a task is expected to take significant time, identify ways to accelerate execution.
- Do not continue blindly after critical failures.