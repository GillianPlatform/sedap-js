build:
	make for-each task="run build"

lint:
	make for-each task="run lint"

install:
	make for-each-extra task=i

for-each-extra:
	make for-each task="$(task)"
	make npm task="$(task)" dir=types
	make npm task="$(task)" dir=vscode/types

for-each:
	make npm task="$(task)" dir=react
	make npm task="$(task)" dir=vscode/ext
	make npm task="$(task)" dir=vscode/ui
	make npm task="$(task)" dir=examples/gillian-debugging

npm:
	cd $(dir) && npm $(task)
