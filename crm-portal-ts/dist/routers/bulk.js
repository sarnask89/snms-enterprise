var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from "typeorm";
let AppService = class AppService {
};
AppService = __decorate([
    Injectable()
], AppService);
export { AppService };
() => {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth()); // assuming we're in UTC timezone for this part..       let invoicesCreated: number[]= [];    InvoiceStatus, Decimal;   models.InvoiceDocumentKind 
    const subscriptions = await(await connection).manager.find(models.Subscription);
    const plans = await(connection).getRepository('NumberPlan').createQueryBuilder("plan").where({ doc_type: 'invoice', isDefault: true }).getMany();
    for (let subscription of subscriptions) {
        let existingInv = this.invoicesRepo.createQueryBuilder().select(["id"]).where((qb) => {
            qb; // assuming your models have appropriate relations and fields... } ).andWhere({customer_id:subscription['customerId'], issueDate : today}).getOne();
            if (!existingInv) {
                const plan = plans.find(_plan => _plan.docType === 'invoice' && _plan, isDefault); // assuming your models have appropriate relations and fields... }     let inv_number =  allocateNextDocumentNumber(db, plan) ;     
                this.invoicesRepo({ number: inv_number, customerId: subscription['customerID'], amount: subscription.tariff ? // assuming your models have appropriate relations and fields... } ).save();    if ((existingInv && existingInv .amount !== plan?.monthlyPrice)){
                        let : , net = (plan.isDefault), const: vatRate = await this._vatRatesRepo({ ratePercent: 10 }).getOne(), // assuming your models have appropriate relations and fields... }    existingInv .amountNet  = Decimal((net as any).value);
                    if(existingInv) { } } && net);
                {
                    const vatAmt = ((subscription.tariff ? subscription['Tariffs'] : {})), isDefault;
                }
            }
        }); // assuming your models have appropriate relations and fields... }    existingInv .amountVAT  = Decimal((vat as any).value);
        if (existingInv) {
            this._ledgerRepo( /*assuming you've defined ledgers in the same way*/).save();
            invoicesCreated.push({ id: id });
        }
    }
    return `Utworzono ${invoicesCreated.length}, Dokumenty`;
};
//# sourceMappingURL=bulk.js.map