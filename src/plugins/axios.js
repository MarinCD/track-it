import axios from 'axios'

// Configuration de l'instance Axios
const instance = axios.create({
  withCredentials: false,
  baseURL: 'https://localhost/api/',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

/** Default error message */
const DEFAULT_ERROR_MESSAGE = 'Une erreur inconnue est survenue'

// Intercepteur de réponse pour gérer les erreurs globalement
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    let errorMessage = null

    // Si nous n'avons pas d'erreur ou si nous avons un code HTTP 500
    if (!error.response || error.response.status >= 500) {
      // Utilisez le message par défaut
      errorMessage = DEFAULT_ERROR_MESSAGE
    } else {
      // Sinon, utilisez le message du serveur ou revenez au message par défaut
      errorMessage = error.response.data.message || DEFAULT_ERROR_MESSAGE
    }
    // Si nous n'avons pas d'erreur ou si nous avons un code HTTP 500
    if (!error.response || error.response.status >= 500) {
      // Utilisez le message par défaut
      errorMessage = DEFAULT_ERROR_MESSAGE
    } else {
      // Sinon, utilisez le message du serveur ou revenez au message par défaut
      errorMessage = error.response.data.message || DEFAULT_ERROR_MESSAGE
    }

    if (errorMessage) {
      console.log(errorMessage)
    }

    return Promise.reject(error)
  },
)

export default instance
