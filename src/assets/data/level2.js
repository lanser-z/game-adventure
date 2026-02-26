// 自动生成的关卡数据
export default {
  "levelId": 2,
  "name": "步步高升",
  "gravity": 980,
  "player": {
    "startPosition": [
      100,
      200
    ],
    "jumpForce": -400,
    "moveSpeed": 150,
    "doubleJumpEnabled": true
  },
  "platforms": [
    {
      "type": "static",
      "position": [
        50,
        270
      ],
      "size": [
        200,
        40
      ]
    },
    {
      "type": "moving",
      "position": [
        300,
        220,
        50
      ],
      "size": [
        120,
        30
      ],
      "path": [
        [
          300,
          220
        ],
        [
          450,
          220
        ]
      ],
      "speed": 80
    },
    {
      "type": "static",
      "position": [
        550,
        170
      ],
      "size": [
        150,
        30
      ]
    },
    {
      "type": "static",
      "position": [
        780,
        120
      ],
      "size": [
        150,
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
      850,
      70
    ],
    "requires": []
  },
  "enemies": []
};
