<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
    <UCard class="w-full max-w-md">
      <template #header>
        <div class="text-center">
          <h1 class="text-2xl font-bold text-primary-600 dark:text-primary-400">SNMS Enterprise</h1>
          <p class="text-sm text-gray-500 mt-1">Zaloguj się do systemu</p>
        </div>
      </template>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <UFormGroup label="Użytkownik" name="username">
          <UInput v-model="form.username" icon="i-heroicons-user" placeholder="login" required />
        </UFormGroup>

        <UFormGroup label="Hasło" name="password">
          <UInput v-model="form.password" type="password" icon="i-heroicons-lock-closed" placeholder="••••••••" required />
        </UFormGroup>

        <div v-if="error" class="text-sm text-red-500 bg-red-50 dark:bg-red-900/10 p-3 rounded-lg border border-red-100 dark:border-red-900/20">
          {{ error }}
        </div>

        <UButton type="submit" label="Zaloguj" block :loading="loading" />
      </form>

      <template #footer>
        <p class="text-center text-xs text-gray-400">
          &copy; 2024 SNMS Enterprise. Wszystkie prawa zastrzeżone.
        </p>
      </template>
    </UCard>
  </div>
</template>

<script setup>
definePageMeta({
  layout: false
})

const form = reactive({
  username: '',
  password: ''
})

const loading = ref(false)
const error = ref('')

const handleLogin = async () => {
  loading.value = true
  error.value = ''

  try {
    const formData = new FormData()
    formData.append('username', form.username)
    formData.append('password', form.password)

    const response = await $fetch('/api/v2/auth/login', {
      method: 'POST',
      body: formData
    })

    if (response.access_token) {
      // Store token in cookie or localStorage
      const token = useCookie('auth_token')
      token.value = response.access_token
      await navigateTo('/')
    }
  } catch (e) {
    error.value = 'Błędny login lub hasło'
  } finally {
    loading.value = false
  }
}
</script>
