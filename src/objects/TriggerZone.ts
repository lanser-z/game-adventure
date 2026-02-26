/**
 * 触发区域类
 */

import Phaser from 'phaser';

export class TriggerZone extends Phaser.GameObjects.Rectangle {
    private triggerType: string = 'death';

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        width: number,
        height: number,
        type: string = 'death'
    ) {
        super(scene, x, y, width, height, 0x000000, 0);

        scene.physics.add.existing(this);
        scene.add.existing(this);

        this.triggerType = type;

        const body = this.body as Phaser.Physics.Arcade.Body;
        body.setAllowGravity(false);
        body.setImmovable(true);

        // 根据类型设置不同的视觉提示（调试用）
        if (type === 'death') {
            // 死亡区域可以用红色边框表示
            this.setStrokeStyle(2, 0xFF0000, 0.5);
            this.setFillStyle(0xFF0000, 0.1);
        }
    }

    /**
     * 激活触发器
     */
    public activate(player: any): void {
        switch (this.triggerType) {
            case 'death':
                player.die();
                break;
            case 'checkpoint':
                // 设置检查点
                console.log('检查点:', this.x, this.y);
                break;
            case 'teleport':
                // 传送
                console.log('传送到:', this.x, this.y);
                break;
        }
    }
}
