// 自动生成的关卡数据
export default {
  "levelId": 47,
  "name": "机关交响曲",
  "gravity": 980,
  "player": {
    "startPosition": [
      60,
      200
    ],
    "jumpForce": -490,
    "moveSpeed": 190,
    "doubleJumpEnabled": true
  },
  "platforms": [
    {
      "type": "static",
      "position": [
        40,
        450
      ],
      "size": [
        200,
        40
      ]
    },
    {
      "type": "static",
      "position": [
        280,
        400
      ],
      "size": [
        100,
        30
      ]
    },
    {
      "type": "static",
      "position": [
        420,
        400
      ],
      "size": [
        100,
        30
      ]
    },
    {
      "type": "moving",
      "position": [
        560,
        450,
        0
      ],
      "size": [
        80,
        25
      ],
      "path": [
        [
          560,
          450
        ],
        [
          680,
          450
        ]
      ],
      "speed": 115
    },
    {
      "type": "static",
      "position": [
        740,
        400
      ],
      "size": [
        100,
        30
      ]
    },
    {
      "type": "static",
      "position": [
        880,
        350
      ],
      "size": [
        100,
        30
      ]
    },
    {
      "type": "static",
      "position": [
        1020,
        300
      ],
      "size": [
        120,
        35
      ]
    },
    {
      "type": "static",
      "position": [
        1170,
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
        100,
        400
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
        400
      ],
      "size": [
        50,
        50
      ]
    },
    {
      "type": "pushable",
      "position": [
        220,
        400
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
        310,
        370
      ],
      "target": "btn1",
      "requiredWeight": 1
    },
    {
      "type": "pressure",
      "position": [
        450,
        370
      ],
      "target": "btn2",
      "requiredWeight": 1
    },
    {
      "type": "pressure",
      "position": [
        770,
        370
      ],
      "target": "btn3",
      "requiredWeight": 1
    },
    {
      "type": "pressure",
      "position": [
        910,
        320
      ],
      "target": "btn4",
      "requiredWeight": 1
    }
  ],
  "door": {
    "position": [
      1220,
      170
    ],
    "requires": [
      "btn1",
      "btn2",
      "btn3",
      "btn4"
    ]
  },
  "enemies": []
};
