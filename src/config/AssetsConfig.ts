/**
 * 资源配置文件
 * 统一管理本地和远程资源路径
 */

// 环境检测
const isWechat = typeof (window as any).wx !== 'undefined';
const isLocalhost = window.location.hostname === 'localhost' ||
                     window.location.hostname === '127.0.0.1' ||
                     window.location.hostname === '';

// 是否使用远程 CDN
// - 微信环境：强制使用远程
// - H5 开发环境(localhost)：使用本地
// - H5 生产环境：使用远程
const useRemoteCDN = isWechat || !isLocalhost;

// 远程 CDN 配置
export const CDN_BASE_URL = 'https://lanser.fun/game/frog/assets';

// 资源路径配置
export const AssetsConfig = {
    // 是否使用远程资源
    useRemote: useRemoteCDN,

    // 远程资源基础路径
    remoteBase: CDN_BASE_URL,

    // 本地资源路径（H5 开发环境）
    localBase: 'assets',

    /**
     * 获取资源完整 URL
     * @param path 资源相对路径，如 'player/idle_1.png'
     * @returns 完整的资源 URL
     */
    getUrl(path: string): string {
        const base = this.useRemote ? this.remoteBase : this.localBase;
        return `${base}/${path}`;
    },

    /**
     * 获取玩家图片资源 URL
     */
    getPlayerImageUrl(name: string): string {
        return this.getUrl(`player/${name}.png`);
    },

    /**
     * 获取音频资源 URL
     */
    getAudioUrl(path: string): string {
        return this.getUrl(`audio/${path}`);
    },

    /**
     * 获取数据资源 URL
     */
    getDataUrl(path: string): string {
        return this.getUrl(`data/${path}`);
    }
};

/**
 * 资源列表配置
 * 用于预加载和资源管理
 */
export const AssetList = {
    // 玩家图片资源
    playerImages: [
        'idle_1', 'idle_2',
        'walk_left_1', 'walk_left_2',
        'walk_right_1', 'walk_right_2',
        'jump', 'fall'
    ],

    // 音频资源
    audio: [
        'bgm_main.mp3',
        'sfx_jump.mp3',
        'sfx_doubleJump.mp3',
        'sfx_collect.mp3',
        'sfx_door.mp3',
        'sfx_death.mp3',
        'sfx_bounce.mp3',
        'sfx_button.mp3'
    ],

    // 获取玩家图片完整路径
    getPlayerImagePath(name: string): string {
        return AssetsConfig.getPlayerImageUrl(name);
    },

    // 获取音频完整路径
    getAudioPath(name: string): string {
        return AssetsConfig.getAudioUrl(name);
    }
};
