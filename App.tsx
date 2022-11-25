import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {StatusBar} from "expo-status-bar";
import {SafeAreaProvider} from "react-native-safe-area-context";
import DetailsScreen from "./screens/DetailsScreen";
import HomePage from "./screens/HomePage";


const Stack = createNativeStackNavigator();



export default function App() {
    return (

        <SafeAreaProvider>
            <NavigationContainer>
                <StatusBar/>
                <Stack.Navigator>

                    <Stack.Screen
                        name="Home"
                        component={HomePage}
                        options={{title: 'webview', headerShown: false}}

                    />

                    <Stack.Screen name="Details" component={DetailsScreen}/>

                </Stack.Navigator>
            </NavigationContainer>
        </SafeAreaProvider>);
}
