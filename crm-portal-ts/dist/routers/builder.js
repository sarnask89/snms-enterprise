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
import { Controller, Get, Post } from '@nestjs/common'; // Import NestJS decorators here. You can use fastify or any other framework you prefer to handle HTTP requests and responses in NodeJs environment with FastAPI for backend API development using Python code above as a reference point only
let AdminBuilderController = class AdminBuilderController {
    async builderIndex(request) { } // Assuming the existence of HTML response and request object from 'fastapi'. You may need more or different implementation based on your project setup. This method will handle GET requests to '/admin/builder' route 
    async builderGenerate(request, data) { } // Assuming the existence of JSON response and request object from 'fastapi'. You may need more or different implementation based on your project setup. This method will handle POST requests to '/admin/builder' route with body parameters
    async builderRegisterNav(label, url) { } // Assuming the existence of JSON response and form data from 'fastapi'. You may need more or different implementation based on your project setup. This method will handle POST requests to '/admin/builder' route with Form Data parameters
};
__decorate([
    Get(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Request]),
    __metadata("design:returntype", Promise)
], AdminBuilderController.prototype, "builderIndex", null);
__decorate([
    Post('/generate'),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Request, Object]),
    __metadata("design:returntype", Promise)
], AdminBuilderController.prototype, "builderGenerate", null);
__decorate([
    Post('/register-nav'),
    __param(0, Form()),
    __param(1, Form()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminBuilderController.prototype, "builderRegisterNav", null);
AdminBuilderController = __decorate([
    Controller('admin/builder') // NestJS decorator for setting up a controller level route prefix in this case '/admin/builder' (you can use other paths as per requirement) 
], AdminBuilderController);
export { AdminBuilderController };
//# sourceMappingURL=builder.js.map