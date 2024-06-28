# Release Notifier Action

[![Push Events](https://github.com/agrc/release-notifier-action/actions/workflows/push.yml/badge.svg)](https://github.com/agrc/release-notifier-action/actions/workflows/push.yml)

[![Release Events](https://github.com/agrc/release-notifier-action/actions/workflows/release.yml/badge.svg)](https://github.com/agrc/release-notifier-action/actions/workflows/release.yml)

This action posts a comment on related closed or fixed issues after a release is published with a link to the release. For example:

```markdown
🥳 This issue is included in [v1.0.0](https://github.com/agrc/release-notifier-action/releases/tag/v1.0.0)
```

## Usage

```yaml
uses: agrc/release-notifier-action@v1
with:
  repo-token: ${{ secrets.GITHUB_TOKEN }}
```

## Package for distribution

This action is built and distributed via the included GitHub action workflows.
