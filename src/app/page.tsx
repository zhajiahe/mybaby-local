'use client'

import { useState, useEffect, useRef } from 'react'
import Navigation from './components/Navigation'
import Dashboard from './components/Dashboard'
import BabyInfo from './components/BabyInfo'
import GrowthRecord from './components/GrowthRecord'
import Milestones from './components/Milestones'
import PhotoGallery from './components/PhotoGallery'
import { ChristmasTree } from '@/components/ui/ChristmasTree'
import { useBaby } from '@/hooks/useBaby'
import { useDashboardPreloader, useSmartPreloader } from '@/hooks/useDataPreloader'

// 检查是否是圣诞节期间 (11月30日 - 12月31日)
function isChristmasSeason(): boolean {
  const now = new Date()
  const month = now.getMonth() // 0-11
  const day = now.getDate()
  // 11月30日 (month=10, day=30) 或 12月任意一天 (month=11)
  return (month === 10 && day >= 30) || month === 11
}

// 检查今天是否已经显示过圣诞树
function hasShownToday(): boolean {
  if (typeof window === 'undefined') return true
  const lastShown = localStorage.getItem('christmas-tree-shown')
  if (!lastShown) return false
  const today = new Date().toDateString()
  return lastShown === today
}

// 标记今天已显示
function markShownToday(): void {
  if (typeof window === 'undefined') return
  localStorage.setItem('christmas-tree-shown', new Date().toDateString())
}

export default function Home() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [loadedTabs, setLoadedTabs] = useState<Set<string>>(new Set(['dashboard']))
  const [showChristmas, setShowChristmas] = useState(false)
  const { baby } = useBaby()
  const growthPreloadedRef = useRef(false)

  // 圣诞节彩蛋
  useEffect(() => {
    if (isChristmasSeason() && !hasShownToday()) {
      setShowChristmas(true)
    }
  }, [])

  // 启用Dashboard预加载
  useDashboardPreloader()
  
  // 启用智能预加载
  useSmartPreloader(activeTab, loadedTabs)

  // 预加载策略：当baby数据加载完成后，预加载常用的标签页
  useEffect(() => {
    if (baby?.id && !growthPreloadedRef.current) {
      // 延迟1秒后预加载成长记录，避免阻塞首页渲染
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
  }, [baby?.id]) // Remove loadedTabs dependency to prevent infinite re-renders

  // 智能预加载：当用户切换到某个标签页时，标记为已加载
  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    setLoadedTabs(prev => new Set([...prev, tab]))
    
    // 根据当前tab预加载下一个可能访问的tab
    if (tab === 'growth' && !loadedTabs.has('milestones')) {
      setTimeout(() => {
        setLoadedTabs(prev => new Set([...prev, 'milestones']))
      }, 1500)
    } else if (tab === 'milestones' && !loadedTabs.has('photos')) {
      setTimeout(() => {
        setLoadedTabs(prev => new Set([...prev, 'photos']))
      }, 2000)
    }
  }

  const handleCloseChristmas = () => {
    markShownToday()
    setShowChristmas(false)
  }

  return (
    <div className="min-h-screen">
      {/* 圣诞节彩蛋 */}
      {showChristmas && <ChristmasTree onClose={handleCloseChristmas} />}
      
      <Navigation activeTab={activeTab} setActiveTab={handleTabChange} />
      <main className="main-content container mx-auto px-3 md:px-4 py-4 md:py-8">
        {/* 使用CSS控制显示隐藏，避免组件重新挂载 */}
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