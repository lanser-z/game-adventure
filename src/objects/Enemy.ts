/**
 * 敌人类
 */

import Phaser from 'phaser';

export interface EnemyData {
    type: string;
    position: [number, number];
    range: [number, number];
    speed: number;
}

export class Enemy extends Phaser.GameObjects.Container {
    declare body: Phaser.Physics.Arcade.Body;
    private graphics!: Phaser.GameObjects.Graphics;
    private enemyType: string = 'patrol';
    private moveSpeed: number = 50;
    private patrolRange: [number, number] = [0, 0];
    private direction: number = 1;
    private isDead: boolean = false;

    constructor(scene: Phaser.Scene, x: number, y: number, data: EnemyData) {
        super(scene, x, y);
        scene.physics.add.existing(this);
        scene.add.existing(this);

        this.enemyType = data.type || 'patrol';
        this.moveSpeed = data.speed || 50;
        this.patrolRange = data.range || [x - 100, x + 100];

        const body = this.body as Phaser.Physics.Arcade.Body;
        body.setSize(40, 40);
        body.setCollideWorldBounds(true);
        body.setBounce(0, 0);

        this.createEnemyGraphics();

        // 开始巡逻
        if (this.enemyType === 'patrol') {
            this.startPatrol();
        }

        // 浮动动画
        this.scene.tweens.add({
            targets: this,
            y: this.y - 3,
            duration: 600,
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: -1
        });
    }

    /**
     * 创建敌人图形
     */
    private createEnemyGraphics(): void {
        this.graphics = this.scene.add.graphics();
        this.drawEnemy();
        this.add(this.graphics);
    }

    /**
     * 绘制敌人（圆形小怪物）
     */
    private drawEnemy(): void {
        this.graphics.clear();

        const x = 0;
        const y = 0;
        const radius = 18;

        // 身体
        this.graphics.fillStyle(0x333333, 1);
        this.graphics.fillCircle(x, y, radius);
        this.graphics.lineStyle(2, 0x000000, 1);
        this.graphics.strokeCircle(x, y, radius);

        // 纹理圈
        this.graphics.lineStyle(1, 0x444444, 1);
        this.graphics.strokeCircle(x, y, radius * 0.75);
        this.graphics.strokeCircle(x, y, radius * 0.5);

        // 愤怒的眼睛
        this.graphics.fillStyle(0xFF0000, 1);

        // 左眼
        this.graphics.beginPath();
        this.graphics.moveTo(x - 10, y - 5);
        this.graphics.lineTo(x - 6, y - 3);
        this.graphics.lineTo(x - 10, y - 1);
        this.graphics.closePath();
        this.graphics.fillPath();

        // 右眼
        this.graphics.beginPath();
        this.graphics.moveTo(x + 10, y - 5);
        this.graphics.lineTo(x + 6, y - 3);
        this.graphics.lineTo(x + 10, y - 1);
        this.graphics.closePath();
        this.graphics.fillPath();

        // 愤怒眉毛
        this.graphics.lineStyle(2, 0xFF0000, 1);
        this.graphics.lineBetween(x - 14, y - 10, x - 6, y - 7);
        this.graphics.lineBetween(x + 14, y - 10, x + 6, y - 7);

        // 邪恶笑容 - 简化为线条
        this.graphics.lineStyle(2, 0xFFFFFF, 1);
        this.graphics.lineBetween(x - 8, y + 7, x, y + 11);
        this.graphics.lineBetween(x, y + 11, x + 8, y + 7);

        // 牙齿
        this.graphics.fillStyle(0xFFFFFF, 1);
        this.graphics.beginPath();
        this.graphics.moveTo(x - 4, y + 10);
        this.graphics.lineTo(x - 2, y + 13);
        this.graphics.lineTo(x, y + 10);
        this.graphics.closePath();
        this.graphics.fillPath();

        this.graphics.beginPath();
        this.graphics.moveTo(x + 4, y + 10);
        this.graphics.lineTo(x + 2, y + 13);
        this.graphics.lineTo(x, y + 10);
        this.graphics.closePath();
        this.graphics.fillPath();
    }

    /**
     * 开始巡逻
     */
    private startPatrol(): void {
        const body = this.body as Phaser.Physics.Arcade.Body;

        this.scene.events.on('update', () => {
            if (this.isDead) return;

            // 移动
            body.setVelocityX(this.direction * this.moveSpeed);

            // 检查边界
            if (this.x >= this.patrolRange[1]) {
                this.direction = -1;
                this.setScale(-1, 1);
            } else if (this.x <= this.patrolRange[0]) {
                this.direction = 1;
                this.setScale(1, 1);
            }
        });
    }

    /**
     * 敌人死亡
     */
    public die(): void {
        if (this.isDead) return;

        this.isDead = true;

        const body = this.body as Phaser.Physics.Arcade.Body;
        body.stop();
        body.enable = false;

        // 死亡动画
        this.scene.tweens.add({
            targets: this,
            scale: 0,
            alpha: 0,
            duration: 300,
            ease: 'Back.easeIn',
            onComplete: () => {
                this.destroy();
            }
        });
    }
}
