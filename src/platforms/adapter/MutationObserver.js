/**
 * MutationObserver polyfill for WeChat Mini Game
 */

(function() {
    function MutationObserver(callback) {
        this.callback = callback;
        this.observe = function() {};
        this.disconnect = function() {};
    }

    MutationObserver.prototype.observe = function() {};
    MutationObserver.prototype.disconnect = function() {};
    MutationObserver.prototype.takeRecords = function() { return []; };

    if (typeof GameGlobal !== 'undefined') {
        GameGlobal.MutationObserver = MutationObserver;
    }
    if (typeof global !== 'undefined') {
        global.MutationObserver = MutationObserver;
    }
    if (typeof window !== 'undefined') {
        window.MutationObserver = MutationObserver;
    }
})();
