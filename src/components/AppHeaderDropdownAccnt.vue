<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import avatar from '@/assets/images/avatars/8.jpg'
import axios from '@/plugins/axios'

// Déclarez les variables pour stocker les informations de l'utilisateur
const userInfo = ref({
  username: '',
  role: '',
  roleLabel: '',
})

// Déclarez une variable pour vérifier si le mode dark est activé
const isDarkMode = ref(false)

// Appliquez la détection du mode sombre lors du montage du composant
onMounted(() => {
  // Récupérer les données utilisateur du localStorage
  const storedUser = JSON.parse(localStorage.getItem('user'))
  if (storedUser) {
    userInfo.value = {
      username: storedUser.username,
      role: storedUser.role,
      
    }
    fetchRoleLabel(storedUser.role) // ⬅️ appel ici
  }

  // Détection du thème
  detectTheme()
  observeThemeChange()
})

const fetchRoleLabel = async (roleId) => {
  try {
    const response = await axios.get('/Connexion/detailrole.php', {
      withCredentials: true, // équivalent de `credentials: 'include'`
    })

    const data = response.data

    if (data.roles) {
      const role = data.roles.find((r) => r.idRole === roleId)
      if (role) {
        userInfo.value.roleLabel = role.libelleRole
      } else {
        userInfo.value.roleLabel = 'Rôle inconnu'
      }
    } else {
      console.error('Erreur dans la réponse :', data.message)
    }
  } catch (error) {
    console.error('Erreur fetchRoleLabel:', error)
  }
}

// Détecter le mode sombre
const detectTheme = () => {
  const theme = document.documentElement.getAttribute('data-coreui-theme')
  isDarkMode.value = theme === 'dark'
}

const ParameterPush = () => {
  router.push({ name: 'Paramètres' }) // Utilise le nom de la route définie dans ton routeur
}

// Observer pour détecter les changements de thème
let observer
const observeThemeChange = () => {
  observer = new MutationObserver(() => {
    detectTheme()
  })
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-coreui-theme'],
  })
}

// Fonction pour gérer la déconnexion
const handleLogout = () => {
  // Supprimer les données d'utilisateur du localStorage
  localStorage.removeItem('user')

  // Rediriger vers la page de connexion
  router.push('/login')
}

// Utilisation du router pour navigation
const router = useRouter()
</script>

<template>
  <CDropdown placement="bottom-end" variant="nav-item">
    <CDropdownToggle class="py-0 pe-0" :caret="false">
      <CAvatar :src="avatar" size="md" />
    </CDropdownToggle>
    <CDropdownMenu class="pt-0">
      <!-- Appliquer une couleur dynamique en fonction du mode -->
      <CDropdownItem :class="{ 'text-white': isDarkMode, 'text-dark': !isDarkMode }" disabled>
        <strong>Utilisateur : </strong>{{ userInfo.username }}
      </CDropdownItem>
      <CDropdownItem :class="{ 'text-white': isDarkMode, 'text-dark': !isDarkMode }" disabled>
        <strong>Rôle : </strong>{{ userInfo.roleLabel }}
      </CDropdownItem>

      <CDropdownDivider />

      <CDropdownItem
        @click="ParameterPush"
        :class="{ 'text-white': isDarkMode, 'text-dark': !isDarkMode }"
      >
        <CIcon :icon="isDarkMode ? 'cil-settings' : 'cil-settings'" /> Paramètres
      </CDropdownItem>

      <CDropdownDivider />

      <!-- Appliquer couleur et icône dynamiquement selon le mode -->
      <CDropdownItem
        @click="handleLogout"
        :class="{ 'text-white': isDarkMode, 'text-dark': !isDarkMode }"
      >
        <CIcon icon="cil-lock-locked" /> Se déconnecter
      </CDropdownItem>
    </CDropdownMenu>
  </CDropdown>
</template>

<style scoped>
/* Définir des couleurs personnalisées pour les textes */
.text-white {
  color: white;
}

.text-dark {
  color: black;
}
</style>
