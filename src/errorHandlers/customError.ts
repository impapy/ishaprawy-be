import messages from './messages'

export type MessageType = keyof typeof messages

export class CustomError extends Error {
  code: MessageType

  message: string

  extra?: Record<string, unknown>

  constructor(code: MessageType, payload?: string, extra?: Record<string, unknown>) {
    super(payload)
    this.code = code
    this.message = payload ?? ''
    this.extra = extra
  }
}
