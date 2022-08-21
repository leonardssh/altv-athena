import * as alt from 'alt-client';

const holdableKeys: { [key: string]: { onKeyDown: Function; onKeyUp: Function } } = {};

class InternalFunctions {
    static handleKeyUp(key: number) {
        if (!holdableKeys[key]) {
            return;
        }

        holdableKeys[key].onKeyUp();
    }

    static handleKeyDown(key: number) {
        if (!holdableKeys[key]) {
            return;
        }

        holdableKeys[key].onKeyDown();
    }
}

export class KeyHeld {
    static init() {
        alt.on('keyup', InternalFunctions.handleKeyUp);
        alt.on('keydown', InternalFunctions.handleKeyDown);
        alt.log(`KeyHeld was initialized`);
    }

    /**
     * Use https://keycode.info for proper key numbers.
     *
     * @static
     * @param {number} key
     * @param {Function} onKeyDown What to do when the key is pressed down.
     * @param {Function} onKeyUp What to do when the key is let go.
     * @return {*}
     * @memberof KeyHeld
     */
    static register(key: number, onKeyDown: Function, onKeyUp: Function) {
        // Verify a key is passed
        if (typeof key === 'undefined') {
            alt.logError(`Key was not specified for KeyHeld.register`);
            return;
        }

        // Verify functions have values
        if (typeof onKeyDown !== 'function' || typeof onKeyUp !== 'function') {
            alt.logWarning(`${key} in KeyHeld.register does not have valid callback functions.`);
            return;
        }

        // Register the callbacks
        holdableKeys[key] = {
            onKeyUp,
            onKeyDown,
        };

        alt.log(`${String.fromCharCode(key)} | Was Registered in KeyHeld`);
    }

    /**
     * Use https://keycode.info for proper key numbers.
     *
     * @static
     * @param {number} key
     * @param {Function} onKeyDown Handle to the onKeyDown callback used in the register method call.
     * @param {Function} onKeyUp Handle to the onKeyUp callback used in the register method call.
     * @return {void}
     * @memberof KeyHeld
     */
    static unregister(key: number, onKeyDown: Function, onKeyUp: Function): void {
        // Verify a key is passed
        if (typeof key === 'undefined') {
            alt.logError(`Key was not specified for KeyHeld.unregister`);
            return;
        }

        // Verify functions have values
        if (typeof onKeyDown !== 'function' || typeof onKeyUp !== 'function') {
            alt.logWarning(`${key} in KeyHeld.unregister does not have valid callback functions.`);
            return;
        }

        if (!holdableKeys[key]) {
            return;
        }

        const keyUpExists = holdableKeys[key].onKeyUp === onKeyUp;
        const keyDownExists = holdableKeys[key].onKeyDown === onKeyDown;

        if (keyUpExists && keyDownExists) {
            delete holdableKeys[key];
            return;
        }

        if (keyUpExists) {
            delete holdableKeys[key].onKeyUp;
        } else if (keyDownExists) {
            delete holdableKeys[key].onKeyDown;
        }
    }
}

KeyHeld.init();
