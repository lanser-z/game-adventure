// 自动生成的关卡数据
export default {
  "levelId": 16,
  "name": "敌军来袭",
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
        200,
        40
      ]
    },
    {
      "type": "static",
      "position": [
        300,
        380
      ],
      "size": [
        200,
        30
      ]
    },
    {
      "type": "static",
      "position": [
        550,
        380
      ],
      "size": [
        200,
        30
      ]
    },
    {
      "type": "static",
      "position": [
        800,
        300
      ],
      "size": [
        180,
        35
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
      870,
      240
    ],
    "requires": []
  },
  "enemies": [
    {
      "type": "patrol",
      "position": [
        380,
        350
      ],
      "range": [
        310,
        480
      ],
      "speed": 55
    }
  ]
};
