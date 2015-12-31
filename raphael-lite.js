var _ = require('underscore');

function Path(d) {
    this.d = d;
    return this;
}

Path.prototype.attr = function(map) {
    var e = this;
    _.keys(map).forEach(function(key) {
        e[key] = map[key];
    });
    return e;
};

Path.prototype.toString = function() {
    var path = this;
    var attrs = _.map(_.keys(path), function(key) {
        return key + '="' + path[key] + '"';
    }).join(" ");
    var str = '<path ' + attrs + '/>';
    return str;
};

function Paper(id) {
    this.width = 0;
    this.height = 0;
    this.container = document.getElementById(id);
    this.paths = [];
    this.xmlns = 'http://www.w3.org/2000/svg';
    this.version = '1.1';
    this.viewBox = null;
}

Paper.prototype.path = function(str, options) {
    options = options || {};
    var p = new Path(str);
    if (options.topLayer) {
        this.paths.push(p);
    } else if (options.bottomLayer) {
        this.paths.unshift(p);
    } else {
        this.paths.push(p);
    }
    this.container.innerHTML = this.toString();
    return p;
};

Paper.prototype.setSize = function(width, height) {
    this.width = width;
    this.height = height;
    this.container.innerHTML = this.toString();
    return this;
};

Paper.prototype.toString = function() {
    var viewBox = this.viewBox ? 'viewBox="' + this.viewBox + '"' : "";
    var svg = '<svg version="' + this.version + '" xmlns="' + this.xmlns + '" width="' + this.width + '" height="' + this.height + '" ' + viewBox + ' preserveAspectRatio="xMidYMin meet">';
    svg += _.map(this.paths, function(path) {
        return path.toString();
    }).join('\n');
    svg  += '</svg>';
    return svg;
};

Paper.prototype.setViewBox = function(x, y, width, height) {
    // Assumed that if you want units attached to width and height you'll do
    // the string concatenation yourself (e.g., 10px).
    this.viewBox = x + " " + y + " " + width + " " + height;
};

Paper.prototype.getBoundingBoxSize = function() {
    var bottom = 0;
    var right = 0;
    // Assume the DOM structure is #container > svg > [path, ...]
    _.each(this.container.querySelector('svg').getElementsByTagName('path'), function(path) {
        // var rect = path.getClientBoundingBox();
        var rect = path.getBBox();
        right = _.max([right, rect.x + rect.width]);
        bottom = _.max([bottom, rect.y + rect.height]);
    });

    return {
        height: bottom,
        width: right
    };
};

function Raphael(id) {
    return new Paper(id);
}

module.exports = Raphael;
