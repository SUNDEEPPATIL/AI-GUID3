/// <reference types="./types.d.ts" />

// Module declarations for importmap-based dependencies
declare module 'react' {
  export = React;
  export as namespace React;
  import React from 'react';
  namespace React {
    type FC<P = {}> = (props: P) => any;
    function useState<T>(initial: T): [T, (value: T) => void];
    function useEffect(effect: () => void | (() => void), deps?: any[]): void;
    function useCallback(callback: any, deps: any[]): any;
    function useMemo(factory: any, deps: any[]): any;
    function createContext(defaultValue: any): any;
    function useContext(context: any): any;
    function useRef(initialValue?: any): any;
    interface ReactNode {}
    type ReactElement = any;
  }
  const React: any;
}

declare module 'react/jsx-runtime' {
  export const jsx: any;
  export const jsxs: any;
  export const Fragment: any;
}

declare module 'react-dom' {
  export const createRoot: any;
}

declare module 'react-dom/' {
  export * from 'react-dom';
}

declare module 'react/' {
  export * from 'react';
}

declare module '@google/genai' {
  export class GoogleGenAI {
    constructor(config: { apiKey: string });
    models: {
      generateContent: (config: any) => Promise<{ text: string; candidates?: any[] }>;
    };
  }
  export const Type: any;
}

declare module 'recharts' {
  export const ResponsiveContainer: any;
  export const BarChart: any;
  export const Bar: any;
  export const XAxis: any;
  export const YAxis: any;
  export const CartesianGrid: any;
  export const Tooltip: any;
}

declare module 'vite' {
  export function defineConfig(config: any): any;
}

declare module '@vitejs/plugin-react' {
  function react(): any;
  export default react;
}

// Node.js globals
declare const process: {
  env: Record<string, string | undefined>;
};

declare const global: any;