import { StackScreenProps } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react'
import Map from '../components/Map';

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

interface PropState {
    isLoading: boolean,
    isAudioPlaying: boolean,
    data: Data,
}

export const MapScreen = ({ route, navigation }: Props) => {
    return (
        <Map route={route} navigation={navigation}></Map>
    )
}