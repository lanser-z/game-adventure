/**
 * 微信小游戏平台适配
 */

export interface WechatMinigameConfig {
    appId?: string;
}

export class WechatAdapter {
    private wx: any;

    constructor() {
        this.wx = (window as any).wx;
    }

    /**
     * 检查是否在微信小游戏环境
     */
    isWechatEnv(): boolean {
        return !!this.wx;
    }

    /**
     * 初始化微信SDK
     */
    init(_config: WechatMinigameConfig = {}): void {
        if (!this.isWechatEnv()) {
            console.warn('[WechatAdapter] 不在微信小游戏环境');
            return;
        }

        console.log('[WechatAdapter] 初始化微信小游戏');
    }

    /**
     * 用户登录
     */
    login(): Promise<any> {
        return new Promise((resolve, reject) => {
            if (!this.isWechatEnv()) {
                // 测试环境模拟登录
                resolve({ userInfo: { nickName: '测试玩家' } });
                return;
            }

            this.wx.login({
                success: (res: any) => {
                    console.log('[WechatAdapter] 登录成功', res);
                    resolve(res);
                },
                fail: (err: any) => {
                    console.error('[WechatAdapter] 登录失败', err);
                    reject(err);
                }
            });
        });
    }

    /**
     * 获取用户信息
     */
    getUserInfo(): Promise<any> {
        return new Promise((resolve, reject) => {
            if (!this.isWechatEnv()) {
                resolve({ nickName: '测试玩家', avatarUrl: '' });
                return;
            }

            this.wx.getUserInfo({
                success: (res: any) => resolve(res),
                fail: (err: any) => reject(err)
            });
        });
    }

    /**
     * 分享到微信
     */
    share(title: string, imageUrl?: string, query?: string): void {
        if (!this.isWechatEnv()) {
            console.log('[WechatAdapter] 分享:', title);
            return;
        }

        this.wx.shareAppMessage({
            title: title,
            imageUrl: imageUrl || '',
            query: query || ''
        });
    }

    /**
     * 设置分享信息
     */
    onShareAppMessage(callback: (options: any) => any): void {
        if (!this.isWechatEnv()) return;

        this.wx.onShareAppMessage(callback);
    }

    /**
     * 显示分享按钮
     */
    showShareButton(config: any = {}): void {
        if (!this.isWechatEnv()) return;

        this.wx.showShareMenu({
            withShareTicket: true,
            ...config
        });

        this.wx.onShareAppMessage(() => {
            return {
                title: '来玩小青蛙的奇妙冒险！',
                imageUrl: ''
            };
        });
    }

    /**
     * 获取系统信息
     */
    getSystemInfo(): Promise<any> {
        return new Promise((resolve) => {
            if (!this.isWechatEnv()) {
                resolve({
                    model: 'test',
                    system: 'test',
                    platform: 'test',
                    screenWidth: 960,
                    screenHeight: 640,
                    windowWidth: 960,
                    windowHeight: 640
                });
                return;
            }

            this.wx.getSystemInfo({
                success: (res: any) => resolve(res),
                fail: () => resolve({})
            });
        });
    }

    /**
     * 设置屏幕方向
     */
    setScreenOrientation(orientation: 'portrait' | 'landscape'): void {
        if (!this.isWechatEnv()) return;

        this.wx.setScreenOrientation({
            orientation: orientation === 'portrait' ? 'portrait-primary' : 'landscape-primary'
        });
    }

    /**
     * 监听内存警告
     */
    onMemoryWarning(callback: () => void): void {
        if (!this.isWechatEnv()) return;

        this.wx.onMemoryWarning(callback);
    }

    /**
     * 显示Toast
     */
    showToast(title: string, icon: 'success' | 'loading' | 'none' = 'success', duration = 2000): void {
        if (!this.isWechatEnv()) {
            console.log(`[Toast] ${title}`);
            return;
        }

        this.wx.showToast({
            title: title,
            icon: icon,
            duration: duration
        });
    }

    /**
     * 显示模态框
     */
    showModal(options: {
        title?: string;
        content: string;
        showCancel?: boolean;
        confirmText?: string;
        cancelText?: string;
    }): Promise<boolean> {
        return new Promise((resolve) => {
            if (!this.isWechatEnv()) {
                console.log(`[Modal] ${options.content}`);
                resolve(true);
                return;
            }

            this.wx.showModal({
                ...options,
                success: (res: any) => resolve(res.confirm),
                fail: () => resolve(false)
            });
        });
    }

    /**
     * 保存数据到本地
     */
    setStorageSync(key: string, data: any): void {
        if (!this.isWechatEnv()) {
            localStorage.setItem(key, JSON.stringify(data));
            return;
        }

        this.wx.setStorageSync(key, data);
    }

    /**
     * 从本地读取数据
     */
    getStorageSync(key: string): any {
        if (!this.isWechatEnv()) {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        }

        return this.wx.getStorageSync(key);
    }

    /**
     * 移除本地数据
     */
    removeStorageSync(key: string): void {
        if (!this.isWechatEnv()) {
            localStorage.removeItem(key);
            return;
        }

        this.wx.removeStorageSync(key);
    }

    /**
     * 设置屏幕保持常亮
     */
    setKeepScreenOn(keep: boolean): void {
        if (!this.isWechatEnv()) return;

        this.wx.setKeepScreenOn({
            keepScreenOn: keep
        });
    }

    /**
     * 获取launchOptions
     */
    getLaunchOptionsSync(): any {
        if (!this.isWechatEnv()) {
            return { scene: 1001, query: {} };
        }

        return this.wx.getLaunchOptionsSync();
    }

    /**
     * 切换到小屏模式
     */
    enterFullscreen(): void {
        // 微信小游戏不支持全屏API，但可以通过CSS控制
    }

    /**
     * 触发重试
     */
    reportEvent(name: string, data: any = {}): void {
        if (!this.isWechatEnv()) return;

        this.wx.reportEvent(name, data);
    }
}

// 单例
export const wechatAdapter = new WechatAdapter();
