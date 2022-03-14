import React from 'react';
import { StyleSheet, View, Alert, PermissionsAndroid, Text, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
import MapboxGL, {Logger} from '@react-native-mapbox-gl/maps';
import Geolocation from 'react-native-geolocation-service';
import { booleanPointInPolygon, point, polygon } from '@turf/turf';
import { db } from '../firebase/firebase-config';
import SwipeUpDown, { SwipeUpDownProps } from 'react-native-swipe-up-down';
import { AudioButton } from '../components/AudioButton';
import { StackScreenProps } from '@react-navigation/stack';
import { ScrollView } from 'react-native-gesture-handler';

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

const Map = ({ route, navigation }: Props) => {

  //constantes del jardin con coordenadas fijas
  const zoomMinimo: number = 18;
  const centerLng: number = -3.690750;
  const centerLat: number = 40.411147;
  const perimetro = polygon([[
    [-3.6925971508026127, 40.41231565042066],
    [-3.6919802427291875, 40.40973422067125],
    [-3.6890941858291626, 40.40976689761599],
    [-3.68891716003418, 40.409893520626945],
    [-3.6890029907226562, 40.41200114608072],
    [-3.6904352903366084, 40.41233607272957],
    [-3.6904406547546387, 40.41256888661311],
    [-3.690462112426758, 40.41262198440359],
    [-3.691293597221374, 40.41258930884518],
    [-3.691293597221374, 40.41247085981296],
    [-3.6925971508026127, 40.41231565042066]
  ]]);
  const terrazaCuadros = polygon([[
    [-3.6924737691879277, 40.412262552388476],
    [-3.6918890476226807, 40.40973830529021],
    [-3.690934181213379, 40.40981591300332],
    [-3.6915135383605957, 40.412393255161554],
    [-3.6924737691879277, 40.412262552388476]
  ]]);
  const terrazaEscuelas = polygon([[
    [-3.6908376216888428, 40.409852674520415],
    [-3.6904406547546387, 40.40996704355622],
    [-3.690054416656494, 40.41021211940711],
    [-3.690510392189026, 40.412180863026386],
    [-3.6913901567459106, 40.41241367744691],
    [-3.6908376216888428, 40.409852674520415]
  ]]);
  const planoFlor = polygon([[
    [-3.690043687820434, 40.41020395022645],
    [-3.6894160509109497, 40.410571562373974],
    [-3.6897593736648564, 40.4120256529652],
    [-3.690505027770996, 40.41218494749685],
    [-3.690043687820434, 40.41020395022645]
  ]]);

  const terrazaBonsais = polygon([[
    [-3.689311444759369, 40.41193375210237],
    [-3.6890673637390137, 40.41086973519647],
    [-3.688962757587433, 40.41084727016682],
    [-3.689040541648865, 40.411966427979095],
    [-3.6892604827880855, 40.411988892635144],
    [-3.689311444759369, 40.41193375210237]
  ]]);

  //terrazas
  const terracelist = [terrazaCuadros, terrazaEscuelas, planoFlor, terrazaBonsais];
  const terraces = ["Terraza de los Cuadros", "Terraza de las Escuelas", "Plano de la Flor", "Terraza de los Bonsáis"];

  const swipeUpDownRef = React.useRef();

  //mapa y listas
  const [map, setMap] = React.useState<MapboxGL.MapView>();
  const [camera, setCamera] = React.useState<MapboxGL.Camera>();
  const [plants, setPlants] = React.useState<any>([]);

  //estados del mapa y del user
  const [userPositionLat, setUserPositionLat] = React.useState<number>(40.412386);
  const [userPositionLong, setUserPositionLong] = React.useState<number>(-3.691977);
  const [alertShown, setAlertShown] = React.useState<boolean>();
  const [actualPlace, setActualPlace] = React.useState<string>();
  const [showItemMarkers, setShowItemMarkers] = React.useState<boolean>(false);
  const [showPosition, setShowPosition] = React.useState<boolean>(true);

  //estados planta seleccionada para view con info
  const [selectedPlantName, setSelectedPlantName] = React.useState<string>();
  const [selectedPlantScientificName, setSelectedPlantScientificName] = React.useState<string>();
  const [selectedPlantDescription, setSelectedDescription] = React.useState<string>();
  const [selectedPlantImage, setSelectedPlantImage] = React.useState<string>();
  const [selectedPlantAudio, setSelectedPlantAudio] = React.useState<any>();
  const [swipeUpMinimized, setSwipeUpMinimized] = React.useState<boolean>(true);
  const [loadPlantImage, setLoadPlantImage] = React.useState<boolean>(false);

  //useEffect al cargar el componente
  React.useEffect(() => {
    requestPermissions();
    checkUserPosition();
    obtenerPlantas();
    disableLogger();
  }, []);

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
        if (!booleanPointInPolygon(userCoords, perimetro) && !alertShown) {
          setActualPlace("Fuera del Jardín");
          Alert.alert("Estás fuera del Jardín Botánico", "Por favor, camina hacia el jardín para poder utilizar el mapa",
            [{ text: "OK", onPress: () => setAlertShown(false) }]);
          setAlertShown(true);
        } else {
          const i = terracelist.findIndex(t => booleanPointInPolygon(userCoords, t));
          setActualPlace(terraces[i]);
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
  }

  //volver de la informacion de la planta en swipeup a informacion de ubicacion del usuario
  const backToPosition = () => {
    setShowPosition(true);
    camera?.flyTo([userPositionLong,userPositionLat]);
  }

  return (
    <View style={mapStyle.page}>
      <View style={mapStyle.container}>
        <MapboxGL.MapView ref={c => c !== null && setMap(c)} onPress={() => backToPosition()} onRegionDidChange={() => updateZoom()} style={mapStyle.map} styleURL={"mapbox://styles/ramxnchv/cl006l6ye000614mufkp230xm"}>
          <MapboxGL.Camera ref={c => c !== null && setCamera(c)} zoomLevel={16.15} centerCoordinate={[centerLng, centerLat]} />
          <MapboxGL.UserLocation androidRenderMode='compass' renderMode={'native'} showsUserHeadingIndicator={true} onUpdate={() => checkUserPosition()} />
          {showItemMarkers && plants.map((e: Data) => (
            <MapboxGL.PointAnnotation key={e.id} id={e.id} onSelected={() => showPlantInfo(e)} anchor={{ x: 0.5, y: 0.5 }} coordinate={[e.positionLong, e.positionLat]}></MapboxGL.PointAnnotation>
          ))}
        </MapboxGL.MapView>
      </View>
      {showPosition ?
        (<SwipeUpDown
	        itemMini={(show : SwipeUpDownProps) => 
            <View style={[textStyle.miniInfoView]}>
              <Text style={textStyle.baseText}>{actualPlace}</Text>
              <Text style={textStyle.titulo}>UBICACIÓN ACTUAL </Text>
            </View>}
	        itemFull={(hide : SwipeUpDownProps) =>
            <View style={[textStyle.miniInfoView]}>
              <Text style={textStyle.baseText}>{actualPlace}</Text>
              <Text style={textStyle.titulo}>UBICACIÓN ACTUAL </Text>
            </View>
          }
	        onShowMini={() => setSwipeUpMinimized(true)}
	        onShowFull={() => setSwipeUpMinimized(false)}
	        animation="spring"
	        disableSwipeIcon={false}
	        extraMarginTop={200}
          swipeHeight={40}
	        style={swipeUpMinimized ? {backgroundColor: '#419E08', height: 80}:{backgroundColor: '#fff', height: 80}} // style for swipe
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
                  <TouchableOpacity style={buttonStyle.button}>
                    <Text style={buttonStyle.buttonText}>Iniciar Ruta</Text>
                  </TouchableOpacity>
                  <AudioButton
                    audioURL={selectedPlantAudio}
                    navigation={navigation}
                    plantButton={false}
                  />
                  <TouchableOpacity style={buttonStyle.buttonMin}>
                    <Text style={buttonStyle.buttonTextMin} onPress={() => backToPosition()}>Volver a ver Ubicación</Text>
                  </TouchableOpacity>
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
    height: 800,
    width: 400,
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
    marginTop: 10
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
  }
});

export default Map