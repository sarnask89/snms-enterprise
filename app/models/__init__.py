from app.models.common import (
    CustomerStatus,
    InvoiceStatus,
    InvoiceDocumentKind,
    NumberPlanDocType,
    TicketStatus,
    CustomerDeviceStatus,
    NetNodeLocationType,
    NetDeviceStatus,
    UserRole,
    LedgerEntryKind,
    AccessTechnology,
    MessageStatus,
)
from app.models.system import (
    AppSetting,
    VatRate,
    Division,
    NumberPlan,
    PortalUser,
    PortalUserGroup,
    AuditLog,
    BackupExport,
    ConfigReloadLog,
    NavMenuItem,
    RoleMenuPermission,
)
from app.models.location import (
    LocationState,
    LocationDistrict,
    LocationCity,
    LocationStreet,
)
from app.models.customer import (
    CustomerGroup,
    Customer,
    CustomerNotice,
    Document,
)
from app.models.network import (
    NetNode,
    NetNodeLink,
    NetworkHost,
    IpNetwork,
    NetDeviceProducer,
    NetDeviceType,
    NetDeviceModel,
    NetDevice,
    NetDeviceInterface,
    NetDeviceIpPool,
    NetDeviceDhcpServer,
    CustomerDevice,
    CustomerDeviceGroup,
    CustomerDeviceSession,
    CustomerDeviceNotice,
    TrafficStat,
)
from app.models.finance import (
    Tariff,
    Subscription,
    Invoice,
    RecurringPayment,
    LedgerEntry,
    CashReceipt,
)
from app.models.helpdesk import (
    HelpdeskQueue,
    HelpdeskCategory,
    SupportTicket,
)
from app.models.netflow import (
    NetFlowAggregate,
    NetFlowRaw,
)
from app.models.communication import (
    MessageTemplate,
    OutboundMessage,
    CalendarEvent,
)
from app.models.monitoring import (
    NetworkLink,
    NetworkStat,
    MonitorTemplate,
    MonitorItem,
    MonitorTrigger,
    MonitorHistory,
    SystemNotification,
    CustomerDeviceStat,
    NvidiaGPU,
    NvidiaStat,
)
try:

    from app.models.generated_modules import *
except ImportError:
    pass
