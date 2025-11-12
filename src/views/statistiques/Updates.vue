<template>
  <CRow>
    <CCard :class="['shadow-sm', themeClass]">
      <CCardBody>
        <h5 class="mb-4 fw-bold">Activité récente</h5>

        <!-- 5 premières activités -->
        <div
          v-for="(update, index) in updates.slice(0, 5)"
          :key="'recent-' + index"
          class="d-flex mb-3 align-items-start activity-item"
          style="cursor: pointer;"
          @click="goToTicket(update.ticket)"
        >
          <div
            class="avatar me-3"
            :style="{ backgroundColor: update.color || '#ccc' }"
          >
            {{ getInitials(update.name) }}
          </div>
          <div class="flex-fill">
            <p class="mb-1">
              <strong>{{ update.name }}</strong> {{ update.action }}
              <span class="ticket">ticket #{{ update.ticket }}</span>
            </p>
            <small class="timestamp">{{ update.timeAgo }}</small>
          </div>
        </div>

        <!-- Bouton Développer -->
        <CButton
          color="primary"
          class="text-white d-flex align-items-center gap-2 rounded-pill"
          v-if="updates.length > 5"
          @click="showModal = true"
        >
          Développer
        </CButton>
      </CCardBody>
    </CCard>

    <!-- Modal CoreUI Vue 3 -->
    <CModal
      :visible="showModal"
      size="xl"
      scrollable
      backdrop="static"
      @close="showModal = false"
    >
      <CCard style="max-height: 80vh; overflow-y: auto;">
        <CCardBody>
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h5 class="mb-0">Toutes les activités</h5>
            <CButton class="text-white d-flex align-items-center gap-2 rounded-pill"  size="sm" color="secondary" @click="showModal = false">
              Fermer
            </CButton>
          </div>

          <CContainer>
            <CRow>
              <CCol
                v-for="(update, index) in updates"
                :key="'modal-' + (update.name ? update.name.replace(/\s/g, '-') : 'unknown') + '-' + index"
                md="12"
                class="mb-3"
              >
                <CCard class="p-3" @click="goToTicket(update.ticket)" style="cursor: pointer;">
                  <div class="d-flex align-items-start">
                    <div
                      class="avatar me-3"
                      :style="{ backgroundColor: update.color || '#ccc' }"
                    >
                      {{ getInitials(update.name) }}
                    </div>
                    <div class="flex-fill">
                      <p class="mb-1">
                        <strong>{{ update.name }}</strong> {{ update.action }}
                        <span class="ticket">ticket #{{ update.ticket }}</span>
                      </p>
                      <small class="timestamp">{{ update.timeAgo }}</small>
                    </div>
                  </div>
                </CCard>
              </CCol>
            </CRow>
          </CContainer>
        </CCardBody>
      </CCard>
    </CModal>
  </CRow>
</template>

<script>
export default {
  data() {
    return {
      updates: [],
      showModal: false,
      themeClass: '',
    }
  },
  mounted() {
    this.loadActivities()
  },
  methods: {

    goToTicket(ticketId) {
    if (!ticketId) return
    this.$router.push({ path: `/support/read/${ticketId}` })
    },

    async loadActivities() {
      try {
        const response = await fetch('http://localhost/api/Dashboard/dashboard.php')
        const result = await response.json()
        if (result.success && result.data.recent_activities) {
          this.updates = result.data.recent_activities.map(act => ({
            name: act.user || 'Unknown',
            action: act.action || '',
            ticket: act.idTicket || '',
            timeAgo: this.formatTimeAgo(act.dateAction),
            color: this.generateColor(act.user),
          }))
        }
      } catch (error) {
        console.error(error)
      }
    },
    getInitials(name) {
      if (!name) return '??'
      return name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
    },
    formatTimeAgo(dateString) {
      if (!dateString) return ''
      const date = new Date(dateString)
      const now = new Date()
      const diff = Math.floor((now - date) / 1000)
      if (diff < 60) return `il y a ${diff} sec`
      if (diff < 3600) return `il y a ${Math.floor(diff / 60)} min`
      if (diff < 86400) return `il y a ${Math.floor(diff / 3600)} h`
      return `il y a ${Math.floor(diff / 86400)} j`
    },
    generateColor(name) {
      if (!name) name = 'Unknown'
      let hash = 0
      for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash)
      }
      return `hsl(${hash % 360}, 70%, 50%)`
    },
  },
}
</script>

<style scoped>
.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}
.ticket {
  font-size: 0.85rem;
  color: #6c757d;
  margin-left: 0.5rem;
}
.timestamp {
  color: #6c757d;
}
.activity-item p {
  margin: 0;
}
</style>
