npm:
	cd $(dir) && npm run $(task)

for-each:
	make npm task=$(task) dir=react
	make npm task=$(task) dir=vscode/extension-utils
	make npm task=$(task) dir=vscode/ui-utils
	make npm task=$(task) dir=examples/gillian-debugging

lint:
	make for-each task=lint

build:
	make for-each task=build
