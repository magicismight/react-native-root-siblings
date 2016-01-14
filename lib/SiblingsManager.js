import callbacks from 'jquery-callbacks';
let decorators = {};
let decoratorUid = 0;
let setCallbacks = callbacks();
let updateCallbacks = callbacks();
let destroyCallbacks = callbacks();

class SiblingsManager {
    constructor(element) {
        decoratorUid++;
        decorators[decoratorUid] = element;
        this.id = decoratorUid;
        setCallbacks.fire(element, decoratorUid);
    }

    static addListener = (event, cb) => {
        switch (event) {
            case 'set':
                setCallbacks.add(cb);
                break;
            case 'update':
                updateCallbacks.add(cb);
                break;
            case 'destroy':
                destroyCallbacks.add(cb);
                break;
            default:
                console.warn(`SiblingsManager.addListener: Unexpected event \`${event}\`.\nEvent must be one of the ['set','update','destroy']`);
        }
    };

    static removeListener = (event, cb) => {
        switch (event) {
            case 'set':
                setCallbacks.remove(cb);
                break;
            case 'update':
                updateCallbacks.remove(cb);
                break;
            case 'destroy':
                destroyCallbacks.remove(cb);
                break;
            default:
                console.warn(`SiblingsManager.removeListener: Unexpected event \`${event}\`.\nEvent must be one of the ['set','update','destroy']`);
        }
    };

    update = element => {
        updateCallbacks.fire(element, decorators[this.id], this.id);
        decorators[this.id] = element;
    };

    destroy = () => {
        destroyCallbacks.fire(decorators[this.id], this.id);
        delete decorators[this.id];
    };
}

export default SiblingsManager;
