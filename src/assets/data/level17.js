// 自动生成的关卡数据
export default {
  "levelId": 17,
  "name": "双敌警戒",
  "gravity": 980,
  "player": {
    "startPosition": [
      100,
      200
    ],
    "jumpForce": -440,
    "moveSpeed": 170,
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
        180,
        40
      ]
    },
    {
      "type": "static",
      "position": [
        280,
        380
      ],
      "size": [
        180,
        30
      ]
    },
    {
      "type": "static",
      "position": [
        500,
        380
      ],
      "size": [
        180,
        30
      ]
    },
    {
      "type": "static",
      "position": [
        720,
        320
      ],
      "size": [
        180,
        35
      ]
    },
    {
      "type": "static",
      "position": [
        940,
        250
      ],
      "size": [
        120,
        30
      ]
    }
  ],
  "blocks": [],
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
  "buttons": [],
  "door": {
    "position": [
      990,
      190
    ],
    "requires": []
  },
  "enemies": [
    {
      "type": "patrol",
      "position": [
        350,
        350
      ],
      "range": [
        290,
        450
      ],
      "speed": 50
    },
    {
      "type": "patrol",
      "position": [
        570,
        350
      ],
      "range": [
        510,
        650
      ],
      "speed": 60
    }
  ]
};
