PYTHON ?= python3
ORGANIZE := $(PYTHON) tools/organize.py

.DEFAULT_GOAL := help
.PHONY: help organize apply migrate readme pretty lint lint-fix

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

lint: ## Run the same format-checks as CI (gofmt/rustfmt/ruff/google-java-format/prettier)
	@bash tools/lint.sh

lint-fix: ## Same checks, but let each formatter rewrite badly formatted files
	@bash tools/lint.sh --fix
