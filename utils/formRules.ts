type MessageResolver = string | (() => string)

const resolveMessage = (message: MessageResolver) => {
  return typeof message === 'function' ? message() : message
}

export const requiredRule = (message: MessageResolver) => {
  return (value: string) => Boolean(value) || resolveMessage(message)
}

export const emailRule = (message: MessageResolver) => {
  return (value: string) => /.+@.+\..+/.test(value) || resolveMessage(message)
}

export const minLengthRule = (minLength: number, message: MessageResolver) => {
  return (value: string) => value.length >= minLength || resolveMessage(message)
}

export const twoFactorCodeRule = (message: MessageResolver) => {
  return (value: string) => /^\d{6}$/.test(value) || resolveMessage(message)
}
