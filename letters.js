var _ = require('underscore');

var letters = {
    L: {
        pixelData: [
            '# ',
            '##'
        ]
    },

    a: {
        pixelData: [
        ' ##  ',
        '#  # ',
        ' ### ',
        '#  # ',
        '#  # ',
        ' ## #'
        ],
        rsb: 0
    },

    b: {
        pixelData: [
        '#   ',
        '#   ',
        '#   ',
        '#   ',
        '### ',
        '#  #',
        '#  #',
        '#  #',
        '#  #',
        ' ## '
        ],
        ascenderHeight: 4
    },

    c: {
        pixelData: [
        ' ## ',
        '#  #',
        '#   ',
        '#   ',
        '#  #',
        ' ## '
        ]
    },

    d: {
        pixelData: [
        '   #',
        '   #',
        '   #',
        '   #',
        '   #',
        ' ###',
        '#  #',
        '#  #',
        '#  #',
        '#  #',
        ' ## '
        ],
        ascenderHeight: 5
    },

    e: {
        pixelData: [
        ' ## ',
        '#  #',
        '####',
        '#   ',
        '#  #',
        ' ## '
        ]
    },
    
    f: {
        pixelData: [
        '  ## ',
        ' #  #',
        ' #   ',
        ' #   ',
        '#### ',
        ' #   ',
        ' #   ',
        ' #   ',
        ' #   ',
        ' #   '
        ],
        ascenderHeight: 4,
        rsb: 0,
    },


    g: {
        pixelData: [
        ' ## ',
        '#  #',
        '#  #',
        '#  #',
        '#  #',
        ' ###',
        '   #',
        '   #',
        '#  #',
        ' ## '
        ],
        descenderHeight: 4
    },

    h: {
        pixelData: [
        '#   ',
        '#   ',
        '#   ',
        '#   ',
        '### ',
        '#  #',
        '#  #',
        '#  #',
        '#  #',
        '#  #'
        ],
        ascenderHeight: 4
    },

    i: {
        pixelData: [
        '#',
        ' ',
        '#',
        '#',
        '#',
        '#',
        '#',
        '#'
        ],
        ascenderHeight: 2
    },

    j: {
        pixelData: [
        '   #',
        '    ',
        '   #',
        '   #',
        '   #',
        '   #',
        '   #',
        '   #',
        '   #',
        '   #',
        '#  #',
        ' ## '
        ],
        descenderHeight: 4,
        ascenderHeight: 2,
        lsb: -2
    },

    k: {
        pixelData: [
        '#   ',
        '#   ',
        '#  #',
        '# # ',
        '##  ',
        '##  ',
        '# # ',
        '#  #'
        ],
        ascenderHeight: 2
    },

    l: {
        pixelData: [
        '#',
        '#',
        '#',
        '#',
        '#',
        '#',
        '#',
        '#',
        '#',
        '#'
        ],
        ascenderHeight: 4
    },

    m: {
        pixelData: [
        ' # # ',
        '# # #',
        '# # #',
        '# # #',
        '# # #',
        '# # #'
        ]
    },

    n: {
        pixelData: [
        '# # ',
        '## #',
        '#  #',
        '#  #',
        '#  #',
        '#  #'
        ]
    },

    o: {
        pixelData: [
        ' ## ',
        '#  #',
        '#  #',
        '#  #',
        '#  #',
        ' ## '
        ]
    },

    p: {
       pixelData: [
       ' ## ',
       '#  #',
       '#  #',
       '#  #',
       '#  #',
       '### ',
       '#   ',
       '#   ',
       '#   ',
       '#   '
       ],
       descenderHeight: 4
    },

    q: {
        pixelData: [
        ' ##   ',
        '#  #  ',
        '#  #  ',
        '#  #  ',
        ' ###  ',
        '   #  ',
        '   #  ',
        '   #  ',
        '   # #',
        '    # '
        ],
        rsb: -1,
        descenderHeight: 5
    },


    r: {
        pixelData: [
        '# # ',
        '## #',
        '#   ',
        '#   ',
        '#   ',
        '#   '
        ]
    },


    s: {
        pixelData: [
        ' ## ',
        '#  #',
        ' #  ',
        '  # ',
        '#  #',
        ' ## '
        ]
    },


    t: {
        pixelData: [
        ' #  ',
        ' #  ',
        '####',
        ' #  ',
        ' #  ',
        ' #  ',
        '  # '
        ],
        ascenderHeight: 1
    },


    u: {
        pixelData: [
        '#  #',
        '#  #',
        '#  #',
        '#  #',
        '#  #',
        ' ###'
        ]
    },


    v: {
        pixelData: [
        '#  #',
        '#  #',
        '# # ',
        '# # ',
        '##  ',
        '#   '
        ]
    },

    V: {
        pixelData: [
        '#    #',
        '#    #',
        '#   # ',
        '#   # ',
        '#  #  ',
        '#  #  ',
        '# #   ',
        '# #   ',
        '##    ',
        '#     '
        ],
        ascenderHeight: 4
    },


    w: {
        pixelData: [
        '#   #',
        '#   #',
        '#   #',
        '# # #',
        '# # #',
        ' ### '
        ]
    },


    x: {
        pixelData: [
        '#  #',
        '#  #',
        ' ## ',
        ' ## ',
        '#  #',
        '#  #'
        ]
    },


    y: {
        pixelData: [
        '#  #',
        '#  #',
        '#  #',
        '#  #',
        '#  #',
        ' ###',
        '   #',
        '   #',
        '   #',
        '  # ',
        '##  '
        ],
        descenderHeight: 5
    },


    z: {
        pixelData: [
        '####',
        '   #',
        '  # ',
        ' #  ',
        '#   ',
        '####'
        ]
    },

    '.': {
        pixelData: [
        ' ',
        ' ',
        ' ',
        ' ',
        ' ',
        '#'
        ],

    },

    ',': {
        pixelData: [
        '  ',
        '  ',
        '  ',
        '  ',
        '  ',
        ' #',
        ' #',
        '# '
        ],
        descenderHeight: 2,
        lsb: -1
    },

    ' ': {
        pixelData: [
        ' ',
        ' ',
        ' ',
        ' ',
        ' ',
        ' '
        ]
    },

    '?': {
        pixelData: [
        ' ## ',
        '#  #',
        '   #',
        '  # ',
        ' #  ',
        ' #  ',
        ' #  ',
        '    ',
        ' #  '
        ],
        ascenderHeight: 3
    },

    '!': {
        pixelData: [
        '#',
        '#',
        '#',
        '#',
        '#',
        '#',
        '#',
        '#',
        ' ',
        '#'
        ],
        ascenderHeight: 4
    },

    '-': {
        pixelData: [
        '  ',
        '  ',
        '##',
        '  ',
        '  ',
        '  '
        ]
    }

};

module.exports = letters;
