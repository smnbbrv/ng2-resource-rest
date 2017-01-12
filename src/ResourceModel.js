import { mapToModel } from './ResourceAction';
export function ResourceModelParams(params) {
    return function (target) {
        var providers = [];
        if (params) {
            providers = params.providers || [];
        }
        Reflect.defineMetadata('providers', providers, target);
    };
}
export var ResourceModel = (function () {
    function ResourceModel() {
        this.$primaryKey = 'id';
    }
    ResourceModel.create = function (data, commit) {
        if (data === void 0) { data = {}; }
        if (commit === void 0) { commit = true; }
        if (!this.resourceInstance) {
            console.error('You should first instantiate Resource by injecting.');
        }
        var result = mapToModel.bind(this.resourceInstance)(data, this);
        if (commit) {
            result = result.$save();
        }
        return result;
    };
    ResourceModel.prototype.$fillFromObject = function (_object) {
        for (var propName in _object) {
            if (_object.hasOwnProperty(propName)) {
                this[propName] = _object[propName];
            }
        }
        return this;
    };
    ResourceModel.prototype.$getData = function () {
        var _object = {};
        for (var propName in this) {
            if (!(this[propName] instanceof Function) && !(propName.charAt(0) === '$')) {
                _object[propName] = this[propName];
            }
        }
        return _object;
    };
    ResourceModel.prototype.$save = function () {
        if (this[this.$primaryKey]) {
            return this.$update();
        }
        else {
            return this.$create();
        }
    };
    ResourceModel.prototype.$update = function () {
        return this.$resource_method('update');
    };
    ResourceModel.prototype.$remove = function () {
        return this.$resource_method('remove');
    };
    ResourceModel.prototype.$resource_method = function (method_name) {
        var _this = this;
        var _method = this.$resource[method_name];
        if (!_method) {
            console.error("Your Resource has no implemented " + method_name + " method.");
            return this;
        }
        var data = (method_name === 'remove') ? { id: this[this.$primaryKey] } : this.$getData();
        var result = _method.bind(this.$resource)(data);
        this.$resolved = result.$resolved;
        this.$observable = result.$observable;
        this.$abortRequest = result.$abortRequest;
        this.$observable.subscribe(function (resp) {
            _this.$fillFromObject(resp.$getData());
        });
        return this;
    };
    ResourceModel.prototype.$create = function () {
        return this.$resource_method('create');
    };
    return ResourceModel;
}());
