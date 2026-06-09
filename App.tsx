import React, {useEffect, useState} from 'react';
import {AppProviders} from '@app/AppProviders';
import {AppNavigator} from '@app/navigation';
import {SplashGate} from '@app/SplashGate';
import {initI18n} from '@core/i18n';

function App(): React.JSX.Element | null {
  const [isI18nInitialized, setIsI18nInitialized] = useState(false);

  useEffect(() => {
    initI18n()
      .then(() => {
        setIsI18nInitialized(true);
      })
      .catch((error) => {
        console.error('Failed to initialize i18n:', error);
        // Fallback to render app anyway to avoid stuck black screen
        setIsI18nInitialized(true);
      });
  }, []);

  if (!isI18nInitialized) {
    return null;
  }

  return (
    <AppProviders>
      <SplashGate>
        <AppNavigator />
      </SplashGate>
    </AppProviders>
  );
}

export default App;
