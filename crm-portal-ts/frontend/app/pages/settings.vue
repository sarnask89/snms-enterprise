<template>
  <div class="p-8">
    <h1 class="text-2xl font-bold mb-4">Ustawienia Systemu</h1>
    <UCard>
      <div class="space-y-6">
        <section>
          <h3 class="text-lg font-medium mb-2">Integracja Ollama</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <UFormGroup label="URL Serwera Ollama">
              <UInput :model-value="config.public.ollamaUrl" disabled />
            </UFormGroup>
            <UFormGroup label="Model Domyslny">
              <UInput :model-value="config.public.ollamaModel" disabled />
            </UFormGroup>
          </div>
        </section>
        
        <UDivider />
        
        <section>
          <h3 class="text-lg font-medium mb-2">Preferencje Interfejsu</h3>
          <div class="flex items-center gap-4">
            <span>Tryb kolorystyczny:</span>
            <UColorModeSelect />
          </div>
        </section>
      </div>
    </UCard>
  </div>
</template>

<script setup>
const config = useRuntimeConfig()
</script>
