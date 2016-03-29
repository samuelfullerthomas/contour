#Comment for this Makefile
.PHONY: bootstrap start;

bootstrap:
	@npm install

start:
	@node contour.js