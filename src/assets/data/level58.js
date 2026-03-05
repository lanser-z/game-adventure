// 自动生成的关卡数据
export default {
  "levelId": 58,
  "name": "完美配合",
  "gravity": 980,
  "player": {
    "startPosition": [
      60,
      200
    ],
    "jumpForce": -520,
    "moveSpeed": 200,
    "doubleJumpEnabled": true
  },
  "platforms": [
    {
      "type": "static",
      "position": [
        40,
        450
      ],
      "size": [
        220,
        40
      ]
    },
    {
      "type": "static",
      "position": [
        300,
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
        440,
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
        580,
        450,
        0
      ],
      "size": [
        80,
        25
      ],
      "path": [
        [
          580,
          450
        ],
        [
          720,
          450
        ]
      ],
      "speed": 140
    },
    {
      "type": "static",
      "position": [
        780,
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
        920,
        350
      ],
      "size": [
        100,
        30
      ]
    },
    {
      "type": "moving",
      "position": [
        1060,
        400,
        0
      ],
      "size": [
        80,
        25
      ],
      "path": [
        [
          1060,
          400
        ],
        [
          1200,
          400
        ]
      ],
      "speed": 150
    },
    {
      "type": "static",
      "position": [
        1240,
        350
      ],
      "size": [
        100,
        30
      ]
    },
    {
      "type": "static",
      "position": [
        1370,
        280
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
        80,
        400
      ],
      "size": [
        50,
        50
      ]
    },
    {
      "type": "pushable",
      "position": [
        140,
        400
      ],
      "size": [
        50,
        50
      ]
    },
    {
      "type": "pushable",
      "position": [
        200,
        400
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
        330,
        370
      ],
      "target": "btn1",
      "requiredWeight": 1
    },
    {
      "type": "pressure",
      "position": [
        470,
        370
      ],
      "target": "btn2",
      "requiredWeight": 1
    },
    {
      "type": "pressure",
      "position": [
        810,
        370
      ],
      "target": "btn3",
      "requiredWeight": 1
    },
    {
      "type": "pressure",
      "position": [
        950,
        320
      ],
      "target": "btn4",
      "requiredWeight": 1
    }
  ],
  "door": {
    "position": [
      1420,
      220
    ],
    "requires": [
      "btn1",
      "btn2",
      "btn3",
      "btn4"
    ]
  },
  "enemies": [
    {
      "type": "patrol",
      "position": [
        1260,
        320
      ],
      "range": [
        1250,
        1320
      ],
      "speed": 105
    }
  ]
};
