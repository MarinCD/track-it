<template>
  <CContainer>
    <CRow>
      <!-- Première colonne avec les informations utilisateur -->
      <CCol>
        <CCard>
          <CCardBody>
            <CCardTitle class="text-center">Informations Utilisateur</CCardTitle>
            <CListGroup>
              <CListGroupItem> Nom d'utilisateur : {{ userInfo.username }} </CListGroupItem>
              <CListGroupItem> Rôle : {{ userInfo.roleLabel }} </CListGroupItem>
              <CListGroupItem> Adresse e-mail : {{ userInfo.email }} </CListGroupItem>
            </CListGroup>
          </CCardBody>
        </CCard>

        <br />

        <!-- Formulaire pour changer le mot de passe -->
        <CCard>
          <CCardBody>
            <CCardTitle class="text-center">Modifier le Mot de Passe</CCardTitle>
            <CForm @submit.prevent="updatePassword">
              <CFormInput
                v-model="newPassword"
                type="password"
                label="Nouveau Mot de Passe"
                required
              />
              <CFormInput
                v-model="confirmPassword"
                type="password"
                label="Confirmer le Mot de Passe"
                required
              />
              <CButton color="primary" type="submit" class="mt-2">Mettre à jour</CButton>
            </CForm>
          </CCardBody>
        </CCard>
        <br />
        <CButton color="danger" block @click="handleLogout"> Se Déconnecter </CButton>
      </CCol>
    </CRow>
  </CContainer>
</template>
<script>
import { ref, onMounted } from 'vue'
import axios from '@/plugins/axios'
import { useRouter } from 'vue-router'

export default {
  setup() {
    const router = useRouter()

    // Référence pour les informations utilisateur
    const userInfo = ref({
      username: '',
      role: '',
      roleLabel: '',
      email: '',
    })

    const newPassword = ref('')
    const confirmPassword = ref('')

    // Récupérer les données de l'utilisateur depuis le localStorage et l'API
    const fetchUserInfo = async () => {
      const storedUser = JSON.parse(localStorage.getItem('user'))
      if (storedUser) {
        userInfo.value.username = storedUser.username
        userInfo.value.email = storedUser.email
        await fetchRoleLabel(storedUser.role)
      }
    }

    // Récupérer le libellé du rôle utilisateur
    const fetchRoleLabel = async (roleId) => {
      try {
        const response = await axios.get('/Connexion/detailrole.php', {
          params: { roleId },
          withCredentials: true,
        })
        if (response.data.roles) {
          const role = response.data.roles.find((r) => r.idRole === roleId)
          if (role) {
            userInfo.value.roleLabel = role.libelleRole
          }
        }
      } catch (error) {
        console.error('Erreur récupération rôle:', error)
      }
    }

    // Fonction de mise à jour du mot de passe
    const updatePassword = async () => {
      if (newPassword.value !== confirmPassword.value) {
        alert('Les mots de passe ne correspondent pas!')
        return
      }

      try {
        const response = await axios.post('Connexion/updatePassword.php', {
          userId: JSON.parse(localStorage.getItem('user')).id,
          newPassword: newPassword.value,
        })

        if (response.data.success) {
          alert('Mot de passe mis à jour avec succès')
        } else {
          alert('Erreur lors de la mise à jour du mot de passe')
        }
      } catch (error) {
        console.error('Erreur API :', error)
      }
    }

    // Déconnexion de l'utilisateur
    const handleLogout = () => {
      localStorage.removeItem('user')
      router.push('/login') // Redirection vers la page de connexion
    }

    // Appel à la récupération des infos utilisateur au montage du composant
    onMounted(() => {
      fetchUserInfo()
    })

    return {
      userInfo,
      newPassword,
      confirmPassword,
      updatePassword,
      handleLogout,
    }
  },
}
</script>
