import { toast } from 'react-toastify'

export function showError(error: string | null) {
  toast.error(error, {
    autoClose: false,
  })
}
