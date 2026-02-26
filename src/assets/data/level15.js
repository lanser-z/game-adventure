// 自动生成的关卡数据
export default {
  "levelId": 15,
  "name": "机关连锁",
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
        100,
        30
      ]
    },
    {
      "type": "static",
      "position": [
        400,
        380
      ],
      "size": [
        100,
        30
      ]
    },
    {
      "type": "static",
      "position": [
        550,
        320
      ],
      "size": [
        120,
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
        120,
        30
      ]
    },
    {
      "type": "static",
      "position": [
        880,
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
        140,
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
        450,
        350
      ],
      "target": "btn1",
      "requiredWeight": 1
    }
  ],
  "door": {
    "position": [
      930,
      190
    ],
    "requires": [
      "btn1"
    ]
  },
  "enemies": []
};
