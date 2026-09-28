declare module 'react-native-safe-area-context' {
  import { ReactNode } from 'react';
  import { ViewStyle } from 'react-native';

  export interface SafeAreaProviderProps {
    children: ReactNode;
    initialMetrics?: {
      frame: { x: number; y: number; width: number; height: number };
      insets: { top: number; right: number; bottom: number; left: number };
    };
  }

  export function SafeAreaProvider(props: SafeAreaProviderProps): JSX.Element;

  export interface SafeAreaViewProps {
    style?: ViewStyle;
    children?: ReactNode;
  }

  export function SafeAreaView(props: SafeAreaViewProps): JSX.Element;

  export function useSafeAreaInsets(): {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };

  export function useSafeAreaFrame(): {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}
