import React from 'react';
import {AppProviders} from '@app/AppProviders';
import {AppNavigator} from '@app/navigation';
import {SplashGate} from '@app/SplashGate';

function App(): React.JSX.Element {
  return (
    <AppProviders>
      <SplashGate>
        <AppNavigator />
      </SplashGate>
    </AppProviders>
  );
}

export default App;
