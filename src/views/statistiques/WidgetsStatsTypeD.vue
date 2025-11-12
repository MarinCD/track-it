<template>
  <div>
    <h1>Tickets</h1>
    <CRow :xs="{ gutter: 4 }">
      <CCol :sm="6" :xl="4" :xxl="3" v-for="(stat, index) in supportStats" :key="'support-' + index">
        <CCard class="shadow-sm rounded-3">
          <CCardBody class="d-flex justify-content-between align-items-center p-4">
            <div>
              <h5 class="mb-1 fw-bold">{{ stat.value }}</h5>
              <small class="text-muted">{{ stat.title }}</small>
            </div>
            <CIcon :icon="stat.icon" :class="`text-${stat.iconColor}`" size="xl" />
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import axios from '@/plugins/axios'

// CoreUI icons
import {
  cilCheckCircle,
  cilClock,
  cilEnvelopeOpen,
  cilList,
  cilChart,
  cilCalendar,
  cilThumbUp,
  cilWarning,
} from '@coreui/icons'

const supportStats = ref([
  {
    title: 'Taux de clôture',
    value: '0%',
    color: 'danger',
    icon: cilChart,
    iconColor: 'danger',
  },
  {
    title: 'Temps moyen de résolution',
    value: '0h 00m',
    color: 'dark',
    icon: cilClock,
    iconColor: 'info',
  },
  {
    title: 'Tickets en cours',
    value: '0',
    color: 'warning',
    icon: cilClock,
    iconColor: 'warning',
  },
  {
    title: 'Tickets totaux',
    value: '0',
    color: 'secondary',
    icon: cilList,
    iconColor: 'primary',
  },
  {
    title: 'Tickets ouverts ce mois',
    value: '0',
    color: 'info',
    icon: cilCalendar,
    iconColor: 'info',
  },
  {
    title: 'Tickets résolus',
    value: '0',
    color: 'success',
    icon: cilCheckCircle,
    iconColor: 'success',
  },
  {
    title: 'Tickets résolus aujourd\'hui',
    value: '0',
    color: 'primary',
    icon: cilThumbUp,
    iconColor: 'primary',
  },
  {
    title: 'Tickets en attente depuis plus de 48h',
    value: '0',
    color: 'danger',
    icon: cilWarning,
    iconColor: 'danger',
  },
])

onMounted(() => {
  fetchSupportStats()
})

const fetchSupportStats = async () => {
  try {
    const response = await axios.get('/Support/stats_tickets.php')
    const data = response.data.data

    supportStats.value = [
      {
        title: 'Taux de clôture',
        value: data.closure_rate_percent + '%',
        color: parseFloat(data.closure_rate_percent) < 50 ? 'danger' : 'success',
        icon: cilChart,
        iconColor: parseFloat(data.closure_rate_percent) < 50 ? 'danger' : 'success',
      },
      {
        title: 'Temps moyen de résolution',
        value: formatResolutionTime(data.avg_resolution_time_hours),
        color: parseFloat(data.avg_resolution_time_hours) > 24 ? 'danger' : 'success',
        icon: cilClock,
        iconColor: parseFloat(data.avg_resolution_time_hours) > 24 ? 'danger' : 'info',
      },
      {
        title: 'Tickets en cours',
        value: data.tickets_in_progress_count,
        color: 'warning',
        icon: cilClock,
        iconColor: 'warning',
      },
      {
        title: 'Tickets totaux',
        value: data.total_tickets,
        color: 'secondary',
        icon: cilList,
        iconColor: 'primary',
      },
      {
        title: 'Tickets ouverts ce mois',
        value: data.monthly_tickets,
        color: 'info',
        icon: cilCalendar,
        iconColor: 'info',
      },
      {
        title: 'Tickets résolus',
        value: data.resolved_tickets,
        color: 'success',
        icon: cilCheckCircle,
        iconColor: 'success',
      },
      {
        title: 'Tickets résolus aujourd\'hui',
        value: data.resolved_today,
        color: 'primary',
        icon: cilThumbUp,
        iconColor: 'primary',
      },
      {
        title: 'Tickets en attente depuis plus de 48h',
        value: data.stale_tickets,
        color: data.stale_tickets > 0 ? 'danger' : 'secondary',
        icon: cilWarning,
        iconColor: data.stale_tickets > 0 ? 'danger' : 'secondary',
      },
    ]
  } catch (error) {
    console.error('Erreur lors du chargement des stats support :', error)
  }
}

const formatResolutionTime = (time) => {
  if (time.includes('j')) {
    const days = parseFloat(time)
    const hours = Math.round(days * 24)
    return `${hours}h`
  }
  return time
}
</script>

<style scoped>
h1 {
  margin-bottom: 1.5rem;
}

.ticket-dashboard h5 {
  font-size: 2rem;
  font-weight: 700;
}

.ticket-dashboard small {
  font-size: 0.9rem;
  color: #ccc;
}
</style>
