import React, { Component } from 'react';
import { StyleSheet, View, Alert, PermissionsAndroid } from 'react-native';
import MapboxGL from '@react-native-mapbox-gl/maps';
import Geolocation from 'react-native-geolocation-service';
import {booleanPointInPolygon,point,polygon} from '@turf/turf';

MapboxGL.setAccessToken('pk.eyJ1IjoicmFteG5jaHYiLCJhIjoiY2t6c2IybzZrNXB2aDMwbzFnbmFsOXptNSJ9.CQqoytOo3yM-pGaCRIGgjw');

const Map = () => {

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
              if(!booleanPointInPolygon(userCoords,perimetro)){
                Alert.alert("Estás fuera del Jardín Botánico","Por favor, camina hacia el jardín para poder utilizar el mapa");
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
            <MapboxGL.Camera zoomLevel={16.15} centerCoordinate={[centerLng,centerLat]} />
            <MapboxGL.UserLocation androidRenderMode='compass' showsUserHeadingIndicator={true} onUpdate={() => checkUserPosition()}/>
          </MapboxGL.MapView>
        </View>
      </View>
    );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },
  container: {
    height: 700,
    width: 400,
    backgroundColor: 'tomato'
  },
  map: {
    flex: 1
  }
});

export default Map