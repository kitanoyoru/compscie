PYTHON ?= python3
ORGANIZE := $(PYTHON) tools/organize.py

.DEFAULT_GOAL := help
.PHONY: help organize apply migrate readme pretty lint

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## ' $(MAKEFILE_LIST) \
		| awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-10s\033[0m %s\n", $$1, $$2}'

organize: ## Preview how loose problem folders would be filed (dry run)
	@$(ORGANIZE)

apply: ## File problem folders by difficulty and refresh both READMEs
	@$(ORGANIZE) --apply

migrate: ## One-time restructure: file everything, drop codeforces/ and codewars/
	@$(ORGANIZE) --apply --drop-legacy

readme: ## Regenerate both READMEs without moving anything
	@$(ORGANIZE) --apply --no-move

pretty: ## Format the repo with prettier
	@yarn pretty

lint: ## Run the same format-checks as CI (gofmt/rustfmt/ruff/prettier/google-java-format)
	@bash -c 'source tools/lint-collect-files.sh; \
		collect_files leetcode structures -name "*.go"; \
		bad=$$(gofmt -l "$${FILES[@]}"); \
		[ -z "$$bad" ] || { echo "gofmt:"; echo "$$bad"; exit 1; }; \
		collect_files leetcode structures -name "*.rs"; \
		rustfmt --check --edition 2021 "$${FILES[@]}"; \
		collect_files leetcode -name "*.py"; \
		ruff format --check "$${FILES[@]}"; \
		collect_files leetcode \( -name "*.ts" -o -name "*.js" \); \
		npx --yes prettier@2.7.1 --check "$${FILES[@]}"'
	@echo "Java: download google-java-format and run --dry-run --set-exit-if-changed (see .github/workflows/lint.yml)"
