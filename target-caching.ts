import {XtalDecor} from 'xtal-decor/xtal-decor.js';
import {define} from 'xtal-element/XtalElement.js';

var alreadyLoaded = new WeakMap<EventTarget, boolean>();

export class TargetCaching extends XtalDecor {
    static is='target-caching';
    on = {
        click: ({self}: any, e: Event) => {
            if(e.timeStamp === this._lastTimestamp) return;
            this._lastTimestamp = e.timeStamp;
            if(alreadyLoaded.has(e.target!)){
                e.preventDefault();
            }else{
                alreadyLoaded.set(e.target!, true);
            }
            const hyper = e.target as HTMLAnchorElement;
            if(hyper.target){
                const linkTarget = (hyper.getRootNode() as DocumentFragment).querySelector(`[name="${hyper.target}"]`) as HTMLIFrameElement;
                if(linkTarget !== null){
                    linkTarget.dataset.selected = '';
                }
            }
        }
    };
    init = (h: HTMLElement) => {};
    actions = [];
    upgrade = 'a';
    ifWantsToBe = 'target-caching';
    _lastTimestamp = -1;
}
define(TargetCaching);