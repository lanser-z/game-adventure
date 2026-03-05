// 自动生成的关卡数据
export default {
  "levelId": 52,
  "name": "五环挑战",
  "gravity": 980,
  "player": {
    "startPosition": [
      70,
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
        50,
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
        100,
        30
      ]
    },
    {
      "type": "static",
      "position": [
        370,
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
        510,
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
        650,
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
        790,
        300
      ],
      "size": [
        100,
        30
      ]
    },
    {
      "type": "static",
      "position": [
        930,
        300
      ],
      "size": [
        100,
        30
      ]
    },
    {
      "type": "static",
      "position": [
        1070,
        250
      ],
      "size": [
        120,
        35
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
        260,
        370
      ],
      "target": "btn1",
      "requiredWeight": 1
    },
    {
      "type": "pressure",
      "position": [
        400,
        370
      ],
      "target": "btn2",
      "requiredWeight": 1
    },
    {
      "type": "pressure",
      "position": [
        540,
        320
      ],
      "target": "btn3",
      "requiredWeight": 1
    },
    {
      "type": "pressure",
      "position": [
        680,
        320
      ],
      "target": "btn4",
      "requiredWeight": 1
    },
    {
      "type": "pressure",
      "position": [
        820,
        270
      ],
      "target": "btn5",
      "requiredWeight": 1
    }
  ],
  "door": {
    "position": [
      1120,
      190
    ],
    "requires": [
      "btn1",
      "btn2",
      "btn3",
      "btn4",
      "btn5"
    ]
  },
  "enemies": []
};
