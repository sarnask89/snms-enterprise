import { Date } from 'date-fns';
import { Model, DataTypes } from 'sequelize';

export class NumberPlan extends Model {
  public id!: number;
  public patternTemplate?: string;
  public nextNumber?: number;

  static associate(models: typeof import('./models')) {
    this.hasMany(models.Document);
  }
}

export interface Document {
  id: number;
  documentNumber: string;
  planId: number;
}

const sequelize = new Sequelize('your-database-url', { dialect: 'postgres' });

(async () => {
  await sequelize.sync({ force: true });
})();

export async function allocateNextDocumentNumber(db: typeof import('./models'), plan: NumberPlan) {
  const today = Date.now();
  let n = plan.nextNumber || 1;
  const tpl = (plan.patternTemplate || '{year}/{n}').trim();

  const fmtData = {
    year: today.getFullYear(),
    month: String(today.getMonth() + 1).padStart(2, '0'),
    day: String(today.getDate()).padStart(2, '0'),
    n
  };

  try {
    if (!tpl.includes('{n}') && !tpl.includes('{n:04d}')) {
      rendered = tpl.replace('{n}', `${n}`);
    } else {
      rendered = tpl.format(fmtData);
    }
  } catch (error) {
    rendered = `${tpl}-${today.getFullYear()}-${n.toString().padStart(4, '0')}`;
  }

  plan.nextNumber = n + 1;
  await db.models.NumberPlan.update(plan, { where: { id: plan.id } });
  return rendered.slice(0, 64);
})();
