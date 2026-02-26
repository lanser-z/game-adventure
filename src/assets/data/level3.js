// 自动生成的关卡数据
export default {
  "levelId": 3,
  "name": "跳跃进阶",
  "gravity": 980,
  "player": {
    "startPosition": [
      100,
      200
    ],
    "jumpForce": -420,
    "moveSpeed": 160,
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
        370
      ],
      "size": [
        100,
        30
      ]
    },
    {
      "type": "static",
      "position": [
        400,
        300
      ],
      "size": [
        100,
        30
      ]
    },
    {
      "type": "moving",
      "position": [
        550,
        250,
        50
      ],
      "size": [
        100,
        25
      ],
      "path": [
        [
          550,
          250
        ],
        [
          700,
          250
        ]
      ],
      "speed": 100
    },
    {
      "type": "static",
      "position": [
        820,
        180
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
      870,
      120
    ],
    "requires": []
  },
  "enemies": []
};
