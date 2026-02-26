// 自动生成的关卡数据
export default {
  "levelId": 9,
  "name": "深渊之上",
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
        120,
        35
      ]
    },
    {
      "type": "moving",
      "position": [
        220,
        400,
        50
      ],
      "size": [
        80,
        25
      ],
      "path": [
        [
          220,
          400
        ],
        [
          320,
          400
        ]
      ],
      "speed": 70
    },
    {
      "type": "static",
      "position": [
        400,
        350
      ],
      "size": [
        80,
        25
      ]
    },
    {
      "type": "static",
      "position": [
        530,
        400
      ],
      "size": [
        80,
        25
      ]
    },
    {
      "type": "moving",
      "position": [
        660,
        350,
        50
      ],
      "size": [
        80,
        25
      ],
      "path": [
        [
          660,
          350
        ],
        [
          760,
          350
        ]
      ],
      "speed": 90
    },
    {
      "type": "static",
      "position": [
        820,
        280
      ],
      "size": [
        100,
        30
      ]
    },
    {
      "type": "static",
      "position": [
        950,
        200
      ],
      "size": [
        100,
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
      1000,
      140
    ],
    "requires": []
  },
  "enemies": []
};
