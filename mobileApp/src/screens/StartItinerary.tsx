import * as React from "react";
import { StyleSheet, View, Alert, TouchableOpacity, Text, ActivityIndicator, Image} from "react-native";
import MapboxNavigation from "@homee/react-native-mapbox-navigation";
import { StackScreenProps } from '@react-navigation/stack';
import SwipeUpDown, { SwipeUpDownProps } from 'react-native-swipe-up-down';
import { ScrollView } from 'react-native-gesture-handler';
import { AudioButton } from '../components/AudioButton';
import { booleanClockwise } from "@turf/turf";

interface Props extends StackScreenProps<any, 'StartItinerary'> { };

export const StartItinerary = ({ route, navigation }: Props) => {
    
    //estado para almacenar la siguiente parada
    const [nextStop,setNextStop] = React.useState<string>(route.params?.stops[0].name);

    //estados para ver la información de la planta actual del itinerario
    const [selectedPlantName, setSelectedPlantName] = React.useState<string>("Origen (mi ubicación)");
    const [selectedPlantScientificName, setSelectedPlantScientificName] = React.useState<string>("");
    const [selectedPlantDescription, setSelectedDescription] = React.useState<string>("Camino desde su ubicación al primer punto del itinerario");
    const [selectedPlantImage, setSelectedPlantImage] = React.useState<string>("https://firebasestorage.googleapis.com/v0/b/realjardinbotanicoapp.appspot.com/o/background-dark.jpg?alt=media&token=b43496b1-59e5-442d-9891-534415ee857b");
    const [selectedPlantAudio, setSelectedPlantAudio] = React.useState<any>("");
    const [swipeUpMinimized, setSwipeUpMinimized] = React.useState<boolean>(true);
    const [loadPlantImage, setLoadPlantImage] = React.useState<boolean>(false);

    React.useEffect(() => {
        navigation.setOptions({ title: route.params?.info.name });
        Alert.alert("Aviso Informativo", "Recuerde avanzar a la siguiente parada con el botón (>) y deslizar hacia arriba el desplegable con las paradas para ver la información detallada de la planta.",
            [{ text: "OK", onPress: () => true }]);
    }, []);


    function filterLast(element: any, index: any) {
        return index !== route.params?.stops.length - 1;
    }

    const updateSwipeUpInfo = (remainingWaypoints: number, isDestination: boolean) => {
        setSelectedPlantName(route.params?.stops[route.params?.stops.length - remainingWaypoints].name);
        setSelectedPlantScientificName(route.params?.stops[route.params?.stops.length - remainingWaypoints].scientific_name);
        setSelectedDescription(route.params?.stops[route.params?.stops.length - remainingWaypoints].description);
        setSelectedPlantAudio(route.params?.stops[route.params?.stops.length - remainingWaypoints].audio);
        setSelectedPlantImage(route.params?.stops[route.params?.stops.length - remainingWaypoints].media[0]);
        if(remainingWaypoints >= 2){
            setNextStop(route.params?.stops[route.params?.stops.length - remainingWaypoints + 1].name);
        }else{
            setNextStop("Fin Itinerario");
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.mapContainer}>
                <MapboxNavigation
                    origin={[route.params?.userposition.long, route.params?.userposition.lat]}
                    destination={[route.params?.stops[route.params?.stops.length - 1].position._long, route.params?.stops[route.params?.stops.length - 1].position._lat]}
                    waypoints={route.params?.stops.filter(filterLast).map((s: any) => [s.position._long, s.position._lat])}
                    shouldSimulateRoute={true/*false*/}
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
                    onArrive={(event) => {
                        updateSwipeUpInfo(1,true);
                        Alert.alert("Itinerario Completado", "Has completado el itinerario: Árboles Singulares, ¡enhorabuena!",
                        [{ text: "OK", onPress: () => true }]);
                    }}
                    onWaypointArrive={(event) => {
                        if(event.nativeEvent!= undefined){
                            updateSwipeUpInfo(event.nativeEvent?.remainingWaypoints,false);
                        }     
                    }}
                />
                <SwipeUpDown
                    itemMini={(show: SwipeUpDownProps) =>
                        <View style={textStyle.miniInfoView}>
                            <View style={textStyle.miniInfoViewLeft}>
                                <Text>PARADA ACTUAL</Text>
                                <Text style={textStyle.baseText}>{selectedPlantName}</Text>
                            </View>
                            <View style={textStyle.verticleLine}></View>
                            <View style={textStyle.miniInfoViewRight}>
                                <Text>PRÓXIMA PARADA</Text>
                                <Text style={textStyle.baseText}>{nextStop}</Text>
                            </View>
                        </View>}
                    itemFull={(hide: SwipeUpDownProps) =>
                        <View style={textStyle.maxInfoView}>
                            <View style={textStyle.nombres}>
                                <Text style={swipeUpMinimized ? textStyle.baseText : textStyle.baseTextMinimized}>{selectedPlantName}</Text>
                                <Text style={swipeUpMinimized ? textStyle.sci_name : textStyle.sci_name_minimized}>{selectedPlantScientificName}</Text>
                            </View>
                            <View style={textStyle.descripcion}>
                                <ScrollView >
                                    <Text style={textStyle.infoText}>{selectedPlantDescription}</Text>
                                </ScrollView>
                            </View>
                            <View style={textStyle.imageButtonsView}>
                                {loadPlantImage && (
                                    <ActivityIndicator size="large" color="#00ff00" />
                                )}
                                <Image source={{ uri: selectedPlantImage }} onLoadStart={() => setLoadPlantImage(true)} onLoadEnd={() => setLoadPlantImage(false)} style={{ width: 150, height: 150 }} />
                                <View>
                                    <AudioButton
                                        audioURL={selectedPlantAudio}
                                        navigation={navigation}
                                        plantButton={false}
                                    />
                                </View>
                            </View>
                        </View>}
                    onShowMini={() => setSwipeUpMinimized(true)}
                    onShowFull={() => setSwipeUpMinimized(false)}
                    animation="spring"
                    disableSwipeIcon={false}
                    extraMarginTop={200}
                    swipeHeight={40}
                    style={swipeUpMinimized ? { backgroundColor: '#419E08', height: 80 } : { backgroundColor: '#fff', height: 80 }} // style for swipe
                    iconColor={"black"}
                    iconSize={30}
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

const buttonStyle = StyleSheet.create({
    button: {
      backgroundColor: '#419E08',
      paddingVertical: 10,
      borderRadius: 10,
      borderColor: 'white',
      borderWidth: 2,
      marginLeft: 10,
      width: 120,
      height: 50
    },
    buttonMin: {
      backgroundColor: '#419E08',
      paddingVertical: 5,
      borderRadius: 10,
      borderColor: 'white',
      borderWidth: 2,
      marginLeft: 10,
      width: 120,
      height: 50
    },
    buttonText: {
      fontSize: 17,
      alignSelf: 'center',
      fontWeight: 'bold',
      color: 'white',
      marginHorizontal: 20,
      width: '100%',
      textAlign: 'center'
    },
    buttonTextMin: {
      fontSize: 14,
      alignSelf: 'center',
      fontWeight: 'bold',
      color: 'white',
      marginHorizontal: 20,
      width: '100%',
      textAlign: 'center'
    }
  });
  
  const textStyle = StyleSheet.create({
    baseText: {
      color: "black",
      fontSize: 15
    },
    baseTextMinimized: {
      color: "white",
      fontSize: 20,
      marginTop: 10
    },
    titulo: {
      fontSize: 15
    },
    sci_name: {
      fontStyle: 'italic',
      fontSize: 13,
      marginBottom: 10
    },
    sci_name_minimized: {
      fontStyle: 'italic',
      fontSize: 13,
      color: "white",
      marginBottom: 10
    },
    infoText: {
      color: "black",
      fontSize: 12,
      marginTop: 10,
      padding: 20
    },
    viewTextStyle: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#fff",
      padding: 20,
      height: 500,
      width: 400,
    },
    textoParada: {
      color: "black",
      fontSize: 12,
      marginTop: 10
    },
    miniInfoView: {
      backgroundColor: "#fff",
      flex: 1,
      alignItems: "center",
      flexDirection: "row"
    },
    miniInfoViewLeft: {
      flex: 1,
      alignItems: "center"
    },
    verticleLine: {
        height: '70%',
        width: 1,
        backgroundColor: '#909090',
      },
    miniInfoViewRight: {
      flex: 1,
      alignItems: "center"
    },
    maxInfoView: {
        backgroundColor: "#fff",
        flex: 1,
        alignItems: "center",
    },
    imageButtonsView: {
      flex: 1,
      flexDirection: "row",
      width: '100%',
      justifyContent: 'center'
    },
    nombres: {
      flex: 0.15,
      alignItems: "center",
      backgroundColor: "#419E08",
      width: 400,
      height: 100
    },
    descripcion: {
      flex: 0.4,
      marginBottom: 20,
      marginTop: 20,
      textAlign: 'justify'
    }
  });