// 自动生成的关卡数据
export default {
  "levelId": 49,
  "name": "终极对决",
  "gravity": 980,
  "player": {
    "startPosition": [
      60,
      200
    ],
    "jumpForce": -500,
    "moveSpeed": 200,
    "doubleJumpEnabled": true
  },
  "platforms": [
    {
      "type": "static",
      "position": [
        40,
        400
      ],
      "size": [
        150,
        35
      ]
    },
    {
      "type": "static",
      "position": [
        230,
        400
      ],
      "size": [
        120,
        35
      ]
    },
    {
      "type": "moving",
      "position": [
        390,
        400,
        0
      ],
      "size": [
        80,
        25
      ],
      "path": [
        [
          390,
          400
        ],
        [
          510,
          400
        ]
      ],
      "speed": 130
    },
    {
      "type": "static",
      "position": [
        560,
        400
      ],
      "size": [
        120,
        35
      ]
    },
    {
      "type": "static",
      "position": [
        720,
        350
      ],
      "size": [
        100,
        30
      ]
    },
    {
      "type": "moving",
      "position": [
        860,
        400,
        0
      ],
      "size": [
        80,
        25
      ],
      "path": [
        [
          860,
          400
        ],
        [
          980,
          400
        ]
      ],
      "speed": 140
    },
    {
      "type": "static",
      "position": [
        1040,
        350
      ],
      "size": [
        120,
        35
      ]
    },
    {
      "type": "static",
      "position": [
        1190,
        280
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
        100,
        350
      ],
      "size": [
        50,
        50
      ]
    },
    {
      "type": "pushable",
      "position": [
        160,
        350
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
        750,
        320
      ],
      "target": "btn1",
      "requiredWeight": 1
    },
    {
      "type": "pressure",
      "position": [
        1070,
        320
      ],
      "target": "btn2",
      "requiredWeight": 1
    }
  ],
  "door": {
    "position": [
      1240,
      220
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
        260,
        370
      ],
      "range": [
        240,
        330
      ],
      "speed": 80
    },
    {
      "type": "patrol",
      "position": [
        600,
        370
      ],
      "range": [
        570,
        650
      ],
      "speed": 85
    },
    {
      "type": "patrol",
      "position": [
        1070,
        320
      ],
      "range": [
        1050,
        1140
      ],
      "speed": 90
    }
  ]
};
