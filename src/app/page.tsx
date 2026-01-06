'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Navigation from './components/Navigation'
import Dashboard from './components/Dashboard'
import BabyInfo from './components/BabyInfo'
import GrowthRecord from './components/GrowthRecord'
import Milestones from './components/Milestones'
import PhotoGallery from './components/photos'
import { useBabyContext } from '@/components/providers/BabyProvider'
import { useDashboardPreloader, useSmartPreloader } from '@/hooks/useDataPreloader'

export default function Home() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [loadedTabs, setLoadedTabs] = useState<Set<string>>(new Set(['dashboard']))
  const { currentBaby, currentBabyId } = useBabyContext()
  const growthPreloadedRef = useRef(false)

  // 启用Dashboard预加载
  useDashboardPreloader()
  
  // 启用智能预加载
  useSmartPreloader(activeTab, loadedTabs)

  // 预加载策略：当baby数据加载完成后，预加载常用的标签页
  useEffect(() => {
    if (currentBabyId && !growthPreloadedRef.current) {
      const timer = setTimeout(() => {
        setLoadedTabs(prev => {
          if (!prev.has('growth')) {
            growthPreloadedRef.current = true
            return new Set([...prev, 'growth'])
          }
          return prev
        })
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [currentBabyId])

  // 智能预加载：当用户切换到某个标签页时，标记为已加载
  const handleTabChange = useCallback((tab: string) => {
    setActiveTab(tab)
    setLoadedTabs(prev => new Set([...prev, tab]))
    
    if (tab === 'growth') {
      setTimeout(() => setLoadedTabs(prev => new Set([...prev, 'milestones'])), 1500)
    } else if (tab === 'milestones') {
      setTimeout(() => setLoadedTabs(prev => new Set([...prev, 'photos'])), 2000)
    }
  }, [])

  // 添加新宝宝：切换到宝宝信息页
  const handleAddBaby = useCallback(() => {
    handleTabChange('baby')
  }, [handleTabChange])

  // 当切换宝宝时，重置预加载状态
  useEffect(() => {
    growthPreloadedRef.current = false
  }, [currentBabyId])

  return (
    <div className="min-h-screen">
      <Navigation 
        activeTab={activeTab} 
        setActiveTab={handleTabChange}
        onAddBaby={handleAddBaby}
      />
      <main className="main-content container mx-auto px-3 md:px-4 py-4 md:py-8">
        <div className={activeTab === 'dashboard' ? 'block' : 'hidden'}>
          <Dashboard setActiveTab={handleTabChange} />
        </div>
        
        <div className={activeTab === 'baby' ? 'block' : 'hidden'}>
          {loadedTabs.has('baby') && <BabyInfo />}
        </div>
        
        <div className={activeTab === 'growth' ? 'block' : 'hidden'}>
          {loadedTabs.has('growth') && <GrowthRecord />}
        </div>
        
        <div className={activeTab === 'milestones' ? 'block' : 'hidden'}>
          {loadedTabs.has('milestones') && <Milestones />}
        </div>
        
        <div className={activeTab === 'photos' ? 'block' : 'hidden'}>
          {loadedTabs.has('photos') && <PhotoGallery />}
        </div>
      </main>
    </div>
  )
}