<script setup lang="ts">
const search = defineModel<string>({ default: '' })
const includeArchived = defineModel<boolean>('includeArchived', { default: false })
const { t } = useAppI18n()
</script>

<template>
  <div class="ticket-filters">
    <v-text-field
      v-model="search"
      :label="t('tickets.search')"
      prepend-inner-icon="mdi-magnify"
      variant="outlined"
      density="compact"
      hide-details
      class="ticket-filters__search"
    />
    <v-switch
      v-model="includeArchived"
      :label="t('tickets.showArchive')"
      color="primary"
      hide-details
    />
  </div>
</template>

<style scoped>
.ticket-filters {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 16px;
  padding: 16px;
}

.ticket-filters__search {
  min-width: 260px;
  max-width: 420px;
}
</style>
