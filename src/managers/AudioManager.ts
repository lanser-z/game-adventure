/**
 * 音频管理器
 * 支持背景音乐和音效播放，兼容 Web 和微信小游戏
 */

import { wechatAdapter } from '../platform/WechatAdapter';

// 音效类型
export type SoundEffect = 'jump' | 'doubleJump' | 'collect' | 'door' | 'death' | 'bounce' | 'button';

// 音频配置
export interface AudioConfig {
    enabled: boolean;
    musicVolume: number;
    sfxVolume: number;
}

export class AudioManager {
    private scene: Phaser.Scene;
    private backgroundMusic: Phaser.Sound.BaseSound | null = null;
    private soundEffects: Map<SoundEffect, Phaser.Sound.BaseSound> = new Map();

    // 音频配置
    private config: AudioConfig = {
        enabled: true,
        musicVolume: 0.3,
        sfxVolume: 0.5
    };

    // 微信音频上下文
    private wxInnerAudioContext: any = null;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
        this.loadConfig();
    }

    /**
     * 加载音频配置
     */
    private loadConfig(): void {
        const saved = wechatAdapter.getStorageSync('audioConfig');
        if (saved) {
            try {
                this.config = { ...this.config, ...JSON.parse(saved) };
            } catch (e) {
                console.warn('[AudioManager] 配置加载失败，使用默认配置');
            }
        }
    }

    /**
     * 保存音频配置
     */
    private saveConfig(): void {
        wechatAdapter.setStorageSync('audioConfig', JSON.stringify(this.config));
    }

    /**
     * 初始化音频系统
     */
    init(): void {
        console.log('[AudioManager] 初始化音频系统');
        this.setupSoundEffects();
    }

    /**
     * 设置音效
     */
    private setupSoundEffects(): void {
        // 创建音效（如果音频文件已加载）
        const soundNames: SoundEffect[] = ['jump', 'doubleJump', 'collect', 'door', 'death', 'bounce', 'button'];

        soundNames.forEach(name => {
            const key = `sfx_${name}`;
            if (this.scene.cache.audio.exists(key)) {
                const sound = this.scene.sound.add(key) as Phaser.Sound.HTML5AudioSound;
                this.soundEffects.set(name, sound);
                console.log(`[AudioManager] 音效已加载: ${name}`);
            } else {
                console.log(`[AudioManager] 音效不存在: ${key}`);
            }
        });
    }

    /**
     * 播放背景音乐
     */
    playBackgroundMusic(loop = true): void {
        if (!this.config.enabled) return;

        // 停止当前背景音乐
        this.stopBackgroundMusic();

        // 微信环境优先使用 InnerAudioContext
        if (wechatAdapter.isWechatEnv()) {
            try {
                const wx = (window as any).wx;
                if (wx && wx.createInnerAudioContext) {
                    this.wxInnerAudioContext = wx.createInnerAudioContext();

                    // 获取 CDN 音频路径
                    const audioPath = this.getAudioPath('bgm_main.mp3');
                    this.wxInnerAudioContext.src = audioPath;

                    // 微信音频配置（先不设置 loop，等加载完成后再设置）
                    this.wxInnerAudioContext.volume = this.config.musicVolume;
                    this.wxInnerAudioContext.autoplay = false; // 手动控制播放
                    this.wxInnerAudioContext.obeyMuteSwitch = false; // iOS 忽略静音开关

                    let canPlayCalled = false;

                    // 监听可以播放事件
                    this.wxInnerAudioContext.onCanplay(() => {
                        if (canPlayCalled) return;
                        canPlayCalled = true;

                        console.log('[AudioManager] 微信音频可以播放，开始播放');
                        // 设置循环并在可以播放时才播放
                        this.wxInnerAudioContext.loop = loop;
                        this.wxInnerAudioContext.play();
                    });

                    this.wxInnerAudioContext.onPlay(() => {
                        console.log('[AudioManager] 微信背景音乐开始播放');
                    });

                    this.wxInnerAudioContext.onError((err: any) => {
                        console.error('[AudioManager] 微信音频错误:', err);
                        console.error('[AudioManager] 错误详情:', err.errMsg, err.errCode);
                    });

                    console.log('[AudioManager] 加载微信背景音乐:', audioPath);
                    return;
                }
            } catch (e) {
                console.warn('[AudioManager] 微信音频播放失败:', e);
            }
        }

        // 非微信环境使用 Phaser 音频
        if (this.scene.cache.audio.exists('bgm_main')) {
            this.backgroundMusic = this.scene.sound.add('bgm_main', {
                loop: loop,
                volume: this.config.musicVolume
            });
            this.backgroundMusic.play();
            console.log('[AudioManager] 播放背景音乐 (Phaser)');
        }
    }

    /**
     * 停止背景音乐
     */
    stopBackgroundMusic(): void {
        if (this.backgroundMusic) {
            this.backgroundMusic.stop();
            this.backgroundMusic = null;
        }

        if (this.wxInnerAudioContext) {
            try {
                this.wxInnerAudioContext.stop();
                this.wxInnerAudioContext.destroy();
                this.wxInnerAudioContext = null;
            } catch (e) {
                console.warn('[AudioManager] 停止微信音频失败:', e);
            }
        }
    }

    /**
     * 暂停背景音乐
     */
    pauseBackgroundMusic(): void {
        if (this.backgroundMusic) {
            this.backgroundMusic.pause();
        }

        if (this.wxInnerAudioContext) {
            try {
                this.wxInnerAudioContext.pause();
            } catch (e) {
                console.warn('[AudioManager] 暂停微信音频失败:', e);
            }
        }
    }

    /**
     * 恢复背景音乐
     */
    resumeBackgroundMusic(): void {
        if (!this.config.enabled) return;

        if (this.backgroundMusic) {
            if (!this.backgroundMusic.isPlaying) {
                this.backgroundMusic.resume();
            }
        }

        if (this.wxInnerAudioContext) {
            try {
                this.wxInnerAudioContext.play();
            } catch (e) {
                console.warn('[AudioManager] 恢复微信音频失败:', e);
            }
        }
    }

    /**
     * 播放音效
     */
    playSound(effect: SoundEffect): void {
        if (!this.config.enabled) return;

        // 微信环境使用 InnerAudioContext 播放音效
        if (wechatAdapter.isWechatEnv()) {
            this.playWeChatSound(effect);
            return;
        }

        // 非 微信环境使用 Phaser 音效
        const sound = this.soundEffects.get(effect) as any;
        if (sound) {
            const config: Phaser.Types.Sound.SoundConfig = {
                volume: this.config.sfxVolume
            };
            sound.play(config);
        } else {
            // 如果音效未加载，尝试使用 Web Audio API 生成简单音效
            this.generateBeep(effect);
        }
    }

    /**
     * 播放微信音效（使用 InnerAudioContext）
     */
    private playWeChatSound(effect: SoundEffect): void {
        try {
            const wx = (window as any).wx;
            if (!wx || !wx.createInnerAudioContext) {
                this.generateBeep(effect);
                return;
            }

            const audioContext = wx.createInnerAudioContext();
            const soundPath = this.getAudioPath(`sfx_${effect}.mp3`);

            audioContext.src = soundPath;
            audioContext.volume = this.config.sfxVolume;
            audioContext.autoplay = true;
            audioContext.obeyMuteSwitch = false;

            audioContext.onEnded(() => {
                audioContext.destroy();
            });

            audioContext.onError((err: any) => {
                console.warn(`[AudioManager] 微信音效播放失败 (${effect}):`, err);
                audioContext.destroy();
                // 降级到蜂鸣音效
                this.generateBeep(effect);
            });

            console.log(`[AudioManager] 播放微信音效: ${effect}`);
        } catch (e) {
            console.warn(`[AudioManager] 微信音效异常 (${effect}):`, e);
            this.generateBeep(effect);
        }
    }

    /**
     * 获取音频文件路径
     */
    private getAudioPath(filename: string): string {
        // 读取 CDN 配置
        const isWechat = typeof (window as any).wx !== 'undefined';
        const isLocalhost = window.location.hostname === 'localhost' ||
                            window.location.hostname === '127.0.0.1' ||
                            window.location.hostname === '';
        const useRemoteCDN = isWechat || !isLocalhost;

        if (useRemoteCDN) {
            return `https://lanser.fun/game/frog/assets/audio/${filename}`;
        }
        return `assets/audio/${filename}`;
    }

    /**
     * 生成简单的蜂鸣音效（当音频文件不可用时）
     */
    private generateBeep(effect: SoundEffect): void {
        try {
            const AudioContext = (window as any).AudioContext || (window as any).webkitAudioContext;
            if (!AudioContext) return;

            const ctx = new AudioContext();
            const oscillator = ctx.createOscillator();
            const gainNode = ctx.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(ctx.destination);

            // 根据音效类型设置不同频率
            let frequency = 440;
            let duration = 0.1;

            switch (effect) {
                case 'jump':
                    frequency = 400;
                    duration = 0.15;
                    break;
                case 'doubleJump':
                    frequency = 500;
                    duration = 0.15;
                    break;
                case 'collect':
                    frequency = 800;
                    duration = 0.1;
                    break;
                case 'door':
                    frequency = 600;
                    duration = 0.3;
                    break;
                case 'death':
                    frequency = 200;
                    duration = 0.3;
                    break;
                case 'bounce':
                    frequency = 450;
                    duration = 0.1;
                    break;
                case 'button':
                    frequency = 300;
                    duration = 0.05;
                    break;
            }

            oscillator.frequency.value = frequency;
            gainNode.gain.value = this.config.sfxVolume * 0.3;

            oscillator.start();
            gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
            oscillator.stop(ctx.currentTime + duration);
        } catch (e) {
            console.warn('[AudioManager] 生成音效失败:', e);
        }
    }

    /**
     * 设置音效音量
     */
    setSfxVolume(volume: number): void {
        this.config.sfxVolume = Math.max(0, Math.min(1, volume));
        this.saveConfig();
    }

    /**
     * 设置背景音乐音量
     */
    setMusicVolume(volume: number): void {
        this.config.musicVolume = Math.max(0, Math.min(1, volume));
        const bgm = this.backgroundMusic as any;
        if (bgm && bgm.setVolume) {
            bgm.setVolume(this.config.musicVolume);
        }
        if (this.wxInnerAudioContext) {
            this.wxInnerAudioContext.volume = this.config.musicVolume;
        }
        this.saveConfig();
    }

    /**
     * 切换静音状态
     */
    toggleMute(): boolean {
        this.config.enabled = !this.config.enabled;
        if (!this.config.enabled) {
            this.stopBackgroundMusic();
        }
        this.saveConfig();
        return this.config.enabled;
    }

    /**
     * 是否启用音频
     */
    isEnabled(): boolean {
        return this.config.enabled;
    }

    /**
     * 销毁音频管理器
     */
    destroy(): void {
        this.stopBackgroundMusic();
        this.soundEffects.forEach(sound => {
            if (sound) {
                sound.destroy();
            }
        });
        this.soundEffects.clear();
    }
}
