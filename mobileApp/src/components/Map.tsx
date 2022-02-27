import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import MapboxGL from '@react-native-mapbox-gl/maps';

MapboxGL.setAccessToken('pk.eyJ1IjoicmFteG5jaHYiLCJhIjoiY2t6c2IybzZrNXB2aDMwbzFnbmFsOXptNSJ9.CQqoytOo3yM-pGaCRIGgjw');

interface Props {
  lat: number,
  lng: number,
}

const Map = ({ lat,lng }: Props) => {
    const centerLng : number = -3.690750;
    const centerLat : number = 40.411147;

    return (
      <View style={styles.page}>
        <View style={styles.container}>
          <MapboxGL.MapView style={styles.map} styleURL={"mapbox://styles/ramxnchv/cl006l6ye000614mufkp230xm"}>
            <MapboxGL.Camera zoomLevel={16.15} centerCoordinate={[centerLng,centerLat]} />
            <MapboxGL.UserLocation androidRenderMode='compass' showsUserHeadingIndicator={true} />
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