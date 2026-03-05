// 自动生成的关卡数据
export default {
  "levelId": 41,
  "name": "双重机关",
  "gravity": 980,
  "player": {
    "startPosition": [
      60,
      200
    ],
    "jumpForce": -480,
    "moveSpeed": 190,
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
        150,
        35
      ]
    },
    {
      "type": "static",
      "position": [
        230,
        420
      ],
      "size": [
        100,
        35
      ]
    },
    {
      "type": "static",
      "position": [
        370,
        380
      ],
      "size": [
        80,
        30
      ]
    },
    {
      "type": "static",
      "position": [
        490,
        380
      ],
      "size": [
        80,
        30
      ]
    },
    {
      "type": "moving",
      "position": [
        610,
        420,
        0
      ],
      "size": [
        80,
        25
      ],
      "path": [
        [
          610,
          420
        ],
        [
          730,
          420
        ]
      ],
      "speed": 120
    },
    {
      "type": "static",
      "position": [
        790,
        380
      ],
      "size": [
        80,
        30
      ]
    },
    {
      "type": "static",
      "position": [
        910,
        320
      ],
      "size": [
        100,
        35
      ]
    },
    {
      "type": "static",
      "position": [
        1040,
        260
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
        370
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
        370
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
        400,
        350
      ],
      "target": "btn1",
      "requiredWeight": 1
    },
    {
      "type": "pressure",
      "position": [
        820,
        350
      ],
      "target": "btn2",
      "requiredWeight": 1
    }
  ],
  "door": {
    "position": [
      1090,
      200
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
        940,
        290
      ],
      "range": [
        920,
        990
      ],
      "speed": 65
    }
  ]
};
