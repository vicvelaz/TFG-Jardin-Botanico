import React, { useEffect, useState } from 'react'
import Map from '../components/Map';
import Geolocation from 'react-native-geolocation-service';
import { Text, PermissionsAndroid } from 'react-native'


export const MapScreen = () => {
    const userposition:number = 2;

    const [userPosition, setUserPosition] = useState<Geolocation.GeoPosition>();
    const [userPositionLat, setUserPositionLat] = useState<number>(40.412386);
    const [userPositionLong, setUserPositionLong] = useState<number>(-3.691977);

    async function requestPermissions(){
        await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
    }

    useEffect(() => {
        requestPermissions();
        Geolocation.getCurrentPosition(
            (position) => {
              setUserPosition(position);
              setUserPositionLat(position.coords.latitude);
              setUserPositionLong(position.coords.longitude);
            },
            (error) => {
              // See error code charts below.
              console.log(error.code, error.message);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
    }, []);

    //Poner <Text>{userPositionLat},{userPositionLong}</Text> para ver mapa de mapbox
    return (
        <Map lat={userPositionLat} lng={userPositionLong}></Map>
    )
}