.PHONY: default redeploy deploy build

default: build

redeploy: build deploy

deploy:
	docker ps | grep ferrytimetableapp && docker stop ferrytimetableapp || echo 'Not running'
	sleep 1 && docker run --rm -d -p 6363:80 --name ferrytimetableapp abjugard/ferrytimetableapp

build:
	docker build -t abjugard/ferrytimetableapp .