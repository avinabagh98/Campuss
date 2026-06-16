
import { Provider } from 'react-redux';
import { store } from './src/app/store';
import RootNavigator from './src/navigation/RootNavigator';
import { SafeAreaProvider } from 'react-native-safe-area-context';


export default function App() {
  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <RootNavigator />
      </Provider>
    </SafeAreaProvider>
  );
}