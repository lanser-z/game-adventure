/**
 * 微信小游戏 Document API Polyfill
 * 添加 Phaser 3 需要的 document 方法
 */

// 确保 document.elementFromPoint 存在
// 使用 Object.defineProperty 绕过只读属性限制
if (typeof document !== 'undefined') {
    const originalElementFromPoint = document.elementFromPoint;

    // 使用 defineProperty 添加 polyfill
    try {
        Object.defineProperty(document, 'elementFromPoint', {
            value: function(x, y) {
                // 微信小游戏环境中只有一个 canvas
                // 总是返回 canvas 元素
                return window.canvas || null;
            },
            writable: true,
            configurable: true,
            enumerable: true
        });
        console.log('[DocumentPolyfill] document.elementFromPoint 已添加');
    } catch (e) {
        // 如果 defineProperty 失败，尝试直接赋值（在某些环境中可能成功）
        console.warn('[DocumentPolyfill] defineProperty 失败，尝试其他方式');
    }

    // 确保 document.caretRangeFromPoint 存在
    if (!document.caretRangeFromPoint) {
        Object.defineProperty(document, 'caretRangeFromPoint', {
            value: function() {
                return null;
            },
            writable: true,
            configurable: true,
            enumerable: true
        });
    }

    // 确保 document.createRange 存在
    if (!document.createRange) {
        Object.defineProperty(document, 'createRange', {
            value: function() {
                return {
                    setStart: function() {},
                    setEnd: function() {},
                    commonAncestorContainer: {},
                    collapse: function() {},
                    selectNodeContents: function() {}
                };
            },
            writable: true,
            configurable: true,
            enumerable: true
        });
    }
}

// 确保 window.getSelection 存在
if (typeof window !== 'undefined' && !window.getSelection) {
    Object.defineProperty(window, 'getSelection', {
        value: function() {
            return {
                removeAllRanges: function() {},
                addRange: function() {},
                toString: function() { return ''; }
            };
        },
        writable: true,
        configurable: true,
        enumerable: true
    });
}

console.log('[DocumentPolyfill] 已加载');
