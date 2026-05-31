import { create } from 'zustand';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastState {
  message: string;
  type: ToastType;
  visible: boolean;
}

interface UiState {
  // --- State ---
  isLoading: boolean;
  toast: ToastState;
  currentDesignStep: number;

  // --- Actions ---
  setLoading: (status: boolean) => void;
  showToast: (message: string, type: ToastType) => void;
  setDesignStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
}

export const useUiStore = create<UiState>((set, get) => ({
  // --- Initial State ---
  isLoading: false,
  toast: {
    message: '',
    type: 'info',
    visible: false,
  },
  currentDesignStep: 1,

  // --- Actions ---
  setLoading: (status: boolean) => set({ isLoading: status }),

  showToast: (message: string, type: ToastType) => {
    set({ toast: { message, type, visible: true } });
    
    // Tự động ẩn sau 3 giây
    setTimeout(() => {
      set((state) => ({
        toast: { ...state.toast, visible: false },
      }));
    }, 3000);
  },

  setDesignStep: (step: number) => {
    if (step >= 1 && step <= 6) {
      set({ currentDesignStep: step });
    }
  },

  nextStep: () => {
    const { currentDesignStep } = get();
    if (currentDesignStep < 6) {
      set({ currentDesignStep: currentDesignStep + 1 });
    }
  },

  prevStep: () => {
    const { currentDesignStep } = get();
    if (currentDesignStep > 1) {
      set({ currentDesignStep: currentDesignStep - 1 });
    }
  },
}));
