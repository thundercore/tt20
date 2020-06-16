CONDA := $(HOME)/miniconda3/bin/conda

TOP_DIR := $(patsubst %/,%,$(dir $(realpath $(lastword $(MAKEFILE_LIST)))))
CONDA_ENV_DIR := $(TOP_DIR)/conda-env
CONDA_ENV_BIN_DIR := $(CONDA_ENV_DIR)/bin
NODE_MODULES_DIR := $(TOP_DIR)/node_modules
NODE_MODULES_BIN_DIR := $(NODE_MODULES_DIR)/.bin
export PATH := $(NODE_MODULES_BIN_DIR):$(CONDA_ENV_BIN_DIR):$(PATH)
-include Local.mk

.PHONY: path
path:
	@echo $(PATH)

.PHONY: conda-env
conda-env:
	if [ ! -d $(CONDA_ENV_DIR) ]; then \
		$(CONDA) env create -f environment.yml -p $(CONDA_ENV_DIR); \
	else \
		$(CONDA) env update -f environment.yml -p $(CONDA_ENV_DIR); \
	fi
	$(CONDA_ENV_BIN_DIR)/yarn install


PREFERRED_INTERACTIVE_SHELL ?= bash
PS1_NAME ?= 'tt20'
MAKE_SHELL_PS1 ?= '$(PS1_NAME) $$ '
.PHONY: shell
ifeq ($(PREFERRED_INTERACTIVE_SHELL),bash)
shell:
	@INIT_FILE=$(shell mktemp); \
	printf '[ -e $$HOME/.bashrc ] && source $$HOME/.bashrc\n' >> $$INIT_FILE; \
	printf 'export PATH="%s"\n' "$(PATH)" >> $$INIT_FILE; \
	printf 'PS1='"$(MAKE_SHELL_PS1) "'\n' >> $$INIT_FILE; \
	printf '[ -e Local.env ] && source Local.env\n' >> $$INIT_FILE; \
	$(PREFERRED_INTERACTIVE_SHELL) --init-file $$INIT_FILE || true
else ifeq ($(PREFERRED_INTERACTIVE_SHELL),fish)
shell:
	@INIT_FILE=$(shell mktemp); \
	printf 'if functions -q fish_right_prompt\n' > $$INIT_FILE; \
	printf '    functions -c fish_right_prompt __fish_right_prompt_original\n' >> $$INIT_FILE; \
	printf '    functions -e fish_right_prompt\n' >> $$INIT_FILE; \
	printf 'else\n' >> $$INIT_FILE; \
	printf '    function __fish_right_prompt_original\n' >> $$INIT_FILE; \
	printf '    end\n' >> $$INIT_FILE; \
	printf 'end\n' >> $$INIT_FILE; \
	printf 'function fish_right_prompt\n' >> $$INIT_FILE; \
	printf '    echo -n "($(PS1_NAME)) "\n' >> $$INIT_FILE; \
	printf '    __fish_right_prompt_original\n' >> $$INIT_FILE; \
	printf 'end\n' >> $$INIT_FILE; \
	$(PREFERRED_INTERACTIVE_SHELL) --init-command="source $$INIT_FILE" || true
else
shell:
	@$(PREFERRED_INTERACTIVE_SHELL) || true
endif
