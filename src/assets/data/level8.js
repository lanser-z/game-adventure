// 自动生成的关卡数据
export default {
  "levelId": 8,
  "name": "移动陷阱",
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
      "type": "moving",
      "position": [
        250,
        350,
        50
      ],
      "size": [
        100,
        30
      ],
      "path": [
        [
          250,
          350
        ],
        [
          400,
          350
        ]
      ],
      "speed": 80
    },
    {
      "type": "static",
      "position": [
        500,
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
        650,
        350,
        50
      ],
      "size": [
        100,
        30
      ],
      "path": [
        [
          650,
          350
        ],
        [
          800,
          350
        ]
      ],
      "speed": 100
    },
    {
      "type": "static",
      "position": [
        900,
        280
      ],
      "size": [
        120,
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
      960,
      220
    ],
    "requires": []
  },
  "enemies": []
};
