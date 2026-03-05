// 自动生成的关卡数据
export default {
  "levelId": 34,
  "name": "四按钮挑战",
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
        400
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
        420,
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
        560,
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
        700,
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
        840,
        250
      ],
      "size": [
        150,
        35
      ]
    },
    {
      "type": "static",
      "position": [
        1000,
        180
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
    },
    {
      "type": "pushable",
      "position": [
        220,
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
        310,
        320
      ],
      "target": "btn1",
      "requiredWeight": 1
    },
    {
      "type": "pressure",
      "position": [
        450,
        320
      ],
      "target": "btn2",
      "requiredWeight": 1
    },
    {
      "type": "pressure",
      "position": [
        590,
        270
      ],
      "target": "btn3",
      "requiredWeight": 1
    },
    {
      "type": "pressure",
      "position": [
        730,
        270
      ],
      "target": "btn4",
      "requiredWeight": 1
    }
  ],
  "door": {
    "position": [
      1050,
      120
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
