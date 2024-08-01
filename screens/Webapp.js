import {
  View,
  Text,
  BackHandler,
  Platform,
  ScrollView,
  RefreshControl
} from 'react-native'
import React, {
  useEffect,
  useRef,
  useState,
} from 'react';
import { WebView } from 'react-native-webview';
import { StyleSheet } from 'react-native';

const Webapp = () => {
  const webViewRef = useRef(null);
  const [refreshing, setRefreshing] = useState(false);
  const [refresherEnabled, setEnableRefresher] = useState(true);

  //Code to get scroll position
  const handleScroll = (event) => {
    // console.log(Number(event.nativeEvent.contentOffset.y))
    const yOffset = Number(event.nativeEvent.contentOffset.y)
    if (yOffset === 0) {
      // console.log('top of the page')
      setEnableRefresher(true)
    } else {
      setEnableRefresher(false)
    }
  }

  const onAndroidBackPress = () => {
    if (webViewRef.current) {
      webViewRef.current.goBack();
      return true; // prevent default behavior (exit app)
    }
    return false;
  }

  useEffect(() => {
    if (Platform.OS === 'android') {
      BackHandler.addEventListener('hardwareBackPress', onAndroidBackPress);
      return () => {
        BackHandler.removeEventListener('hardwareBackPress', onAndroidBackPress);
      };
    }
  }, []);
  return (
    <ScrollView
      contentContainerStyle={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#000' }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          enabled={refresherEnabled}
          onRefresh={() => { webViewRef.current.reload() }}
        />
      }>
      <WebView
        ref={webViewRef}
        style={styles.container}
        source={{ uri: 'https://dojo-8a998.web.app/' }}
        originWhitelist={['*']}
        allowsInlineMediaPlayback
        javaScriptEnabled
        scalesPageToFit
        mediaPlaybackRequiresUserAction={false}
        javaScriptEnabledAndroid
        useWebkit
        startInLoadingState={true}
        cacheEnabled
        onScroll={handleScroll}
      />

    </ScrollView>
  )
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: '0%',
  },
});


export default Webapp