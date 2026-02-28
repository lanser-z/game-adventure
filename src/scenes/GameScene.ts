/**
 * 游戏场景 - 核心游戏玩法
 */

import Phaser from 'phaser';
import { Player } from '../objects/Player';
import { Platform } from '../objects/Platform';
import { PushBlock } from '../objects/PushBlock';
import { Door } from '../objects/Door';
import { Button } from '../objects/Button';
import { Enemy } from '../objects/Enemy';
import { TriggerZone } from '../objects/TriggerZone';
import { TouchControls } from '../objects/TouchControls';
import { AudioManager } from '../managers/AudioManager';

export interface LevelConfig {
    levelId: number;
    name: string;
    gravity: number;
    player: {
        startPosition: [number, number];
        jumpForce: number;
        moveSpeed: number;
        doubleJumpEnabled: boolean;
    };
    platforms: Array<{
        type: string;
        position: [number, number];
        size: [number, number];
        path?: [number, number][];
        speed?: number;
    }>;
    blocks: Array<{
        type: string;
        position: [number, number];
        size: [number, number];
    }>;
    triggers: Array<{
        type: string;
        position: [number, number];
        size: [number, number];
    }>;
    buttons: Array<{
        type: string;
        position: [number, number];
        target: string;
        requiredWeight: number;
    }>;
    door: {
        position: [number, number];
        requires: string[];
    };
    enemies: Array<{
        type: string;
        position: [number, number];
        range: [number, number];
        speed: number;
    }>;
}

export class GameScene extends Phaser.Scene {
    private levelId!: number | string;
    private levelConfig!: LevelConfig;
    private player!: Player;
    private platforms: Platform[] = [];
    private blocks: PushBlock[] = [];
    private buttons: Button[] = [];
    private enemies: Enemy[] = [];
    private door!: Door;
    private triggers: TriggerZone[] = [];
    private audioManager!: AudioManager;

    // UI
    private pauseButton!: Phaser.GameObjects.Text;
    private levelText!: Phaser.GameObjects.Text;
    private deathText!: Phaser.GameObjects.Text;
    private timeText!: Phaser.GameObjects.Text;
    private touchControls!: TouchControls;

    // 游戏状态
    private gameTime: number = 0;
    private deathCount: number = 0;
    private isPaused: boolean = false;
    private isGameOver: boolean = false;

    constructor() {
        super({ key: 'GameScene' });
    }

    init(data: { levelId: number | string }): void {
        this.levelId = data.levelId;
        // 重置游戏状态
        this.isGameOver = false;
        this.isPaused = false;
        this.gameTime = 0;
        this.deathCount = 0;
        console.log('[GameScene] init - 关卡:', this.levelId, '状态已重置');
    }

    create(): void {
        // 加载关卡数据
        this.loadLevelData();

        // 初始化音频管理器
        this.audioManager = new AudioManager(this);
        this.audioManager.init();

        // 监听场景销毁事件，清理音频资源
        this.events.once('shutdown', () => {
            console.log('[GameScene] 场景关闭，清理音频资源');
            if (this.audioManager) {
                this.audioManager.destroy();
            }
        });

        // 设置物理世界边界
        this.physics.world.setBounds(0, 0, 2000, 1000);

        // 设置场景重力
        this.physics.world.gravity.y = this.levelConfig.gravity || 980;

        // 创建背景
        this.createBackground();

        // 创建关卡对象
        this.createLevelObjects();

        // 创建UI
        this.createUI();

        // 设置相机
        this.setupCamera();

        // 播放背景音乐
        this.audioManager.playBackgroundMusic();

        // 添加碰撞检测
        this.setupCollisions();

        // 计时器
        this.time.addEvent({
            delay: 1000,
            callback: this.updateGameTime,
            callbackScope: this,
            loop: true
        });
    }

    update(): void {
        if (this.isPaused || this.isGameOver) {
            return;
        }

        // 检测玩家是否掉出场景边界（死亡）
        if (this.player && this.player.y > 700) {
            if (!this.player.isDead) {
                this.player.die();
            }
        }

        // 更新UI
        this.updateUI();
    }

    /**
     * 加载关卡数据
     */
    private loadLevelData(): void {
        // 确定缓存键
        let cacheKey: string;
        if (this.levelId === 'test_level') {
            cacheKey = 'test_level';
        } else {
            cacheKey = `level${this.levelId}`;
        }

        // 检查缓存中是否有该关卡数据
        if (this.cache.json.exists(cacheKey)) {
            try {
                this.levelConfig = this.cache.json.get(cacheKey);
                console.log(`[GameScene] 加载关卡数据: ${cacheKey}`, this.levelConfig);
            } catch (e) {
                console.warn(`[GameScene] 关卡数据解析失败，使用默认数据`, e);
                this.levelConfig = this.getDefaultLevelData();
            }
        } else {
            console.log(`[GameScene] 关卡数据不存在: ${cacheKey}，使用默认数据`);
            // 使用默认测试数据
            this.levelConfig = this.getDefaultLevelData();
        }
    }

    /**
     * 获取默认关卡数据
     */
    private getDefaultLevelData(): LevelConfig {
        return {
            levelId: typeof this.levelId === 'number' ? this.levelId : 1,
            name: `关卡 ${this.levelId}`,
            gravity: 980,
            player: {
                startPosition: [100, 300],
                jumpForce: -400,
                moveSpeed: 150,
                doubleJumpEnabled: true
            },
            platforms: [
                { type: 'static', position: [0, 500], size: [300, 50] },
                { type: 'static', position: [350, 400], size: [200, 30] },
                { type: 'static', position: [600, 300], size: [200, 30] },
            ],
            blocks: (typeof this.levelId === 'number' && this.levelId > 5) ? [
                { type: 'pushable', position: [200, 450], size: [50, 50] }
            ] : [],
            triggers: [
                { type: 'death', position: [0, 600], size: [2000, 100] }
            ],
            buttons: [],
            door: { position: [700, 230], requires: [] },
            enemies: (typeof this.levelId === 'number' && this.levelId > 10) ? [
                { type: 'patrol', position: [400, 350], range: [300, 500], speed: 50 }
            ] : []
        };
    }

    /**
     * 创建背景
     */
    private createBackground(): void {
        const { width, height } = this.cameras.main;
        this.add.rectangle(width / 2, height / 2, width, height, 0x87CEEB);
    }

    /**
     * 创建关卡对象
     */
    private createLevelObjects(): void {
        // 创建玩家
        const [playerX, playerY] = this.levelConfig.player.startPosition;
        this.player = new Player(this, playerX, playerY);
        this.player.setAudioManager(this.audioManager);
        this.add.existing(this.player);

        // 创建触摸控制（移动端）
        this.touchControls = new TouchControls(this);
        this.player.setTouchControls(this.touchControls);
        this.player.setTouchEnabled(true);
        this.add.existing(this.player);

        // 创建平台
        this.levelConfig.platforms.forEach(data => {
            const [x, y] = data.position;
            const [w, h] = data.size;
            const platform = new Platform(this, x, y, w, h, data.type, data);
            this.add.existing(platform);
            this.platforms.push(platform);
        });

        // 创建可推箱子
        this.levelConfig.blocks.forEach(data => {
            const [x, y] = data.position;
            const [w, h] = data.size;
            const block = new PushBlock(this, x, y, w, h);
            this.add.existing(block);
            this.blocks.push(block);
        });

        // 创建按钮
        this.levelConfig.buttons.forEach(data => {
            const [x, y] = data.position;
            const button = new Button(this, x, y, data);
            this.add.existing(button);
            this.buttons.push(button);
        });

        // 创建敌人
        this.levelConfig.enemies.forEach(data => {
            const [x, y] = data.position;
            const enemy = new Enemy(this, x, y, data);
            this.add.existing(enemy);
            this.enemies.push(enemy);
        });

        // 创建触发区域
        this.levelConfig.triggers.forEach(data => {
            const [x, y] = data.position;
            const [w, h] = data.size;
            const trigger = new TriggerZone(this, x, y, w, h, data.type);
            this.add.existing(trigger);
            this.triggers.push(trigger);
        });

        // 创建门
        const [doorX, doorY] = this.levelConfig.door.position;
        this.door = new Door(this, doorX, doorY, this.levelConfig.door.requires);
        this.add.existing(this.door);

        // 设置按钮的玩家和箱子引用
        this.buttons.forEach(button => {
            button.setReferences(this.player, this.blocks);
        });
    }

    /**
     * 创建UI
     */
    private createUI(): void {
        const { width } = this.cameras.main;

        // 暂停按钮
        this.pauseButton = this.add.text(width - 80, 40, '暂停', {
            fontSize: '24px',
            fontFamily: 'Arial',
            color: '#ffffff',
            backgroundColor: '#FF9800',
            padding: { x: 15, y: 8 }
        });
        this.pauseButton.setOrigin(0.5);
        this.pauseButton.setInteractive({ useHandCursor: true });
        this.pauseButton.on('pointerdown', () => this.togglePause());

        // 关卡信息
        this.levelText = this.add.text(width / 2, 40, `关卡 ${this.levelId}`, {
            fontSize: '28px',
            fontFamily: 'Arial',
            color: '#ffffff',
            fontStyle: 'bold'
        });
        this.levelText.setOrigin(0.5);

        // 时间
        this.timeText = this.add.text(120, 40, '00:00', {
            fontSize: '24px',
            fontFamily: 'Arial',
            color: '#ffffff'
        });

        // 死亡次数
        this.deathText = this.add.text(width - 150, 40, '死亡: 0', {
            fontSize: '20px',
            fontFamily: 'Arial',
            color: '#ff6666'
        });
    }

    /**
     * 设置相机
     */
    private setupCamera(): void {
        this.cameras.main.setBounds(0, 0, 2000, 1000);
        this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
    }

    /**
     * 设置碰撞检测
     */
    private setupCollisions(): void {
        // 玩家与平台碰撞
        this.platforms.forEach(platform => {
            this.physics.add.collider(this.player, platform);
        });

        // 玩家与箱子碰撞
        this.blocks.forEach(block => {
            this.physics.add.collider(this.player, block);
        });

        // 箱子与平台碰撞
        this.blocks.forEach(block => {
            this.platforms.forEach(platform => {
                this.physics.add.collider(block, platform);
            });
        });

        // 箱子之间的碰撞（防止重叠）
        for (let i = 0; i < this.blocks.length; i++) {
            for (let j = i + 1; j < this.blocks.length; j++) {
                this.physics.add.collider(this.blocks[i], this.blocks[j]);
            }
        }

        // 玩家与敌人碰撞
        this.enemies.forEach(enemy => {
            this.physics.add.collider(this.player, enemy, this.handleEnemyCollision as any, undefined, this);
        });

        // 玩家与门碰撞
        this.physics.add.overlap(this.player, this.door, this.handleDoorOverlap as any, undefined, this);

        // 玩家与触发区域碰撞
        this.triggers.forEach(trigger => {
            this.physics.add.overlap(this.player, trigger, this.handleTriggerOverlap as any, undefined, this);
        });
    }

    /**
     * 处理敌人碰撞
     */
    private handleEnemyCollision(
        player: Player,
        enemy: Enemy
    ): void {
        // 检查是否踩到敌人头顶
        const playerBody = player.body as Phaser.Physics.Arcade.Body;
        if (playerBody && playerBody.velocity.y > 0 && player.y < enemy.y - 20) {
            // 踩死敌人
            enemy.die();
            this.audioManager.playSound('bounce');
            player.bounce();
        } else {
            // 玩家受伤
            player.die();
        }
    }

    /**
     * 处理门重叠
     */
    private handleDoorOverlap(
        _player: Player,
        door: Door
    ): void {
        // 防止重复触发（关卡已完成或已死亡）
        if (this.isGameOver) {
            console.log('[GameScene] 门碰撞被阻止 - 游戏已结束');
            return;
        }

        const isOpen = door.isOpenCheck();
        console.log('[GameScene] 碰到门 - 门是否打开:', isOpen);
        if (isOpen) {
            this.levelComplete();
        } else {
            console.log('[GameScene] 门未打开，无法过关');
        }
    }

    /**
     * 处理触发区域重叠
     */
    private handleTriggerOverlap(
        player: Player,
        trigger: TriggerZone
    ): void {
        trigger.activate(player);
    }

    /**
     * 更新UI
     */
    private updateUI(): void {
        const minutes = Math.floor(this.gameTime / 60);
        const seconds = this.gameTime % 60;
        this.timeText.setText(
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
        );
        this.deathText.setText(`死亡: ${this.deathCount}`);
    }

    /**
     * 更新游戏时间
     */
    private updateGameTime(): void {
        if (!this.isPaused && !this.isGameOver) {
            this.gameTime++;
        }
    }

    /**
     * 切换暂停
     */
    private togglePause(): void {
        this.isPaused = !this.isPaused;

        if (this.isPaused) {
            this.physics.pause();
            this.pauseButton.setText('继续');
            this.audioManager.pauseBackgroundMusic();
            this.showPauseMenu();
        } else {
            this.physics.resume();
            this.pauseButton.setText('暂停');
            this.audioManager.resumeBackgroundMusic();
            this.hidePauseMenu();
        }
    }

    /**
     * 显示暂停菜单
     */
    private showPauseMenu(): void {
        const { width, height } = this.cameras.main;

        const overlay = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.5);
        overlay.setInteractive();

        const menuBg = this.add.rectangle(width / 2, height / 2, 400, 300, 0xffffff);
        menuBg.setStrokeStyle(3, 0x333333);

        const title = this.add.text(width / 2, height / 2 - 80, '暂停', {
            fontSize: '48px',
            fontFamily: 'Arial',
            color: '#333333',
            fontStyle: 'bold'
        });
        title.setOrigin(0.5);

        // 重玩按钮
        const restartBtn = this.add.text(width / 2, height / 2, '重玩', {
            fontSize: '28px',
            fontFamily: 'Arial',
            color: '#ffffff',
            backgroundColor: '#4CAF50',
            padding: { x: 30, y: 12 }
        });
        restartBtn.setOrigin(0.5);
        restartBtn.setInteractive({ useHandCursor: true });
        restartBtn.on('pointerdown', () => this.restartLevel());

        // 退出按钮
        const quitBtn = this.add.text(width / 2, height / 2 + 60, '退出', {
            fontSize: '28px',
            fontFamily: 'Arial',
            color: '#ffffff',
            backgroundColor: '#f44336',
            padding: { x: 30, y: 12 }
        });
        quitBtn.setOrigin(0.5);
        quitBtn.setInteractive({ useHandCursor: true });
        quitBtn.on('pointerdown', () => this.quitToMenu());
    }

    /**
     * 隐藏暂停菜单
     */
    private hidePauseMenu(): void {
        // 清除暂停菜单元素
        this.children.getAll().forEach(child => {
            const texture = (child as any).texture;
            if (texture && texture.key === '__DEFAULT') {
                // 简化处理，实际应该用更好的方式管理
            }
        });
    }

    /**
     * 玩家死亡
     */
    public playerDied(): void {
        console.log('[GameScene] 玩家死亡，死亡次数:', this.deathCount);
        this.audioManager.playSound('death');
        this.deathCount++;
        this.time.delayedCall(1000, () => {
            console.log('[GameScene] 1秒后重新开始关卡');
            this.restartLevel();
        });
    }

    /**
     * 关卡完成
     */
    private levelComplete(): void {
        console.log('[GameScene] 关卡完成！');
        this.isGameOver = true;
        this.audioManager.playSound('door');

        const { width } = this.cameras.main;

        this.add.rectangle(width / 2, 320, width, 640, 0x000000, 0.7);

        const text = this.add.text(width / 2, 320, '关卡完成!', {
            fontSize: '64px',
            fontFamily: 'Arial',
            color: '#4CAF50',
            fontStyle: 'bold'
        });
        text.setOrigin(0.5);

        // 解锁下一关
        const maxUnlocked = this.registry.get('maxUnlockedLevel') || 1;
        if (typeof this.levelId === 'number' && this.levelId >= maxUnlocked && this.levelId < 20) {
            this.registry.set('maxUnlockedLevel', this.levelId + 1);
            console.log('[GameScene] 解锁下一关:', this.levelId + 1);
        }

        // 3秒后返回或进入下一关
        this.time.delayedCall(3000, () => {
            // 停止背景音乐，防止下一关重复播放
            this.audioManager.stopBackgroundMusic();

            if (typeof this.levelId === 'number' && this.levelId < 20) {
                console.log('[GameScene] 进入下一关:', this.levelId + 1);
                this.scene.start('GameScene', { levelId: this.levelId + 1 });
            } else {
                console.log('[GameScene] 返回主菜单');
                this.scene.start('MainMenuScene');
            }
        });
    }

    /**
     * 重玩关卡
     */
    private restartLevel(): void {
        // 停止背景音乐，防止重复播放
        this.audioManager.stopBackgroundMusic();
        this.scene.restart();
    }

    /**
     * 退出到菜单
     */
    private quitToMenu(): void {
        this.audioManager.destroy();
        this.scene.start('MainMenuScene');
    }

    /**
     * 获取音频管理器（供 Player 等对象使用）
     */
    public getAudioManager(): AudioManager {
        return this.audioManager;
    }
}
