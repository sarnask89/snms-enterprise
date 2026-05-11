from sqladmin import ModelView
from app.models import (
    PortalUser,
    PortalUserGroup,
    Customer,
    CustomerGroup,
    CustomerNotice,
    Subscription,
    Tariff,
    Invoice,
    NetNode,
    NetDevice,
    CustomerDevice,
    CustomerDeviceGroup,
    IpNetwork,
    NetworkHost,
    SupportTicket,
    HelpdeskQueue,
    HelpdeskCategory,
    AppSetting,
    VatRate,
    Division,
    NumberPlan
)

# --- Użytkownicy ---

class PortalUserAdmin(ModelView, model=PortalUser):
    column_list = [PortalUser.id, PortalUser.username, PortalUser.role, PortalUser.active]
    column_searchable_list = [PortalUser.username]
    name = "Użytkownik Portalu"
    name_plural = "Użytkownicy Portalu"
    icon = "fa-solid fa-user-shield"
    category = "Użytkownicy"

class PortalUserGroupAdmin(ModelView, model=PortalUserGroup):
    column_list = [PortalUserGroup.id, PortalUserGroup.name]
    name = "Grupa Użytkowników"
    name_plural = "Grupy Użytkowników"
    icon = "fa-solid fa-users-gear"
    category = "Użytkownicy"

# --- CRM ---

class CustomerAdmin(ModelView, model=Customer):
    column_list = [Customer.id, Customer.customer_code, Customer.first_name, Customer.last_name, Customer.status]
    column_searchable_list = [Customer.customer_code, Customer.last_name, Customer.email]
    name = "Klient"
    name_plural = "Klienci"
    icon = "fa-solid fa-users"
    category = "CRM"

class CustomerGroupAdmin(ModelView, model=CustomerGroup):
    column_list = [CustomerGroup.id, CustomerGroup.name]
    name = "Grupa Klientów"
    name_plural = "Grupy Klientów"
    icon = "fa-solid fa-people-group"
    category = "CRM"

class CustomerNoticeAdmin(ModelView, model=CustomerNotice):
    column_list = [CustomerNotice.id, CustomerNotice.customer_id, CustomerNotice.title, CustomerNotice.is_active]
    name = "Notatka o Kliencie"
    name_plural = "Notatki o Klientach"
    icon = "fa-solid fa-note-sticky"
    category = "CRM"

class SubscriptionAdmin(ModelView, model=Subscription):
    column_list = [Subscription.id, Subscription.customer_id, Subscription.tariff_id, Subscription.active]
    name = "Abonament"
    name_plural = "Abonamenty"
    icon = "fa-solid fa-file-contract"
    category = "CRM"

# --- Finanse ---

class TariffAdmin(ModelView, model=Tariff):
    column_list = [Tariff.id, Tariff.name, Tariff.monthly_price, Tariff.active]
    name = "Taryfa"
    name_plural = "Taryfy"
    icon = "fa-solid fa-tags"
    category = "Finanse"

class InvoiceAdmin(ModelView, model=Invoice):
    column_list = [Invoice.id, Invoice.number, Invoice.amount, Invoice.status, Invoice.issue_date]
    column_searchable_list = [Invoice.number]
    name = "Faktura"
    name_plural = "Faktury"
    icon = "fa-solid fa-file-invoice-dollar"
    category = "Finanse"

class VatRateAdmin(ModelView, model=VatRate):
    column_list = [VatRate.id, VatRate.label, VatRate.rate_percent, VatRate.is_default]
    name = "Stawka VAT"
    name_plural = "Stawki VAT"
    icon = "fa-solid fa-percent"
    category = "Finanse"

# --- Sieć ---

class NetNodeAdmin(ModelView, model=NetNode):
    column_list = [NetNode.id, NetNode.name, NetNode.location_city_id]
    column_searchable_list = [NetNode.name]
    name = "Węzeł Sieciowy"
    name_plural = "Węzły Sieciowe"
    icon = "fa-solid fa-network-wired"
    category = "Sieć"

class NetDeviceAdmin(ModelView, model=NetDevice):
    column_list = [NetDevice.id, NetDevice.name, NetDevice.management_ip, NetDevice.status]
    column_searchable_list = [NetDevice.name, NetDevice.management_ip]
    name = "Urządzenie"
    name_plural = "Urządzenia"
    icon = "fa-solid fa-server"
    category = "Sieć"

class CustomerDeviceAdmin(ModelView, model=CustomerDevice):
    column_list = [CustomerDevice.id, CustomerDevice.hostname, CustomerDevice.ip_address, CustomerDevice.status]
    column_searchable_list = [CustomerDevice.hostname, CustomerDevice.ip_address]
    name = "Urządzenie Klienta"
    name_plural = "Urządzenia Klientów"
    icon = "fa-solid fa-desktop"
    category = "CRM"

class CustomerDeviceGroupAdmin(ModelView, model=CustomerDeviceGroup):
    column_list = [CustomerDeviceGroup.id, CustomerDeviceGroup.name]
    name = "Grupa Usług"
    name_plural = "Grupy Usług"
    icon = "fa-solid fa-layer-group"
    category = "Sieć"

class IpNetworkAdmin(ModelView, model=IpNetwork):
    column_list = [IpNetwork.id, IpNetwork.name, IpNetwork.cidr, IpNetwork.active]
    column_searchable_list = [IpNetwork.cidr, IpNetwork.name]
    name = "Sieć IP"
    name_plural = "Sieci IP"
    icon = "fa-solid fa-globe"
    category = "Sieć"

class NetworkHostAdmin(ModelView, model=NetworkHost):
    column_list = [NetworkHost.id, NetworkHost.name]
    name = "Host Sieciowy"
    name_plural = "Hosty Sieciowe"
    icon = "fa-solid fa-circle-nodes"
    category = "Sieć"

# --- Helpdesk ---

class SupportTicketAdmin(ModelView, model=SupportTicket):
    column_list = [SupportTicket.id, SupportTicket.title, SupportTicket.status, SupportTicket.created_at]
    column_searchable_list = [SupportTicket.title]
    name = "Zgłoszenie"
    name_plural = "Zgłoszenia"
    icon = "fa-solid fa-ticket"
    category = "Helpdesk"

class HelpdeskQueueAdmin(ModelView, model=HelpdeskQueue):
    column_list = [HelpdeskQueue.id, HelpdeskQueue.name]
    name = "Kolejka Helpdesk"
    name_plural = "Kolejki Helpdesk"
    icon = "fa-solid fa-tray"
    category = "Helpdesk"

class HelpdeskCategoryAdmin(ModelView, model=HelpdeskCategory):
    column_list = [HelpdeskCategory.id, HelpdeskCategory.name]
    name = "Kategoria Helpdesk"
    name_plural = "Kategorie Helpdesk"
    icon = "fa-solid fa-folder-tree"
    category = "Helpdesk"

# --- Konfiguracja ---

class AppSettingAdmin(ModelView, model=AppSetting):
    column_list = [AppSetting.id, AppSetting.key, AppSetting.value]
    column_searchable_list = [AppSetting.key]
    name = "Ustawienie"
    name_plural = "Ustawienia Systemowe"
    icon = "fa-solid fa-gears"
    category = "Konfiguracja"

class DivisionAdmin(ModelView, model=Division):
    column_list = [Division.id, Division.name, Division.is_default]
    name = "Oddział"
    name_plural = "Oddziały"
    icon = "fa-solid fa-building"
    category = "Konfiguracja"

class NumberPlanAdmin(ModelView, model=NumberPlan):
    column_list = [NumberPlan.id, NumberPlan.name, NumberPlan.doc_type, NumberPlan.is_default]
    name = "Plan Numeracji"
    name_plural = "Plany Numeracji"
    icon = "fa-solid fa-list-ol"
    category = "Konfiguracja"

all_views = [
    PortalUserAdmin,
    PortalUserGroupAdmin,
    CustomerAdmin,
    CustomerGroupAdmin,
    CustomerNoticeAdmin,
    SubscriptionAdmin,
    TariffAdmin,
    InvoiceAdmin,
    VatRateAdmin,
    NetNodeAdmin,
    NetDeviceAdmin,
    CustomerDeviceAdmin,
    CustomerDeviceGroupAdmin,
    IpNetworkAdmin,
    NetworkHostAdmin,
    SupportTicketAdmin,
    HelpdeskQueueAdmin,
    HelpdeskCategoryAdmin,
    AppSettingAdmin,
    DivisionAdmin,
    NumberPlanAdmin
]
