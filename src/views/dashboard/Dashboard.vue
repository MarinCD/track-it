<script setup>
import { onMounted, ref } from 'vue'
import WidgetsStatsD from '@/views/statistiques/WidgetsStatsTypeD.vue' // Import du widget D
import WidgetsStatsA from '@/views/statistiques/WidgetsStatsTypeA.vue' // Import du widget D
import ChartTickets from '@/views/statistiques/ChartsTickets.vue'
import Updates from '@/views/statistiques/Updates.vue'
import RecentTickets from '@/views/statistiques/RecentTickets.vue'
import ChartsContact from '@/views/statistiques/ChartsContact.vue'




const isSupport = ref(false)
const isAdmin = ref(false)


// Vérification du rôle utilisateur au montage
onMounted(() => {
  const storedUser = JSON.parse(localStorage.getItem('user'))
  if (storedUser) {
    // Vérifie rôle support
    if (storedUser.role === 2) {
      console.log('🛠️ Utilisateur support détecté')
      isSupport.value = true
    } else {
      console.log('👤 Utilisateur non-support')
      isSupport.value = false
    }
    // Vérifie rôle admin
    if (storedUser.role === 3) {
      console.log('🛡️ Utilisateur admin détecté')
      isAdmin.value = true
    } else {
      isAdmin.value = false
    }
  } else {
    console.warn('⚠️ Aucun utilisateur trouvé dans localStorage')
  }
})
</script>

<template>
  <div>
    <WidgetsStatsA class="mb-4" v-if="isSupport || isAdmin" />
<CRow>
  <CCol :md="12">
    <CCard class="mb-4" v-if="isSupport || isAdmin">
      <CCardBody>
        <CRow>
          <CCol :sm="5">
            <h4 id="traffic" class="card-title mb-0">Nombre de contact par mois</h4>
          </CCol>
          <CCol :sm="7" class="d-none d-md-block">
            <CButton color="primary" class="float-end">
              <CIcon icon="cil-cloud-download" />
            </CButton>
          </CCol>
        </CRow>
        <CRow>
          <ChartsContact style="height: 100%; max-height: 300px; margin-top: 40px" />
        </CRow>
      </CCardBody>
    </CCard>

    

<br>    

      </CCol>
    </CRow>
<WidgetsStatsD class="mb-4" v-if="isSupport || isAdmin" />
<CRow>
  <CCol :md="12">
    <CCard class="mb-4" v-if="isSupport || isAdmin">
      <CCardBody>
        <CRow>
          <CCol :sm="5">
            <h4 id="traffic" class="card-title mb-0">Nombre de tickets par mois</h4>
          </CCol>
          <CCol :sm="7" class="d-none d-md-block">
            <CButton color="primary" class="float-end">
              <CIcon icon="cil-cloud-download" />
            </CButton>
          </CCol>
        </CRow>
        <CRow>
          <ChartTickets style="height: 100%; max-height: 300px; margin-top: 40px" />
        </CRow>
      </CCardBody>
    </CCard>

    

<br>    

      </CCol>
    </CRow>
    <Updates class="mb-4" v-if="isSupport || isAdmin" />

<RecentTickets class="mb-4" v-if="isSupport || isAdmin" />
    


  </div>
</template>
