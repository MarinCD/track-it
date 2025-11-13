<template>
  <div class="wrapper min-vh-100 d-flex flex-row align-items-center">
    <CContainer>
      <CRow class="justify-content-center">
        <CCol :md="8">
          <CCardGroup>
            <CCard class="p-4">
              <CCardBody>
                <CForm @submit.prevent="handleLogin">
                  <h1>Connexion</h1>
                  <p class="text-body-secondary">Connectez-vous à votre compte</p>

                  <CInputGroup class="mb-3">
                    <CInputGroupText>
                      <CIcon icon="cil-user" />
                    </CInputGroupText>
                    <CFormInput
                      v-model="formData.username"
                      placeholder="Nom d'utilisateur"
                      autocomplete="username"
                      required
                    />
                  </CInputGroup>

                  <CInputGroup class="mb-4">
                    <CInputGroupText>
                      <CIcon icon="cil-lock-locked" />
                    </CInputGroupText>
                    <CFormInput
                      v-model="formData.password"
                      type="password"
                      placeholder="Mot de passe"
                      autocomplete="current-password"
                      required
                    />
                  </CInputGroup>

                  <CRow>
                    <CCol :xs="6">
                      <CButton type="submit" color="primary" class="px-4 text-white">
                        Se connecter
                      </CButton>
                    </CCol>
                  </CRow>

                  <p v-if="errorMessage" class="text-danger mt-3">{{ errorMessage }}</p>
                </CForm>
              </CCardBody>
            </CCard>
          </CCardGroup>
        </CCol>
      </CRow>
    </CContainer>
  </div>
</template>

<script>
import axios from '@/plugins/axios'

export default {
  data() {
    return {
      formData: {
        username: '',
        password: '',
      },
      errorMessage: null,
    }
  },
  methods: {
    async handleLogin() {
      try {
        // ✅ Envoi du cookie de session (PHPSESSID)
        const response = await axios.post(
          'http://localhost/api/Connexion/authentification.php',
          this.formData,
          {
            withCredentials: true, // 🚨 Important !
            headers: { 'Content-Type': 'application/json' },
          }
        )

        if (response.data?.success) {
          // Stockage local
          localStorage.setItem('user', JSON.stringify(response.data.user))

          // Redirection
          this.$router.push('/dashboard')
        } else {
          throw new Error(response.data?.message || 'Erreur de connexion.')
        }
      } catch (error) {
        this.errorMessage =
          error.response?.data?.message ||
          error.message ||
          'Une erreur est survenue.'
      }
    },
  },
}
</script>
