import React from 'react'
import Map from '../components/Map';
import { StyleSheet, View, Alert, Text, PermissionsAndroid } from 'react-native';
import MapboxGL from '@react-native-mapbox-gl/maps';
import Geolocation from 'react-native-geolocation-service';
import { booleanPointInPolygon, point, polygon } from '@turf/turf';
import { StackScreenProps } from '@react-navigation/stack';

interface Props extends StackScreenProps<any, 'ShowItemPosition'> { };

export const ShowItemPosition = ({ route, navigation }: Props) => {
    //constantes del jardin con coordenadas fijas
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

    //estados para la posicion del usuario
    const [userPositionLat, setUserPositionLat] = React.useState<number>(40.412386);
    const [userPositionLong, setUserPositionLong] = React.useState<number>(-3.691977);
    const [alertShown, setAlertShown] = React.useState<boolean>();
    const [itemName, setItemName] = React.useState<string>();
    const [itemTerrace, setItemTerrace] = React.useState<string>();
    const [itemLng,setItemLng] = React.useState<number>(-3.691977);
    const [itemLat,setItemLat] = React.useState<number>(40.412386);

    React.useEffect(() => {
        requestPermissions();
        checkUserPosition();
    }, []);

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
                Alert.alert("Estás fuera del Jardín Botánico","Por favor, camina hacia el jardín para poder utilizar el mapa",
                [{ text: "OK", onPress: () => setAlertShown(false) }]);
                setAlertShown(true);
              }else{
                setItemName(route.params?.info.name);
                setItemTerrace(route.params?.info.terrace);
                setItemLng(route.params?.info.position._long);
                setItemLat(route.params?.info.position._lat);
              }
            },
            (error) => {
              // See error code charts below.
              console.log(error.code, error.message);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    }

    return (
      <View style={styles.page}>
        <View style={styles.container}>
          <MapboxGL.MapView style={styles.map} styleURL={"mapbox://styles/ramxnchv/cl006l6ye000614mufkp230xm"}>
            <MapboxGL.Camera zoomLevel={17.5} centerCoordinate={[itemLng,itemLat]} />
            <MapboxGL.PointAnnotation id={route.params?.id} anchor={{x:0.5,y:0.5}}  coordinate={[itemLng,itemLat]}></MapboxGL.PointAnnotation>
            <MapboxGL.UserLocation androidRenderMode='compass' renderMode={'native'} visible={false} showsUserHeadingIndicator={true} onUpdate={() => checkUserPosition()}/>
          </MapboxGL.MapView>
        </View>
        <View style={textStyle.viewTextStyle}>
            <Text style={textStyle.baseText}>{itemName}</Text>
            <Text style={textStyle.titulo}>{itemTerrace}</Text>
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