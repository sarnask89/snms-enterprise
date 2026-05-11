import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class DocumentNumberService {
  constructor(
    @InjectRepository(DocumentPlan)
    private documentPlansRepository: Repository<DocumentPlan>,
  ) {}

  async allocateNextDocumentNumber(plan: DocumentPlan): Promise<string> {
    const today = new Date();
    let n = plan.nextNumber || 1;
    const tpl = plan.patternTemplate || '{year}/{n}';

    const fmtData = {
      year: today.getFullYear(),
      month: String(today.getMonth() + 1).padStart(2, '0'),
      day: String(today.getDate()).padStart(2, '0'),
      n,
    };

    try {
      if (tpl.includes('{n}') && !tpl.includes('{n:04d}')) {
        rendered = tpl.replace('{n}', `${n.toString().padStart(4, '0')}`).format(fmtData);
      } else {
        rendered = tpl.format(fmtData);
      }
    } catch (error) {
      rendered = `${tpl}-${today.getFullYear()}-${n.toString().padStart(4, '0')}`;
    }

    plan.nextNumber = n + 1;
    await this.documentPlansRepository.save(plan);

    return rendered.slice(0, 64);
  }
}
