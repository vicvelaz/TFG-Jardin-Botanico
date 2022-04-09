import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, ImageBackground, Image, Dimensions, Modal,PermissionsAndroid } from 'react-native'
import { StackScreenProps } from '@react-navigation/stack';
import Carousel from 'react-native-snap-carousel';
import { ScrollView } from 'react-native-gesture-handler';
import { db } from '../firebase/firebase-config';
import { AudioButton } from '../components/AudioButton';
import Geolocation from 'react-native-geolocation-service';

interface Props extends StackScreenProps<any, 'PlantDetails'> { };

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

interface Data {
    audio?: any,
    category?: string,
    description?: string,
    name?: string,
    scientific_name?: string,
    position?: any
    otherServices?:boolean,
}

interface PropState {
    isLoading: boolean,
    isAudioPlaying: boolean,
    data: Data,
}

export const PlantDetails = ({ route, navigation }: Props) => {

    const [state, setstate] = useState<PropState>({
        isLoading: true,
        isAudioPlaying: false,
        data: {},
    });

    const [image, setImage] = useState<JSX.Element[]>([]);

    const [index, setIndex] = useState(0);

    const [userPositionLat, setUserPositionLat] = React.useState<number>(40.411147);
    const [userPositionLong, setUserPositionLong] = React.useState<number>(-3.690750);


    const getDetails = async () => {
        try {
            const data = await db.collection('plants').doc(route.params?.id).get();

            const info: any = data.data();
            const arrayImages: JSX.Element[] = [];

            console.log(info);

            if (info.media == undefined || info.media == '') {
                arrayImages.push(
                    <View >
                        <Image style={styles.image} source={require('../img/image-not-found.jpg')} />
                    </View>
                )
            }
            else {
                info.media.forEach((element: any) => {
                    arrayImages.push(
                        <View >
                            <Image style={styles.image} source={{ uri: element }} />
                        </View>
                    )
                });
            }

            setImage(arrayImages);
            setstate({
                isLoading: false,
                isAudioPlaying: false,
                data: info,
            })

        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        navigation.setOptions({ title: route.params?.title });
        requestPermissions();
        checkUserPosition();
        getDetails();
    }, [])

    async function requestPermissions() {
        await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
    }

    const checkUserPosition = () => {
        Geolocation.getCurrentPosition(
            (position) => {
                setUserPositionLat(position.coords.latitude);
                setUserPositionLong(position.coords.longitude);
            },
            (error) => {
                // See error code charts below.
                console.log(error.code, error.message);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
    }



    return (
        <ImageBackground source={require('../img/background-dark.jpg')} resizeMode="cover" style={styles.container}>
            {state.isLoading
                ? <Text style={{ color: 'white', fontSize: 50, textAlign: 'center' }}>Cargando....</Text>
                : <View>
                    {
                        (state.data.scientific_name != '' && state.data.scientific_name != undefined ) &&
                        <Text style={styles.scientific_name} >{state.data.scientific_name}</Text>
                    }

                    <View style={styles.carousel}>
                        <Carousel
                            data={image}
                            renderItem={({ item, index }: any) => image[index]}
                            sliderWidth={windowWidth - 44}
                            itemWidth={windowWidth - 44}
                            sliderHeight={200}
                            enableMomentum
                            lockScrollWhileSnapping
                            onSnapToItem={setIndex}
                            style={{ zIndex: -1 }}
                        />
                        {image.length > 1 &&
                            <Text style={styles.carouselIndex}>{`${index + 1}/${image.length}`}</Text>
                        }
                    </View>
                    <View style={[styles.block, (state.data.scientific_name != '' && state.data.scientific_name != undefined ) ? { height: windowHeight - 405 } : { height: windowHeight - 350 }]}>
                      
                      {!state.data.otherServices &&
                        <View style={styles.description}>
                            <ScrollView >
                                <Text style={styles.descriptionText}>{state.data.description}</Text>
                            </ScrollView>
                        </View>

                      } 

                        <View style={[!state.data.otherServices &&  styles.rowButtons]}>
                        {!state.data.otherServices &&
                            <AudioButton
                                audioURL={state.data.audio}
                                navigation={navigation}
                                plantButton={true}
                            />
                        }
                            <TouchableOpacity
                            style={[state.data.otherServices? styles.button : styles.smallButton]}
                                onPress={() => navigation.navigate('ShowItemPosition',{ info: state.data, id:route.params?.id })}
                            >
                                <Text style={styles.buttonText}>Mostrar ubicación</Text>
                            </TouchableOpacity>

                        </View>

                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => navigation.navigate('ShowItemItinerary',{ info: state.data, userposition: {long: userPositionLong, lat: userPositionLat}, id:route.params?.id })}
                        >
                            <Text style={styles.buttonText}>Iniciar ruta</Text>
                        </TouchableOpacity>
                    </View>
                </View>}
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
    },
    scientific_name: {
        backgroundColor: '#419E08',
        justifyContent: 'center',
        paddingVertical: 5,
        borderRadius: 10,
        borderColor: 'white',
        borderWidth: 2,
        marginTop: 20,
        marginHorizontal: 20,

        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center'
    },
    carouselIndex: {
        position: 'absolute',
        bottom: 0,
        color: 'white',
        fontSize: 15,
        textShadowColor: '#419E08',
        textShadowOffset: { width: -2, height: 2 },
        textShadowRadius: 10,
        backgroundColor: 'rgba(128,128,128, 0.85)',
        paddingHorizontal: 5,
        paddingVertical: 1,
        marginBottom: 2,
        borderRadius: 50,
    },
    carousel: {
        height: 250,
        marginHorizontal: 20,
        marginTop: 20,
        marginBottom: 20,
        borderRadius: 10,
        alignItems: 'center',
        borderColor: 'white',
        borderWidth: 2,
    },
    image: {
        height: '100%',
        width: '100%',
        borderRadius: 10,
    },
    block: {
        flexDirection: 'column',
    },
    description: {
        alignItems: 'center',
        borderColor: 'white',
        borderWidth: 2,
        borderRadius: 10,
        marginBottom: 20,
        backgroundColor: '#419E08',
        marginHorizontal: 20,
        flex: 1,
    },
    descriptionText: {
        textAlign: 'justify',
        fontSize: 20,
        color: 'white',
        margin: 10,

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
        margin: 20,
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

