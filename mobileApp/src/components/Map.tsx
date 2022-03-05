import React from 'react';
import { StyleSheet, View, Alert, PermissionsAndroid, Text } from 'react-native';
import MapboxGL from '@react-native-mapbox-gl/maps';
import Geolocation from 'react-native-geolocation-service';
import {booleanPointInPolygon,point,polygon} from '@turf/turf';
import { db } from '../firebase/firebase-config';

MapboxGL.setAccessToken('pk.eyJ1IjoicmFteG5jaHYiLCJhIjoiY2t6c2IybzZrNXB2aDMwbzFnbmFsOXptNSJ9.CQqoytOo3yM-pGaCRIGgjw');

interface Data {
  id: string,
  name?: string,
  scientific_name?: string,
  description?: string,
  positionLat?: any,
  positionLong?: any,
  image: string
}

const Map = () => {

    //constantes del jardin con coordenadas fijas
    const zoomMinimo : number = 18;
    const centerLng : number = -3.690750;
    const centerLat : number = 40.411147;
    const perimetro = polygon([[
      [-3.6925971508026127,40.41231565042066],
      [-3.6919802427291875,40.40973422067125],
      [-3.6890941858291626,40.40976689761599],
      [-3.68891716003418,40.409893520626945],
      [-3.6890029907226562,40.41200114608072],
      [-3.6904352903366084,40.41233607272957],
      [-3.6904406547546387,40.41256888661311],
      [-3.690462112426758,40.41262198440359],
      [-3.691293597221374,40.41258930884518],
      [-3.691293597221374,40.41247085981296],
      [-3.6925971508026127,40.41231565042066]
    ]]);
    const terrazaCuadros = polygon([[
      [-3.6924737691879277,40.412262552388476],
      [-3.6918890476226807,40.40973830529021],
      [-3.690934181213379,40.40981591300332],
      [-3.6915135383605957,40.412393255161554],
      [-3.6924737691879277,40.412262552388476]
    ]]);
    const terrazaEscuelas = polygon([[
      [-3.6908376216888428,40.409852674520415],
      [-3.6904406547546387,40.40996704355622],
      [-3.690054416656494,40.41021211940711],
      [-3.690510392189026,40.412180863026386],
      [-3.6913901567459106,40.41241367744691],
      [-3.6908376216888428,40.409852674520415]
    ]]);
    const planoFlor = polygon([[
      [-3.690043687820434,40.41020395022645],
      [-3.6894160509109497,40.410571562373974],
      [-3.6897593736648564,40.4120256529652],
      [-3.690505027770996,40.41218494749685],
      [-3.690043687820434,40.41020395022645]
    ]]);

    const terrazaBonsais = polygon([[
      [-3.689311444759369,40.41193375210237],
      [-3.6890673637390137,40.41086973519647],
      [-3.688962757587433,40.41084727016682],
      [-3.689040541648865,40.411966427979095],
      [-3.6892604827880855,40.411988892635144],
      [-3.689311444759369,40.41193375210237]
    ]]);

    //terrazas
    const terracelist = [terrazaCuadros,terrazaEscuelas,planoFlor,terrazaBonsais];
    const terraces = ["Terraza de los Cuadros", "Terraza de las Escuelas", "Plano de la Flor", "Terraza de los Bonsáis"];

    //mapa y listas
    const [map,setMap] = React.useState<MapboxGL.MapView>();
    const [plants, setPlants] = React.useState<any>([]);

    //estados del mapa y del user
    const [userPositionLat, setUserPositionLat] = React.useState<number>(40.412386);
    const [userPositionLong, setUserPositionLong] = React.useState<number>(-3.691977);
    const [alertShown, setAlertShown] = React.useState<boolean>();
    const [actualPlace, setActualPlace] = React.useState<string>();
    const [showItemMarkers, setShowItemMarkers] = React.useState<boolean>(false);

    React.useEffect(() => {
        requestPermissions();
        checkUserPosition();
        obtenerPlantas();
    }, []);

    const obtenerPlantas = async () => {
      const data = await db.collection('plants').where('type', '==', 'plant').get();
      const arrayData: any = data.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const arrayPlants: Data[] = [];
      arrayData.forEach((element: any) => {
        arrayPlants.push({ id: element.id, name: element.name, scientific_name: element.scientific_name, description: element.description,
        positionLat:element.position._lat, positionLong:element.position._long, image: element.media[0] });
      });
      setPlants(arrayPlants);
    }

    async function requestPermissions(){
      await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
    }

    const checkUserPosition = () => {
      Geolocation.getCurrentPosition(
            (position) => {
              setUserPositionLat(position.coords.latitude);
              setUserPositionLong(position.coords.longitude);
              const userCoords = point([position.coords.longitude,position.coords.latitude]);
              if(!booleanPointInPolygon(userCoords,perimetro) && !alertShown){
                setActualPlace("Fuera del Jardín");
                Alert.alert("Estás fuera del Jardín Botánico","Por favor, camina hacia el jardín para poder utilizar el mapa",
                [{ text: "OK", onPress: () => setAlertShown(false) }]);
                setAlertShown(true);
              }else{
                
                const i = terracelist.findIndex(t => booleanPointInPolygon(userCoords,t));
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

    const updateZoom = async () => {
      if(map!== undefined){
        const zoom = await map.getZoom();
        if(zoom > zoomMinimo){
          setShowItemMarkers(true);
        }else{
          setShowItemMarkers(false);
        }
      }
    }

    return (
      <View style={styles.page}>
        <View style={styles.container}>
          <MapboxGL.MapView ref={c => c!== null && setMap(c)} onRegionDidChange={() => updateZoom()} style={styles.map} styleURL={"mapbox://styles/ramxnchv/cl006l6ye000614mufkp230xm"}>
            <MapboxGL.Camera zoomLevel={16.15} centerCoordinate={[centerLng,centerLat]} />
            <MapboxGL.UserLocation androidRenderMode='compass' renderMode={'native'} showsUserHeadingIndicator={true} onUpdate={() => checkUserPosition()}/>
            {showItemMarkers && plants.map((e: Data) => (
              <MapboxGL.PointAnnotation key={e.id} id={e.id} anchor={{x:0.5,y:0.5}} coordinate={[e.positionLong,e.positionLat]}></MapboxGL.PointAnnotation>
            ))}
          </MapboxGL.MapView>
        </View>
        <View style={textStyle.viewTextStyle}>
          <Text style={textStyle.titulo}>UBICACIÓN ACTUAL: </Text>
          <Text style={textStyle.baseText}>{actualPlace}</Text>
        </View>
      </View>
    );
}

const textStyle = StyleSheet.create({
  baseText: {
    color: "black",
    fontSize: 20
  },
  titulo: {
    fontSize: 15
  },
  viewTextStyle: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
    height: 500,
    width: 400,
  }
});

const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },
  container: {
    height: 600,
    width: 400,
    backgroundColor: 'tomato'
  },
  map: {
    flex: 1
  }
});

export default Map