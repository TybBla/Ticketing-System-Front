<script setup lang="ts" generic="TItem">
defineProps<{
  items: TItem[]
  getKey: (item: TItem) => string | number
  getLabel: (item: TItem) => string
  getValue: (item: TItem) => string | number
}>()
</script>

<template>
  <div class="generic-stat-list">
    <div
      v-for="item in items"
      :key="getKey(item)"
      class="generic-stat-list__row"
    >
      <slot name="label" :item="item" :label="getLabel(item)">
        <span class="text-body-2 text-medium-emphasis">
          {{ getLabel(item) }}
        </span>
      </slot>

      <slot name="value" :item="item" :value="getValue(item)">
        <strong>{{ getValue(item) }}</strong>
      </slot>
    </div>
  </div>
</template>

<style scoped>
.generic-stat-list {
  display: grid;
  flex: 1;
  gap: 10px;
}

.generic-stat-list__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}
</style>
