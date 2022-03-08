import * as React from "react";
import { StyleSheet, View, PermissionsAndroid } from "react-native";
import MapboxNavigation from "@homee/react-native-mapbox-navigation";
import { StackScreenProps } from '@react-navigation/stack';
import Geolocation from 'react-native-geolocation-service';

interface Props extends StackScreenProps<any, 'ShowItemItinerary'> { };

export const ShowItemItinerary = ({ route, navigation }: Props) => {

    const [userPositionLat, setUserPositionLat] = React.useState<number>(40.412386);
    const [userPositionLong, setUserPositionLong] = React.useState<number>(-3.691977);

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
            {/* <MapboxNavigation
        origin={[-97.760288, 30.273566]}
        destination={[-97.918842, 30.494466]}
        shouldSimulateRoute
        showsEndOfRouteFeedback
        onLocationChange={(event) => {
          const { latitude, longitude } = event.nativeEvent;
        }}
        onRouteProgressChange={(event) => {
          const {
            distanceTraveled,
            durationRemaining,
            fractionTraveled,
            distanceRemaining,
          } = event.nativeEvent;
        }}
        onError={(event) => {
          const { message } = event.nativeEvent;
        }}
        onCancelNavigation={() => {
          // User tapped the "X" cancel button in the nav UI
          // or canceled via the OS system tray on android.
          // Do whatever you need to here.
        }}
        onArrive={() => {
          // Called when you arrive at the destination.
        }}
      /> */}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});