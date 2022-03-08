import * as React from "react";
import { StyleSheet, View, PermissionsAndroid } from "react-native";
import MapboxNavigation from "@homee/react-native-mapbox-navigation";
import { StackScreenProps } from '@react-navigation/stack';
import Geolocation from 'react-native-geolocation-service';

interface Props extends StackScreenProps<any, 'ShowItemItinerary'> { };

export const ShowItemItinerary = ({ route, navigation }: Props) => {

    const [userPositionLat, setUserPositionLat] = React.useState<number>(40.412386);
    const [userPositionLong, setUserPositionLong] = React.useState<number>(-3.691977);

    React.useEffect(() => {
        navigation.setOptions({ title: "Ruta a " + route.params?.info.name });
        requestPermissions();
        checkUserPosition();
    }, []);

    async function requestPermissions() {
        await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
    }

    const checkUserPosition = () => {
        Geolocation.getCurrentPosition(
            (position) => {
                setUserPositionLat(position.coords.latitude);
                setUserPositionLong(position.coords.longitude);
            },
            (error) => {
                // See error code charts below.
                console.log(error.code, error.message);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
    }
    return (
        <View style={styles.container}>
            <View style={styles.mapContainer}>
                <MapboxNavigation
                    origin={[userPositionLong, userPositionLat]}
                    destination={[route.params?.info.position._long, route.params?.info.position._lat]}
                    shouldSimulateRoute={true}
                    showsEndOfRouteFeedback
                    onLocationChange={(event) => {
                        console.log('onLocationChange', event.nativeEvent)
                        console.log('[' + event.nativeEvent?.latitude + '],[' + event.nativeEvent?.longitude + ']')
                    }}
                    onRouteProgressChange={(event) => {
                        console.log(event.nativeEvent?.distanceTraveled);
                        console.log(event.nativeEvent?.durationRemaining);
                        console.log(event.nativeEvent?.fractionTraveled);
                        console.log(event.nativeEvent?.distanceRemaining);
                    }}
                    onError={(event) => {
                        console.log(event.nativeEvent?.message);
                    }}
                    onCancelNavigation={() => {
                        console.log("Ruta cancelada");
                    }}
                    onArrive={() => {
                        console.log("Has llegado");
                    }}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
    },
    mapContainer: {
        flex: 1
    }
});