// 自动生成的关卡数据
export default {
  "levelId": 22,
  "name": "移动阶梯",
  "gravity": 980,
  "player": {
    "startPosition": [
      60,
      200
    ],
    "jumpForce": -470,
    "moveSpeed": 180,
    "doubleJumpEnabled": true
  },
  "platforms": [
    {
      "type": "static",
      "position": [
        40,
        350
      ],
      "size": [
        100,
        35
      ]
    },
    {
      "type": "moving",
      "position": [
        180,
        380,
        0
      ],
      "size": [
        70,
        25
      ],
      "path": [
        [
          180,
          380
        ],
        [
          280,
          380
        ]
      ],
      "speed": 100
    },
    {
      "type": "moving",
      "position": [
        320,
        340,
        0
      ],
      "size": [
        70,
        25
      ],
      "path": [
        [
          320,
          340
        ],
        [
          420,
          340
        ]
      ],
      "speed": 110
    },
    {
      "type": "moving",
      "position": [
        460,
        300,
        0
      ],
      "size": [
        70,
        25
      ],
      "path": [
        [
          460,
          300
        ],
        [
          560,
          300
        ]
      ],
      "speed": 120
    },
    {
      "type": "moving",
      "position": [
        600,
        260,
        0
      ],
      "size": [
        70,
        25
      ],
      "path": [
        [
          600,
          260
        ],
        [
          700,
          260
        ]
      ],
      "speed": 130
    },
    {
      "type": "static",
      "position": [
        780,
        200
      ],
      "size": [
        120,
        35
      ]
    },
    {
      "type": "static",
      "position": [
        920,
        150
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
      960,
      90
    ],
    "requires": []
  },
  "enemies": []
};
