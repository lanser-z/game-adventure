// 自动生成的关卡数据
export default {
  "levelId": 20,
  "name": "终极挑战",
  "gravity": 980,
  "player": {
    "startPosition": [
      100,
      200
    ],
    "jumpForce": -460,
    "moveSpeed": 180,
    "doubleJumpEnabled": true
  },
  "platforms": [
    {
      "type": "static",
      "position": [
        50,
        400
      ],
      "size": [
        100,
        30
      ]
    },
    {
      "type": "static",
      "position": [
        190,
        360
      ],
      "size": [
        70,
        25
      ]
    },
    {
      "type": "static",
      "position": [
        310,
        320
      ],
      "size": [
        70,
        25
      ]
    },
    {
      "type": "moving",
      "position": [
        430,
        380,
        50
      ],
      "size": [
        80,
        25
      ],
      "path": [
        [
          430,
          380
        ],
        [
          530,
          380
        ]
      ],
      "speed": 90
    },
    {
      "type": "static",
      "position": [
        600,
        400
      ],
      "size": [
        100,
        30
      ]
    },
    {
      "type": "static",
      "position": [
        740,
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
        860,
        300
      ],
      "size": [
        80,
        25
      ]
    },
    {
      "type": "static",
      "position": [
        960,
        250
      ],
      "size": [
        100,
        30
      ]
    }
  ],
  "blocks": [
    {
      "type": "pushable",
      "position": [
        250,
        350
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
        780,
        320
      ],
      "target": "btn1",
      "requiredWeight": 1
    }
  ],
  "door": {
    "position": [
      1000,
      190
    ],
    "requires": [
      "btn1"
    ]
  },
  "enemies": [
    {
      "type": "patrol",
      "position": [
        180,
        330
      ],
      "range": [
        100,
        250
      ],
      "speed": 45
    },
    {
      "type": "patrol",
      "position": [
        640,
        370
      ],
      "range": [
        610,
        690
      ],
      "speed": 55
    }
  ]
};
