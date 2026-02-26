/**
 * 可推箱子类
 */

import Phaser from 'phaser';

export class PushBlock extends Phaser.GameObjects.Rectangle {
    declare body: Phaser.Physics.Arcade.Body;

    constructor(scene: Phaser.Scene, x: number, y: number, width: number = 50, height: number = 50) {
        super(scene, x, y, width, height, 0xDEB887);

        // 添加物理
        scene.physics.add.existing(this);
        scene.add.existing(this);

        const body = this.body as Phaser.Physics.Arcade.Body;
        body.setCollideWorldBounds(true);
        body.setFriction(0.8, 0);
        body.setBounce(0, 0);
        body.setMass(2);
        body.setDragX(400);

        // 绘制箱子纹理
        this.drawCrateTexture();

        // 监听碰撞以处理推动
        scene.events.on('update', this.update, this);
    }

    /**
     * 绘制木箱纹理
     */
    private drawCrateTexture(): void {
        this.setStrokeStyle(2, 0x333333, 1);
        this.setFillStyle(0xDEB887, 1);

        // 绘制木箱交叉线
        const graphics = this.scene.add.graphics();
        const x = this.x;
        const y = this.y;
        const w = this.width;
        const h = this.height;

        graphics.lineStyle(1, 0x8B7355, 0.8);
        graphics.lineBetween(x - w/2 + 5, y - h/2 + 5, x + w/2 - 5, y + h/2 - 5);
        graphics.lineBetween(x + w/2 - 5, y - h/2 + 5, x - w/2 + 5, y + h/2 - 5);

        // 添加木纹线
        graphics.lineBetween(x - w/2 + 10, y - h/2, x - w/2 + 10, y + h/2);
        graphics.lineBetween(x + w/2 - 10, y - h/2, x + w/2 - 10, y + h/2);
        graphics.lineBetween(x - w/2, y - h/2 + 15, x + w/2, y - h/2 + 15);
        graphics.lineBetween(x - w/2, y + h/2 - 15, x + w/2, y + h/2 - 15);
    }

    public update(): void {
        const body = this.body as Phaser.Physics.Arcade.Body;

        // 限制速度
        if (Math.abs(body.velocity.x) > 50) {
            body.setVelocityX(Math.sign(body.velocity.x) * 50);
        }
    }

    destroy(): void {
        this.scene.events.off('update', this.update, this);
        super.destroy();
    }
}
