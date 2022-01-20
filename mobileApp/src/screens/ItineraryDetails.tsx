import React, { useCallback, useEffect, useState } from 'react'

import { Text, View, StyleSheet, Button, TouchableOpacity, ImageBackground, Image, Dimensions, Modal } from 'react-native'
import { StackScreenProps } from '@react-navigation/stack';
import Carousel from 'react-native-snap-carousel';
import { ScrollView } from 'react-native-gesture-handler';
import { db } from '../firebase/firebase-config';
import Sound from 'react-native-sound';

interface Props extends StackScreenProps<any, 'ItineraryDetails'> { };

const windowWidth = Dimensions.get('window').width;
interface Data {
    audio?: any,
    category?: string,
    description?: string,
    name?: string,

}

interface PropState {
    isLoading: boolean,
    data: Data,
}

export const ItineraryDetails = ({ route, navigation }: Props) => {

    const [state, setstate] = useState<PropState>({
        isLoading: true,
        data: {},
    });

    const [image, setImage] = useState<JSX.Element[]>([]);
    const [isPlaying, setIsPlaying] = useState(false);
    const [control_Online, setControl_Online] = useState<Sound>();


    const getDetails = async () => {
        try {
            const data = await db.collection('itinerary').doc(route.params?.id).get();
            // console.log(data.data());
            const info: any = data.data();
            const arrayImagenes: JSX.Element[] = [];
            info.media.forEach((element: any) => {
                arrayImagenes.push(
                    <View >
                        <Image style={styles.imageCarousel} source={{ uri: element }} />
                    </View>
                )
            });
            setImage(arrayImagenes);
            setstate({
                isLoading: false,
                data: info,
            })

            
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        navigation.setOptions({ title: route.params?.title })
        getDetails();

    }, [])


    const playSound_onLine = () => {


        if (isPlaying) {
            control_Online?.stop(() => {
                // control_Online.release();
            });
            setIsPlaying(false);
        } else {

            setIsPlaying(true);
            control_Online?.play(() => {
                control_Online?.release();
            });
        }



    }

    const pausePlayAudio = () => {
        // control_Online.
        // ? audio.play()
        // :audio.pause();
    }


    return (
        <ImageBackground source={require('../img/background-dark.jpg')} resizeMode="cover" style={styles.container}>
            {state.isLoading
                ? <Text style={{ color: 'white', fontSize: 50, textAlign: 'center' }}>Cargando....</Text>
                : <View>
                    <View style={styles.carousel}>
                        <Carousel
                            data={image}
                            renderItem={({ item, index }: any) => image[index]}
                            sliderWidth={windowWidth - 44}
                            itemWidth={windowWidth - 44}
                            sliderHeight={200}
                            enableMomentum
                            lockScrollWhileSnapping
                        />
                    </View>
                    <View style={styles.scroll}>
                        <ScrollView >
                            <Text style={styles.description}>{state.data.description}</Text>
                        </ScrollView>
                    </View>
                    <View style={styles.rowButtons}>
                        {/* {state.data.audio != '' 
                            ? <TouchableOpacity
                                style={styles.smallButton}
                                onPress={playSound_onLine}
                            >
                                <Text style={[styles.buttonText, isPlaying ? { color: 'black' } : { color: 'white' }]}>Play/Pause audio</Text>
                            </TouchableOpacity>

                            : <TouchableOpacity
                                disabled={true}
                                activeOpacity={0}
                                style={{ ...styles.smallButton, opacity: 0 }}
                            // onPress={() => navigation.navigate('PlantsList')}
                            >

                            </TouchableOpacity>
                        } */}

                        <TouchableOpacity
                            style={styles.smallButton}
                        // onPress={() => navigation.navigate('PuntosInteresList')}
                        >
                            <Text style={styles.buttonText}>Mostrar ubicación</Text>
                        </TouchableOpacity>

                    </View>

                    <TouchableOpacity
                        style={styles.button}
                    // onPress={() => navigation.navigate('ItinerariosList')}
                    >
                        <Text style={styles.buttonText}>Iniciar ruta</Text>
                    </TouchableOpacity>
                </View>}
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
    },
    carousel: {
        height: 200,
        marginHorizontal: 20,
        marginVertical: 50,
        borderRadius: 10,
        alignItems: 'center',
        borderColor: 'white',
        borderWidth: 2,
    },
    imageCarousel: {
        height: '100%',
        width: '100%',
        borderRadius: 10,
    },
    scroll: {
        height: 160,
        alignItems: 'center',
        borderColor: 'white',
        borderWidth: 2,
        borderRadius: 10,
        marginBottom: 20,
        backgroundColor: '#419E08',
        marginHorizontal: 20,
    },
    description: {
        textAlign: 'center',
        fontSize: 20,
        color: 'white',
        marginVertical: 5,
    },
    rowButtons: {
        flexDirection: "row",
        justifyContent: 'space-between',
        marginHorizontal: 20,
    },
    smallButton: {
        backgroundColor: '#419E08',
        justifyContent: 'center',
        paddingVertical: 10,
        borderRadius: 10,
        borderColor: 'white',
        borderWidth: 2,
        width: '48%'
    },
    button: {
        backgroundColor: '#419E08',
        justifyContent: 'center',
        paddingVertical: 10,
        borderRadius: 10,
        borderColor: 'white',
        borderWidth: 2,
        marginTop: 20,
        marginHorizontal: 20
    },
    buttonText: {
        fontSize: 17,
        alignSelf: 'center',
        fontWeight: 'bold',
        color: 'white',
        marginHorizontal: 20,
        width: '100%',
        textAlign: 'center'
    }
});

