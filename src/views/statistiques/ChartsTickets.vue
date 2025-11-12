<script setup>
import { onMounted, ref } from 'vue'
import { CChart } from '@coreui/vue-chartjs'
import { getStyle } from '@coreui/utils'
import axios from '@/plugins/axios'

// Référence pour le graphique principal
const mainChartRef = ref()

// Données réactives pour le graphique
const data = ref({
  labels: [],
  datasets: [
    {
      label: 'Tickets par mois',
      backgroundColor: `rgba(${getStyle('--cui-info-rgb')}, .1)`,
      borderColor: getStyle('--cui-info'),
      pointHoverBackgroundColor: getStyle('--cui-info'),
      borderWidth: 2,
      data: [],
      fill: true,
    },
  ],
})

// Options de configuration pour le graphique
const options = {
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
  },
  scales: {
    x: {
      grid: {
        color: getStyle('--cui-border-color-translucent'),
        drawOnChartArea: false,
      },
      ticks: {
        color: getStyle('--cui-body-color'),
      },
    },
    y: {
      beginAtZero: true,
      border: {
        color: getStyle('--cui-border-color-translucent'),
      },
      grid: {
        color: getStyle('--cui-border-color-translucent'),
      },
      ticks: {
        color: getStyle('--cui-body-color'),
        maxTicksLimit: 5,
        
      },
    },
  },
  elements: {
    line: {
      tension: 0.4,
    },
    point: {
      radius: 0,
      hitRadius: 10,
      hoverRadius: 4,
      hoverBorderWidth: 3,
    },
  },
}

// Indicateur pour vérifier si les données sont prêtes
const isDataReady = ref(false)

// Fonction pour récupérer les données de l'API
const fetchApiData = async () => {
  try {
    const response = await axios.get('Support/stats_tickets.php')

    if (response.data.success) {
      // Mise à jour des labels et des données du graphique
      data.value.labels = response.data.data.tickets_per_month.map(item => item.month)
      data.value.datasets[0].data = response.data.data.tickets_per_month.map(item => item.total_tickets)

      isDataReady.value = true // Les données sont prêtes

      // Mise à jour du graphique si la référence est disponible
      if (mainChartRef.value) {
        const chart = mainChartRef.value.chart
        chart.update()
      }
    } else {
      console.error('Failed to fetch data from API')
    }
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}

// Cycle de vie onMounted
onMounted(() => {
  fetchApiData()

  // Écoute des changements de thème pour actualiser les styles du graphique
  document.documentElement.addEventListener('ColorSchemeChange', () => {
    if (mainChartRef.value) {
      const chart = mainChartRef.value.chart
      chart.options.scales.x.grid.borderColor = getStyle('--cui-border-color-translucent')
      chart.options.scales.x.grid.color = getStyle('--cui-border-color-translucent')
      chart.options.scales.x.ticks.color = getStyle('--cui-body-color')
      chart.options.scales.y.grid.borderColor = getStyle('--cui-border-color-translucent')
      chart.options.scales.y.grid.color = getStyle('--cui-border-color-translucent')
      chart.options.scales.y.ticks.color = getStyle('--cui-body-color')
      chart.update()
    }
  })
})
</script>

<template>
  <div>
    <!-- Affichage conditionnel en fonction des données -->
    <CChart
      v-if="isDataReady"
      type="line"
      :data="data"
      :options="options"
      ref="mainChartRef"
    />
    <div v-else>
      Chargement des données...
    </div>
  </div>
</template>