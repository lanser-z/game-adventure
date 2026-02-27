/**
 * 平台适配层 - 统一入口
 * 根据环境自动选择合适的适配器
 */

import { WechatAdapter, wechatAdapter } from './WechatAdapter';

/**
 * 平台类型
 */
export type PlatformType = 'web' | 'wechat' | 'douyin' | 'alipay';

/**
 * 平台管理器
 */
export class PlatformManager {
    private static instance: PlatformManager;
    private currentPlatform: PlatformType = 'web';
    private adapter: WechatAdapter = wechatAdapter;

    private constructor() {
        this.detectPlatform();
    }

    static getInstance(): PlatformManager {
        if (!PlatformManager.instance) {
            PlatformManager.instance = new PlatformManager();
        }
        return PlatformManager.instance;
    }

    /**
     * 检测当前平台
     */
    private detectPlatform(): void {
        const wx = (window as any).wx;
        const my = (window as any).my;
        const tt = (window as any).tt;

        if (typeof wx !== 'undefined') {
            this.currentPlatform = 'wechat';
        } else if (typeof my !== 'undefined') {
            this.currentPlatform = 'alipay';
        } else if (typeof tt !== 'undefined') {
            this.currentPlatform = 'douyin';
        } else {
            this.currentPlatform = 'web';
        }

        console.log(`[Platform] 当前平台: ${this.currentPlatform}`);
    }

    /**
     * 获取当前平台
     */
    getPlatform(): PlatformType {
        return this.currentPlatform;
    }

    /**
     * 是否在微信小游戏环境
     */
    isWechat(): boolean {
        return this.currentPlatform === 'wechat';
    }

    /**
     * 是否在 Web 环境
     */
    isWeb(): boolean {
        return this.currentPlatform === 'web';
    }

    /**
     * 获取微信适配器
     */
    getWechatAdapter(): WechatAdapter {
        return this.adapter;
    }

    /**
     * 初始化平台
     */
    init(): void {
        if (this.isWechat()) {
            try {
                this.adapter.init();
            } catch (e) {
                console.warn('[Platform] 初始化失败:', e);
            }
        }
    }

    /**
     * 设置分享
     */
    setupShare(title?: string): void {
        if (this.isWechat()) {
            this.adapter.onShareAppMessage(() => ({
                title: title || '来玩小青蛙大冒险！20个益智关卡等你挑战',
                imageUrl: ''
            }));
            this.adapter.showShareButton();
        }
    }
}

// 导出单例
export const platformManager = PlatformManager.getInstance();
