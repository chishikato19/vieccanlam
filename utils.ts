
export const triggerConfetti = () => {
  if ((window as any).confetti) {
    (window as any).confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FBBF24', '#3B82F6', '#EF4444', '#10B981']
    });
  }
};

export const generateId = () => Math.random().toString(36).substr(2, 9);

export const calculateMaxXp = (level: number) => {
  return level * 50 + 50; 
};
