<template>
  <div class="p-8 max-w-7xl mx-auto space-y-8">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Finanse</h1>
        <p class="text-sm text-gray-500">Aktywny baseline TS dla taryf, faktur, płatności stałych, księgi i kasy</p>
      </div>
      <UButton to="/subscriptions" color="primary" icon="i-heroicons-arrows-right-left" label="Subskrypcje" />
    </div>

    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <div>
            <h2 class="font-semibold text-lg">Taryfy</h2>
            <p class="text-sm text-gray-500">Plany usług wykorzystywane przez subskrypcje klientów</p>
          </div>
          <UButton color="primary" icon="i-heroicons-plus" label="Dodaj taryfę" @click="isTariffModalOpen = true" />
        </div>
      </template>

      <UTable :rows="tariffs || []" :columns="tariffColumns" :loading="pendingTariffs">
        <template #active-data="{ row }">
          <UBadge :color="row.active ? 'emerald' : 'gray'" variant="soft">
            {{ row.active ? 'Aktywna' : 'Wyłączona' }}
          </UBadge>
        </template>

        <template #actions-data="{ row }">
          <div class="flex gap-2">
            <UButton size="xs" color="gray" variant="ghost" icon="i-heroicons-pencil-square" @click="openTariffEdit(row)" />
            <UButton size="xs" color="red" variant="ghost" icon="i-heroicons-trash" @click="removeTariff(row)" />
          </div>
        </template>
      </UTable>
    </UCard>

    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <div>
            <h2 class="font-semibold text-lg">Faktury i dokumenty sprzedaży</h2>
            <p class="text-sm text-gray-500">Minimalny baseline wystawiania i ewidencji dokumentów</p>
          </div>
          <UButton color="primary" icon="i-heroicons-document-plus" label="Nowy dokument" @click="isInvoiceModalOpen = true" />
        </div>
      </template>

      <UTable :rows="invoices || []" :columns="invoiceColumns" :loading="pendingInvoices">
        <template #status-data="{ row }">
          <UBadge :color="invoiceStatusColor(row.status)" variant="soft">{{ row.status }}</UBadge>
        </template>

        <template #customer-data="{ row }">
          <div class="text-sm text-gray-600 dark:text-gray-300">
            {{ row.customer ? `${row.customer.customerCode} · ${row.customer.firstName} ${row.customer.lastName}` : 'Brak klienta' }}
          </div>
        </template>

        <template #actions-data="{ row }">
          <div class="flex gap-2">
            <UButton size="xs" color="gray" variant="ghost" icon="i-heroicons-pencil-square" @click="openInvoiceEdit(row)" />
            <UButton size="xs" color="red" variant="ghost" icon="i-heroicons-trash" @click="removeInvoice(row)" />
          </div>
        </template>
      </UTable>
    </UCard>

    <div class="grid lg:grid-cols-3 gap-6">
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <div>
              <h2 class="font-semibold">Płatności stałe</h2>
              <p class="text-sm text-gray-500">Cykliczne należności</p>
            </div>
            <UButton color="primary" variant="soft" size="xs" icon="i-heroicons-plus" @click="isPaymentModalOpen = true" />
          </div>
        </template>

        <div class="space-y-3">
          <div
            v-for="payment in payments || []"
            :key="payment.id"
            class="rounded-lg border border-gray-200 dark:border-gray-800 p-4"
          >
            <div class="flex items-start justify-between gap-3">
              <div>
                <div class="font-medium">{{ payment.name }}</div>
                <div class="text-sm text-gray-500">{{ payment.customer?.customerCode }} · {{ payment.amount.toFixed(2) }} PLN</div>
                <div class="text-xs text-gray-400">Co {{ payment.intervalMonths }} mies. · dzień {{ payment.dayOfMonth }}</div>
              </div>
              <UButton size="xs" color="red" variant="ghost" icon="i-heroicons-trash" @click="removePayment(payment)" />
            </div>
          </div>
        </div>
      </UCard>

      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <div>
              <h2 class="font-semibold">Księga</h2>
              <p class="text-sm text-gray-500">Operacje debet / kredyt</p>
            </div>
            <UButton color="primary" variant="soft" size="xs" icon="i-heroicons-plus" @click="isLedgerModalOpen = true" />
          </div>
        </template>

        <div class="space-y-3">
          <div
            v-for="entry in ledgerEntries || []"
            :key="entry.id"
            class="rounded-lg border border-gray-200 dark:border-gray-800 p-4"
          >
            <div class="flex items-start justify-between gap-3">
              <div>
                <div class="font-medium">{{ entry.description }}</div>
                <div class="text-sm text-gray-500">{{ entry.customer?.customerCode }} · {{ entry.amount.toFixed(2) }} PLN</div>
                <UBadge :color="entry.kind === 'credit' ? 'emerald' : 'yellow'" variant="soft" size="xs">{{ entry.kind }}</UBadge>
              </div>
              <UButton size="xs" color="red" variant="ghost" icon="i-heroicons-trash" @click="removeLedgerEntry(entry)" />
            </div>
          </div>
        </div>
      </UCard>

      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <div>
              <h2 class="font-semibold">Kasa</h2>
              <p class="text-sm text-gray-500">Wpłaty i paragony</p>
            </div>
            <UButton color="primary" variant="soft" size="xs" icon="i-heroicons-plus" @click="isCashModalOpen = true" />
          </div>
        </template>

        <div class="space-y-3">
          <div
            v-for="receipt in cashReceipts || []"
            :key="receipt.id"
            class="rounded-lg border border-gray-200 dark:border-gray-800 p-4"
          >
            <div class="flex items-start justify-between gap-3">
              <div>
                <div class="font-medium">{{ receipt.description }}</div>
                <div class="text-sm text-gray-500">{{ receipt.customer?.customerCode || 'Bez klienta' }} · {{ receipt.amount.toFixed(2) }} PLN</div>
              </div>
              <UButton size="xs" color="red" variant="ghost" icon="i-heroicons-trash" @click="removeCashReceipt(receipt)" />
            </div>
          </div>
        </div>
      </UCard>
    </div>

    <UModal v-model="isTariffModalOpen">
      <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
        <template #header><h3 class="text-lg font-bold">{{ tariffForm.id ? 'Edytuj taryfę' : 'Dodaj taryfę' }}</h3></template>
        <form class="space-y-4 p-4" @submit.prevent="saveTariff">
          <div class="grid md:grid-cols-2 gap-4">
            <UFormGroup label="Nazwa" required><UInput v-model="tariffForm.name" /></UFormGroup>
            <UFormGroup label="Cena miesięczna" required><UInput v-model="tariffForm.monthlyPrice" type="number" step="0.01" /></UFormGroup>
          </div>
          <div class="grid md:grid-cols-2 gap-4">
            <UFormGroup label="Download (Mbps)"><UInput v-model="tariffForm.speedDownMbps" type="number" /></UFormGroup>
            <UFormGroup label="Upload (Mbps)"><UInput v-model="tariffForm.speedUpMbps" type="number" /></UFormGroup>
          </div>
          <UFormGroup label="Opis"><UTextarea v-model="tariffForm.description" :rows="3" /></UFormGroup>
          <label class="flex items-center gap-3 text-sm">
            <input v-model="tariffForm.active" type="checkbox" class="rounded border-gray-300">
            <span>Taryfa aktywna</span>
          </label>
          <div class="flex justify-end gap-2">
            <UButton color="gray" variant="ghost" label="Anuluj" @click="isTariffModalOpen = false" />
            <UButton type="submit" color="primary" :loading="isSavingTariff" label="Zapisz" />
          </div>
        </form>
      </UCard>
    </UModal>

    <UModal v-model="isInvoiceModalOpen">
      <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
        <template #header><h3 class="text-lg font-bold">{{ invoiceForm.id ? 'Edytuj dokument' : 'Dodaj dokument' }}</h3></template>
        <form class="space-y-4 p-4" @submit.prevent="saveInvoice">
          <div class="grid md:grid-cols-2 gap-4">
            <UFormGroup label="Numer" required><UInput v-model="invoiceForm.number" /></UFormGroup>
            <UFormGroup label="Kwota brutto" required><UInput v-model="invoiceForm.amount" type="number" step="0.01" /></UFormGroup>
          </div>
          <div class="grid md:grid-cols-3 gap-4">
            <UFormGroup label="Klient"><USelect v-model="invoiceForm.customerId" :options="customerOptions" option-attribute="label" /></UFormGroup>
            <UFormGroup label="Status"><USelect v-model="invoiceForm.status" :options="invoiceStatusOptions" option-attribute="label" /></UFormGroup>
            <UFormGroup label="Typ"><USelect v-model="invoiceForm.documentKind" :options="invoiceKindOptions" option-attribute="label" /></UFormGroup>
          </div>
          <UFormGroup label="Data wystawienia"><UInput v-model="invoiceForm.issueDate" type="date" /></UFormGroup>
          <div class="flex justify-end gap-2">
            <UButton color="gray" variant="ghost" label="Anuluj" @click="isInvoiceModalOpen = false" />
            <UButton type="submit" color="primary" :loading="isSavingInvoice" label="Zapisz" />
          </div>
        </form>
      </UCard>
    </UModal>

    <UModal v-model="isPaymentModalOpen">
      <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
        <template #header><h3 class="text-lg font-bold">Dodaj płatność stałą</h3></template>
        <form class="space-y-4 p-4" @submit.prevent="savePayment">
          <UFormGroup label="Klient"><USelect v-model="paymentForm.customerId" :options="customerOptions" option-attribute="label" /></UFormGroup>
          <UFormGroup label="Nazwa" required><UInput v-model="paymentForm.name" /></UFormGroup>
          <div class="grid md:grid-cols-3 gap-4">
            <UFormGroup label="Kwota"><UInput v-model="paymentForm.amount" type="number" step="0.01" /></UFormGroup>
            <UFormGroup label="Interwał (mies.)"><UInput v-model="paymentForm.intervalMonths" type="number" /></UFormGroup>
            <UFormGroup label="Dzień miesiąca"><UInput v-model="paymentForm.dayOfMonth" type="number" /></UFormGroup>
          </div>
          <UFormGroup label="Następne uruchomienie"><UInput v-model="paymentForm.nextRun" type="date" /></UFormGroup>
          <div class="flex justify-end gap-2">
            <UButton color="gray" variant="ghost" label="Anuluj" @click="isPaymentModalOpen = false" />
            <UButton type="submit" color="primary" :loading="isSavingPayment" label="Zapisz" />
          </div>
        </form>
      </UCard>
    </UModal>

    <UModal v-model="isLedgerModalOpen">
      <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
        <template #header><h3 class="text-lg font-bold">Dodaj wpis do księgi</h3></template>
        <form class="space-y-4 p-4" @submit.prevent="saveLedgerEntry">
          <UFormGroup label="Klient"><USelect v-model="ledgerForm.customerId" :options="customerOptions" option-attribute="label" /></UFormGroup>
          <UFormGroup label="Opis" required><UInput v-model="ledgerForm.description" /></UFormGroup>
          <div class="grid md:grid-cols-2 gap-4">
            <UFormGroup label="Kwota"><UInput v-model="ledgerForm.amount" type="number" step="0.01" /></UFormGroup>
            <UFormGroup label="Rodzaj"><USelect v-model="ledgerForm.kind" :options="ledgerKindOptions" option-attribute="label" /></UFormGroup>
          </div>
          <div class="flex justify-end gap-2">
            <UButton color="gray" variant="ghost" label="Anuluj" @click="isLedgerModalOpen = false" />
            <UButton type="submit" color="primary" :loading="isSavingLedger" label="Zapisz" />
          </div>
        </form>
      </UCard>
    </UModal>

    <UModal v-model="isCashModalOpen">
      <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
        <template #header><h3 class="text-lg font-bold">Dodaj wpis kasy</h3></template>
        <form class="space-y-4 p-4" @submit.prevent="saveCashReceipt">
          <UFormGroup label="Klient"><USelect v-model="cashForm.customerId" :options="customerOptionsWithEmpty" option-attribute="label" /></UFormGroup>
          <UFormGroup label="Opis" required><UInput v-model="cashForm.description" /></UFormGroup>
          <UFormGroup label="Kwota"><UInput v-model="cashForm.amount" type="number" step="0.01" /></UFormGroup>
          <div class="flex justify-end gap-2">
            <UButton color="gray" variant="ghost" label="Anuluj" @click="isCashModalOpen = false" />
            <UButton type="submit" color="primary" :loading="isSavingCash" label="Zapisz" />
          </div>
        </form>
      </UCard>
    </UModal>
  </div>
</template>

<script setup>
const tariffColumns = [
  { key: 'name', label: 'Nazwa' },
  { key: 'monthlyPrice', label: 'Cena / mies.' },
  { key: 'speedDownMbps', label: 'Down' },
  { key: 'speedUpMbps', label: 'Up' },
  { key: 'subscriptionCount', label: 'Subskrypcje' },
  { key: 'active', label: 'Status' },
  { key: 'actions', label: 'Akcje' }
]

const invoiceColumns = [
  { key: 'number', label: 'Numer' },
  { key: 'customer', label: 'Klient' },
  { key: 'amount', label: 'Kwota' },
  { key: 'documentKind', label: 'Typ' },
  { key: 'status', label: 'Status' },
  { key: 'issueDate', label: 'Data' },
  { key: 'actions', label: 'Akcje' }
]

const invoiceStatusOptions = [
  { label: 'Draft', value: 'draft' },
  { label: 'Issued', value: 'issued' },
  { label: 'Paid', value: 'paid' }
]

const invoiceKindOptions = [
  { label: 'Faktura', value: 'invoice' },
  { label: 'Proforma', value: 'proforma' },
  { label: 'Nota debetowa', value: 'debit_note' }
]

const ledgerKindOptions = [
  { label: 'Debet', value: 'debit' },
  { label: 'Kredyt', value: 'credit' }
]

const isTariffModalOpen = ref(false)
const isInvoiceModalOpen = ref(false)
const isPaymentModalOpen = ref(false)
const isLedgerModalOpen = ref(false)
const isCashModalOpen = ref(false)

const isSavingTariff = ref(false)
const isSavingInvoice = ref(false)
const isSavingPayment = ref(false)
const isSavingLedger = ref(false)
const isSavingCash = ref(false)

const tariffForm = reactive({
  id: null,
  name: '',
  monthlyPrice: '',
  description: '',
  speedDownMbps: '',
  speedUpMbps: '',
  active: true
})

const invoiceForm = reactive({
  id: null,
  number: '',
  customerId: null,
  amount: '',
  status: 'draft',
  documentKind: 'invoice',
  issueDate: new Date().toISOString().slice(0, 10)
})

const paymentForm = reactive({
  customerId: null,
  name: '',
  amount: '',
  intervalMonths: 1,
  dayOfMonth: 1,
  nextRun: ''
})

const ledgerForm = reactive({
  customerId: null,
  amount: '',
  kind: 'debit',
  description: ''
})

const cashForm = reactive({
  customerId: null,
  amount: '',
  description: ''
})

const { data: tariffs, pending: pendingTariffs, refresh: refreshTariffs } = await useFetch('/api/v1/finances/tariffs')
const { data: invoices, pending: pendingInvoices, refresh: refreshInvoices } = await useFetch('/api/v1/finances/invoices')
const { data: payments, refresh: refreshPayments } = await useFetch('/api/v1/finances/payments')
const { data: ledgerEntries, refresh: refreshLedgerEntries } = await useFetch('/api/v1/finances/balance')
const { data: cashReceipts, refresh: refreshCashReceipts } = await useFetch('/api/v1/finances/cash')
const { data: customers, refresh: refreshCustomers } = await useFetch('/api/v1/customers', {
  query: { limit: 200 }
})

const customerOptions = computed(() => (customers.value || []).map((customer) => ({
  label: `${customer.customerCode} · ${customer.firstName} ${customer.lastName}`,
  value: customer.id
})))

const customerOptionsWithEmpty = computed(() => [
  { label: 'Brak klienta', value: null },
  ...customerOptions.value
])

const invoiceStatusColor = (status) => {
  switch (status) {
    case 'paid': return 'emerald'
    case 'issued': return 'blue'
    case 'draft': return 'yellow'
    default: return 'gray'
  }
}

const resetTariffForm = () => Object.assign(tariffForm, {
  id: null,
  name: '',
  monthlyPrice: '',
  description: '',
  speedDownMbps: '',
  speedUpMbps: '',
  active: true
})

const resetInvoiceForm = () => Object.assign(invoiceForm, {
  id: null,
  number: '',
  customerId: null,
  amount: '',
  status: 'draft',
  documentKind: 'invoice',
  issueDate: new Date().toISOString().slice(0, 10)
})

const resetPaymentForm = () => Object.assign(paymentForm, {
  customerId: null,
  name: '',
  amount: '',
  intervalMonths: 1,
  dayOfMonth: 1,
  nextRun: ''
})

const resetLedgerForm = () => Object.assign(ledgerForm, {
  customerId: null,
  amount: '',
  kind: 'debit',
  description: ''
})

const resetCashForm = () => Object.assign(cashForm, {
  customerId: null,
  amount: '',
  description: ''
})

const openTariffEdit = (row) => {
  Object.assign(tariffForm, {
    id: row.id,
    name: row.name,
    monthlyPrice: row.monthlyPrice,
    description: row.description || '',
    speedDownMbps: row.speedDownMbps ?? '',
    speedUpMbps: row.speedUpMbps ?? '',
    active: !!row.active
  })
  isTariffModalOpen.value = true
}

const openInvoiceEdit = (row) => {
  Object.assign(invoiceForm, {
    id: row.id,
    number: row.number,
    customerId: row.customerId,
    amount: row.amount,
    status: row.status,
    documentKind: row.documentKind,
    issueDate: row.issueDate
  })
  isInvoiceModalOpen.value = true
}

const saveTariff = async () => {
  isSavingTariff.value = true
  try {
    const payload = {
      name: tariffForm.name,
      monthlyPrice: Number(tariffForm.monthlyPrice),
      description: tariffForm.description || null,
      speedDownMbps: tariffForm.speedDownMbps === '' ? null : Number(tariffForm.speedDownMbps),
      speedUpMbps: tariffForm.speedUpMbps === '' ? null : Number(tariffForm.speedUpMbps),
      active: !!tariffForm.active
    }

    if (tariffForm.id) {
      await $fetch(`/api/v1/finances/tariffs/${tariffForm.id}`, { method: 'PUT', body: payload })
    } else {
      await $fetch('/api/v1/finances/tariffs', { method: 'POST', body: payload })
    }

    isTariffModalOpen.value = false
    resetTariffForm()
    await refreshTariffs()
  } finally {
    isSavingTariff.value = false
  }
}

const saveInvoice = async () => {
  isSavingInvoice.value = true
  try {
    const payload = {
      number: invoiceForm.number,
      customerId: invoiceForm.customerId,
      amount: Number(invoiceForm.amount),
      status: invoiceForm.status,
      documentKind: invoiceForm.documentKind,
      issueDate: invoiceForm.issueDate
    }

    if (invoiceForm.id) {
      await $fetch(`/api/v1/finances/invoices/${invoiceForm.id}`, { method: 'PUT', body: payload })
    } else {
      await $fetch('/api/v1/finances/invoices', { method: 'POST', body: payload })
    }

    isInvoiceModalOpen.value = false
    resetInvoiceForm()
    await refreshInvoices()
  } finally {
    isSavingInvoice.value = false
  }
}

const savePayment = async () => {
  isSavingPayment.value = true
  try {
    await $fetch('/api/v1/finances/payments', {
      method: 'POST',
      body: {
        customerId: paymentForm.customerId,
        name: paymentForm.name,
        amount: Number(paymentForm.amount),
        intervalMonths: Number(paymentForm.intervalMonths),
        dayOfMonth: Number(paymentForm.dayOfMonth),
        nextRun: paymentForm.nextRun || null,
        active: true
      }
    })
    isPaymentModalOpen.value = false
    resetPaymentForm()
    await refreshPayments()
  } finally {
    isSavingPayment.value = false
  }
}

const saveLedgerEntry = async () => {
  isSavingLedger.value = true
  try {
    await $fetch('/api/v1/finances/balance', {
      method: 'POST',
      body: {
        customerId: ledgerForm.customerId,
        amount: Number(ledgerForm.amount),
        kind: ledgerForm.kind,
        description: ledgerForm.description
      }
    })
    isLedgerModalOpen.value = false
    resetLedgerForm()
    await refreshLedgerEntries()
  } finally {
    isSavingLedger.value = false
  }
}

const saveCashReceipt = async () => {
  isSavingCash.value = true
  try {
    await $fetch('/api/v1/finances/cash', {
      method: 'POST',
      body: {
        customerId: cashForm.customerId,
        amount: Number(cashForm.amount),
        description: cashForm.description
      }
    })
    isCashModalOpen.value = false
    resetCashForm()
    await refreshCashReceipts()
  } finally {
    isSavingCash.value = false
  }
}

const removeTariff = async (row) => {
  if (!confirm(`Usunąć taryfę "${row.name}"?`)) return
  await $fetch(`/api/v1/finances/tariffs/${row.id}`, { method: 'DELETE' })
  await refreshTariffs()
}

const removeInvoice = async (row) => {
  if (!confirm(`Usunąć dokument "${row.number}"?`)) return
  await $fetch(`/api/v1/finances/invoices/${row.id}`, { method: 'DELETE' })
  await refreshInvoices()
}

const removePayment = async (row) => {
  if (!confirm(`Usunąć płatność "${row.name}"?`)) return
  await $fetch(`/api/v1/finances/payments/${row.id}`, { method: 'DELETE' })
  await refreshPayments()
}

const removeLedgerEntry = async (row) => {
  if (!confirm(`Usunąć wpis "${row.description}"?`)) return
  await $fetch(`/api/v1/finances/balance/${row.id}`, { method: 'DELETE' })
  await refreshLedgerEntries()
}

const removeCashReceipt = async (row) => {
  if (!confirm(`Usunąć wpis "${row.description}"?`)) return
  await $fetch(`/api/v1/finances/cash/${row.id}`, { method: 'DELETE' })
  await refreshCashReceipts()
}
</script>
