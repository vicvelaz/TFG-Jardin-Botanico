import React, { useCallback, useEffect, useState } from 'react'

import { Text, View, StyleSheet, Button, TouchableOpacity, ImageBackground, Image, Dimensions, Modal, FlatList } from 'react-native'
import { StackScreenProps } from '@react-navigation/stack';
import Carousel from 'react-native-snap-carousel';
import { ScrollView } from 'react-native-gesture-handler';
import { db } from '../firebase/firebase-config';

interface Props extends StackScreenProps<any, 'ItineraryDetails'> { };

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

interface Data {
    category?: string,
    description?: string,
    name?: string,
    media?: any
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


    const [images, setImages] = useState<JSX.Element[]>([]);
    const [stops, setStops] = useState<any[]>([]);
    const [index, setIndex] = useState(0);

    const getDetails = async () => {
        try {
            await db.collection('itinerary').doc(route.params?.id).get()
                .then(async (res: any) => {
                    const info: any = res.data();
                    const arrayStops: any[] = [];

                    await info.paradas.reduce(async (promise: any, parada: any) => {
                        await promise;
                        const d = await db.collection('plants').doc(parada?._delegate?._key?.path?.segments.slice(-1)[0]).get();
                        const i = d?.data();
                        arrayStops.push(i);
                    }, Promise.resolve())

                    setStops(arrayStops);

                    const arrayImagesURL: any[] = [];
                    arrayImagesURL.push(info.media[0]);
                    arrayStops.forEach((p: any) => {
                        arrayImagesURL.push(...p.media);
                    });

                    const arrayImages: JSX.Element[] = [];
                    arrayImagesURL.forEach((element: any) => {
                        arrayImages.push(
                            <View >
                                <Image style={styles.imageCarousel} source={{ uri: element }} />
                            </View>
                        )
                    });
                    setImages(arrayImages);
                    setstate({
                        isLoading: false,
                        data: info,
                    })


                });


        } catch (error) {
            console.log(error);
        }
    }

  
    useEffect(() => {
        navigation.setOptions({ title: route.params?.title })
        getDetails()

    }, [])



    const Item = ({ title }: any) => (
        <View >
            <Text style={styles.paradas}>{title}</Text>
        </View>
    );

    const renderItem = ({ item }: any) => (
        <Item title={item.name} />
    );


    return (
        <ImageBackground source={require('../img/background-dark.jpg')} resizeMode="cover" style={styles.container}>
            {state.isLoading
                ? <Text style={{ color: 'white', fontSize: 50, textAlign: 'center' }}>Cargando....</Text>
                : <View>
                    <View style={styles.carousel}>
                        <Carousel
                            data={images}
                            renderItem={({ item, index }: any) => images[index]}
                            sliderWidth={windowWidth - 44}
                            itemWidth={windowWidth - 44}
                            sliderHeight={200}
                            enableMomentum
                            onSnapToItem={setIndex}
                            lockScrollWhileSnapping
                        />
                        {images.length > 1 &&
                            <Text style={styles.carouselIndex}>{`${index + 1}/${images.length}`}</Text>
                        }
                    </View>
                    <View style={styles.block}>
                        <View style={styles.row}>

                            <View style={styles.description}>
                                <ScrollView >
                                    <Text style={styles.descriptionText}>{state.data.description}</Text>
                                </ScrollView>
                            </View>

                            <FlatList
                                style={styles.lista}
                                data={stops}
                                renderItem={renderItem}
                                keyExtractor={item => item.id}
                            />

                        </View>

                        <TouchableOpacity
                            style={styles.button}
                        // onPress={() => navigation.navigate('PuntosInteresList')}
                        >
                            <Text style={styles.buttonText}>Iniciar itinerario</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            }
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
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
    imageCarousel: {
        height: '100%',
        width: '100%',
        borderRadius: 10,
    },
    block: {
        height: windowHeight - 350,
        flexDirection: 'column'
    },
    row: {
        flexDirection: "row",
        justifyContent: 'space-between',
        marginHorizontal: 20,
        flex: 15,
    },
    description: {
        flex: 1,
        alignItems: 'center',
        borderColor: 'white',
        borderWidth: 2,
        borderRadius: 10,
        marginBottom: 20,
        backgroundColor: '#419E08',
        marginRight: 20,
    },
    lista: {
        flex: 1,
        marginBottom: 20,
    },
    descriptionText: {
        textAlign: 'center',
        fontSize: 17,
        color: 'white',
        margin: 5,
    },
    paradas: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
        paddingVertical: 10,
        borderColor: 'white',
        borderWidth: 2,
        textAlign: 'center',
        backgroundColor: '#419E08',
        borderRadius: 10,
    },
    button: {
        flex: 1,
        backgroundColor: '#419E08',
        justifyContent: 'center',
        paddingVertical: 10,
        borderRadius: 10,
        borderColor: 'white',
        borderWidth: 2,
        marginBottom: 20,
        marginHorizontal: 20,
    },
    buttonText: {
        fontSize: 20,
        alignSelf: 'center',
        fontWeight: 'bold',
        color: 'white',
        marginHorizontal: 20,
        width: '100%',
        textAlign: 'center'
    }
});

