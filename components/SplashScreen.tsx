import React, {useEffect} from 'react';
import {StyleSheet, View} from "react-native";
import {ActivityIndicator} from "react-native-paper";
import Animated, {runOnJS, useAnimatedStyle, useSharedValue, withDelay, withTiming} from "react-native-reanimated";


const homeStyle = StyleSheet.create({

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


    progress: {
        position: 'absolute', marginTop: 60
    },

    intro: {
        alignSelf: 'center', justifyContent: 'center', marginTop: 'auto', marginBottom: 'auto',

        // borderStyle: "solid",
        // borderColor: 'red',
        // borderWidth: 1,

        display: "flex", flexDirection: 'row', alignItems: 'center', width: '70%', maxWidth: 200,


    },

})

const imgStyle = StyleSheet.create({
    wrapper: {
        flex: 1, // borderStyle: "solid",
        // borderColor: 'black',
        // borderWidth: 1,
        overflow: "hidden",
    }, text: {
        maxWidth: '100%', width: '100%',
    }, logo: {
        maxWidth: '100%', flex: .35,

    }
})

const SplashScreen = (props: any) => {
    const {isConnected, animated, setAnimated} = props;


    const offset = useSharedValue(110);
    const logoOffset = useSharedValue(80);
    const opacity = useSharedValue(0);
    const logoOpacity = useSharedValue(0);

    const animatedStyles = useAnimatedStyle(() => {
        'worklet';
        return {
            transform: [{
                translateX: withDelay(300, withTiming(offset.value, {
                    duration: 1100,
                }, finished => {

                    runOnJS(setAnimated)(Boolean(finished));

                }))
            }],

            opacity: withDelay(470, withTiming(opacity.value, {
                duration: 1000,
            }))
        };
    });

    const logoAnimatedStyles = useAnimatedStyle(() => {
        'worklet';
        return {
            transform: [{
                translateX: withDelay(300, withTiming(-logoOffset.value, {
                    duration: 1100,
                }))
            }], opacity: withDelay(0, withTiming(logoOpacity.value, {
                duration: 350,
            }))
        };
    });

    useEffect(() => {
        offset.value = logoOffset.value = 0
        opacity.value = 1
        logoOpacity.value = 1
    }, [])

    return (
        <View style={homeStyle.splash}>

            <View style={homeStyle.progress}>
                {isConnected && animated && <ActivityIndicator size="large" color="white"/>}
            </View>

            <View style={homeStyle.intro}>

                <View style={imgStyle.wrapper}>
                    <Animated.Image source={require('../assets/future-text.png')}
                                    resizeMode='contain'
                                    style={[imgStyle.text, animatedStyles]}
                    />
                </View>

                <Animated.Image source={require('../assets/future-logo.png')}
                                resizeMode='contain'
                                style={[imgStyle.logo, logoAnimatedStyles]}

                />

            </View>

        </View>

    );
};

export default SplashScreen;
