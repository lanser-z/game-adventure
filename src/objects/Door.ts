/**
 * 门类（终点）- 使用 Image 支持物理碰撞
 */

import Phaser from 'phaser';

export class Door extends Phaser.GameObjects.Image {
    declare body: Phaser.Physics.Arcade.StaticBody;

    private isOpen: boolean = false;
    private requiredConditions: string[] = [];
    private metConditions: Set<string> = new Set();

    constructor(scene: Phaser.Scene, x: number, y: number, requires: string[] = []) {
        // 创建纹理
        const textureKey = 'door-texture';
        const width = 40;
        const height = 60;

        if (!scene.textures.exists(textureKey)) {
            const graphics = scene.make.graphics();

            // 门框
            graphics.fillStyle(0x333333, 1);
            graphics.fillRect(0, 0, width, height);

            // 门主体
            graphics.fillStyle(0x8B4513, 1);
            graphics.fillRect(3, 3, width - 6, height - 6);

            // 门把手
            graphics.fillStyle(0xFFD700, 1);
            graphics.fillCircle(30, height / 2, 3);

            // 锁（如果需要条件）
            if (requires.length > 0) {
                graphics.fillStyle(0xFF0000, 1);
                graphics.fillRect(width/2 - 8, height/2 - 8, 16, 14);
                graphics.fillStyle(0xFFD700, 1);
                graphics.fillCircle(width/2, height/2 - 10, 4);
            }

            graphics.generateTexture(textureKey, width, height);
        }

        const centerX = x + width / 2;
        const centerY = y + height / 2;

        super(scene, centerX, centerY, textureKey);

        // 设置显示尺寸
        this.setDisplaySize(width, height);

        // 设置名称，供按钮查找
        this.name = 'door';

        // 添加到场景
        scene.add.existing(this);

        // 添加静态物理
        scene.physics.add.existing(this, true);

        this.requiredConditions = requires;

        // 如果没有条件要求，门默认开启
        if (requires.length === 0) {
            this.isOpen = true;
        }

        // 浮动动画
        scene.tweens.add({
            targets: this,
            y: this.y - 3,
            duration: 1000,
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: -1
        });

        // 确保门不需要条件时是绿色
        if (this.isOpen) {
            this.updateColor(true);
        }
    }

    /**
     * 满足条件
     */
    public meetCondition(condition: string): void {
        this.metConditions.add(condition);
        this.checkConditions();
    }

    /**
     * 移除条件
     */
    public removeCondition(condition: string): void {
        this.metConditions.delete(condition);
        this.checkConditions();
    }

    /**
     * 检查是否所有条件都满足
     */
    private checkConditions(): void {
        const allMet = this.requiredConditions.every(cond =>
            this.metConditions.has(cond)
        );

        if (allMet && !this.isOpen) {
            this.open();
        } else if (!allMet && this.isOpen) {
            this.close();
        }
    }

    /**
     * 打开门
     */
    public open(): void {
        if (this.isOpen) return;

        this.isOpen = true;

        // 更新颜色为绿色
        this.updateColor(true);

        console.log('[Door] 门已打开');
    }

    /**
     * 关闭门
     */
    public close(): void {
        if (!this.isOpen) return;

        this.isOpen = false;

        // 更新颜色为红色
        this.updateColor(false);

        console.log('[Door] 门已关闭');
    }

    /**
     * 更新门的颜色
     */
    private updateColor(isOpen: boolean): void {
        // 重新生成纹理
        const textureKey = 'door-texture';
        const width = 40;
        const height = 60;

        const graphics = this.scene.make.graphics();

        // 门框
        graphics.fillStyle(isOpen ? 0x4CAF50 : 0x333333, 1);
        graphics.fillRect(0, 0, width, height);

        // 门主体
        graphics.fillStyle(0x8B4513, 1);
        graphics.fillRect(3, 3, width - 6, height - 6);

        // 门把手
        graphics.fillStyle(0xFFD700, 1);
        graphics.fillCircle(30, height / 2, 3);

        // 如果有条件要求且未满足，画锁
        if (this.requiredConditions.length > 0 && !isOpen) {
            graphics.fillStyle(0xFF0000, 1);
            graphics.fillRect(width/2 - 8, height/2 - 8, 16, 14);
            graphics.fillStyle(0xFFD700, 1);
            graphics.fillCircle(width/2, height/2 - 10, 4);
        }

        graphics.generateTexture(textureKey, width, height);
        this.setTexture(textureKey);
        this.setDisplaySize(width, height);
    }

    /**
     * 检查门是否打开
     */
    public isOpenCheck(): boolean {
        return this.isOpen;
    }
}
