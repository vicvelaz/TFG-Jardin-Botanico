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


    const [image, setImage] = useState<JSX.Element[]>([]);
    const [paradas, setParadas] = useState<any[]>([]);

    const getDetails = async () => {
        try {
            await db.collection('itinerary').doc(route.params?.id).get()
                .then(async (res: any) => {
                    const info: any = res.data();
                    const arrayParadas: any[] = [];

                    await info.paradas.reduce(async (promise: any, parada: any) => {
                        await promise;
                        const d = await db.collection('plants').doc(parada?._delegate?._key?.path?.segments.slice(-1)[0]).get();
                        const i = d?.data();
                        arrayParadas.push(i);
                        // console.log(i?.media[0]);
                        // arrayImagenesURL.push(i?.media[0]);
                    }, Promise.resolve())

                    console.log(arrayParadas);
                    setParadas(arrayParadas);

                    const arrayImagenesURL: any[] = [];
                    arrayImagenesURL.push(info.media[0]);
                    arrayParadas.forEach((p: any) => {
                        arrayImagenesURL.push(...p.media);
                    });

                    const arrayImagenes: JSX.Element[] = [];
                    console.log('arrayImagenesURL', arrayImagenesURL);
                    arrayImagenesURL.forEach((element: any) => {
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

                    // console.log(image);

                });





        } catch (error) {
            console.log('error getDetails', error);
        }
    }

    const getParadas = async (info: any) => {
        const arrayParadas: any[] = [];
        const arrayImagenesURL: any[] = [];

        // console.log(info.image)
        arrayImagenesURL.push(info.image);

        // info.paradas.forEach(async (parada: any) => {
        //     const d = await db.collection('plants').doc(parada._delegate._key.path.segments.slice(-1)[0]).get();
        //     const i = d?.data();
        //     arrayParadas.push(i);
        //     // console.log(i?.media[0]);
        //     arrayImagenesURL.push(i?.media[0]);
        //     console.log(arrayImagenesURL);
        // })


        for await (const parada of paradas) {
            const d = await db.collection('plants').doc(parada?._delegate?._key?.path?.segments.slice(-1)[0]).get();
            const i = d?.data();
            arrayParadas.push(i);
            // console.log(i?.media[0]);
            arrayImagenesURL.push(i?.media[0]);
        }
        console.log(arrayImagenesURL);

        const arrayImagenes: JSX.Element[] = [];
        arrayImagenesURL.forEach((element: any) => {
            arrayImagenes.push(
                <View >
                    <Image style={styles.imageCarousel} source={{ uri: element }} />
                </View>
            )
        });
        console.log(1);

        setParadas(arrayParadas);
        // console.log(image);
        // console.log(arrayImagenes);
        setImage(arrayImagenes);
        console.log(image);
        return arrayParadas;
    }

    const prepareImg = async () => {

        try {
            const arrayImagenesURL: any[] = [];
            arrayImagenesURL.push(...state.data.media);
            paradas.forEach((p: any) => {
                arrayImagenesURL.push(...p.media);
            });

            const arrayImagenes: JSX.Element[] = [];
            arrayImagenesURL.forEach((element: any) => {
                arrayImagenes.push(
                    <View >
                        <Image style={styles.imageCarousel} source={{ uri: element }} />
                    </View>
                )
            });
            setImage(arrayImagenes);
            setstate({
                isLoading: false,
                data: state.data,
            })
            console.log(2);
        } catch (error) {
            console.log('si es este', error);
        }
    }

    useEffect(() => {
        navigation.setOptions({ title: route.params?.title })
        getDetails()
        // prepareImg();

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
                            data={image}
                            renderItem={({ item, index }: any) => image[index]}
                            sliderWidth={windowWidth - 44}
                            itemWidth={windowWidth - 44}
                            sliderHeight={200}
                            enableMomentum
                            lockScrollWhileSnapping
                        />
                    </View>
                    <View style={styles.bloque}>
                        <View style={styles.rowButtons}>

                            <View style={styles.scroll}>
                                <ScrollView >
                                    <Text style={styles.description}>{state.data.description}</Text>
                                </ScrollView>
                            </View>

                            <FlatList
                                style={styles.lista}
                                data={paradas}
                                renderItem={renderItem}
                                keyExtractor={item => item.id}
                            />

                        </View>

                        <TouchableOpacity
                            style={styles.smallButton}
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
    imageCarousel: {
        height: '100%',
        width: '100%',
        borderRadius: 10,
    },
    bloque: {
        height: windowHeight - 350,
        flexDirection: 'column'
    },
    scroll: {
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
    description: {
        textAlign: 'center',
        fontSize: 17,
        color: 'white',
        marginVertical: 5,
    },
    rowButtons: {
        flexDirection: "row",
        justifyContent: 'space-between',
        marginHorizontal: 20,
        flex: 15,

        // backgroundColor:'blue'
    },
    smallButton: {
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
    },
    paradas: {
        fontSize: 20,
        // alignSelf: 'center',
        fontWeight: 'bold',
        color: 'white',
        // marginTop: 8,
        paddingVertical: 10,
        // backgroundColor:'gray',
        borderColor: 'white',
        borderWidth: 2,
        textAlign: 'center',
        backgroundColor: '#419E08',

        borderRadius: 10,

    }
});

