// 自动生成的关卡数据
export default {
  "levelId": 60,
  "name": "传奇终点",
  "gravity": 1050,
  "player": {
    "startPosition": [
      60,
      200
    ],
    "jumpForce": -560,
    "moveSpeed": 230,
    "doubleJumpEnabled": true
  },
  "platforms": [
    {
      "type": "static",
      "position": [
        40,
        420
      ],
      "size": [
        100,
        30
      ]
    },
    {
      "type": "moving",
      "position": [
        180,
        450,
        0
      ],
      "size": [
        60,
        25
      ],
      "path": [
        [
          180,
          450
        ],
        [
          180,
          340
        ]
      ],
      "speed": 170
    },
    {
      "type": "moving",
      "position": [
        280,
        450,
        0
      ],
      "size": [
        60,
        25
      ],
      "path": [
        [
          280,
          450
        ],
        [
          280,
          310
        ]
      ],
      "speed": 180
    },
    {
      "type": "static",
      "position": [
        380,
        310
      ],
      "size": [
        80,
        30
      ]
    },
    {
      "type": "moving",
      "position": [
        500,
        450,
        0
      ],
      "size": [
        60,
        25
      ],
      "path": [
        [
          500,
          450
        ],
        [
          500,
          290
        ]
      ],
      "speed": 190
    },
    {
      "type": "moving",
      "position": [
        600,
        450,
        0
      ],
      "size": [
        60,
        25
      ],
      "path": [
        [
          600,
          450
        ],
        [
          600,
          270
        ]
      ],
      "speed": 200
    },
    {
      "type": "static",
      "position": [
        700,
        270
      ],
      "size": [
        80,
        30
      ]
    },
    {
      "type": "moving",
      "position": [
        820,
        450,
        0
      ],
      "size": [
        60,
        25
      ],
      "path": [
        [
          820,
          450
        ],
        [
          820,
          250
        ]
      ],
      "speed": 210
    },
    {
      "type": "static",
      "position": [
        920,
        250
      ],
      "size": [
        80,
        30
      ]
    },
    {
      "type": "moving",
      "position": [
        1040,
        450,
        0
      ],
      "size": [
        60,
        25
      ],
      "path": [
        [
          1040,
          450
        ],
        [
          1040,
          230
        ]
      ],
      "speed": 220
    },
    {
      "type": "static",
      "position": [
        1140,
        230
      ],
      "size": [
        100,
        30
      ]
    }
  ],
  "blocks": [
    {
      "type": "pushable",
      "position": [
        420,
        260
      ],
      "size": [
        50,
        50
      ]
    }
  ],
  "triggers": [
    {
      "type": "death",
      "position": [
        0,
        700
      ],
      "size": [
        2000,
        100
      ]
    }
  ],
  "buttons": [
    {
      "type": "pressure",
      "position": [
        730,
        240
      ],
      "target": "btn1",
      "requiredWeight": 1
    },
    {
      "type": "pressure",
      "position": [
        950,
        220
      ],
      "target": "btn2",
      "requiredWeight": 1
    }
  ],
  "door": {
    "position": [
      1190,
      170
    ],
    "requires": [
      "btn1",
      "btn2"
    ]
  },
  "enemies": [
    {
      "type": "patrol",
      "position": [
        400,
        280
      ],
      "range": [
        390,
        450
      ],
      "speed": 110
    },
    {
      "type": "patrol",
      "position": [
        720,
        240
      ],
      "range": [
        710,
        770
      ],
      "speed": 115
    },
    {
      "type": "patrol",
      "position": [
        940,
        220
      ],
      "range": [
        930,
        990
      ],
      "speed": 120
    }
  ]
};
