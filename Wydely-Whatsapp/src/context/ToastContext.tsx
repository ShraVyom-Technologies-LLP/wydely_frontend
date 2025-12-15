import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import colors from '../theme/colors';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export type ToastOptions = {
  id?: string;
  type?: ToastType;
  title: string;
  message?: string;
  duration?: number;
};

type ToastInternal = Required<ToastOptions>;

type ToastContextValue = {
  showToast: (options: ToastOptions) => void;
};

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return ctx;
};

type ProviderProps = {
  children: React.ReactNode;
};

export const ToastProvider: React.FC<ProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastInternal[]>([]);

  const showToast = useCallback((options: ToastOptions) => {
    const id = options.id ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const toast: ToastInternal = {
      id,
      type: options.type ?? 'info',
      title: options.title,
      message: options.message ?? '',
      duration: options.duration ?? 4000,
    };
    setToasts((prev) => [...prev, toast]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <View pointerEvents="box-none" style={styles.host}>
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onClose={removeToast} />
        ))}
      </View>
    </ToastContext.Provider>
  );
};

type ToastItemProps = {
  toast: ToastInternal;
  onClose: (id: string) => void;
};

const ToastItem: React.FC<ToastItemProps> = ({ toast, onClose }) => {
  const translateY = useRef(new Animated.Value(-40)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 200,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    const timeout = setTimeout(() => {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: -20,
          duration: 200,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start(() => onClose(toast.id));
    }, toast.duration);

    return () => clearTimeout(timeout);
  }, [toast.id, toast.duration, onClose, opacity, translateY]);

  const palette = getPalette(toast.type);

  return (
    <Animated.View
      style={[
        styles.toast,
        {
          borderColor: palette.border,
          backgroundColor: palette.bg,
          transform: [{ translateY }],
          opacity,
        },
      ]}
    >
      <View style={[styles.iconCircle, { borderColor: palette.iconBorder }]}>
        <Text style={[styles.iconText, { color: palette.iconBorder }]}>{palette.symbol}</Text>
      </View>
      <View style={styles.textContainer}>
        <Text style={[styles.title, { color: palette.title }]} numberOfLines={2}>
          {toast.title}
        </Text>
        {!!toast.message && (
          <Text style={[styles.message, { color: palette.message }]} numberOfLines={3}>
            {toast.message}
          </Text>
        )}
      </View>
      <TouchableOpacity onPress={() => onClose(toast.id)} style={styles.closeButton}>
        <Text style={[styles.closeText, { color: palette.close }]}>✕</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const getPalette = (type: ToastType) => {
  switch (type) {
    case 'success':
      return {
        bg: '#ECFDF3',
        border: '#6CE9A6',
        title: '#027A48',
        message: colors.textSecondary,
        iconBorder: '#12B76A',
        close: '#98A2B3',
        symbol: '✓',
      };
    case 'error':
      return {
        bg: '#FEF3F2',
        border: '#FDA29B',
        title: '#B42318',
        message: colors.textSecondary,
        iconBorder: '#F04438',
        close: '#98A2B3',
        symbol: '✕',
      };
    case 'warning':
      return {
        bg: '#FFFAEB',
        border: '#FEDF89',
        title: '#B54708',
        message: colors.textSecondary,
        iconBorder: '#F79009',
        close: '#98A2B3',
        symbol: '!',
      };
    case 'info':
    default:
      return {
        bg: '#EFF4FF',
        border: '#84CAFF',
        title: '#175CD3',
        message: colors.textSecondary,
        iconBorder: '#2E90FA',
        close: '#98A2B3',
        symbol: 'i',
      };
  }
};

const styles = StyleSheet.create({
  host: {
    position: 'absolute',
    top: 80,
    left: 72,
    right: 24,
    zIndex: 200,
    alignItems: 'flex-start',
    pointerEvents: 'box-none',
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    backgroundColor: '#fff',
    maxWidth: 480,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  iconText: {
    fontSize: 16,
    fontWeight: '700',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  message: {
    fontSize: 13,
  },
  closeButton: {
    padding: 4,
    marginLeft: 8,
  },
  closeText: {
    fontSize: 16,
  },
});
