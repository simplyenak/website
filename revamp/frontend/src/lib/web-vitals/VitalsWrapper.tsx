import React, { useEffect } from 'react';
import { initWebVitals } from './vitals';

/**
 * Wrapper component to initialize web vitals measurement
 * 
 * Use this component at the root of your application to start measuring
 * Core Web Vitals automatically.
 * 
 * Example usage:
 * <VitalsWrapper>
 *   <YourApp />
 * </VitalsWrapper>
 */
const VitalsWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    initWebVitals();
  }, []);

  return <>{children}</>;
};

export default VitalsWrapper;