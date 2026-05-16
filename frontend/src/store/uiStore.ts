import { create } from 'zustand'

type ModalKey = 'subject' | 'chapter' | 'note' | 'event' | null

export const useUiStore = create<{

  sidebarOpen: boolean


  setSidebarOpen: (open: boolean) => void


  activeModal: ModalKey


  setActiveModal: (m: ModalKey) => void


  noteTab: 'all' | 'text' | 'pdf' | 'url' | 'youtube'


  setNoteTab: (t: 'all' | 'text' | 'pdf' | 'url' | 'youtube') => void


}>()((set) => ({

  sidebarOpen: false,

  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),

  activeModal: null,

  setActiveModal: (activeModal) => set({ activeModal }),

  noteTab: 'all',

  setNoteTab: (noteTab) => set({ noteTab }),

}))
