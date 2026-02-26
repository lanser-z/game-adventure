/**
 * 关卡编辑器场景
 */

import Phaser from 'phaser';

// 预制物类型
enum PrefabType {
    PLATFORM = 'platform',
    PUSH_BLOCK = 'push_block',
    BUTTON = 'button',
    DOOR = 'door',
    ENEMY = 'enemy',
    SPAWN = 'spawn'
}

// 预制物数据
interface PrefabItem {
    type: PrefabType;
    x: number;
    y: number;
    width: number;
    height: number;
    data?: any;
}

export class EditorScene extends Phaser.Scene {
    // UI 元素
    private toolbar!: Phaser.GameObjects.Container;
    private saveButton!: Phaser.GameObjects.Text;
    private testButton!: Phaser.GameObjects.Text;
    private backButton!: Phaser.GameObjects.Text;
    private helpText!: Phaser.GameObjects.Text;
    private selectedInfoText!: Phaser.GameObjects.Text;

    // 编辑状态
    private selectedPrefab: PrefabType | null = null;
    private prefabItems: PrefabItem[] = [];
    private itemContainers: Map<PrefabItem, Phaser.GameObjects.Container> = new Map();
    private selectedItem: PrefabItem | null = null;
    private selectedHighlight: Phaser.GameObjects.Rectangle | null = null;

    // 视觉元素
    private gridGraphics!: Phaser.GameObjects.Graphics;

    // 关卡数据
    private levelData: any = {
        levelId: 1,
        name: '自定义关卡',
        gravity: 980,
        player: {
            startPosition: [100, 200],
            jumpForce: -400,
            moveSpeed: 150,
            doubleJumpEnabled: true
        },
        platforms: [],
        blocks: [],
        triggers: [
            { type: 'death', position: [0, 700], size: [2000, 100] }
        ],
        buttons: [],
        door: { position: [850, 70], requires: [] },
        enemies: []
    };

    constructor() {
        super({ key: 'EditorScene' });
    }

    create(): void {
        const { width, height } = this.cameras.main;

        // 背景
        this.add.rectangle(width / 2, height / 2, width, height, 0x2c3e50);

        // 绘制网格
        this.createGrid();

        // 创建工具栏
        this.createToolbar();

        // 创建UI按钮
        this.createUIButtons();

        // 设置输入
        this.setupInput();

        // 加载现有关卡数据（如果有的话）
        this.loadExistingLevel();

        // 显示帮助信息
        this.showHelp();
    }

    /**
     * 创建网格
     */
    private createGrid(): void {
        const { width, height } = this.cameras.main;
        this.gridGraphics = this.add.graphics();

        const gridSize = 25;

        this.gridGraphics.lineStyle(1, 0x34495e, 0.5);

        // 绘制垂直线
        for (let x = 0; x <= width; x += gridSize) {
            this.gridGraphics.moveTo(x, 0);
            this.gridGraphics.lineTo(x, height);
        }

        // 绘制水平线
        for (let y = 0; y <= height; y += gridSize) {
            this.gridGraphics.moveTo(0, y);
            this.gridGraphics.lineTo(width, y);
        }

        this.gridGraphics.strokePath();
    }

    /**
     * 创建工具栏
     */
    private createToolbar(): void {
        const startX = 15;
        const startY = 70;
        const spacing = 20;

        this.toolbar = this.add.container(0, 0);

        const prefabs = [
            { type: PrefabType.PLATFORM, label: '平台', color: 0x95a5a6 },
            { type: PrefabType.PUSH_BLOCK, label: '箱子', color: 0xdeb887 },
            { type: PrefabType.BUTTON, label: '按钮', color: 0xff6666 },
            { type: PrefabType.DOOR, label: '门', color: 0x8b4513 },
            { type: PrefabType.ENEMY, label: '敌人', color: 0xe74c3c },
            { type: PrefabType.SPAWN, label: '出生点', color: 0x3498db }
        ];

        prefabs.forEach((prefab, index) => {
            const x = startX;
            const y = startY + index * spacing;

            // 背景
            const bg = this.add.rectangle(x, y, 95, 40, prefab.color, 0.3);
            bg.setStrokeStyle(2, prefab.color, 1);
            bg.setData('prefabType', prefab.type);

            // 文字
            const text = this.add.text(x, y, prefab.label, {
                fontSize: '13px',
                color: '#ffffff',
                fontStyle: 'bold'
            });
            text.setOrigin(0.5);

            const container = this.add.container(x, y);
            container.add([bg, text]);
            container.setData('prefabType', prefab.type);

            this.toolbar.add(container);

            // 点击事件
            bg.setInteractive({ useHandCursor: true });
            bg.on('pointerdown', () => this.selectPrefab(prefab.type));
            bg.on('pointerover', () => bg.setFillStyle(prefab.color, 0.6));
            bg.on('pointerout', () => bg.setFillStyle(prefab.color, 0.3));
        });
    }

    /**
     * 创建UI按钮
     */
    private createUIButtons(): void {
        const { width } = this.cameras.main;

        // 保存按钮
        this.saveButton = this.add.text(width - 280, 30, '保存关卡', {
            fontSize: '18px',
            color: '#ffffff',
            backgroundColor: '#27ae60',
            padding: { x: 15, y: 8 }
        });
        this.saveButton.setOrigin(0.5);
        this.saveButton.setInteractive({ useHandCursor: true });
        this.saveButton.on('pointerdown', () => this.saveLevel());

        // 测试按钮
        this.testButton = this.add.text(width - 160, 30, '测试', {
            fontSize: '18px',
            color: '#ffffff',
            backgroundColor: '#f39c12',
            padding: { x: 15, y: 8 }
        });
        this.testButton.setOrigin(0.5);
        this.testButton.setInteractive({ useHandCursor: true });
        this.testButton.on('pointerdown', () => this.testLevel());

        // 返回按钮
        this.backButton = this.add.text(80, 30, '← 返回', {
            fontSize: '18px',
            color: '#ffffff',
            backgroundColor: '#e74c3c',
            padding: { x: 15, y: 8 }
        });
        this.backButton.setOrigin(0.5);
        this.backButton.setInteractive({ useHandCursor: true });
        this.backButton.on('pointerdown', () => this.goBack());

        // 清空按钮
        const clearButton = this.add.text(width - 100, 30, '清空', {
            fontSize: '18px',
            color: '#ffffff',
            backgroundColor: '#7f8c8d',
            padding: { x: 15, y: 8 }
        });
        clearButton.setOrigin(0.5);
        clearButton.setInteractive({ useHandCursor: true });
        clearButton.on('pointerdown', () => this.clearAll());
    }

    /**
     * 显示帮助信息
     */
    private showHelp(): void {
        this.helpText = this.add.text(400, 25,
            '左键：放置 | 拖拽：移动 | 右键：删除 | 选中后WASD调整大小 | Del删除',
            {
                fontSize: '14px',
                color: '#bdc3c7'
            }
        );
        this.helpText.setOrigin(0.5);

        // 选中物品信息
        this.selectedInfoText = this.add.text(400, 50, '', {
            fontSize: '14px',
            color: '#f1c40f'
        });
        this.selectedInfoText.setOrigin(0.5);
    }

    /**
     * 设置输入
     */
    private setupInput(): void {
        // 场景点击 - 放置预制物
        this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            // 排除工具栏区域和顶部UI区域
            if (pointer.x < 120 || pointer.y < 60) return;

            if (this.selectedPrefab) {
                this.placePrefab(pointer.x, pointer.y);
                this.selectedPrefab = null; // 放置后清除选择
            } else {
                // 点击空白处取消选择
                this.deselectItem();
            }
        });

        // 键盘控制 - 调整大小和删除
        this.input.keyboard!.on('keydown-DELETE', () => {
            if (this.selectedItem) {
                this.deletePrefab(this.selectedItem);
            }
        });

        this.input.keyboard!.on('keydown-W', () => {
            if (this.selectedItem) {
                this.resizeItem(this.selectedItem, 0, -25);
            }
        });

        this.input.keyboard!.on('keydown-S', () => {
            if (this.selectedItem) {
                this.resizeItem(this.selectedItem, 0, 25);
            }
        });

        this.input.keyboard!.on('keydown-A', () => {
            if (this.selectedItem) {
                this.resizeItem(this.selectedItem, -25, 0);
            }
        });

        this.input.keyboard!.on('keydown-D', () => {
            if (this.selectedItem) {
                this.resizeItem(this.selectedItem, 25, 0);
            }
        });
    }

    /**
     * 选择预制物类型
     */
    private selectPrefab(type: PrefabType): void {
        this.selectedPrefab = type;
        console.log('[Editor] 选择预制物:', type);
    }

    /**
     * 放置预制物
     */
    private placePrefab(x: number, y: number): void {
        if (!this.selectedPrefab) return;

        // 对齐到网格
        const gridSize = 25;
        x = Math.round(x / gridSize) * gridSize;
        y = Math.round(y / gridSize) * gridSize;

        let width = 100;
        let height = 30;
        let data: any = {};

        switch (this.selectedPrefab) {
            case PrefabType.PLATFORM:
                width = 120;
                height = 30;
                break;
            case PrefabType.PUSH_BLOCK:
                width = 50;
                height = 50;
                break;
            case PrefabType.BUTTON:
                width = 50;
                height = 25;
                data.target = 'btn1';
                data.requiredWeight = 1;
                break;
            case PrefabType.DOOR:
                width = 40;
                height = 60;
                break;
            case PrefabType.ENEMY:
                width = 40;
                height = 40;
                data.range = [100, 300];
                data.speed = 50;
                break;
            case PrefabType.SPAWN:
                width = 40;
                height = 50;
                break;
        }

        const item: PrefabItem = {
            type: this.selectedPrefab,
            x: x - width / 2,
            y: y - height / 2,
            width,
            height,
            data
        };

        this.prefabItems.push(item);
        this.renderPrefab(item);
        this.selectedPrefab = null;
    }

    /**
     * 渲染预制物
     */
    private renderPrefab(item: PrefabItem): void {
        const container = this.add.container(item.x + item.width / 2, item.y + item.height / 2);

        let color = 0xffffff;
        switch (item.type) {
            case PrefabType.PLATFORM: color = 0x95a5a6; break;
            case PrefabType.PUSH_BLOCK: color = 0xdeb887; break;
            case PrefabType.BUTTON: color = 0xff6666; break;
            case PrefabType.DOOR: color = 0x8b4513; break;
            case PrefabType.ENEMY: color = 0xe74c3c; break;
            case PrefabType.SPAWN: color = 0x3498db; break;
        }

        // 主体
        const rect = this.add.rectangle(0, 0, item.width, item.height, color, 0.8);
        rect.setStrokeStyle(2, 0xffffff, 1);
        rect.setName('body');
        container.add(rect);

        // 类型标签
        const label = this.add.text(0, 0, this.getTypeLabel(item.type), {
            fontSize: '11px',
            color: '#ffffff'
        });
        label.setOrigin(0.5);
        container.add(label);

        // 设置可交互
        container.setSize(item.width, item.height);
        container.setInteractive({ useHandCursor: true });

        // 用于区分点击和拖拽
        let isClick = true;
        let dragDistance = 0;

        // 拖拽开始
        container.on('dragstart', () => {
            isClick = true;
            dragDistance = 0;
            container.setData('origX', container.x);
            container.setData('origY', container.y);
        });

        // 拖拽中
        container.on('drag', (_pointer: Phaser.Input.Pointer, dragX: number, dragY: number) => {
            const dx = dragX - container.x;
            const dy = dragY - container.y;
            dragDistance += Math.abs(dx) + Math.abs(dy);

            if (dragDistance > 5) {
                isClick = false;
            }

            container.x = dragX;
            container.y = dragY;
        });

        // 拖拽结束
        container.on('dragend', () => {
            const gridSize = 25;
            const newX = Math.round(container.x / gridSize) * gridSize;
            const newY = Math.round(container.y / gridSize) * gridSize;

            container.x = newX;
            container.y = newY;

            // 更新物品位置数据
            item.x = newX - item.width / 2;
            item.y = newY - item.height / 2;

            // 如果是点击而不是拖拽，选中该物品
            if (isClick) {
                this.selectItem(item);
            }
        });

        // 右键删除
        container.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            if (pointer.rightButtonDown()) {
                this.deletePrefab(item);
            }
        });

        // 启用拖拽
        this.input.setDraggable(container, true);

        // 保存引用
        this.itemContainers.set(item, container);
    }

    /**
     * 选中物品
     */
    private selectItem(item: PrefabItem): void {
        // 移除之前的选中高亮
        if (this.selectedHighlight) {
            this.selectedHighlight.destroy();
            this.selectedHighlight = null;
        }

        this.selectedItem = item;

        // 添加选中高亮边框
        const container = this.itemContainers.get(item);
        if (container) {
            this.selectedHighlight = this.add.rectangle(
                container.x, container.y,
                item.width + 10, item.height + 10,
                0xffff00, 0
            );
            this.selectedHighlight.setStrokeStyle(3, 0xffff00, 1);
        }

        // 更新信息显示
        this.updateSelectedInfo(item);
    }

    /**
     * 取消选中
     */
    private deselectItem(): void {
        if (this.selectedHighlight) {
            this.selectedHighlight.destroy();
            this.selectedHighlight = null;
        }
        this.selectedItem = null;
        this.selectedInfoText.setText('');
    }

    /**
     * 调整物品大小
     */
    private resizeItem(item: PrefabItem, deltaWidth: number, deltaHeight: number): void {
        const minWidth = 25;
        const minHeight = 25;

        item.width = Math.max(minWidth, item.width + deltaWidth);
        item.height = Math.max(minHeight, item.height + deltaHeight);

        // 重新渲染
        const container = this.itemContainers.get(item);
        if (container) {
            container.destroy();
            this.itemContainers.delete(item);
        }

        this.renderPrefab(item);
        this.selectItem(item); // 重新选中以显示高亮
        this.updateSelectedInfo(item);
    }

    /**
     * 更新选中信息显示
     */
    private updateSelectedInfo(item: PrefabItem): void {
        const typeLabel = this.getTypeLabel(item.type);
        this.selectedInfoText.setText(`${typeLabel}: ${item.width}x${item.height} | WASD调整 | Del删除`);
    }

    /**
     * 删除预制物
     */
    private deletePrefab(item: PrefabItem): void {
        const index = this.prefabItems.indexOf(item);
        if (index > -1) {
            this.prefabItems.splice(index, 1);

            // 删除视觉元素
            const container = this.itemContainers.get(item);
            if (container) {
                container.destroy();
                this.itemContainers.delete(item);
            }

            // 如果删除的是当前选中项，清除选中状态
            if (this.selectedItem === item) {
                this.deselectItem();
            }
        }
    }

    /**
     * 清空所有
     */
    private clearAll(): void {
        this.prefabItems = [];
        this.itemContainers.forEach(container => container.destroy());
        this.itemContainers.clear();
    }

    /**
     * 保存关卡
     */
    private saveLevel(): void {
        this.buildLevelData();

        // 获取自定义关卡列表
        let customLevels: any[] = [];
        const savedList = localStorage.getItem('customLevels');
        if (savedList) {
            try {
                customLevels = JSON.parse(savedList);
            } catch (e) {
                console.warn('[Editor] 无法解析自定义关卡列表');
            }
        }

        // 分配新的关卡ID (从21开始，避免与内置关卡冲突)
        const newLevelId = 21 + customLevels.length;
        this.levelData.levelId = newLevelId;
        this.levelData.name = `自定义关卡 ${customLevels.length + 1}`;

        // 保存关卡数据
        const levelKey = `custom_level_${newLevelId}`;
        localStorage.setItem(levelKey, JSON.stringify(this.levelData));

        // 更新关卡列表
        customLevels.push({
            levelId: newLevelId,
            key: levelKey,
            name: this.levelData.name,
            isCustom: true
        });
        localStorage.setItem('customLevels', JSON.stringify(customLevels));

        // 显示成功消息
        alert(`关卡已保存！\n${this.levelData.name}\n\n在关卡选择界面可以找到`);
    }

    /**
     * 测试关卡
     */
    private testLevel(): void {
        this.buildLevelData();

        // 临时保存到缓存
        this.cache.json.add('test_level', this.levelData);

        // 启动游戏场景
        this.scene.start('GameScene', { levelId: 'test_level' });
    }

    /**
     * 构建关卡数据
     */
    private buildLevelData(): void {
        this.levelData.platforms = [];
        this.levelData.blocks = [];
        this.levelData.buttons = [];
        this.levelData.enemies = [];

        for (const item of this.prefabItems) {
            const pos: [number, number] = [item.x, item.y];
            const size: [number, number] = [item.width, item.height];

            switch (item.type) {
                case PrefabType.PLATFORM:
                    this.levelData.platforms.push({
                        type: 'static',
                        position: pos,
                        size
                    });
                    break;
                case PrefabType.PUSH_BLOCK:
                    this.levelData.blocks.push({
                        type: 'pushable',
                        position: pos,
                        size
                    });
                    break;
                case PrefabType.BUTTON:
                    this.levelData.buttons.push({
                        type: 'pressure',
                        position: pos,
                        target: item.data?.target || 'btn1',
                        requiredWeight: 1
                    });
                    break;
                case PrefabType.ENEMY:
                    this.levelData.enemies.push({
                        type: 'patrol',
                        position: pos,
                        range: item.data?.range || [100, 300],
                        speed: item.data?.speed || 50
                    });
                    break;
                case PrefabType.SPAWN:
                    this.levelData.player.startPosition = [item.x + item.width / 2, item.y + item.height / 2];
                    break;
            }
        }
    }

    /**
     * 加载现有关卡
     */
    private loadExistingLevel(): void {
        // 可以从 localStorage 或其他地方加载
        const saved = localStorage.getItem('editorLevel');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                this.levelData = data;
                this.loadFromLevelData(data);
            } catch (e) {
                console.warn('[Editor] 无法加载保存的关卡');
            }
        }
    }

    /**
     * 从关卡数据加载
     */
    private loadFromLevelData(data: any): void {
        this.clearAll();

        // 加载平台
        data.platforms?.forEach((p: any) => {
            const item: PrefabItem = {
                type: PrefabType.PLATFORM,
                x: p.position[0],
                y: p.position[1],
                width: p.size[0],
                height: p.size[1]
            };
            this.prefabItems.push(item);
            this.renderPrefab(item);
        });

        // 加载箱子
        data.blocks?.forEach((b: any) => {
            const item: PrefabItem = {
                type: PrefabType.PUSH_BLOCK,
                x: b.position[0],
                y: b.position[1],
                width: b.size[0],
                height: b.size[1]
            };
            this.prefabItems.push(item);
            this.renderPrefab(item);
        });

        // 加载按钮
        data.buttons?.forEach((b: any) => {
            const item: PrefabItem = {
                type: PrefabType.BUTTON,
                x: b.position[0],
                y: b.position[1],
                width: 50,
                height: 25,
                data: { target: b.target, requiredWeight: b.requiredWeight }
            };
            this.prefabItems.push(item);
            this.renderPrefab(item);
        });

        // 加载敌人
        data.enemies?.forEach((e: any) => {
            const item: PrefabItem = {
                type: PrefabType.ENEMY,
                x: e.position[0],
                y: e.position[1],
                width: 40,
                height: 40,
                data: { range: e.range, speed: e.speed }
            };
            this.prefabItems.push(item);
            this.renderPrefab(item);
        });
    }

    /**
     * 返回主菜单
     */
    private goBack(): void {
        // 保存当前编辑状态
        this.buildLevelData();
        localStorage.setItem('editorLevel', JSON.stringify(this.levelData));

        this.scene.start('MainMenuScene');
    }

    /**
     * 获取类型标签
     */
    private getTypeLabel(type: PrefabType): string {
        const labels: Record<PrefabType, string> = {
            [PrefabType.PLATFORM]: '平台',
            [PrefabType.PUSH_BLOCK]: '箱子',
            [PrefabType.BUTTON]: '按钮',
            [PrefabType.DOOR]: '门',
            [PrefabType.ENEMY]: '敌人',
            [PrefabType.SPAWN]: '出生点'
        };
        return labels[type];
    }
}
