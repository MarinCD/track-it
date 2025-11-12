<template>
  <h1 class="text-center">Consultation de {{ pcId }}</h1>
  <br /><br />

  <CContainer>
    <CRow>
      <CCol>
        <CCard>
          <CCardBody>
            <CCardTitle class="text-center">Informations système</CCardTitle>
            <CListGroup>
              <CListGroupItem> OS : {{ pcData.OSNAME }} </CListGroupItem>
              <CListGroupItem> OS Version : {{ pcData.OSVERSION }} </CListGroupItem>
              <CListGroupItem> Architecture : {{ pcData.ARCHITECTURE }} </CListGroupItem>
              <CListGroupItem> Utilisateur windows : {{ pcData.USER }} </CListGroupItem>
              <CListGroupItem> Licence status : {{ pcData.licensestatus }} </CListGroupItem>
              <CListGroupItem> Clé windows : {{ pcData.WINPRODKEY }} </CListGroupItem>
            </CListGroup>
          </CCardBody>
        </CCard>
        <br />
        <CCard>
          <CCardBody>
            <CCardTitle class="text-center">Hardware</CCardTitle>
            <CListGroup>
              <CListGroupItem> CPU : {{ pcData.CPU }} </CListGroupItem>
              <CListGroupItem> RAM : {{ pcData.MEMORY }} Go </CListGroupItem>
            </CListGroup>
          </CCardBody>
        </CCard>
        <br />
        <v-btn v-if="pcData.facture" color="primary" dark @click="factureDialog = true">
          Voir la facture
        </v-btn>
      </CCol>

      <CCol>
        <CCard>
          <CCardBody>
            <CCardTitle class="text-center">Réseau</CCardTitle>
            <CListGroup>
              <CListGroupItem> Domaine : {{ pcData.DOMAIN }} </CListGroupItem>
              <CListGroupItem> Adresse IP : {{ pcData.IPADDR }} </CListGroupItem>
              <CListGroupItem> Adresse MAC : {{ pcData.MAC }} </CListGroupItem>
            </CListGroup>
          </CCardBody>
        </CCard>
        <br />
        <CCard>
          <CCardBody>
            <CCardTitle class="text-center">Agent</CCardTitle>
            <CListGroup>
              <CListGroupItem> Dernier inventaire : {{ pcData.LASTDATE }} </CListGroupItem>
              <CListGroupItem> Dernier contact : {{ pcData.LASTCOME }} </CListGroupItem>
            </CListGroup>
          </CCardBody>
        </CCard>
        <br />

        <CCard>
          <CCardBody>
            <CCardTitle class="text-center">Notes</CCardTitle>
            <textarea class="form-control" aria-label="Notes" v-model="note"></textarea>
            <div class="d-grid gap-2 mt-3">
              <button class="btn btn-primary text-white" type="button" @click="saveNotes">
                Sauvegarder
              </button>
            </div>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  </CContainer>
<br>
  <h1 class="text-center">Rapport de Sécurité</h1>

  <!-- Nouveau container pour Rapport Audit -->
  <CContainer class="mt-5">
    <CRow class="justify-content-center">
      <CCol md="8">
        <CCard v-if="scoreSecurite !== null || (risques && risques.length)">
          <CCardBody>
            <CCardTitle class="text-center  mb-4">Score</CCardTitle>
            

            <div v-if="scoreSecurite !== null" class="d-flex justify-center mb-3">
              <v-progress-circular
                :model-value="scoreSecurite"
                color="success"
                :size="100"
                :width="12"
              >
                {{ scoreSecurite }}%
              </v-progress-circular>
            </div>

            <div v-if="risques && risques.length" class="mb-3">
              <h5>Risques détectés</h5>
              <CRow>
                <CCol
                  v-for="(risque, index) in risques"
                  :key="index"
                  md="12"
                  class="mb-3"
                >
                  <CCard  class="p-3">
                    {{ risque }}
                  </CCard>
                </CCol>
              </CRow>
            </div>

            <div v-if="!scoreSecurite && (!risques || risques.length === 0)">
              <p class="text-center text-muted">Aucun risque détecté, système sain.</p>
            </div>

            
          </CCardBody>
        </CCard>
        <div v-else class="text-center text-muted">
          <p>Aucun rapport d'audit disponible.</p>
        </div>
      </CCol>
    </CRow>
  </CContainer>
  <br>

  <v-dialog v-model="factureDialog" max-width="800px">
    <v-card>
      <v-card-title class="d-flex justify-space-between align-center">
        Facture
        <v-btn icon @click="factureDialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <iframe
          v-if="pcData.facture"
          :src="pcData.facture"
          style="width: 100%; height: 600px;"
          frameborder="0"
        ></iframe>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup>
import {
  CRow,
  CCol,
  CCard,
  CCardBody,
  CCardTitle,
  CListGroup,
  CListGroupItem,
  CContainer,
} from '@coreui/vue'
import { ref, onMounted, defineProps } from 'vue'
import { useRoute } from 'vue-router'
import axios from '@/plugins/axios'

import {
  VBtn,
  VDialog,
  VCard,
  VCardTitle,
  VCardText,
  VIcon,
  VProgressCircular,
} from 'vuetify/components'

const props = defineProps({
  id: String,
})

const route = useRoute()
const pcId = route.params.id

const pcData = ref({
  OSVERSION: '',
  OSNAME: '',
  ARCHITECTURE: '',
  USER: '',
  WINPRODID: '',
  WINPRODKEY: '',
  CPU: '',
  MEMORY: '',
  MAC: '',
  DOMAIN: '',
  IPADDR: '',
  USERAGENT: '',
  LASTDATE: '',
  LASTCOME: '',
  licensestatus: '',
  NOTE: '',
  facture: '',
})

const scoreSecurite = ref(null)
const risques = ref([])
const note = ref('')
const factureDialog = ref(false)

const fetchPcData = async (id) => {
  try {
    const response = await axios.get(`/Pc/consult_pc.php?pc=${id}`)
    if (response.data?.pc && response.data.pc.length > 0) {
      pcData.value = response.data.pc[0]
      note.value = pcData.value.NOTE

      if (response.data.rapport && response.data.rapport.length > 0) {
        const rapport = response.data.rapport[0]
        scoreSecurite.value = rapport.ScoreSecurite || 0
        if (rapport.Risques) {
          try {
            risques.value = JSON.parse(rapport.Risques)
          } catch {
            risques.value = []
          }
        }
      } else {
        scoreSecurite.value = null
        risques.value = []
      }
    }
  } catch (error) {
    console.error('Erreur récupération données:', error)
  }
}

onMounted(() => {
  fetchPcData(pcId)
})

const saveNotes = async () => {
  try {
    const response = await axios.post(
      '/Pc/consult_notes.php',
      { pc: pcId, note: note.value },
      { headers: { 'Content-Type': 'application/json' } },
    )
    if (response.data.success) {
      alert('Note sauvegardée avec succès.')
    } else {
      alert('Erreur lors de la sauvegarde de la note.')
    }
  } catch (error) {
    console.error('Erreur sauvegarde note:', error)
    alert('Erreur serveur lors de la sauvegarde de la note.')
  }
}
</script>

<style>
.dark-table {
  background-color: #1d222b !important;
  color: white !important;
}

.light-table {
  background-color: #f3f4f7 !important;
  color: black !important;
}

.v-data-table__th:hover {
  color: #5856d6 !important;
}
</style>
