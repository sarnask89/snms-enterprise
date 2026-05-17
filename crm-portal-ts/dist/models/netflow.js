var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { NetDevice } from './net_device.entity'; // assuming you have a separate entity for net devices in your application 
let NetFlowAggregate = class NetFlowAggregate {
    id;
    device_id; //ForeignKey("net_devices") in SQLAlchemy should be "NETWORK DEVICE" table name not the id column of this entity  
    src_ip; // same as String(45) from sqlalchemry 
    dst_port; // Integer in SQLAlchemy should be int or similar type not the column of this entity  
    protocol;
    bytes; // Same type of column definition used for big integer. Defaults are same as above 
    packets; //Same default value is set to zero if no provided by user in database or else will use the one that has been assigned  
};
__decorate([
    PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], NetFlowAggregate.prototype, "id", void 0);
__decorate([
    ManyToOne(type => NetDevice, device => device.id) // assuming there is a one-to-many relationship between net devices and aggregated flows 
    ,
    __metadata("design:type", typeof (_a = typeof NetDevice !== "undefined" && NetDevice) === "function" ? _a : Object)
], NetFlowAggregate.prototype, "device_id", void 0);
__decorate([
    Column({ length: 45 }),
    __metadata("design:type", String)
], NetFlowAggregate.prototype, "src_ip", void 0);
__decorate([
    Column(),
    __metadata("design:type", Number)
], NetFlowAggregate.prototype, "dst_port", void 0);
__decorate([
    Column({ type: 'int' }),
    __metadata("design:type", Number)
], NetFlowAggregate.prototype, "protocol", void 0);
__decorate([
    Column({ type: 'bigint' }),
    __metadata("design:type", Number)
], NetFlowAggregate.prototype, "bytes", void 0);
__decorate([
    Column({ type: 'bigint' }),
    __metadata("design:type", Number)
], NetFlowAggregate.prototype, "packets", void 0);
NetFlowAggregate = __decorate([
    Entity('netflow_aggregates')
], NetFlowAggregate);
export { NetFlowAggregate };
x;
let NetFlowRaw = class NetFlowRaw {
    id; // Assuming primary key is auto incremented by default. If it's different please adjust accordingly, same as above in net flow aggregate entity for foreignkey definition if not then use appropriate datatype  . Same type of column definitions used here with the assumption that you have a JSON or similar data stored inside this field
    raw_data; // Assuming it's json/similar format. If different please adjust accordingly  
};
__decorate([
    PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], NetFlowRaw.prototype, "id", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], NetFlowRaw.prototype, "raw_data", void 0);
NetFlowRaw = __decorate([
    Entity('netflow_raw')
], NetFlowRaw);
export { NetFlowRaw };
//# sourceMappingURL=netflow.js.map