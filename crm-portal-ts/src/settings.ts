import { Field, ObjectType } from 'type-graphql';
import * as dotenv from 'dotenv';

dotenv.config();

@ObjectType()
export class Settings {
  @Field({ nullable: true })
  CRM_ENV?: string;

  @Field({ nullable: true })
  APP_DISPLAY_NAME?: string;

  @Field({ nullable: true })
  DATABASE_URL?: string;

  @Field({ nullable: true })
  CRM_SECRET_KEY?: string;

  @Field({ nullable: true })
  CRM_ENCRYPTION_KEY?: string;

  @Field({ nullable: true })
  CRM_ADMIN_USER?: string;

  @Field({ nullable: true })
  CRM_ADMIN_PASSWORD?: string;

  @Field({ defaultValue: true })
  AUTH_ENABLED?: boolean;

  @Field({ nullable: true })
  CRM_UPLOAD_ROOT?: string;

  @Field({ defaultValue: 20.0 })
  CRM_MAX_UPLOAD_MB?: number;

  @Field({ nullable: true })
  TERYT_WS_WSDL?: string;

  @Field({ nullable: true })
  TERYT_WS_USER?: string;

  @Field({ nullable: true })
  TERYT_WS_PASSWORD?: string;
}
