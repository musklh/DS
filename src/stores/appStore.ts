import { defineStore } from 'pinia';

const MOBILE_BREAKPOINT = 768; // Define mobile breakpoint

export const useAppStore = defineStore('app', {
  state: () => ({
    sidebarOpened: window.innerWidth >= MOBILE_BREAKPOINT, // Default for desktop, false for mobile
    isMobile: window.innerWidth < MOBILE_BREAKPOINT,
  }),
  actions: {
    toggleSidebar() {
      this.sidebarOpened = !this.sidebarOpened;
    },
    closeSidebar() {
      if (this.isMobile) { // Only close if on mobile, desktop might have a pinned state
        this.sidebarOpened = false;
      }
    },
    openSidebar() {
      this.sidebarOpened = true;
    },
    checkIsMobile() {
      const currentIsMobile = window.innerWidth < MOBILE_BREAKPOINT;
      if (this.isMobile !== currentIsMobile) {
        this.isMobile = currentIsMobile;
        if (currentIsMobile) {
          this.sidebarOpened = false; // Hide sidebar when switching to mobile
        } else {
          this.sidebarOpened = true; // Show sidebar when switching to desktop
        }
      }
    },
  },
});
