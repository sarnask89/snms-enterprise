import { join } from 'path';
export const config = {
    CRM_ENV: process.env.CRM_ENV || "development",
    APP_DISPLAY_NAME: process.env.APP_DISPLAY_NAME || "SNMS Enterprise",
    DATABASE_URL: process.env.DATABASE_URL || "sqlite:///./crm.sqlite",
    CRM_SECRET_KEY: process.env.CRM_SECRET_KEY || "",
    CRM_ENCRYPTION_KEY: process.env.CRM_ENCRYPTION_KEY || "",
    CRM_ADMIN_USER: process.env.CRM_ADMIN_USER || "admin",
    CRM_ADMIN_PASSWORD: process.env.CRM_ADMIN_PASSWORD || "",
    AUTH_ENABLED: process.env.AUTH_ENABLED === "true" ? true : false,
    CRM_UPLOAD_ROOT: join(__dirname, "./uploads"),
    CRM_MAX_UPLOAD_MB: parseFloat(process.env.CRM_MAX_UPLOAD_MB) || 20.0,
    TERYT_WS_WSDL: process.env.TERYT_WS_WSDL || "https://uslugaterytws1.stat.gov.pl/wsdl/terytws1.wsdl",
    TERYT_WS_USER: process.env.TERYT_WS_USER || "",
    TERYT_WS_PASSWORD: process.env.TERYT_WS_PASSWORD || ""
};
export const typeOrmConfig = {
    type: "sqlite",
    database: config.DATABASE_URL,
    entities: [join(__dirname, 'entities/*.entity{.ts,.js}')],
    synchronize: true
};
//# sourceMappingURL=settings.js.map