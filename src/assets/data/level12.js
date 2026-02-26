// 自动生成的关卡数据
export default {
  "levelId": 12,
  "name": "按钮机关",
  "gravity": 980,
  "player": {
    "startPosition": [
      100,
      200
    ],
    "jumpForce": -430,
    "moveSpeed": 165,
    "doubleJumpEnabled": true
  },
  "platforms": [
    {
      "type": "static",
      "position": [
        50,
        300
      ],
      "size": [
        150,
        40
      ]
    },
    {
      "type": "static",
      "position": [
        250,
        380
      ],
      "size": [
        120,
        30
      ]
    },
    {
      "type": "static",
      "position": [
        420,
        380
      ],
      "size": [
        120,
        30
      ]
    },
    {
      "type": "static",
      "position": [
        600,
        320
      ],
      "size": [
        150,
        35
      ]
    },
    {
      "type": "static",
      "position": [
        800,
        250
      ],
      "size": [
        120,
        30
      ]
    }
  ],
  "blocks": [
    {
      "type": "pushable",
      "position": [
        150,
        250
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
        670,
        290
      ],
      "target": "btn1",
      "requiredWeight": 1
    }
  ],
  "door": {
    "position": [
      850,
      190
    ],
    "requires": [
      "btn1"
    ]
  },
  "enemies": []
};
