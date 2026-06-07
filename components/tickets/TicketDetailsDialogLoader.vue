<template>
  <v-dialog model-value persistent max-width="720">
    <v-card>
      <v-card-text class="dialog-loader">
        <v-progress-circular indeterminate color="primary" />
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.dialog-loader {
  display: grid;
  min-height: 180px;
  place-items: center;
}
</style>
