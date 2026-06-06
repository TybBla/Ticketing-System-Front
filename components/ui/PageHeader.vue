<script setup lang="ts">
defineProps<{
  title: string
  subtitle?: string
  backTo?: string
}>()

const { t } = useAppI18n()
</script>

<template>
  <div class="page-header">
    <div>
      <div class="d-flex align-center ga-2 mb-1">
        <v-btn
          v-if="backTo"
          :to="backTo"
          icon="mdi-arrow-left"
          variant="text"
          density="comfortable"
          :aria-label="t('app.back')"
        />
        <h1 class="text-h4 font-weight-bold">
          {{ title }}
        </h1>
      </div>
      <p v-if="subtitle" class="text-body-1 text-medium-emphasis mb-0">
        {{ subtitle }}
      </p>
    </div>

    <div v-if="$slots.actions" class="page-header__actions">
      <slot name="actions" />
    </div>
  </div>
</template>

<style scoped>
.page-header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 24px;
}

.page-header__actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
}
</style>
