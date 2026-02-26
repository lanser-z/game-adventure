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
        // 创建纹理 - 使用 Canvas API 以兼容微信小游戏
        const textureKey = 'door-texture';
        const width = 40;
        const height = 60;

        if (!scene.textures.exists(textureKey)) {
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d')!;

            // 门框
            ctx.fillStyle = '#333333';
            ctx.fillRect(0, 0, width, height);

            // 门主体
            ctx.fillStyle = '#8B4513';
            ctx.fillRect(3, 3, width - 6, height - 6);

            // 门把手
            ctx.fillStyle = '#FFD700';
            ctx.beginPath();
            ctx.arc(30, height / 2, 3, 0, Math.PI * 2);
            ctx.fill();

            // 锁（如果需要条件）
            if (requires.length > 0) {
                ctx.fillStyle = '#FF0000';
                ctx.fillRect(width/2 - 8, height/2 - 8, 16, 14);
                ctx.fillStyle = '#FFD700';
                ctx.beginPath();
                ctx.arc(width/2, height/2 - 10, 4, 0, Math.PI * 2);
                ctx.fill();
            }

            scene.textures.addCanvas(textureKey, canvas);
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
        const textureKey = isOpen ? 'door-texture-open' : 'door-texture-closed';
        const width = 40;
        const height = 60;

        if (!this.scene.textures.exists(textureKey)) {
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d')!;

            // 门框
            ctx.fillStyle = isOpen ? '#4CAF50' : '#333333';
            ctx.fillRect(0, 0, width, height);

            // 门主体
            ctx.fillStyle = '#8B4513';
            ctx.fillRect(3, 3, width - 6, height - 6);

            // 门把手
            ctx.fillStyle = '#FFD700';
            ctx.beginPath();
            ctx.arc(30, height / 2, 3, 0, Math.PI * 2);
            ctx.fill();

            // 如果有条件要求且未满足，画锁
            if (this.requiredConditions.length > 0 && !isOpen) {
                ctx.fillStyle = '#FF0000';
                ctx.fillRect(width/2 - 8, height/2 - 8, 16, 14);
                ctx.fillStyle = '#FFD700';
                ctx.beginPath();
                ctx.arc(width/2, height/2 - 10, 4, 0, Math.PI * 2);
                ctx.fill();
            }

            this.scene.textures.addCanvas(textureKey, canvas);
        }

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
