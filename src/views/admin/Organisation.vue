<template>
  <div class="organization-settings p-4">
    <h2 class="fw-bold mb-1" :class="themeText">Paramètres de l'organisation</h2>
    <p class="text-muted mb-4">Gérez les informations de votre organisation</p>

    <CCard :class="[themeClass, 'shadow-sm border-0']">
      <CCardHeader :class="[themeClass, 'border-bottom-0']">
        <h5 class="mb-0" :class="themeText">Détails de l'organisation</h5>
      </CCardHeader>

      <CCardBody v-if="org">
        <div class="mb-4 d-flex justify-content-between align-items-start">
          <div>
            <div class="text-muted small">Nom de l'organisation</div>
            <div class="fs-5 fw-medium" :class="themeText">{{ org.name }}</div>
          </div>
        </div>

        <div class="mb-4">
          <div class="text-muted small">Identifiant (UUID)</div>
          <CFormInput
            :value="org.uuid"
            plaintext
            readonly
            class="mt-1 form-control-plaintext"
            :class="themeInput"
          />
          <small class="text-muted">Identifiant unique de votre organisation</small>
        </div>

        <div class="d-flex justify-content-between mt-5 text-muted">
          <div>
            <div class="small">Créée le</div>
            <div>{{ org.createdAt }}</div>
          </div>
          <div>
            <div class="small">Dernière mise à jour</div>
            <div>{{ org.updatedAt }}</div>
          </div>
        </div>
      </CCardBody>

      <CCardBody v-else>
        <p class="text-muted">Chargement des informations...</p>
      </CCardBody>
    </CCard>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const org = ref(null)

const themeClass = ref('')
const themeText = ref('')
const themeInput = ref('')

// Charger organisation depuis l’API
async function loadOrganization() {
  try {
    const user = JSON.parse(localStorage.getItem('user'))
    if (!user || !user.id) {
      console.error('Utilisateur non connecté')
      return
    }

    const res = await fetch(`http://localhost/api/Support/getOrganizationUser.php?idUser=${user.id}`, {
    method: 'GET',
    credentials: 'include',  // très important pour envoyer le cookie de session
    });
    const json = await res.json()
    console.log("Données API :", json);

    if (json.success && json.organization) {
      org.value = mapOrganization(json.organization)
    } else {
      console.error('Organisation introuvable')
    }
  } catch (err) {
    console.error('Erreur API organisation :', err)
  }
}

// Mapping API → UI
function mapOrganization(apiOrg) {
  return {
    id: apiOrg.organization_id,
    uuid: apiOrg.organization_uuid,
    name: apiOrg.organization_name,
    createdAt: formatDate(apiOrg.created_at),
    updatedAt: formatDate(apiOrg.updated_at),
  }
}

// Formatage de date
function formatDate(dateString) {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit', 
    month: 'long',
    year: 'numeric',
  })
}

// Gestion du thème
function updateThemeClasses() {
  const theme = document.documentElement.getAttribute('data-coreui-theme')
  if (theme === 'dark') {
    themeClass.value = 'bg-dark text-white'
    themeText.value = 'text-white'
    themeInput.value = 'bg-secondary bg-opacity-10 text-white'
  } else {
    themeClass.value = 'bg-white text-dark'
    themeText.value = 'text-dark'
    themeInput.value = 'bg-light text-dark'
  }
}

let observer
function observeThemeChange() {
  observer = new MutationObserver(() => {
    updateThemeClasses()
  })
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-coreui-theme'],
  })
}

onMounted(() => {
  loadOrganization()
  updateThemeClasses()
  observeThemeChange()
})
</script>

<style scoped>
.organization-settings {
  min-height: 100vh;
}

.form-control-plaintext {
  border-radius: 0.375rem;
  padding: 0.75rem;
}
</style>
