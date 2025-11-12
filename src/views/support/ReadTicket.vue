<template>
  <h1 class="text-center">Consultation du Ticket #{{ ticketData.idTicket }}</h1>
  <br /><br />
  <CContainer>
    <CRow>
      <!-- Première colonne -->
      <CCol>
        <!-- Informations principales -->
        <CCard>
          <CCardBody>
            <CCardTitle class="text-center">Informations du Ticket</CCardTitle>
            <CListGroup>
              <CListGroupItem> Titre : {{ ticketData.titreTicket }} </CListGroupItem>
              <CListGroupItem> Description : {{ ticketData.descriptionTicket }} </CListGroupItem>
              <CListGroupItem> Catégorie : {{ ticketData.categorie }} </CListGroupItem>
              <CListGroupItem> Utilisateur : {{ ticketData.user }} </CListGroupItem>
            </CListGroup>
          </CCardBody>
        </CCard>

        <br />

        <!-- Pièces jointes existantes -->
        <CCard class="mt-3" v-if="ticketFiles.length">
          <CCardBody>
            <CCardTitle>Pièces jointes</CCardTitle>
            <ul>
              <li
                v-for="(file, index) in ticketFiles"
                :key="index"
                class="d-flex align-items-center justify-content-between"
              >
                <a :href="getFileUrl(file.file_name)" target="_blank">{{ file.file_name }}</a>
                <button class="btn btn-sm btn-danger" @click="deleteAttachment(file.id)">Supprimer</button>
              </li>
            </ul>
          </CCardBody>
        </CCard>

        <!-- Ajouter des fichiers -->
        <CCard class="mt-3">
          <CCardBody>
            <CCardTitle>Ajouter des pièces jointes</CCardTitle>
            <input type="file" multiple class="form-control" @change="handleFileUpload" />
            <ul v-if="newAttachments.length" class="mt-2">
              <li v-for="(file, index) in newAttachments" :key="index">{{ file.name }}</li>
            </ul>
          </CCardBody>
        </CCard>

        <br />

        <!-- Historique -->
        <CCard>
          <CCardBody>
            <CCardTitle class="text-center">Historique</CCardTitle>
            <CListGroup>
              <CListGroupItem>
                Date de création : {{ formatDate(ticketData.createdate) }}
              </CListGroupItem>
              <CListGroupItem>
                Dernière mise à jour : {{ formatDate(ticketData.updatedate) }}
              </CListGroupItem>
            </CListGroup>
          </CCardBody>
        </CCard>
      </CCol>

      <!-- Deuxième colonne -->
      <CCol v-if="idRole > 1">
        <!-- Gestion du ticket -->
        <CCard>
          <CCardBody>
            <CCardTitle class="text-center">Gestion du Ticket</CCardTitle>
            <CListGroup>
              <CListGroupItem>
                Priorité :
                <select v-model="ticketData.priorite" class="form-control mt-2">
                  <option value="Faible">Faible</option>
                  <option value="Moyenne">Moyenne</option>
                  <option value="Élevée">Élevée</option>
                </select>
              </CListGroupItem>

              <CListGroupItem>
                Statut :
                <select v-model="ticketData.status" class="form-control mt-2">
                  <option
                    v-for="status in statuses"
                    :key="status.idstatus"
                    :value="status.idstatus"
                  >
                    {{ status.libellestatus }}
                  </option>
                </select>
              </CListGroupItem>
            </CListGroup>
          </CCardBody>
        </CCard>
        <div class="d-grid gap-2 mt-3">
          <button class="btn btn-success mt-2 text-white" @click="updateTicketWithAttachments">
            Sauvegarder Modification
          </button>
          <button class="btn btn-danger text-white" type="button" @click="deleteTicket">
            Supprimer Ticket
          </button>
        </div>
      </CCol>
    </CRow>
  </CContainer>

  <!-- Affichage des réponses du ticket -->
  <CContainer class="mt-5">
    <CCard>
      <CCardBody>
        <CCardTitle class="text-center">Réponses au Ticket</CCardTitle>
        <CListGroup>
          <CListGroupItem v-for="(response, index) in ticketResponses" :key="index">
            <strong>{{ response.userLogin }} :</strong> {{ response.commentaire }}
            <div class="text-muted small">{{ formatDate(response.DatePublication) }}</div>
          </CListGroupItem>
        </CListGroup>

        <!-- Ajouter une réponse -->
        <div class="mt-4">
          <textarea
            v-model="newResponseMessage"
            required
            class="form-control"
            rows="3"
            placeholder="Écrire une réponse..."
          ></textarea>
          <button class="btn btn-success mt-2 text-white" @click="sendResponse">Envoyer</button>
        </div>
      </CCardBody>
    </CCard>
  </CContainer>
  <br />
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from '@/plugins/axios'

export default {
  setup() {
    const route = useRoute()
    const router = useRouter()
    const ticketId = route.params.id

    const ticketData = ref({
      idTicket: '',
      titreTicket: '',
      descriptionTicket: '',
      categorie: '',
      user: '',
      priorite: '',
      status: '',
      createdate: '',
      updatedate: '',
    })

    const ticketFiles = ref([]) // <-- fichiers existants
    const ticketResponses = ref([])
    const statuses = ref([])
    const newResponseMessage = ref('')
    const newAttachments = ref([])
    const user = JSON.parse(localStorage.getItem('user'))
    const userId = user.id
    const idRole = user.role

    const fetchTicketData = async () => {
      try {
        const response = await axios.get(`/Support/consult_tickets.php?id=${ticketId}`)
        if (response.data?.ticket) {
          const t = response.data.ticket
          ticketData.value = {
            idTicket: t.idTicket,
            titreTicket: t.titreTicket,
            descriptionTicket: t.descriptionTicket,
            categorie: t.libelleCategorie,
            user: t.user,
            priorite: t.Priorite,
            status: t.idstatus,
            createdate: t.createDate,
            updatedate: t.UpdateDate,
          }
          ticketFiles.value = t.files || [] // <-- tableau depuis ticket_files
          ticketResponses.value = t.reponses || []
        }
      } catch (error) {
        console.error('Erreur ticket :', error)
      }
    }

    const fetchStatuses = async () => {
      try {
        const response = await axios.get('/Support/Get_details.php')
        if (response.data?.statuses) statuses.value = response.data.statuses
      } catch (error) {
        console.error('Erreur statuts :', error)
      }
    }

    const handleFileUpload = (event) => {
      newAttachments.value = Array.from(event.target.files)
    }

    const updateTicketWithAttachments = async () => {
      try {
        const formData = new FormData()
        formData.append('idTicket', ticketData.value.idTicket)
        formData.append('status', ticketData.value.status)
        formData.append('priority', ticketData.value.priorite)
        newAttachments.value.forEach(file => formData.append('attachments[]', file))

        const response = await axios.post('/Support/update_ticket.php', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })

        if (response.data.success) {
          newAttachments.value = []
          fetchTicketData()
          alert('Ticket mis à jour avec succès')
        } else {
          alert('Erreur lors de la mise à jour')
        }
      } catch (error) {
        console.error('Erreur mise à jour ticket :', error)
        alert('Erreur lors de la mise à jour du ticket')
      }
    }

    const deleteAttachment = async (fileId) => {
      if (!confirm(`Supprimer ce fichier ?`)) return
      try {
        const response = await axios.post('/Support/delete_attachment.php', {
          fileId
        })
        if (response.data?.success) {
          ticketFiles.value = ticketFiles.value.filter(f => f.id !== fileId)
        } else alert(response.data.message || 'Erreur suppression fichier')
      } catch (error) {
        console.error('Erreur suppression fichier :', error)
        alert('Erreur lors de la suppression du fichier')
      }
    }

    const deleteTicket = async () => {
      try {
        const response = await axios.post('/Support/delete_ticket.php', { idTicket: ticketData.value.idTicket })
        if (response.data.success) router.push(`/support`)
      } catch (error) {
        console.error('Erreur de suppression du ticket:', error)
      }
    }

    const sendResponse = async () => {
      if (!newResponseMessage.value.trim()) return
      try {
        const response = await axios.post('/Support/submit_response.php', {
          idTicket: ticketData.value.idTicket,
          idUser: userId,
          commentaire: newResponseMessage.value.trim(),
        })
        if (response.data?.success) {
          newResponseMessage.value = ''
          fetchTicketData()
        }
      } catch (error) {
        console.error('Erreur envoi de la réponse :', error)
      }
    }

    const formatDate = (dateString) => {
      if (!dateString) return ''
      const date = new Date(dateString)
      return date.toLocaleString('fr-FR', {
        hour: '2-digit', minute: '2-digit',
        day: '2-digit', month: '2-digit', year: 'numeric',
      }).replace(',', ' -')
    }

    const getFileUrl = (fileName) => `https://localhost/api/Support/uploads/${fileName}`

    onMounted(() => {
      fetchTicketData()
      fetchStatuses()
    })

    return {
      ticketData,
      ticketFiles,
      ticketResponses,
      statuses,
      newResponseMessage,
      newAttachments,
      idRole,
      updateTicketWithAttachments,
      deleteTicket,
      sendResponse,
      deleteAttachment,
      handleFileUpload,
      formatDate,
      getFileUrl
    }
  }
}
</script>
