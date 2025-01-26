npm:
	cd $(dir) && npm run $(task)

for-each:
	make npm task=$(task) dir=react
	make npm task=$(task) dir=vscode/ext
	make npm task=$(task) dir=vscode/ui
	make npm task=$(task) dir=examples/gillian-debugging

lint:
	make for-each task=lint

build:
	make for-each task=build
