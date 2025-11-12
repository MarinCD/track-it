<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  CRow,
  CCol,
  CCard,
  CCardBody,
  CBadge,
  CButton,
  CButtonGroup,
} from '@coreui/vue'

const router = useRouter()

// Filtres correspondant aux statuts de ton API
const filters = ['All', 'Nouveau', 'En cours', 'Clôturé', 'En attente', 'À vérifier', 'Rejeté']
const activeFilter = ref('All')
const tickets = ref([])

// Mapping status -> badge CoreUI
const statusColors = {
  'Nouveau': 'primary',
  'En cours': 'warning',
  'Clôturé': 'secondary',
  'En attente': 'info',
  'À vérifier': 'dark',
  'Rejeté': 'danger',
}

// Mapping priorité -> badge CoreUI
const priorityColors = {
  'Basse': 'secondary',
  'Moyenne': 'info',
  'Haute': 'warning',
  'Critique': 'danger',
}

// Convertir un ticket API en format UI
function mapTicket(apiTicket) {
  return {
    id: apiTicket.idTicket,
    title: apiTicket.titreTicket,
    description: apiTicket.descriptionTicket,
    labels: [
      { text: apiTicket.status, color: statusColors[apiTicket.status] || 'secondary' },
      { text: apiTicket.Priorite, color: priorityColors[apiTicket.Priorite] || 'secondary' },
    ],
    time: new Date(apiTicket.UpdateDate.replace(' ', 'T')).toLocaleDateString(),
    comments: apiTicket.nbCommentaires,
    from: apiTicket.auteur,
    assigned: apiTicket.assigne,
  }
}

// Charger tickets depuis l’API
async function loadTickets() {
  try {
    const res = await fetch('http://localhost/api/Dashboard/dashboard.php')
    const json = await res.json()
    if (json.success && json.data.recent_tickets) {
      tickets.value = json.data.recent_tickets.map(mapTicket)
    }
  } catch (err) {
    console.error('Erreur API tickets:', err)
  }
}

onMounted(loadTickets)

// Tickets filtrés selon le statut actif
const filteredTickets = computed(() => {
  if (activeFilter.value === 'All') return tickets.value
  return tickets.value.filter(ticket =>
    ticket.labels.some(label =>
      label.text.toLowerCase() === activeFilter.value.toLowerCase()
    )
  )
})

// Redirection vers ticket
function goToTicket(ticketId) {
  if (!ticketId) return
  router.push({ path: `/support/read/${ticketId}` })
}
</script>

<template>
  <div>
    <!-- Boutons de filtre -->
    <CButtonGroup class="mb-3">
      <CButton
        v-for="filter in filters"
        :key="filter"
        :color="activeFilter === filter ? 'primary' : 'secondary'"
        @click="activeFilter = filter"
      >
        {{ filter }}
      </CButton>
    </CButtonGroup>

    <!-- Liste des tickets -->
    <CRow class="g-3">
      <CCol
        v-for="ticket in filteredTickets"
        :key="ticket.id"
        cols="12"
        md="6"
        lg="4"
      >
        <CCard
          class="h-100"
          style="cursor: pointer;"
          @click="goToTicket(ticket.id)"
        >
          <CCardBody>
            <h5>{{ ticket.title }}</h5>
            <p>{{ ticket.description }}</p>
            <div class="mb-2">
              <CBadge
                v-for="label in ticket.labels"
                :key="label.text"
                :color="label.color"
                class="me-1"
              >
                {{ label.text }}
              </CBadge>
            </div>
            <small>
              {{ ticket.time }} - Auteur: {{ ticket.from }}
              <span v-if="ticket.assigned"> | Assigné à: {{ ticket.assigned }}</span>
            </small>
            <div>
              <small>Commentaires: {{ ticket.comments }}</small>
            </div>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  </div>
</template>
