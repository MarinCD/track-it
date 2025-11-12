<template>
  <h1 class="text-center">Créer un ticket de support</h1>
  <br /><br />
  <CContainer>
    <CRow>
      <!-- Colonne gauche : directives et délais -->
      <CCol md="4">
        <CCard class="mb-4">
          <CCardBody>
            <h5 class="fw-bold mb-3">Directives de soumission</h5>
            <ul class="list-unstyled">
              <li class="mb-3">
                ⚠️ <strong>Soyez descriptif</strong><br />
                Incluez autant de détails que possible sur le problème.
              </li>
              <li class="mb-3">
                🧭 <strong>Étapes pour reproduire</strong><br />
                Décrivez les étapes exactes ayant mené au problème.
              </li>
              <li class="mb-3">
                📸 <strong>Captures d’écran</strong><br />
                Joignez des captures d’écran ou des messages d’erreur si possible.
              </li>
            </ul>

            <hr />

            <h5 class="fw-bold mb-3">Délai de réponse estimé</h5>
            <ul class="list-unstyled">
              <li class="mb-2">
                <span class="badge bg-danger">Priorité Élevée</span> &lt; 2 heures
              </li>
              <li class="mb-2">
                <span class="badge bg-warning text-dark">Priorité moyenne</span> &lt; 8 heures
              </li>
              <li>
                <span class="badge bg-secondary">Priorité faible</span> &lt; 24 heures
              </li>
            </ul>
          </CCardBody>
        </CCard>
      </CCol>

      <!-- Colonne droite : formulaire -->
      <CCol md="8">
        <CCard>
          <CCardBody>
            <CCardTitle class="text-center">Formulaire de création de ticket</CCardTitle>
            <CListGroup>
              <CListGroupItem>
                <label for="category">Catégorie</label>
                <select id="category" v-model="ticketData.category" class="form-control">
                  <option
                    v-for="category in categories"
                    :key="category.idCategorie"
                    :value="category.libelleCategorie"
                  >
                    {{ category.libelleCategorie }}
                  </option>
                </select>
              </CListGroupItem>

              <CListGroupItem>
                <label for="os">Système d’exploitation</label>
                <input type="text" id="os" v-model="ticketData.os" class="form-control" readonly />
              </CListGroupItem>

              <CListGroupItem>
                <label for="priority">Priorité</label>
                <select id="priority" v-model="ticketData.priority" class="form-control">
                  <option value="Faible">Faible</option>
                  <option value="Moyenne">Moyenne</option>
                  <option value="Élevée">Élevée</option>
                </select>
              </CListGroupItem>

              <CListGroupItem>
                <label for="title">Titre</label>
                <input type="text" id="title" v-model="ticketData.title" class="form-control" required />
              </CListGroupItem>

              <CListGroupItem>
                <label for="description">Description</label>
                <textarea id="description" v-model="ticketData.description" class="form-control" required></textarea>
              </CListGroupItem>

              <!-- 📎 Nouveau champ pour pièces jointes -->
              <CListGroupItem>
                <label for="attachments">Pièces jointes (captures, documents...)</label>
                <input
                  type="file"
                  id="attachments"
                  class="form-control"
                  multiple
                  @change="handleFileUpload"
                />
                <small class="text-muted">
                  Formats acceptés : JPG, PNG, PDF, DOCX...
                </small>
                <ul v-if="attachments.length" class="mt-2">
                  <li v-for="(file, index) in attachments" :key="index">
                    {{ file.name }}
                  </li>
                </ul>
              </CListGroupItem>
            </CListGroup>

            <div class="d-grid gap-2 mt-3">
              <button class="btn btn-primary" type="button" @click="submitTicket">Soumettre</button>
            </div>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  </CContainer>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'
import { CRow, CCol, CCard, CCardBody, CCardTitle, CListGroup, CListGroupItem } from '@coreui/vue'
import axios from '@/plugins/axios'

const ticketData = ref({
  category: '',
  os: '',
  priority: '',
  title: '',
  description: '',
})

const categories = ref([])
const attachments = ref([])
const router = useRouter()

// Détection du système d’exploitation
const detectOS = () => {
  const userAgent = window.navigator.userAgent
  let os = 'Inconnu'
  if (userAgent.includes('Win')) os = 'Windows'
  else if (userAgent.includes('Mac')) os = 'MacOS'
  else if (userAgent.includes('Linux')) os = 'Linux'
  else if (userAgent.includes('Android')) os = 'Android'
  else if (userAgent.includes('like Mac')) os = 'iOS'
  ticketData.value.os = os
}

// Récupération des catégories
const fetchCategories = async () => {
  try {
    const response = await axios.get('/Support/Get_details.php')
    if (response.data.categories) {
      categories.value = response.data.categories
    } else {
      alert('Erreur lors de la récupération des catégories.')
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des catégories:', error)
    alert('Erreur lors de la récupération des catégories.')
  }
}

// Gérer les fichiers sélectionnés
const handleFileUpload = (event) => {
  attachments.value = Array.from(event.target.files)
}

// Soumission du ticket
const user = JSON.parse(localStorage.getItem('user'))
const userId = user ? user.id : null

const submitTicket = async () => {
  try {
    const formData = new FormData()
    formData.append('category', ticketData.value.category)
    formData.append('os', ticketData.value.os)
    formData.append('priority', ticketData.value.priority)
    formData.append('title', ticketData.value.title)
    formData.append('description', ticketData.value.description)
    formData.append('userid', userId)

    // Ajout des fichiers
    attachments.value.forEach((file, i) => {
      formData.append(`attachments[]`, file)
    })

    const response = await axios.post('/Support/submit_ticket.php', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })

    if (response.data.success) {
      alert('Ticket créé avec succès.')
      router.push('/support')
    } else {
      alert('Erreur lors de la soumission du ticket.')
    }
  } catch (error) {
    console.error('Erreur lors de la soumission du ticket:', error)
    alert('Erreur lors de la soumission du ticket.')
  }
}

onMounted(() => {
  detectOS()
  fetchCategories()
})
</script>

<style scoped>
.badge {
  font-size: 0.9rem;
}
</style>
