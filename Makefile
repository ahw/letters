all:
	browserify main.js | uglifyjs > main.bundled.js
	cleancss style.css > style.min.css

clean:
	rm -f main.bundled.js
	rm -f style.min.css
