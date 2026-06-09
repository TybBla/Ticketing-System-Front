export const vFocus = {
  mounted: (el: HTMLElement) => {
    const input = el.querySelector('.v-field__input') as HTMLInputElement

    if (input) {
      setTimeout(() => input.focus(), 250)
    }
  },
}
