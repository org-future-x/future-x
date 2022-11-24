import {Image, StyleSheet, Text, View} from 'react-native';
import {NavigationContainer, NavigationProp} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import WebView, {WebViewNavigation} from "react-native-webview";
import {StatusBar} from "expo-status-bar";
import {useEffect, useLayoutEffect, useState} from "react";
import NetInfo, {NetInfoState} from '@react-native-community/netinfo';
import {SafeAreaProvider} from "react-native-safe-area-context";
import {ActivityIndicator, Snackbar} from "react-native-paper";
import {WebViewError} from "react-native-webview/lib/WebViewTypes";


const Stack = createNativeStackNavigator();


const homeStyle = StyleSheet.create({
    home: {
        position: 'relative', // borderStyle: 'solid',
        // borderColor: 'red',
        // borderWidth: 2,
        display: 'flex', height: '100%'
    },

    splash: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        backgroundColor: '#0089C6',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',


        zIndex: 9
    },

    webView: {
        height: '100%', width: '100%', marginTop: 30
    },

    progress: {
        position: 'absolute', marginTop: 60
    },

    intro: {
        alignSelf: 'center',
        justifyContent: 'center',
        marginTop: 'auto',
        marginBottom: 'auto',
        // borderStyle: "solid",
        // borderColor: 'red',
        // borderWidth: 1,

        display: "flex",
        flexDirection: 'row',
        alignItems: 'center',
        width: '70%',
        maxWidth: 200,


    },

    text: {
        fontSize: 100
    }
})

const snackStyle = StyleSheet.create({
    wrapper: {
        zIndex: 1000
    }
})

const imgStyle = StyleSheet.create({
    text: {
        maxWidth: '100%',
        width: '100%',
        flex: 1,
    },
    logo: {
        maxWidth: '100%',
        flex: .35,

    }
})

function WebViewErrorPage(props: any) {

    return (<View
        style={{
            position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, backgroundColor: 'gray', zIndex: 888,
        }}
    >
        <Text>{props?.errorDesc}</Text>


    </View>)
}

type SnackInfo = {
    show: boolean, text: string, error: boolean, duration?: undefined | number
}

function HomeScreen({navigation}: any) {

    const [progress, setProgress] = useState(0)
    const [showSplash, setShowSplash] = useState(true)
    const [isConnected, setIsConnected] = useState(true);
    const [webviewLoadingState, setWebviewLoadingState] = useState<WebViewError | WebViewNavigation & { invoker?: string } & Record<string, any>>()

    const [networkState, setNetworkState] = useState<NetInfoState>()
    const [prevNetworkState, setPrevNetworkState] = useState<NetInfoState>()

    let webViewRef: any = null;

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

        if (!networkState) return;

        // console.log('prevNetState : ', prevNetworkState)

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

    }, [networkState])

    useEffect(() => {
        // console.log('isCOnnected for refresh: ', isConnected, webviewLoadingState, progress )

        if (webviewLoadingState?.loading) return;

        if (webviewLoadingState?.code == -2) {
            webViewRef?.reload()
        }

    }, [isConnected])

    useEffect(() => {

        // console.log('loadingState: ', webviewLoadingState, progress)

        if (!webviewLoadingState) return;


        // todo -> fix this
        if (!webviewLoadingState.loading && progress == 1) {
            // setShowSplash(false)
        }

    }, [webviewLoadingState])


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


        {showSplash && <View style={homeStyle.splash}>


            <View style={homeStyle.progress}>

                {isConnected && <ActivityIndicator size="large" color="red"/>}

            </View>

            <View style={homeStyle.intro}>

                <Image source={require('./assets/future-text.png')} style={imgStyle.text}
                       resizeMode='contain'
                />
                <Image source={require('./assets/future-logo.png')}
                       resizeMode='contain'
                       style={imgStyle.logo}
                />

            </View>


        </View>}


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


function DetailsScreen({navigation}: { navigation: NavigationProp<any> }) {
    return (<WebView source={{
        uri: 'https://inspire-ethiosd.netlifyass.app'
    }}/>);
}


export default function App() {
    return (

        <SafeAreaProvider>
            <NavigationContainer>
                <StatusBar/>
                <Stack.Navigator>

                    <Stack.Screen
                        name="Home"
                        component={HomeScreen}
                        options={{title: 'webview', headerShown: false}}

                    />

                    <Stack.Screen name="Details" component={DetailsScreen}/>

                </Stack.Navigator>
            </NavigationContainer>
        </SafeAreaProvider>);
}
