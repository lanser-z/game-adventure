// 自动生成的关卡数据
export default {
  "levelId": 18,
  "name": "箱子与敌人",
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
        350
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
        420
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
        420
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
        350
      ],
      "size": [
        200,
        35
      ]
    }
  ],
  "blocks": [
    {
      "type": "pushable",
      "position": [
        180,
        300
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
  "buttons": [],
  "door": {
    "position": [
      900,
      290
    ],
    "requires": []
  },
  "enemies": [
    {
      "type": "patrol",
      "position": [
        620,
        390
      ],
      "range": [
        560,
        740
      ],
      "speed": 55
    }
  ]
};
