/**
 * 关卡选择场景
 */

import Phaser from 'phaser';
import { wechatAdapter } from '../platform/WechatAdapter';

interface LevelItem {
    levelId: number;
    customKey?: string; // 自定义关卡在存储中的键名
    name?: string; // 自定义关卡名称
    unlocked: boolean;
    stars: number;
    completed: boolean;
}

export class LevelSelectScene extends Phaser.Scene {
    private levelItems: LevelItem[] = [];
    private backButton!: Phaser.GameObjects.Text;
    private levelButtons: Phaser.GameObjects.Container[] = [];

    constructor() {
        super({ key: 'LevelSelectScene' });
    }

    create(): void {
        const { width, height } = this.cameras.main;

        // 背景
        this.add.rectangle(width / 2, height / 2, width, height, 0x1a1a2e);

        // 标题
        const title = this.add.text(width / 2, 60, '选择关卡', {
            fontSize: '48px',
            fontFamily: 'Arial',
            color: '#ffffff',
            fontStyle: 'bold'
        });
        title.setOrigin(0.5);

        // 返回按钮
        this.backButton = this.add.text(80, 50, '← 返回', {
            fontSize: '28px',
            fontFamily: 'Arial',
            color: '#ffffff'
        });
        this.backButton.setInteractive({ useHandCursor: true });
        this.backButton.on('pointerdown', () => this.goBack());
        this.backButton.on('pointerover', () => this.backButton.setStyle({ color: '#4CAF50' }));
        this.backButton.on('pointerout', () => this.backButton.setStyle({ color: '#ffffff' }));

        // 加载关卡数据
        this.loadLevelData();

        // 创建关卡按钮
        this.createLevelButtons();

        // 显示总星级
        this.showTotalStars();
    }

    /**
     * 加载关卡数据
     */
    private loadLevelData(): void {
        const totalLevels = this.registry.get('totalLevels') || 20;
        const maxUnlocked = this.registry.get('maxUnlockedLevel') || 1;
        const levelStars = this.registry.get('levelStars') || {};

        // 加载内置关卡
        for (let i = 1; i <= totalLevels; i++) {
            this.levelItems.push({
                levelId: i,
                unlocked: true, // 所有关卡都解锁
                stars: levelStars[i] || 0,
                completed: i < maxUnlocked
            });
        }

        // 加载自定义关卡
        const customLevelsList = wechatAdapter.getStorageSync('customLevels');
        console.log('[LevelSelect] 自定义关卡列表:', customLevelsList);

        if (customLevelsList) {
            try {
                const customLevels: any[] = JSON.parse(customLevelsList);
                console.log('[LevelSelect] 解析后的自定义关卡:', customLevels);

                customLevels.forEach(custom => {
                    const customItem: LevelItem = {
                        levelId: custom.levelId,
                        customKey: custom.key,
                        name: custom.name,
                        unlocked: true,
                        stars: 0,
                        completed: false
                    };
                    this.levelItems.push(customItem);
                    console.log('[LevelSelect] 添加自定义关卡:', customItem);
                });
            } catch (e) {
                console.warn('[LevelSelect] 无法加载自定义关卡列表', e);
            }
        }

        console.log('[LevelSelect] 总关卡数:', this.levelItems.length);
    }

    /**
     * 创建关卡按钮
     */
    private createLevelButtons(): void {
        const startX = 120;
        const startY = 180;
        const spacingX = 160;
        const spacingY = 140;
        const perRow = 5;

        this.levelItems.forEach((item, index) => {
            const row = Math.floor(index / perRow);
            const col = index % perRow;

            const x = startX + col * spacingX;
            const y = startY + row * spacingY;

            const button = this.createLevelButton(x, y, item);
            this.levelButtons.push(button);
        });
    }

    /**
     * 创建单个关卡按钮
     */
    private createLevelButton(
        x: number,
        y: number,
        item: LevelItem
    ): Phaser.GameObjects.Container {
        const container = this.add.container(x, y);

        const isCustom = !!item.customKey;

        // 按钮背景 - 自定义关卡用紫色
        let bgColor: number;
        if (isCustom) {
            bgColor = 0x9B59B6; // 紫色表示自定义关卡
        } else {
            bgColor = item.unlocked
                ? (item.completed ? 0x4CAF50 : 0xFFFFFF)
                : 0x666666;
        }

        const bg = this.add.rectangle(0, 0, 100, 100, bgColor, 1);
        bg.setStrokeStyle(3, isCustom ? 0x8E44AD : (item.unlocked ? 0x333333 : 0x444444));

        // 关卡编号或名称
        const textColor = item.unlocked ? 0x333333 : 0x999999;
        let displayText: string;
        let fontSize: number;

        if (isCustom && item.name) {
            // 自定义关卡显示名称（简化版）
            displayText = '自';
            fontSize = 35;
        } else {
            displayText = `${item.levelId}`;
            fontSize = 40;
        }

        const text = this.add.text(0, -5, displayText, {
            fontSize: fontSize,
            fontFamily: 'Arial',
            color: `#${textColor.toString(16).padStart(6, '0')}`,
            fontStyle: 'bold'
        });
        text.setOrigin(0.5);

        container.add([bg, text]);

        // 自定义关卡标识
        if (isCustom) {
            const customLabel = this.add.text(0, 25, '自定义', {
                fontSize: '11px',
                fontFamily: 'Arial',
                color: '#ffffff'
            });
            customLabel.setOrigin(0.5);
            container.add(customLabel);
        }

        // 星级显示（仅内置关卡）
        if (item.unlocked && !isCustom) {
            this.addStars(container, item.stars);
        }

        // 点击事件
        if (item.unlocked) {
            bg.setInteractive();
            text.setInteractive();

            const originalColor = item.customKey ? 0x9B59B6 : (item.completed ? 0x4CAF50 : 0xFFFFFF);

            const handlePointerOver = () => {
                bg.setFillStyle(0x66BB6A);
                bg.setScale(1.05);
            };

            const handlePointerOut = () => {
                bg.setFillStyle(originalColor);
                bg.setScale(1);
            };

            bg.on('pointerover', handlePointerOver);
            bg.on('pointerout', handlePointerOut);
            text.on('pointerover', handlePointerOver);
            text.on('pointerout', handlePointerOut);

            bg.on('pointerdown', () => this.startLevel(item));
            text.on('pointerdown', () => this.startLevel(item));
        }

        return container;
    }

    /**
     * 添加星级显示
     */
    private addStars(container: Phaser.GameObjects.Container, stars: number): void {
        const starPositions = [-25, 0, 25];
        const starColor = 0xFFD700;

        starPositions.forEach((x, index) => {
            const filled = index < stars;
            const star = this.add.star(x, 35, 5, 8, 14, filled ? starColor : 0xCCCCCC, 1);
            container.add(star);
        });
    }

    /**
     * 显示总星级
     */
    private showTotalStars(): void {
        const { width } = this.cameras.main;

        let totalStars = 0;
        this.levelItems.forEach(item => {
            totalStars += item.stars;
        });

        const totalLevels = this.registry.get('totalLevels') || 20;
        const maxStars = totalLevels * 3;

        const starsText = this.add.text(width / 2, 580, `总星级: ${totalStars}/${maxStars}`, {
            fontSize: '24px',
            fontFamily: 'Arial',
            color: '#FFD700'
        });
        starsText.setOrigin(0.5);
    }

    /**
     * 开始关卡
     */
    private startLevel(item: LevelItem): void {
        // 如果是自定义关卡，先从 localStorage 加载数据到缓存
        if (item.customKey) {
            try {
                const levelData = wechatAdapter.getStorageSync(item.customKey);
                if (levelData) {
                    this.cache.json.add('custom_level', levelData);
                    this.scene.start('GameScene', { levelId: 'custom_level' });
                    return;
                }
            } catch (e) {
                console.error('[LevelSelect] 无法加载自定义关卡', e);
            }
        }

        // 内置关卡
        this.registry.set('currentLevel', item.levelId);
        this.scene.start('GameScene', { levelId: item.levelId });
    }

    /**
     * 返回主菜单
     */
    private goBack(): void {
        this.scene.start('MainMenuScene');
    }
}
