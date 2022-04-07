import React from 'react';
import { StyleSheet, View, Alert, PermissionsAndroid, Text, Image, ActivityIndicator, TouchableOpacity, Switch, Dimensions, Pressable, ScrollView, TouchableWithoutFeedback } from 'react-native';
import MapboxGL, { Logger } from '@react-native-mapbox-gl/maps';
import Geolocation from 'react-native-geolocation-service';
import { booleanClockwise, booleanPointInPolygon, Feature, point, Polygon, polygon, Properties } from '@turf/turf';
import { db } from '../firebase/firebase-config';
import SwipeUpDown, { SwipeUpDownProps } from 'react-native-swipe-up-down';
import { AudioButton } from '../components/AudioButton';
import { StackScreenProps } from '@react-navigation/stack';

MapboxGL.setAccessToken('pk.eyJ1IjoicmFteG5jaHYiLCJhIjoiY2t6c2IybzZrNXB2aDMwbzFnbmFsOXptNSJ9.CQqoytOo3yM-pGaCRIGgjw');
interface Props extends StackScreenProps<any, 'MapScreen'> { };

interface Data {
  id: string,
  name?: string,
  scientific_name?: string,
  description?: string,
  positionLat?: any,
  positionLong?: any,
  audio?: any,
  image: string
}

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const Map = ({ route, navigation }: Props) => {

  //constantes del jardin con coordenadas fijas
  const zoomMinimo: number = 17;
  const centerLng: number = -3.690750;
  const centerLat: number = 40.411147;

  const [perimetro, setPerimetro] = React.useState<any>();
  const [terraces, setTerraces] = React.useState<any>([]);
  const [zones, setZones] = React.useState<any>([]);

  const swipeUpDownRef = React.useRef();

  //mapa y listas
  const [map, setMap] = React.useState<MapboxGL.MapView>();
  const [isEnabled, setEnabled] = React.useState<boolean>(false);
  const [camera, setCamera] = React.useState<MapboxGL.Camera>();
  const [markers, setMarkers] = React.useState<MapboxGL.PointAnnotation[]>();
  const [plants, setPlants] = React.useState<any>([]);

  //estados del mapa y del user
  const [userPositionLat, setUserPositionLat] = React.useState<number>(40.412386);
  const [userPositionLong, setUserPositionLong] = React.useState<number>(-3.691977);
  const [alertShown, setAlertShown] = React.useState<boolean>();
  const [actualPlace, setActualPlace] = React.useState<string>("Cargando..");
  const [showItemMarkers, setShowItemMarkers] = React.useState<boolean>(false);
  const [showPosition, setShowPosition] = React.useState<boolean>(true);

  //estados planta seleccionada para view con info
  const [selectedPlantName, setSelectedPlantName] = React.useState<string>();
  const [selectedPlantScientificName, setSelectedPlantScientificName] = React.useState<string>();
  const [selectedPlantDescription, setSelectedDescription] = React.useState<string>();
  const [selectedPlantImage, setSelectedPlantImage] = React.useState<string>();
  const [selectedPlantAudio, setSelectedPlantAudio] = React.useState<any>();
  const [selectedPlantLong, setSelectedPlantLong] = React.useState<number>();
  const [selectedPlantLat, setSelectedPlantLat] = React.useState<number>();
  const [swipeUpMinimized, setSwipeUpMinimized] = React.useState<boolean>(true);
  const [loadPlantImage, setLoadPlantImage] = React.useState<boolean>(false);

  //useEffect al cargar el componente
  React.useEffect(() => {
    requestPermissions();
    checkUserPosition();
    obtenerPlantas();
    obtenerZonas();
    disableLogger();
  }, []);

  //consulta de zonas a firebase
  const obtenerZonas = async () => {

    const data = await db.collection('zones').get();
    const arrayData: any[] = data.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    const arrayPolygon = arrayData.map((e: any) =>
    ({ id: e.id, name: e.name, type: e.type, coordinates: polygon([e.coordinates.map((c: any) => ([c.longitude, c.latitude]))]) }
    ));

    const arrayZones = arrayPolygon.filter((e: any) => e.type === "zone");
    const arrayTerraces = arrayPolygon.filter((e: any) => e.type === "terrace");
    const arrayPerimetro = arrayPolygon.filter((e: any) => e.type === "perimeter");

    setZones(arrayZones);
    setTerraces(arrayTerraces);
    setPerimetro(arrayPerimetro[0]);
  }

  //metodo para deshabilitar el logger del mapa con warnings de la API de mapbox
  const disableLogger = () => {
    Logger.setLogCallback(log => {
      const { message } = log;

      // expected warnings - see https://github.com/mapbox/mapbox-gl-native/issues/15341#issuecomment-522889062
      if (
        message.match('Request failed due to a permanent error: Canceled') ||
        message.match('Request failed due to a permanent error: Socket Closed') ||
        message.match('MapRenderer::onSurfaceCreated GlyphsRasterizationMode was specified without providing LocalIdeographFontFamily. Switching glyphsRasterizationMode to NoGlyphsRasterizedLocally mode.')
      ) {
        return true;
      }
      return false;
    });
  }

  //consulta de plantas a firebase
  const obtenerPlantas = async () => {
    const data = await db.collection('plants').where('type', '==', 'plant').get();
    const arrayData: any = data.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const arrayPlants: Data[] = [];
    arrayData.forEach((element: any) => {
      arrayPlants.push({
        id: element.id, name: element.name, scientific_name: element.scientific_name, description: element.description,
        positionLat: element.position._lat, positionLong: element.position._long, audio: element.audio, image: element.media[0]
      });
    });
    setPlants(arrayPlants);
  }

  //permisos de geolocalizacion a android
  async function requestPermissions() {
    await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
  }

  //obtener la posicion del usuario y comprobar si está dentro de un area concreta
  const checkUserPosition = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        setUserPositionLat(position.coords.latitude);
        setUserPositionLong(position.coords.longitude);
        const userCoords = point([position.coords.longitude, position.coords.latitude]);

        if (perimetro !== undefined && !booleanPointInPolygon(userCoords, perimetro.coordinates)) {
          setActualPlace("Fuera del Jardín");
          
        } else {
          if (zones !== undefined && zones.length !== 0 && terraces !== undefined && terraces.length !== 0) {
            const i = zones.findIndex((t: any) => booleanPointInPolygon(userCoords, t.coordinates));
            if (i === -1) {
              const l = terraces.findIndex((t: any) => booleanPointInPolygon(userCoords, t.coordinates));
              if (l !== -1) {
                setActualPlace(terraces[l].name);
              }
            } else {
              setActualPlace(zones[i].name);
            }
          }
        }
      },
      (error) => {
        // See error code charts below.
        console.log(error.code, error.message);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  }

  //comprobar el zoom del usuario para mostrar plantas
  const updateZoom = async () => {
    if (map !== undefined) {
      const zoom = await map.getZoom();
      if (zoom > zoomMinimo) {
        setShowItemMarkers(true);
      } else {
        setShowItemMarkers(false);
      }
    }
  }

  //obtener informacion de la planta en onclick del marcador
  const showPlantInfo = (e: Data) => {
    camera?.flyTo([e.positionLong, e.positionLat]);
    setShowPosition(false);
    setSelectedPlantName(e.name);
    setSelectedPlantScientificName(e.scientific_name);
    setSelectedDescription(e.description);
    setSelectedPlantImage(e.image);
    setSelectedPlantAudio(e.audio);
    setSelectedPlantLat(e.positionLat);
    setSelectedPlantLong(e.positionLong);
  }

  //volver de la informacion de la planta en swipeup a informacion de ubicacion del usuario
  const backToPosition = () => {
    setShowPosition(true);
    camera?.flyTo([userPositionLong, userPositionLat]);
  }

  const updateAccessibilitySwitch = async (value: boolean) => {
    setEnabled(previousState => !previousState);
  }

  const loadMap = () => {
    return <MapboxGL.MapView ref={c => c !== null && setMap(c)} onPress={() => backToPosition()} onRegionDidChange={() => updateZoom()} style={mapStyle.map} styleURL={"mapbox://styles/ramxnchv/cl006l6ye000614mufkp230xm"}>
      <MapboxGL.Camera ref={c => c !== null && setCamera(c)} zoomLevel={16.15} centerCoordinate={[centerLng, centerLat]} />
      <MapboxGL.UserLocation androidRenderMode='compass' renderMode={'native'} showsUserHeadingIndicator={true} onUpdate={() => checkUserPosition()} />
      {plants.map((e: Data, i: number) => (
        <MapboxGL.PointAnnotation ref={c => c !== null && markers?.push(c)} key={e.id} id={e.id} onSelected={() => showPlantInfo(e)} anchor={{ x: 0.5, y: 0.5 }} title={e.name} coordinate={[e.positionLong, e.positionLat]}>
          <View>
            <Image
              source={require("../img/red_marker.png")}
              style={{ width: 33, height: 53 }}
              onLoad={() => markers && markers[i].refresh()}
            />
          </View>
        </MapboxGL.PointAnnotation>
      ))}
    </MapboxGL.MapView>
  }

  const loadAccesibleMap = () => {
    return <MapboxGL.MapView ref={c => c !== null && setMap(c)} onPress={() => backToPosition()} onRegionDidChange={() => updateZoom()} style={mapStyle.map} styleURL={"mapbox://styles/ramxnchv/cl1kwik9i00c615qs8phvcjcp"}>
      <MapboxGL.Camera ref={c => c !== null && setCamera(c)} zoomLevel={16.15} centerCoordinate={[centerLng, centerLat]} />
      <MapboxGL.UserLocation androidRenderMode='compass' renderMode={'native'} showsUserHeadingIndicator={true} onUpdate={() => checkUserPosition()} />
      {plants.map((e: Data, i: number) => (
        <MapboxGL.PointAnnotation ref={c => c !== null && markers?.push(c)} key={e.id} id={e.id} onSelected={() => showPlantInfo(e)} anchor={{ x: 0.5, y: 0.5 }} coordinate={[e.positionLong, e.positionLat]}>
          <View>
            <Image
              source={require("../img/red_marker.png")}
              style={{ width: 33, height: 54 }}
              onLoad={() => markers && markers[i].refresh()}
            />
          </View>
        </MapboxGL.PointAnnotation>
      ))}
    </MapboxGL.MapView>
  }

  return (
    <View style={mapStyle.page}>
      <View style={mapStyle.container}>
        {isEnabled ? loadAccesibleMap() : loadMap()}
      </View>
      {showPosition ?
        (<SwipeUpDown
          itemMini={(show: SwipeUpDownProps) =>
            <View style={[textStyle.miniInfoView]}>
              <Text style={textStyle.baseText}>{actualPlace}</Text>
              <Text style={textStyle.titulo}>UBICACIÓN ACTUAL</Text>
            </View>}
          itemFull={(hide: SwipeUpDownProps) =>
            <View style={textStyle.maxInfoView}>
              <View style={textStyle.ubicacionInfo}>
                <Text style={swipeUpMinimized ? textStyle.baseText : textStyle.baseTextMinimized}>{actualPlace}</Text>
                <Text style={swipeUpMinimized ? textStyle.sci_name : textStyle.sci_name_minimized}>UBICACIÓN ACTUAL</Text>
              </View>
              <View style={textStyle.switchView}>
                <Image source={require('../img/wheelchair.png')} style={textStyle.switchImg}></Image>
                <Text style={textStyle.switchText}>Mostrar caminos accesibles</Text>
                <Switch
                  trackColor={{ false: "#9c9c9c", true: "#9c9c9c" }}
                  thumbColor="#003d88"
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={(value: boolean) => updateAccessibilitySwitch(value)}
                  value={isEnabled}
                />
              </View>
            </View>
          }
          onShowMini={() => setSwipeUpMinimized(true)}
          onShowFull={() => setSwipeUpMinimized(false)}
          animation="spring"
          disableSwipeIcon={false}
          extraMarginTop={450}
          swipeHeight={40}
          style={swipeUpMinimized ? { backgroundColor: '#419E08', height: 80 } : { backgroundColor: '#fff', height: 80 }} // style for swipe
          iconColor={"black"}
          iconSize={30}
        />)
        :
        (<SwipeUpDown
          itemMini={(show: SwipeUpDownProps) =>
            <View style={[textStyle.miniInfoView]}>
              <Text style={textStyle.baseText}>{selectedPlantName}</Text>
              <Text style={textStyle.sci_name}>{selectedPlantScientificName}</Text>
            </View>}
          itemFull={(hide: SwipeUpDownProps) =>
            <View style={textStyle.maxInfoView}>
              <View style={textStyle.nombres}>
                <Text style={swipeUpMinimized ? textStyle.baseText : textStyle.baseTextMinimized}>{selectedPlantName}</Text>
                <Text style={swipeUpMinimized ? textStyle.sci_name : textStyle.sci_name_minimized}>{selectedPlantScientificName}</Text>
              </View>
              <View style={textStyle.descripcion}>
                <ScrollView style={textStyle.scrollView}>
                  <Text style={textStyle.infoText}>{selectedPlantDescription}</Text>
                </ScrollView>
              </View>
              <View style={textStyle.imageButtonsView}>
                {loadPlantImage && (
                  <ActivityIndicator size="large" color="#00ff00" />
                )}
                <Image source={{ uri: selectedPlantImage }} onLoadStart={() => setLoadPlantImage(true)} onLoadEnd={() => setLoadPlantImage(false)} style={{ width: 150, height: 150 }} />
                <View>
                  <Pressable style={buttonStyle.button}
                    onPressOut={() => navigation.navigate('ShowItemItinerary',
                      {
                        info: { position: { _long: selectedPlantLong, _lat: selectedPlantLat }, name: selectedPlantName },
                        userposition: { long: userPositionLong, lat: userPositionLat },
                        id: route.params?.id
                      })}>
                    <Text style={buttonStyle.buttonText}>Iniciar Ruta</Text>
                  </Pressable>
                  <AudioButton
                    audioURL={selectedPlantAudio}
                    navigation={navigation}
                    plantButton={false}
                  />
                  <Pressable style={buttonStyle.buttonMin} onPressOut={() => backToPosition()}>
                    <Text style={buttonStyle.buttonTextMin}>Volver a ver Ubicación</Text>
                  </Pressable>
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
        />)}
    </View>
  );
}

const mapStyle = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    fontFamily: 'Noto Sans'
  },
  container: {
    height: windowHeight,
    width: windowWidth,
    backgroundColor: 'tomato'
  },
  map: {
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
    fontSize: 20,
    marginTop: 7
  },
  baseTextMinimized: {
    color: "white",
    fontSize: 20,
    marginTop: 10
  },
  titulo: {
    color: "gray",
    fontSize: 15,
    marginBottom: 10
  },
  sci_name: {
    fontStyle: 'italic',
    color: "gray",
    fontSize: 14,
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
    padding: 20,
    height: 300
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
  miniInfoView: {
    backgroundColor: "#fff",
    flex: 1,
    alignItems: "center",
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
  },
  switchView: {
    flex: 0.2,
    flexDirection: 'row',
    alignItems: 'center'
  },
  switchText: {
    color: "gray",
    fontSize: 16,
    marginStart: 15,
    marginEnd: 10
  },
  switchImg: {
    height: 25,
    width: 25
  },
  ubicacionInfo: {
    flex: 0.10,
    alignItems: "center",
    backgroundColor: "#419E08",
    width: 400,
    height: 100
  },
  scrollView : {
    height: 40
  }
});

const annotationStyles = StyleSheet.create({
  annotationContainer: {
    alignItems: 'center',
    backgroundColor: 'white',
    borderColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 30 / 2,
    borderWidth: StyleSheet.hairlineWidth,
    height: 30,
    justifyContent: 'center',
    overflow: 'hidden',
    width: 30,
  },
});

export default Map