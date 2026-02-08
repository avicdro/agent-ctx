# [2.0.0](https://github.com/avicdro/agent-ctx/compare/v1.0.1...v2.0.0) (2026-02-08)


* build!: drop node 18 support, require node 20+ ([42e0b5d](https://github.com/avicdro/agent-ctx/commit/42e0b5ddbee992d8d72135a415433d4a854fe671))


### Bug Fixes

* **ci:** update node.js to 24.x for semantic-release compatibility ([11111f9](https://github.com/avicdro/agent-ctx/commit/11111f99292ba560a99b0dc977c0b9cb05970937))
* **ci:** use registry-url for npm authentication ([1d85744](https://github.com/avicdro/agent-ctx/commit/1d857445a19da6e282a238c3662973ffcc7e46cf))
* minor code quality improvements (comments, imports, nvmrc) ([80af72f](https://github.com/avicdro/agent-ctx/commit/80af72fc0e4a4da82f28bd00550a025f37401319))
* remove NODE_AUTH_TOKEN/registry-url to enforce OIDC trusted publishing ([5b068d5](https://github.com/avicdro/agent-ctx/commit/5b068d5e89662cc99349ba876dbf256fb778c75c))


### Features

* add i18n to update cmd & fix editors config storage ([30e19a6](https://github.com/avicdro/agent-ctx/commit/30e19a6c2f0f57ac1984aa158d097b4450a2c876))


### BREAKING CHANGES

* node 18 is no longer supported due to use of
import.meta.dirname which requires node 20.11+
