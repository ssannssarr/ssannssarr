---
name: GitHub Workflow Debug
description: Systematic approach to debug failing GitHub Actions workflows by checking permissions, configuration, and push requirements
source: auto-skill
extracted_at: '2026-06-29T08:42:49.355Z'
---

When a GitHub Actions workflow isn't working, follow this systematic debugging approach:

## Procedure

1. **Check workflow file syntax** - Ensure YAML is valid and indentation is correct

2. **Verify permissions** - Ensure the workflow has necessary permissions:
   - `contents: write` for checkout and pushing changes
   - `pages: write` for GitHub Pages actions
   - `id-token: write` for OIDC authentication

3. **Add job-level permissions** - Some actions require permissions at the job level, not just workflow level

4. **Check token configuration** - Ensure `GITHUB_TOKEN` is properly passed to actions that need it

5. **Verify branch requirements** - Check if target branch exists and if branch protection rules allow the push

6. **Test with manual dispatch** - Use `workflow_dispatch` to manually trigger and see detailed error messages

## Common Fixes

- Missing `pages: write` permission for GitHub Pages actions
- Missing `id-token: write` for OIDC authentication
- Not passing explicit `token` to checkout step
- Missing `fetch-depth: 0` for actions that need full history