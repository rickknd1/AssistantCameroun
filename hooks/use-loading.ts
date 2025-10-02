'use client'

import { create } from 'zustand'

interface LoadingStore {
  isLoading: boolean
  loadingTasks: Set<string>
  startLoading: (taskId: string) => void
  finishLoading: (taskId: string) => void
  reset: () => void
}

export const useLoading = create<LoadingStore>((set) => ({
  isLoading: false,
  loadingTasks: new Set(),

  startLoading: (taskId: string) => set((state) => {
    const newTasks = new Set(state.loadingTasks)
    newTasks.add(taskId)
    return {
      loadingTasks: newTasks,
      isLoading: true
    }
  }),

  finishLoading: (taskId: string) => set((state) => {
    const newTasks = new Set(state.loadingTasks)
    newTasks.delete(taskId)
    return {
      loadingTasks: newTasks,
      isLoading: newTasks.size > 0
    }
  }),

  reset: () => set({
    isLoading: false,
    loadingTasks: new Set()
  })
}))
