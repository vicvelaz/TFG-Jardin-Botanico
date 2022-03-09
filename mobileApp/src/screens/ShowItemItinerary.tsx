import * as React from "react";
import { StyleSheet, View, Alert } from "react-native";
import MapboxNavigation from "@homee/react-native-mapbox-navigation";
import { StackScreenProps } from '@react-navigation/stack';

interface Props extends StackScreenProps<any, 'ShowItemItinerary'> { };

export const ShowItemItinerary = ({ route, navigation }: Props) => {

    React.useEffect(() => {
        navigation.setOptions({ title: "Ruta a " + route.params?.info.name });
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.mapContainer}>
                <MapboxNavigation
                    origin={[route.params?.userposition.long, route.params?.userposition.lat]}
                    destination={[route.params?.info.position._long, route.params?.info.position._lat]}
                    shouldSimulateRoute={true}
                    onLocationChange={(event) => {

                    }}
                    onRouteProgressChange={(event) => {
                        
                    }}
                    onError={(event) => {
                        console.log(event.nativeEvent);
                    }}
                    onCancelNavigation={() => {
                        console.log("Ruta cancelada");
                    }}
                    onArrive={() => {
                        Alert.alert("Has llegado a tu destino","Enhorabuena, has llegado a "+route.params?.info.name,
                        [{ text: "OK", onPress: () => true }]);
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