import React, {useEffect, useLayoutEffect, useState} from 'react';
import {StyleSheet, View} from "react-native";
import {WebViewError} from "react-native-webview/lib/WebViewTypes";
import WebView, {WebViewNavigation} from "react-native-webview";
import NetInfo, {NetInfoState} from "@react-native-community/netinfo";
import {useSharedValue} from "react-native-reanimated";
import {Snackbar} from "react-native-paper";
import SplashScreen from "../components/SplashScreen";


function WebViewErrorPage(props: any) {

    return (<View
        style={{
            position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, backgroundColor: 'gray', zIndex: 888,
        }}
    >
        {/*<Text>{props?.errorDesc}</Text>*/}


    </View>)
}

type SnackInfo = {
    show: boolean, text: string, error: boolean, duration?: undefined | number
}

type WebViewLoadingState = {
    invoker?: string,
} & WebViewError | WebViewNavigation & Record<string, any>


const homeStyle = StyleSheet.create({
    home: {
        position: 'relative', // borderStyle: 'solid',
        // borderColor: 'red',
        // borderWidth: 2,
        display: 'flex', height: '100%'
    },

    webView: {
        height: '100%', width: '100%', marginTop: 30
    },


})


const snackStyle = StyleSheet.create({
    wrapper: {
        zIndex: 1000
    }
})


function HomeScreen(props: any) {
    let webViewRef: any = null;
    const [progress, setProgress] = useState(0)
    const [showSplash, setShowSplash] = useState(true)
    const [isConnected, setIsConnected] = useState(true);
    const [webviewLoadingState, setWebviewLoadingState] = useState<WebViewLoadingState>()

    const [networkState, setNetworkState] = useState<NetInfoState>()
    const [prevNetworkState, setPrevNetworkState] = useState<NetInfoState>()
    const [animated, setAnimated] = useState(false)


    const offset = useSharedValue(110);
    const logoOffset = useSharedValue(80);
    const opacity = useSharedValue(0);
    const logoOpacity = useSharedValue(0);


    useEffect(() => {
        offset.value = logoOffset.value = 0

        opacity.value = 1

        logoOpacity.value = 1

    }, [])


    const [snackInfo, setSnackInfo] = useState<SnackInfo>({
        show: false, text: '', error: false,
    })

    useLayoutEffect(() => {
        NetInfo.addEventListener(networkState => {
            setNetworkState(networkState)
        })

    }, [])

    // show snackbar
    useEffect(() => {

        if (!networkState || !animated) return;


        if (networkState?.isConnected === false) {
            setSnackInfo({
                show: true, error: true, text: 'You are not connected to the Internet'
            })
            setIsConnected(false)

        } else if (networkState?.isInternetReachable && networkState?.isConnected && (snackInfo.show && snackInfo.error)) {

            setSnackInfo({
                show: true, error: false, text: 'You are back online', duration: 4000
            })

            setIsConnected(true)
        }

        setPrevNetworkState(networkState)

    }, [networkState, animated])

    useEffect(() => {

        if (webviewLoadingState?.loading) return;

        if (webviewLoadingState?.code == -2) {
            webViewRef?.reload()
        }

    }, [isConnected])

    // hide the splash screen
    useEffect(() => {

        if (!webviewLoadingState || !animated) return;


        if (webviewLoadingState?.invoker === 'onLoadStart') {

            return;
        }

        if (webviewLoadingState?.invoker === 'onLoadEnd' && !webviewLoadingState.loading && progress == 1 && webviewLoadingState.title === 'Vite App') {
            setShowSplash(false)
        }

    }, [webviewLoadingState, animated])


    return (<View style={homeStyle.home}>

        <Snackbar visible={snackInfo.show}
                  style={{backgroundColor: snackInfo.error ? 'red' : 'black'}}
                  wrapperStyle={snackStyle.wrapper}
                  onDismiss={() => {
                      if (!snackInfo.duration) return;

                      setSnackInfo({
                          show: false, error: false, text: '',
                      })
                  }}
                  duration={snackInfo.duration}
                  action={{
                      label: snackInfo.error ? 'Refresh' : '', onPress: () => {
                          webViewRef?.reload();
                      },
                  }}
        >
            {snackInfo.text}
        </Snackbar>


        {showSplash && <SplashScreen isConnected={isConnected}
                                     animated={animated}
                                     setAnimated={setAnimated}/>}


        <View style={homeStyle.webView}>

            <WebView source={{
                uri: 'https://inspire-ethio.netlify.app'
            }}
                     ref={WEBVIEW_REF => (webViewRef = WEBVIEW_REF)}

                     startInLoadingState
                     pullToRefreshEnabled
                     bounces

                     onLoadProgress={event => setProgress(event.nativeEvent.progress)}
                     onLoadEnd={(event) => {
                         // console.log('onLoad End -- ', event.nativeEvent)
                         setWebviewLoadingState({invoker: 'onLoadEnd', ...event.nativeEvent,})
                     }}
                     onLoad={event => {
                         // console.log('onLoad: ', event.nativeEvent.loading)
                     }}
                     onLoadStart={(event) => {
                         // console.log('onLoadStart:: ', event.nativeEvent.loading)
                         setWebviewLoadingState({invoker: 'onLoadStart', ...event.nativeEvent,})


                     }}
                     onError={(event) => {
                         // console.log('Web View Error: ')
                         setWebviewLoadingState({invoker: 'onError', ...event.nativeEvent,})

                     }}

                     renderError={(errorDomain, errorCode, errorDesc) => <WebViewErrorPage errorDesc={errorDesc}/>}


            />

        </View>


    </View>);
}

export default HomeScreen;
