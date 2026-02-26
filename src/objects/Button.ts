/**
 * 按钮类 - 使用 Image 支持物理碰撞
 */

import Phaser from 'phaser';
import { Door } from './Door';

export interface ButtonData {
    type: string;
    position: [number, number];
    target: string;
    requiredWeight: number;
}

export class Button extends Phaser.GameObjects.Image {
    declare body: Phaser.Physics.Arcade.StaticBody;

    private isPressed: boolean = false;
    private targetId: string = '';
    private player: any;
    private blocks: any[] = [];
    private wasOnTop: boolean = false; // 上一帧是否有人在上面

    constructor(scene: Phaser.Scene, x: number, y: number, data: ButtonData) {
        // 创建纹理
        const textureKey = 'button-texture';
        if (!scene.textures.exists(textureKey)) {
            const graphics = scene.make.graphics();

            // 底座
            graphics.fillStyle(0x666666, 1);
            graphics.fillRect(0, 0, 50, 25);
            graphics.lineStyle(2, 0x333333, 1);
            graphics.strokeRect(0, 0, 50, 25);

            // 按钮表面（红色）
            graphics.fillStyle(0xFF6666, 1);
            graphics.fillRect(10, 2, 30, 12);
            graphics.lineStyle(2, 0x333333, 1);
            graphics.strokeRect(10, 2, 30, 12);

            graphics.generateTexture(textureKey, 50, 25);
        }

        // 计算中心点
        const centerX = x + 25;
        const centerY = y + 12;

        super(scene, centerX, centerY, textureKey);

        // 设置显示尺寸
        this.setDisplaySize(50, 25);

        // 添加到场景
        scene.add.existing(this);

        // 添加静态物理
        scene.physics.add.existing(this, true);

        this.targetId = data.target;
        // requiredWeight 存储在 data 中，供将来使用
        // this._requiredWeight = data.requiredWeight;

        // 每帧检查是否有物体在上面
        scene.events.on('update', this.update, this);
    }

    /**
     * 设置引用对象（由 GameScene 调用）
     */
    public setReferences(player: any, blocks: any[]): void {
        this.player = player;
        this.blocks = blocks;
    }

    /**
     * 每帧更新检测 - 切换式逻辑
     */
    public update(): void {
        let hasWeight = false;

        // 检查玩家是否在按钮上
        if (this.player && this.physicsOverlap(this.player)) {
            hasWeight = true;
        }

        // 检查箱子是否在按钮上
        if (this.blocks) {
            for (const block of this.blocks) {
                if (this.physicsOverlap(block)) {
                    hasWeight = true;
                    break;
                }
            }
        }

        // 检测边沿：从没有变成有 -> 触发切换
        if (hasWeight && !this.wasOnTop) {
            this.toggle();
        }

        this.wasOnTop = hasWeight;
    }

    /**
     * 检查物理重叠
     */
    private physicsOverlap(obj: any): boolean {
        const bounds = this.getBounds();
        const objBounds = obj.getBounds();
        return Phaser.Geom.Intersects.RectangleToRectangle(bounds, objBounds);
    }


    /**
     * 切换按钮状态
     */
    private toggle(): void {
        this.isPressed = !this.isPressed;

        // 更新按钮外观
        this.updateTexture(this.isPressed);

        // 触发或取消目标
        if (this.isPressed) {
            this.triggerTarget();
        } else {
            this.untriggerTarget();
        }
    }

    /**
     * 更新按钮纹理
     */
    private updateTexture(isPressed: boolean): void {
        const textureKey = 'button-texture';
        const graphics = this.scene.make.graphics();

        // 底座
        graphics.fillStyle(0x666666, 1);
        graphics.fillRect(0, 0, 50, 25);
        graphics.lineStyle(2, 0x333333, 1);
        graphics.strokeRect(0, 0, 50, 25);

        // 按钮表面（按下时绿色，未按下时红色）
        graphics.fillStyle(isPressed ? 0x66FF66 : 0xFF6666, 1);
        const buttonY = isPressed ? 5 : 2; // 按下时位置下移
        graphics.fillRect(10, buttonY, 30, 12);
        graphics.lineStyle(2, 0x333333, 1);
        graphics.strokeRect(10, buttonY, 30, 12);

        graphics.generateTexture(textureKey, 50, 25);
        this.setTexture(textureKey);
        this.setDisplaySize(50, 25);
    }

    /**
     * 触发目标
     */
    private triggerTarget(): void {
        // 查找目标对象
        const door = this.scene.children.getByName('door') as Door;
        if (door) {
            door.meetCondition(this.targetId);
        }
    }

    /**
     * 取消触发目标
     */
    private untriggerTarget(): void {
        const door = this.scene.children.getByName('door') as Door;
        if (door) {
            door.removeCondition(this.targetId);
        }
    }

    destroy(): void {
        this.scene.events.off('update', this.update, this);
        super.destroy();
    }
}
