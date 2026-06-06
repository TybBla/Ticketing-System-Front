export const vFocus = {
  mounted: (el: HTMLElement) => {
    // Vuetify renders the real input inside the field wrapper.
    const input = el.querySelector('.v-field__input') as HTMLInputElement

    if (input) {
      setTimeout(() => input.focus(), 250)
    }
  },
}
