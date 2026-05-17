<template>
  <div class="p-8 max-w-7xl mx-auto space-y-8">
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Ustawienia Systemu</h1>
        <p class="text-sm text-gray-500">Oddziały, stawki VAT i plany numeracji dla runtime TS.</p>
      </div>
      <UButton color="gray" variant="ghost" icon="i-heroicons-arrow-path" label="Odśwież" @click="refreshAll" />
    </div>

    <UAlert
      v-if="route.query.reason === 'auth'"
      color="amber"
      variant="soft"
      icon="i-heroicons-lock-closed"
      title="Ta sekcja wymaga zalogowanej sesji."
    />

    <UAlert
      v-else-if="route.query.reason === 'forbidden'"
      color="red"
      variant="soft"
      icon="i-heroicons-shield-exclamation"
      title="Bieżąca rola nie ma dostępu do wskazanego modułu."
    />

    <div v-if="isAdmin" class="grid xl:grid-cols-2 gap-6">
      <UCard>
        <template #header>
          <div>
            <h2 class="font-semibold text-lg">Oddziały</h2>
            <p class="text-sm text-gray-500">Konfiguracja firm wykorzystywanych przez dokumenty i finanse.</p>
          </div>
        </template>

        <div class="space-y-4">
          <div class="grid md:grid-cols-2 gap-3">
            <UInput v-model="divisionForm.name" placeholder="Nazwa oddziału" />
            <UInput v-model="divisionForm.shortName" placeholder="Skrót" />
            <UInput v-model="divisionForm.city" placeholder="Miasto" />
            <UInput v-model="divisionForm.postalCode" placeholder="Kod pocztowy" />
            <UInput v-model="divisionForm.nip" placeholder="NIP" />
            <UInput v-model="divisionForm.regon" placeholder="REGON" />
          </div>
          <UInput v-model="divisionForm.address" placeholder="Adres" />
          <div class="flex flex-wrap items-center gap-4">
            <UCheckbox v-model="divisionForm.active" label="Aktywny" />
            <UCheckbox v-model="divisionForm.isDefault" label="Domyślny" />
          </div>
          <div class="flex justify-end gap-3">
            <UButton v-if="editingDivisionId" color="gray" variant="soft" label="Anuluj" @click="resetDivisionForm" />
            <UButton color="primary" :loading="isSavingDivision" :label="editingDivisionId ? 'Zapisz oddział' : 'Dodaj oddział'" @click="saveDivision" />
          </div>

          <div class="space-y-3">
            <div
              v-for="division in divisions || []"
              :key="division.id"
              class="rounded-lg border border-gray-200 dark:border-gray-800 p-4 flex flex-col gap-3"
            >
              <div class="flex items-start justify-between gap-4">
                <div>
                  <div class="font-medium">{{ division.name }}</div>
                  <div class="text-sm text-gray-500">
                    {{ division.shortName || 'brak skrótu' }} · {{ division.city || 'brak miasta' }}
                  </div>
                  <div class="text-xs text-gray-400 mt-1">{{ division.address || 'brak adresu' }}</div>
                </div>
                <div class="flex gap-2">
                  <UBadge :color="division.active ? 'green' : 'gray'" variant="soft">{{ division.active ? 'active' : 'inactive' }}</UBadge>
                  <UBadge v-if="division.isDefault" color="primary" variant="soft">default</UBadge>
                </div>
              </div>
              <div class="flex justify-end gap-3">
                <UButton color="gray" variant="ghost" label="Edytuj" @click="editDivision(division)" />
                <UButton color="red" variant="ghost" label="Usuń" @click="deleteDivision(division.id)" />
              </div>
            </div>
          </div>
        </div>
      </UCard>

      <UCard>
        <template #header>
          <div>
            <h2 class="font-semibold text-lg">Stawki VAT</h2>
            <p class="text-sm text-gray-500">Baza stawek dla taryf, subskrypcji i faktur.</p>
          </div>
        </template>

        <div class="space-y-4">
          <div class="grid md:grid-cols-3 gap-3">
            <UInput v-model="vatForm.label" placeholder="Etykieta" />
            <UInput v-model="vatForm.ratePercent" type="number" placeholder="%" />
            <UInput v-model="vatForm.sortOrder" type="number" placeholder="Sort" />
          </div>
          <div class="flex flex-wrap items-center gap-4">
            <UCheckbox v-model="vatForm.isDefault" label="Domyślna" />
          </div>
          <div class="flex justify-end gap-3">
            <UButton v-if="editingVatId" color="gray" variant="soft" label="Anuluj" @click="resetVatForm" />
            <UButton color="primary" :loading="isSavingVat" :label="editingVatId ? 'Zapisz stawkę' : 'Dodaj stawkę'" @click="saveVatRate" />
          </div>

          <div class="space-y-3">
            <div
              v-for="vatRate in vatRates || []"
              :key="vatRate.id"
              class="rounded-lg border border-gray-200 dark:border-gray-800 p-4 flex items-center justify-between gap-4"
            >
              <div>
                <div class="font-medium">{{ vatRate.label }}</div>
                <div class="text-sm text-gray-500">{{ vatRate.ratePercent }}% · sort {{ vatRate.sortOrder }}</div>
              </div>
              <div class="flex items-center gap-2">
                <UBadge v-if="vatRate.isDefault" color="primary" variant="soft">default</UBadge>
                <UButton color="gray" variant="ghost" label="Edytuj" @click="editVatRate(vatRate)" />
                <UButton color="red" variant="ghost" label="Usuń" @click="deleteVatRate(vatRate.id)" />
              </div>
            </div>
          </div>
        </div>
      </UCard>
    </div>

    <div class="grid xl:grid-cols-[2fr_1fr] gap-6">
      <UCard>
        <template #header>
          <div>
            <h2 class="font-semibold text-lg">Plany numeracji</h2>
            <p class="text-sm text-gray-500">Domyślne wzorce numerów per typ dokumentu.</p>
          </div>
        </template>

        <div class="space-y-4">
          <div class="grid md:grid-cols-2 gap-3">
            <UInput v-model="numberPlanForm.name" placeholder="Nazwa planu" />
            <USelectMenu
              v-model="numberPlanForm.docType"
              :items="docTypeOptions"
              value-key="value"
              label-key="label"
            />
            <UInput v-model="numberPlanForm.patternTemplate" placeholder="Szablon, np. FV/{year}/{n}" />
            <UInput v-model="numberPlanForm.nextNumber" type="number" placeholder="Następny numer" />
            <USelectMenu
              v-model="numberPlanForm.divisionId"
              :items="divisionOptions"
              value-key="value"
              label-key="label"
              placeholder="Oddział opcjonalny"
            />
          </div>
          <div class="flex flex-wrap items-center gap-4">
            <UCheckbox v-model="numberPlanForm.active" label="Aktywny" />
            <UCheckbox v-model="numberPlanForm.isDefault" label="Domyślny dla typu" />
          </div>
          <div class="flex justify-end gap-3">
            <UButton v-if="editingNumberPlanId" color="gray" variant="soft" label="Anuluj" @click="resetNumberPlanForm" />
            <UButton color="primary" :loading="isSavingNumberPlan" :label="editingNumberPlanId ? 'Zapisz plan' : 'Dodaj plan'" @click="saveNumberPlan" />
          </div>

          <div class="space-y-3">
            <div
              v-for="numberPlan in numberPlans || []"
              :key="numberPlan.id"
              class="rounded-lg border border-gray-200 dark:border-gray-800 p-4 flex flex-col gap-3"
            >
              <div class="flex items-start justify-between gap-4">
                <div>
                  <div class="font-medium">{{ numberPlan.name }}</div>
                  <div class="text-sm text-gray-500">
                    {{ numberPlan.docType }} · {{ numberPlan.patternTemplate }} · next {{ numberPlan.nextNumber }}
                  </div>
                  <div class="text-xs text-gray-400 mt-1">
                    {{ numberPlan.division?.name || 'wszystkie oddziały' }}
                  </div>
                </div>
                <div class="flex gap-2">
                  <UBadge :color="numberPlan.active ? 'green' : 'gray'" variant="soft">{{ numberPlan.active ? 'active' : 'inactive' }}</UBadge>
                  <UBadge v-if="numberPlan.isDefault" color="primary" variant="soft">default</UBadge>
                </div>
              </div>
              <div class="flex justify-end gap-3">
                <UButton color="gray" variant="ghost" label="Edytuj" @click="editNumberPlan(numberPlan)" />
                <UButton color="red" variant="ghost" label="Usuń" @click="deleteNumberPlan(numberPlan.id)" />
              </div>
            </div>
          </div>
        </div>
      </UCard>

      <UCard :class="isAdmin ? '' : 'xl:col-span-2'">
        <template #header>
          <div>
            <h2 class="font-semibold text-lg">Runtime</h2>
            <p class="text-sm text-gray-500">Lokalna konfiguracja klienta Nuxt.</p>
          </div>
        </template>

        <div class="space-y-6">
          <section>
            <h3 class="text-sm font-medium mb-2">Integracja Ollama</h3>
            <div class="space-y-3">
              <UInput :model-value="config.public.ollamaUrl" disabled />
              <UInput :model-value="config.public.ollamaModel" disabled />
            </div>
          </section>

          <USeparator />

          <section>
            <h3 class="text-sm font-medium mb-2">Preferencje interfejsu</h3>
            <div class="flex items-center gap-4">
              <span class="text-sm text-gray-500">Tryb kolorystyczny:</span>
              <UColorModeSelect />
            </div>
          </section>

          <USeparator />

          <section v-if="!isAdmin" class="space-y-2">
            <h3 class="text-sm font-medium">Konfiguracja administracyjna</h3>
            <p class="text-sm text-gray-500">
              Oddziały, VAT i plany numeracji są widoczne dopiero po zalogowaniu kontem z rolą `admin`.
            </p>
          </section>

          <USeparator v-if="!isAdmin" />

          <section class="space-y-4">
            <div>
              <h3 class="text-sm font-medium mb-2">Auth runtime</h3>
              <p class="text-xs text-gray-500">Logowanie sesji, podgląd użytkownika i zmiana hasła.</p>
            </div>

            <div v-if="authSession?.user" class="rounded-lg border border-gray-200 dark:border-gray-800 p-3 space-y-2">
              <div class="font-medium">{{ authSession.user.username }}</div>
              <div class="text-sm text-gray-500">{{ authSession.user.role }}</div>
              <UButton color="gray" variant="soft" :loading="isLoggingOut" label="Wyloguj" @click="logout" />
            </div>

            <div v-else class="space-y-3">
              <UInput v-model="loginForm.username" placeholder="Login" />
              <UInput v-model="loginForm.password" type="password" placeholder="Hasło" />
              <UButton color="primary" :loading="isLoggingIn" label="Zaloguj" @click="login" />
            </div>

            <div v-if="authSession?.user" class="space-y-3">
              <UInput v-model="passwordForm.currentPassword" type="password" placeholder="Aktualne hasło" />
              <UInput v-model="passwordForm.newPassword" type="password" placeholder="Nowe hasło" />
              <UInput v-model="passwordForm.newPassword2" type="password" placeholder="Powtórz nowe hasło" />
              <UButton color="primary" variant="soft" :loading="isChangingPassword" label="Zmień hasło" @click="changePassword" />
            </div>

            <UAlert
              v-if="authMessage"
              color="primary"
              variant="soft"
              icon="i-heroicons-information-circle"
              :title="authMessage"
            />
          </section>
        </div>
      </UCard>
    </div>
  </div>
</template>

<script setup>
const config = useRuntimeConfig()
const route = useRoute()
const { session: authSession, loadSession, login: loginWithSession, logout: logoutSession, changePassword: changeSessionPassword } = usePortalAuth()

const defaultDivisionForm = () => ({
  name: '',
  shortName: '',
  address: '',
  city: '',
  postalCode: '',
  nip: '',
  regon: '',
  active: true,
  isDefault: false
})

const defaultVatForm = () => ({
  label: '',
  ratePercent: '',
  sortOrder: 0,
  isDefault: false
})

const defaultNumberPlanForm = () => ({
  name: '',
  docType: 'invoice',
  patternTemplate: 'FV/{year}/{n}',
  nextNumber: 1,
  divisionId: null,
  active: true,
  isDefault: false
})

const docTypeOptions = [
  { label: 'Invoice', value: 'invoice' },
  { label: 'Proforma', value: 'proforma' },
  { label: 'Debit note', value: 'debit_note' },
  { label: 'Customer', value: 'customer' }
]

const divisionForm = reactive(defaultDivisionForm())
const vatForm = reactive(defaultVatForm())
const numberPlanForm = reactive(defaultNumberPlanForm())
const loginForm = reactive({ username: '', password: '' })
const passwordForm = reactive({ currentPassword: '', newPassword: '', newPassword2: '' })

const editingDivisionId = ref(null)
const editingVatId = ref(null)
const editingNumberPlanId = ref(null)

const isSavingDivision = ref(false)
const isSavingVat = ref(false)
const isSavingNumberPlan = ref(false)
const isLoggingIn = ref(false)
const isLoggingOut = ref(false)
const isChangingPassword = ref(false)
const authMessage = ref('')

const isAdmin = computed(() => authSession.value.user?.role === 'admin')

const { data: divisions, refresh: refreshDivisions } = await useFetch('/api/v1/config/divisions', {
  default: () => [],
  immediate: false,
  server: false
})
const { data: vatRates, refresh: refreshVatRates } = await useFetch('/api/v1/config/vat-rates', {
  default: () => [],
  immediate: false,
  server: false
})
const { data: numberPlans, refresh: refreshNumberPlans } = await useFetch('/api/v1/config/number-plans', {
  default: () => [],
  immediate: false,
  server: false
})

const divisionOptions = computed(() => [
  { label: 'Wszystkie oddziały', value: null },
  ...((divisions.value || []).map((division) => ({
    label: division.name,
    value: division.id
  })))
])

const refreshAll = async () => {
  await loadAuthSession()

  if (!isAdmin.value) {
    return
  }

  await Promise.all([
    refreshDivisions(),
    refreshVatRates(),
    refreshNumberPlans()
  ])
}

const resetDivisionForm = () => {
  editingDivisionId.value = null
  Object.assign(divisionForm, defaultDivisionForm())
}

const resetVatForm = () => {
  editingVatId.value = null
  Object.assign(vatForm, defaultVatForm())
}

const resetNumberPlanForm = () => {
  editingNumberPlanId.value = null
  Object.assign(numberPlanForm, defaultNumberPlanForm())
}

const editDivision = (division) => {
  editingDivisionId.value = division.id
  Object.assign(divisionForm, {
    name: division.name || '',
    shortName: division.shortName || '',
    address: division.address || '',
    city: division.city || '',
    postalCode: division.postalCode || '',
    nip: division.nip || '',
    regon: division.regon || '',
    active: !!division.active,
    isDefault: !!division.isDefault
  })
}

const editVatRate = (vatRate) => {
  editingVatId.value = vatRate.id
  Object.assign(vatForm, {
    label: vatRate.label || '',
    ratePercent: vatRate.ratePercent ?? '',
    sortOrder: vatRate.sortOrder ?? 0,
    isDefault: !!vatRate.isDefault
  })
}

const editNumberPlan = (numberPlan) => {
  editingNumberPlanId.value = numberPlan.id
  Object.assign(numberPlanForm, {
    name: numberPlan.name || '',
    docType: numberPlan.docType || 'invoice',
    patternTemplate: numberPlan.patternTemplate || '',
    nextNumber: numberPlan.nextNumber ?? 1,
    divisionId: numberPlan.divisionId ?? null,
    active: !!numberPlan.active,
    isDefault: !!numberPlan.isDefault
  })
}

const saveDivision = async () => {
  isSavingDivision.value = true
  try {
    await $fetch(editingDivisionId.value ? `/api/v1/config/divisions/${editingDivisionId.value}` : '/api/v1/config/divisions', {
      method: editingDivisionId.value ? 'PUT' : 'POST',
      body: { ...divisionForm }
    })
    resetDivisionForm()
    await refreshDivisions()
  } finally {
    isSavingDivision.value = false
  }
}

const deleteDivision = async (id) => {
  await $fetch(`/api/v1/config/divisions/${id}`, { method: 'DELETE' })
  if (editingDivisionId.value === id) {
    resetDivisionForm()
  }
  await refreshDivisions()
}

const saveVatRate = async () => {
  isSavingVat.value = true
  try {
    await $fetch(editingVatId.value ? `/api/v1/config/vat-rates/${editingVatId.value}` : '/api/v1/config/vat-rates', {
      method: editingVatId.value ? 'PUT' : 'POST',
      body: { ...vatForm }
    })
    resetVatForm()
    await refreshVatRates()
  } finally {
    isSavingVat.value = false
  }
}

const deleteVatRate = async (id) => {
  await $fetch(`/api/v1/config/vat-rates/${id}`, { method: 'DELETE' })
  if (editingVatId.value === id) {
    resetVatForm()
  }
  await refreshVatRates()
}

const saveNumberPlan = async () => {
  isSavingNumberPlan.value = true
  try {
    await $fetch(editingNumberPlanId.value ? `/api/v1/config/number-plans/${editingNumberPlanId.value}` : '/api/v1/config/number-plans', {
      method: editingNumberPlanId.value ? 'PUT' : 'POST',
      body: { ...numberPlanForm }
    })
    resetNumberPlanForm()
    await refreshNumberPlans()
  } finally {
    isSavingNumberPlan.value = false
  }
}

const deleteNumberPlan = async (id) => {
  await $fetch(`/api/v1/config/number-plans/${id}`, { method: 'DELETE' })
  if (editingNumberPlanId.value === id) {
    resetNumberPlanForm()
  }
  await refreshNumberPlans()
}

const loadAuthSession = async () => {
  await loadSession({ force: true, silent: true })

  if (isAdmin.value) {
    await Promise.all([
      refreshDivisions(),
      refreshVatRates(),
      refreshNumberPlans()
    ])
  }
}

const login = async () => {
  isLoggingIn.value = true
  authMessage.value = ''
  try {
    await loginWithSession({ ...loginForm })
    Object.assign(loginForm, { username: '', password: '' })
    authMessage.value = 'Sesja została utworzona.'
    await loadAuthSession()

    const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : ''
    if (redirect && redirect !== '/settings') {
      await navigateTo(redirect)
    }
  } catch (_error) {
    authMessage.value = 'Logowanie nie powiodło się.'
  } finally {
    isLoggingIn.value = false
  }
}

const logout = async () => {
  isLoggingOut.value = true
  authMessage.value = ''
  try {
    await logoutSession()
    authMessage.value = 'Sesja została zamknięta.'
  } finally {
    isLoggingOut.value = false
  }
}

const changePassword = async () => {
  isChangingPassword.value = true
  authMessage.value = ''
  try {
    await changeSessionPassword({ ...passwordForm })
    Object.assign(passwordForm, { currentPassword: '', newPassword: '', newPassword2: '' })
    authMessage.value = 'Hasło zostało zmienione.'
  } catch (_error) {
    authMessage.value = 'Zmiana hasła nie powiodła się.'
  } finally {
    isChangingPassword.value = false
  }
}

onMounted(() => {
  loadAuthSession()
})
</script>
