/**
 * Symbol polyfill for WeChat Mini Game
 * This provides ES6 Symbol support for libraries that need it
 */

if (typeof Symbol === 'undefined') {
    (function() {
        var Symbol = function(description) {
            var symbol = Object.create(null);
            Object.defineProperty(symbol, 'description', {
                value: String(description)
            });
            return symbol;
        };

        Symbol.for = function(key) {
            return Symbol(key);
        };

        Symbol.iterator = Symbol('Symbol.iterator');

        // Export to global
        if (typeof GameGlobal !== 'undefined') {
            GameGlobal.Symbol = Symbol;
        }
        if (typeof global !== 'undefined') {
            global.Symbol = Symbol;
        }
    })();
}
