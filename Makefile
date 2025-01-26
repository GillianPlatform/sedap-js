npm-build:
	cd $(dir) && npm run build

build:
	make npm-build dir=react
	make npm-build dir=vscode/extension-utils
	make npm-build dir=vscode/ui-utils
	make npm-build dir=examples/gillian-debugging
