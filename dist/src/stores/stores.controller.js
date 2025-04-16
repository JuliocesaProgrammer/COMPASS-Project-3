"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoresController = void 0;
const common_1 = require("@nestjs/common");
const store_service_1 = require("./store.service");
let StoresController = class StoresController {
    constructor(storesService) {
        this.storesService = storesService;
    }
    getAllStores() {
        return this.storesService.getAllStores();
    }
    async getStoresByCep(cep) {
        return await this.storesService.getStoresByCep(cep);
    }
    getStoresByState(state) {
        return this.storesService.getStoresByState(state);
    }
    getStoreById(id) {
        return this.storesService.getStoreById(id);
    }
};
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], StoresController.prototype, "getAllStores", null);
__decorate([
    (0, common_1.Get)('/cep/:cep'),
    __param(0, (0, common_1.Param)('cep')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StoresController.prototype, "getStoresByCep", null);
__decorate([
    (0, common_1.Get)('/state/:state'),
    __param(0, (0, common_1.Param)('state')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StoresController.prototype, "getStoresByState", null);
__decorate([
    (0, common_1.Get)('/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StoresController.prototype, "getStoreById", null);
StoresController = __decorate([
    (0, common_1.Controller)('stores'),
    __metadata("design:paramtypes", [store_service_1.StoresService])
], StoresController);
exports.StoresController = StoresController;
//# sourceMappingURL=stores.controller.js.map