import * as React from "react";
import { StyleSheet, View, Alert } from "react-native";
import MapboxNavigation from "@homee/react-native-mapbox-navigation";
import { StackScreenProps } from '@react-navigation/stack';

interface Props extends StackScreenProps<any, 'StartItinerary'> { };

export const StartItinerary = ({ route, navigation }: Props) => {

    React.useEffect(() => {
        navigation.setOptions({ title: route.params?.info.name });
    }, []);


    function filterLast(element:any,index:any){
        return index !== route.params?.stops.length - 1;
    }

    return (
        <View style={styles.container}>
            <View style={styles.mapContainer}>
                <MapboxNavigation
                    origin={[route.params?.userposition.long, route.params?.userposition.lat]}
                    destination={[route.params?.stops[route.params?.stops.length-1].position._long, route.params?.stops[route.params?.stops.length-1].position._lat]}
                    waypoints={route.params?.stops.filter(filterLast).map((s : any) => [s.position._long,s.position._lat])}
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