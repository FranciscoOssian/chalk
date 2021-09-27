import * as React from 'react';
import { StatusBar, SafeAreaView, StyleSheet } from 'react-native';

import Routes from './src/Routes'

const App = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle='dark-content' backgroundColor="#ffff" />
      <Routes />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;