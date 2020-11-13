import {XtalDecor, PropAction, propActions} from 'xtal-decor/xtal-decor.js';
import {define, AttributeProps} from 'xtal-element/XtalElement.js';

export class ReSrc extends XtalDecor {
    static is = 're-src';

    ifWantsToBe = 'persistable';
    actions = [];
    upgrade = 'nav';

    capture = {
        click: ({self})
    }
}
define(ReSrc);