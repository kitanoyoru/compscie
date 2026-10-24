PYTHON ?= python3
ORGANIZE := $(PYTHON) tools/organize.py
NOTES := $(PYTHON) tools/notes.py

.DEFAULT_GOAL := help
.PHONY: help hooks topic note readme organize apply lint lint-fix pretty

help: ## Show this help
	@awk 'BEGIN {FS = ":.*?## "} \
		/^##@/ {printf "\n\033[1m%s\033[0m\n", substr($$0, 5)} \
		/^[a-zA-Z_-]+:.*?## / {printf "  \033[36m%-10s\033[0m %s\n", $$1, $$2}' \
		$(MAKEFILE_LIST)

##@ Setup

hooks: ## Install git hooks: every commit dates new notes and rebuilds READMEs
	@git config core.hooksPath .githooks
	@echo "hooks installed from .githooks/"

##@ Notes

topic: ## New topic from notes/_template (NAME=clickhouse)
	@$(NOTES) new-topic "$(NAME)"

note: ## New note in a topic (TOPIC=clickhouse NOTE=data-part)
	@$(NOTES) new-note "$(TOPIC)" "$(NOTE)"

readme: ## Date new notes and regenerate READMEs (the pre-commit hook runs this)
	@$(NOTES) sync

##@ LeetCode

organize: ## Preview how loose problem folders would be filed (dry run)
	@$(ORGANIZE)

apply: ## File problem folders by difficulty and refresh READMEs
	@$(ORGANIZE) --apply

##@ Quality

lint: ## Run the same format-checks as CI (gofmt/rustfmt/ruff/google-java-format/prettier)
	@bash tools/lint.sh

lint-fix: ## Same checks, but let each formatter rewrite badly formatted files
	@bash tools/lint.sh --fix

pretty: ## Format the whole repo with prettier
	@yarn pretty
