var _ = require('underscore');
var qs = require('querystring');
var normal = require('box-muller');
var Raphael = require('./raphael-lite');
var letters = require('./letters');
var query = qs.parse(window.location.search.substring(1));


var xHeight = 6;
var capHeight = 11;
var defsCache = {};

function getCssColor(str) {
    if (/^[0-9a-f]{3}$/.test(str)) {
        return '#' + str;
    } else if (/^[0-9a-f]{6}$/.test(str)) {
        return '#' + str;
    } else if (/^[0-9a-f]{8}$/.test(str)) {
        // Opacity. Doesn't work right now. Whatever.
        return '#' + str;
    } else {
        return str;
    }
}

function getJitteredCoordinate(variance, pixelSize, pixelOffset, v) {
    return variance * normal() + v * pixelSize + pixelOffset;
}

function letter2svg(letter, opts) {
    var data = letters[letter];
    var height = data.pixelData.length;
    var width = _.max(_.map(data.pixelData, function(str) {
        return str.length;
    }));
    var blockOffsetX = opts.blockOffsetX || 0;
    var blockOffsetY = opts.blockOffsetY || 0;
    var pixelOffsetX = opts.pixelOffsetX || 0;
    var pixelOffsetY = opts.pixelOffsetY || 0;
    var PIXEL_SIZE = opts.pixelSize;
    var variance = opts.variance || 0;

    var getX = getJitteredCoordinate.bind(null, variance, PIXEL_SIZE, pixelOffsetX);
    var getY = getJitteredCoordinate.bind(null, variance, PIXEL_SIZE, pixelOffsetY);

    var pathData = []; // The SVG data
    for (var j = 0; j < height; j++) {
        for (var i = 0; i < width; i++) {
            if (data.pixelData[j].charAt(i) !== ' ') {
                var x = i + blockOffsetX;
                var y = j + blockOffsetY;
                // Draw a square
                pathData.push('M');
                pathData.push(getX(x));
                pathData.push(getY(y));
                pathData.push('L');
                pathData.push(variance * normal() + x * PIXEL_SIZE + PIXEL_SIZE + pixelOffsetX);
                pathData.push(getY(y));
                pathData.push('L');
                pathData.push(variance * normal() + x * PIXEL_SIZE + PIXEL_SIZE + pixelOffsetX);
                pathData.push(variance * normal() + y * PIXEL_SIZE + PIXEL_SIZE + pixelOffsetY);
                pathData.push('L');
                pathData.push(getX(x));
                pathData.push(variance * normal() + y * PIXEL_SIZE + PIXEL_SIZE + pixelOffsetY);
                pathData.push('L');
                pathData.push(getX(x));
                pathData.push(getY(y));
            }
        }
    }
    var path = pathData.join(' ');
    return {
        path: path,
        width: width,
        height: height
    };
}

function shadow2svg(letter, opts) {
    var data = letters[letter];
    var height = data.pixelData.length;
    var width = _.max(_.map(data.pixelData, function(str) {
        return str.length;
    }));
    var blockOffsetX = opts.blockOffsetX || 0;
    var blockOffsetY = opts.blockOffsetY || 0;
    var pixelOffsetX = opts.pixelOffsetX || 0;
    var pixelOffsetY = opts.pixelOffsetY || 0;
    var SHADOW_OFFSET_X = opts.shadowOffsetX || 10;
    var SHADOW_OFFSET_Y = opts.shadowOffsetY || 10;
    var PIXEL_SIZE = opts.pixelSize;
    var variance = opts.variance || 0;

    var getX = getJitteredCoordinate.bind(null, variance, PIXEL_SIZE, pixelOffsetX);
    var getY = getJitteredCoordinate.bind(null, variance, PIXEL_SIZE, pixelOffsetY);

    var pathData = []; // The SVG data
    for (var j = 0; j < height; j++) {
        for (var i = 0; i < width; i++) {
            var x = i + blockOffsetX;
            var y = j + blockOffsetY;

            var hasNeighborNorth = false;
            var hasNeighborEast = false;
            var hasNeighborNorthEast = false; // The kitty-corner neighbor
            if (data.pixelData[j-1] && data.pixelData[j-1].charAt(i) !== "" && data.pixelData[j-1].charAt(i) !== ' ') {
                hasNeighborNorth = true;
            }

            var right = data.pixelData[j].charAt(i + 1);
            if (right !== "" && right !== ' ') {
                hasNeighborEast = true;
            }

            if (data.pixelData[j-1] && data.pixelData[j-1].charAt(i+1) !== "" && data.pixelData[j-1].charAt(i+1) !== ' ') {
                hasNeighborNorthEast = true;
            }

            if (data.pixelData[j].charAt(i) === ' ') {
                // Empty - draw nothing.
            } else if (hasNeighborEast && hasNeighborNorth) {
                // No shadow can be seen since both neighbors block it.
            } else if (hasNeighborNorth && !hasNeighborEast) {
                //
                //                   + 2
                //                  /|
                //            1, 5 / |
                //       +--------+  +  3 
                //       |        | /
                //       |        |/
                //       +--------+  4 

                pathData.push('M');
                pathData.push(getX(x) + PIXEL_SIZE);
                pathData.push(getY(y));

                pathData.push('L');
                pathData.push(getX(x) + PIXEL_SIZE + SHADOW_OFFSET_X);
                if (hasNeighborNorthEast) {
                    pathData.push(getY(y));
                } else {
                    pathData.push(getY(y) - SHADOW_OFFSET_Y);
                }

                pathData.push('L');
                pathData.push(getX(x) + PIXEL_SIZE + SHADOW_OFFSET_X);
                pathData.push(getY(y) + PIXEL_SIZE - SHADOW_OFFSET_Y);

                pathData.push('L');
                pathData.push(getX(x) + PIXEL_SIZE);
                pathData.push(getY(y) + PIXEL_SIZE);

                pathData.push('L');
                pathData.push(getX(x) + PIXEL_SIZE);
                pathData.push(getY(y));

            } else if (!hasNeighborNorth && hasNeighborEast) {

                //         2          3 
                //          +-----.--+
                //         /      . /
                //        /     4 ./
                // 1, 5  +--------+
                //       |        |
                //       |        |
                //       +--------+

                pathData.push('M');
                pathData.push(getX(x));
                pathData.push(getY(y));

                pathData.push('L');
                pathData.push(getX(x) + SHADOW_OFFSET_X);
                pathData.push(getY(y) - SHADOW_OFFSET_Y);

                pathData.push('L');
                if (hasNeighborNorthEast) {
                    pathData.push(getX(x) + PIXEL_SIZE);
                } else {
                    pathData.push(getX(x) + SHADOW_OFFSET_X + PIXEL_SIZE);
                }
                pathData.push(getY(y) - SHADOW_OFFSET_Y);

                pathData.push('L');
                pathData.push(getX(x) + PIXEL_SIZE);
                pathData.push(getY(y));

                pathData.push('L');
                pathData.push(getX(x));
                pathData.push(getY(y));

            } else if (hasNeighborNorthEast) {
                //         2        3
                //           +------+.... 
                //          /       |  ..
                //         /        | . .
                //        /   1,4,5 |.  .
                // 1, 5  +----------+---+  2 
                //       |          |   |
                //       |          |   + 3
                //       |          |  /
                //       |          | /
                //       |          |/
                //       +----------+ 4

                var point4 = [
                    getX(x) + PIXEL_SIZE,
                    getY(y)
                ];

                // 1
                pathData.push('M');
                pathData.push(getX(x));
                pathData.push(getY(y));

                // 2
                pathData.push('L');
                pathData.push(getX(x) + SHADOW_OFFSET_X);
                pathData.push(getY(y) - SHADOW_OFFSET_Y);

                // 3
                pathData.push('L');
                pathData.push(getX(x) + PIXEL_SIZE);
                pathData.push(getY(y) - SHADOW_OFFSET_Y);

                // 4
                pathData.push('L');
                pathData.push(point4[0]);
                pathData.push(point4[1]);

                // 5
                pathData.push('L');
                pathData.push(getX(x));
                pathData.push(getY(y));

                // 1
                pathData.push('M');
                pathData.push(point4[0]);
                pathData.push(point4[1]);

                // // 2
                pathData.push('L');
                pathData.push(getX(x) + PIXEL_SIZE + SHADOW_OFFSET_X);
                pathData.push(getY(y));

                // 3
                pathData.push('L');
                pathData.push(getX(x) + PIXEL_SIZE + SHADOW_OFFSET_X);
                pathData.push(getY(y) + PIXEL_SIZE - SHADOW_OFFSET_Y);

                // 4
                pathData.push('L');
                pathData.push(getX(x) + PIXEL_SIZE);
                pathData.push(getY(y) + PIXEL_SIZE);

                // 5
                pathData.push('L');
                pathData.push(point4[0]);
                pathData.push(point4[1]);

            } else {
                //         2          3 
                //           +--------+ 
                //          /        /|
                //         /        / |
                //        /     6  /  |
                // 1, 7  +--------+   +  4 
                //       |        |  /
                //       |        | /
                //       |        |/
                //       +--------+  5 

                var point3 = [
                    getX(x) + SHADOW_OFFSET_X + PIXEL_SIZE,
                    getY(y) - SHADOW_OFFSET_Y
                ];

                var point6 = [
                    getX(x) + PIXEL_SIZE,
                    getY(y)
                ];

                // 1
                pathData.push('M');
                pathData.push(getX(x));
                pathData.push(getY(y));

                // 2
                pathData.push('L');
                pathData.push(getX(x) + SHADOW_OFFSET_X);
                pathData.push(getY(y) - SHADOW_OFFSET_Y);

                // 3
                pathData.push('L');
                pathData.push(getX(x) + SHADOW_OFFSET_X + PIXEL_SIZE);
                pathData.push(getY(y) - SHADOW_OFFSET_Y);

                // 4
                pathData.push('L');
                pathData.push(getX(x) + SHADOW_OFFSET_X + PIXEL_SIZE);
                pathData.push(getY(y) - SHADOW_OFFSET_Y + PIXEL_SIZE);

                // 5
                pathData.push('L');
                pathData.push(getX(x) + PIXEL_SIZE);
                pathData.push(getY(y) + PIXEL_SIZE);

                // 6
                pathData.push('L');
                pathData.push(getX(x) + PIXEL_SIZE);
                pathData.push(getY(y));

                // 7
                pathData.push('L');
                pathData.push(getX(x));
                pathData.push(getY(y));

                pathData = pathData.concat(['M', point3[0], point3[1], 'L', point6[0], point6[1]]);
            }
        }
    }
    var path = pathData.join(' ');
    return [{
        path: path,
        width: width,
        height: height
    }];
}

function write(id, word, opts) {
    var paper = Raphael(id);
    window.paper = paper; // mmmm...globals

    var STROKE_WIDTH    = opts['stroke-width'] || 1;
    var SHADOW_OFFSET_X = opts['shadow-offset'] || opts['shadow-offset-x'] || 10;
    var SHADOW_OFFSET_Y = opts['shadow-offset'] || opts['shadow-offset-y'] || 10;
    var FG_FILL         = opts['fg-fill'] || 'white';
    var BG_FILL         = opts['bg-fill'] || 'black';
    var FG_STROKE       = opts['fg-stroke'] || 'black';
    var BG_STROKE       = opts['bg-stroke'] || 'black';
    var SHOULD_SHADOW   = opts['should-shadow'] == 0 ? false : true; // == advantageous here
    var PIXEL_SIZE      = opts['pixel-size'] || 20;
    var LINE_OFFSETS    = opts['line-offsets'] || [];
    var VARIANCE        = (_.isNull(opts['variance']) || _.isUndefined(opts['variance'])) ? PIXEL_SIZE * 0.025 : opts['variance'];
    var buffer          = Math.ceil(VARIANCE * 3); // To account for the variance

    FG_FILL = getCssColor(FG_FILL);
    BG_FILL = getCssColor(BG_FILL);
    FG_STROKE = getCssColor(FG_STROKE);
    BG_STROKE = getCssColor(BG_STROKE);

    var maxLineWidth = 0;
    var lineMetadata = [];

    _.each(word.split('\n'), function(line, index) {
        lineMetadata.push({
            maxAscenderHeight: 0,
            maxDescenderHeight: 0
        });

        _.each(line.split(""), function(letter) {
            if (_.isUndefined(letters[letter])) {
                return;
            }

            if (letters[letter].ascenderHeight) {
                lineMetadata[index].maxAscenderHeight = _.max([lineMetadata[index].maxAscenderHeight, letters[letter].ascenderHeight]);
            }

            if (letters[letter].descenderHeight) {
                lineMetadata[index].maxDescenderHeight = _.max([lineMetadata[index].maxDescenderHeight, letters[letter].descenderHeight]);
            }

        });
    });

    _.each(word.split('\n'), function(line, lineIndex) {
        var lineWidth = 0;
        _.each(line.split(""), function(letter, index) {

            var descenderHeight = letters[letter].descenderHeight || 0;
            var ascenderHeight = letters[letter].ascenderHeight || 0;
            var rsb = _.isUndefined(letters[letter].rsb) ? 1 : letters[letter].rsb;
            var lsb = _.isUndefined(letters[letter].lsb) ? 0 : letters[letter].lsb;
            if (index !== 0) {
                // Don't adjust lsb if it's the first character
                lineWidth += lsb;
            }

            var blockOffsetY =  capHeight * lineIndex + lineMetadata[lineIndex].maxAscenderHeight - ascenderHeight;
            if (!_.isUndefined(LINE_OFFSETS[lineIndex])) {
                blockOffsetY += LINE_OFFSETS[lineIndex];
            }
            var foregroundLetters = letter2svg(letter, {
                variance: VARIANCE, // 1.5,
                pixelOffsetX: STROKE_WIDTH/2 + buffer/2,
                pixelOffsetY: STROKE_WIDTH/2 + buffer/2 + SHADOW_OFFSET_Y,
                blockOffsetX: lineWidth,
                blockOffsetY: blockOffsetY,
                pixelSize: PIXEL_SIZE
            });

            if (SHOULD_SHADOW) {
                var shadow = shadow2svg(letter, {
                    variance: VARIANCE,
                    pixelOffsetX: STROKE_WIDTH/2 + buffer/2,
                    pixelOffsetY: STROKE_WIDTH/2 + buffer/2 + SHADOW_OFFSET_Y,
                    blockOffsetX: lineWidth,
                    blockOffsetY: blockOffsetY,
                    shadowOffsetX: SHADOW_OFFSET_X,
                    shadowOffsetY: SHADOW_OFFSET_Y,
                    pixelSize: PIXEL_SIZE
                });
                shadow.map(function(shadowPath) {
                    paper.path(shadowPath.path, {bottomLayer: true}).attr({
                        fill: BG_FILL,
                        stroke: BG_STROKE
                    });
                });
            }

            lineWidth += foregroundLetters.width;

            if (index < line.length - 1) {
                lineWidth += rsb;
            }

            paper.path(foregroundLetters.path).attr({
                fill: FG_FILL,
                stroke: FG_STROKE,
                'stroke-width': STROKE_WIDTH,
                'class': 'fg'
            });
        });

        maxLineWidth = _.max([maxLineWidth, lineWidth]);
    });

    var box = paper.getBoundingBoxSize();
    var width = Math.min(Math.ceil(window.innerWidth), box.width);
    var height = Math.min(Math.ceil(window.innerHeight), box.height);

    paper.setViewBox(0, 0, box.width, box.height);
    paper.setSize(width, height);
    var download = document.createElement('a');
    download.setAttribute('href', 'data:text/svg,' + paper.toString());
    download.setAttribute('target', '_blank');
    download.innerHTML = 'download';
    document.body.insertBefore(download, document.body.firstChild);
}

write('container', query.s || 'hello', {
    'stroke-width':    query['stroke-width'] ? parseInt(query['stroke-width'], 10) : null,
    'variance':        query['variance']     ? parseFloat(query['variance'], 10) : null,
    'shadow-offset':   query['shadow']       ? parseInt(query['shadow'], 10) : null,
    'shadow-offset-x': query['shadow-x']     ? parseInt(query['shadow-x'], 10) : null,
    'shadow-offset-y': query['shadow-y']     ? parseInt(query['shadow-y'], 10) : null,
    'pixel-size':      query['pixel-size']   ? parseInt(query['pixel-size'], 10) : null,
    'fg-fill':         query['fg-fill'],
    'fg-stroke':       query['fg-stroke'],
    'bg-fill':         query['bg-fill'],
    'bg-stroke':       query['bg-stroke'],
    'line-offsets':    query['line-offsets'] ? query['line-offsets'].split(',').map(function(item) { return parseInt(item, 10); }) : null,
    'should-shadow':   query.shadow
});
