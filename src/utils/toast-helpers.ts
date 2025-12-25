import { toast } from 'sonner';
import { logger } from './logger';

/**
 * Helpers para substituir alert() e confirm() por toasts
 */

export const showToast = {
  success: (message: string) => {
    toast.success(message);
  },
  error: (message: string) => {
    toast.error(message);
  },
  info: (message: string) => {
    toast.info(message);
  },
  warning: (message: string) => {
    toast.warning(message);
  }
};

/**
 * Substitui confirm() por um toast com ação
 * Retorna uma Promise que resolve com true/false
 */
export const showConfirm = (message: string): Promise<boolean> => {
  return new Promise((resolve) => {
    toast(message, {
      action: {
        label: 'Confirmar',
        onClick: () => resolve(true)
      },
      cancel: {
        label: 'Cancelar',
        onClick: () => resolve(false)
      },
      duration: Infinity // Não fecha automaticamente
    });
  });
};

/**
 * Versão mais simples que usa window.confirm como fallback
 * mas mostra toast primeiro
 */
export const confirmAction = async (
  message: string,
  onConfirm: () => void | Promise<void>,
  onCancel?: () => void
): Promise<void> => {
  // Para confirmações importantes, ainda usar window.confirm
  // mas com melhor UX
  const confirmed = window.confirm(message);
  
  if (confirmed) {
    try {
      await onConfirm();
      showToast.success('Ação realizada com sucesso!');
    } catch (error) {
      showToast.error('Erro ao realizar ação');
      logger.error('Erro em confirmAction:', error);
    }
  } else {
    onCancel?.();
  }
};

