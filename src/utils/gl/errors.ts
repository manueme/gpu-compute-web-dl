import { showError } from '../errors'

export function checkGlError(context: WebGL2ComputeRenderingContext | null, message: string) {
  if (!context) {
    showError(`Context is null ${message}`)
  } else {
    const error = context.getError()
    if (error != context.NO_ERROR) {
      showError(`GL Error ${error} ${message}`)
    }
  }
}
