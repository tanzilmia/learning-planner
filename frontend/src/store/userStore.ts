import { create } from 'zustand'

export const useUserStore = create<{

  calendarView: 'month' | 'week'


  setCalendarView: (v: 'month' | 'week') => void


}>()((set) => ({

  calendarView: 'month',

  setCalendarView: (calendarView) => set({ calendarView }),

}))
