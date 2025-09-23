"use client"

import { useEffect, useState } from 'react'
import { AnalyticsChart } from './analytics-chart'
import { Globe, Monitor, Calendar, Users } from 'lucide-react'

interface AnalyticsData {
  totalClicks: number
  uniqueClicks: number
  deviceStats: { device: string; count: number }[]
  browserStats: { browser: string; count: number }[]
  countryStats: { country: string; count: number }[]
  dailyStats: { date: string; clicks: number }[]
}

interface AdvancedAnalyticsProps {
  linkId: string
}

export function AdvancedAnalytics({ linkId }: AdvancedAnalyticsProps) {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [linkId])

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(`/api/links/${linkId}/analytics`)
      if (response.ok) {
        const data = await response.json()
        setAnalytics(data)
      }
    } catch (error) {
      console.error('Erreur lors du chargement des analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="text-center p-8 text-gray-500 dark:text-gray-400">
        Impossible de charger les analytics
      </div>
    )
  }

  const deviceChartData = {
    labels: analytics.deviceStats.map(d => d.device),
    datasets: [{
      label: 'Appareils',
      data: analytics.deviceStats.map(d => d.count),
      backgroundColor: [
        '#3B82F6', // Bleu
        '#10B981', // Vert
        '#F59E0B', // Orange
      ],
    }]
  }

  const browserChartData = {
    labels: analytics.browserStats.map(b => b.browser),
    datasets: [{
      label: 'Navigateurs',
      data: analytics.browserStats.map(b => b.count),
      backgroundColor: [
        '#EF4444', // Rouge
        '#8B5CF6', // Violet
        '#F59E0B', // Orange
        '#10B981', // Vert
        '#6B7280', // Gris
      ],
    }]
  }

  const dailyChartData = {
    labels: analytics.dailyStats.map(d => 
      new Date(d.date).toLocaleDateString('fr-FR', { 
        day: '2-digit', 
        month: '2-digit' 
      })
    ),
    datasets: [{
      label: 'Clics par jour',
      data: analytics.dailyStats.map(d => d.clicks),
      borderColor: '#3B82F6',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      borderWidth: 2,
      fill: true,
    }]
  }

  const countryChartData = {
    labels: analytics.countryStats.slice(0, 10).map(c => c.country),
    datasets: [{
      label: 'Clics par pays',
      data: analytics.countryStats.slice(0, 10).map(c => c.count),
      backgroundColor: '#3B82F6',
    }]
  }

  return (
    <div className="space-y-8">
      {/* Métriques principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border-l-4 border-blue-500">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-blue-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total des clics</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{analytics.totalClicks}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border-l-4 border-green-500">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-green-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Visiteurs uniques</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{analytics.uniqueClicks}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border-l-4 border-purple-500">
          <div className="flex items-center">
            <Globe className="h-8 w-8 text-purple-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Pays différents</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{analytics.countryStats.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border-l-4 border-orange-500">
          <div className="flex items-center">
            <Monitor className="h-8 w-8 text-orange-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Appareils</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{analytics.deviceStats.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <AnalyticsChart
            data={dailyChartData}
            type="line"
            title="Évolution des clics (30 derniers jours)"
            height={300}
          />
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <AnalyticsChart
            data={deviceChartData}
            type="doughnut"
            title="Répartition par appareils"
            height={300}
          />
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <AnalyticsChart
            data={browserChartData}
            type="doughnut"
            title="Répartition par navigateurs"
            height={300}
          />
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <AnalyticsChart
            data={countryChartData}
            type="bar"
            title="Top 10 des pays"
            height={300}
          />
        </div>
      </div>
    </div>
  )
}