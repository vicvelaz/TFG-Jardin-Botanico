import React, { useEffect, useState } from 'react'

import { Text, View, StyleSheet, Button, TouchableOpacity, ImageBackground, Image, Dimensions } from 'react-native'
import { StackScreenProps } from '@react-navigation/stack';
import Carousel from 'react-native-snap-carousel';

import { firebase, db } from '../firebase/firebase-config';



interface Props extends StackScreenProps<any, any> { };

const windowWidth = Dimensions.get('window').width;

export const MainMenu = ({ navigation }: Props) => {


    const [image, setImage] = useState<JSX.Element[]>([]);


    const obtenerEventos = async () => {

        try {
            const data = await db.collection('events').get();
            const arrayData: any = data.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            const arrayImagenes: JSX.Element[] = [];
            arrayData.forEach((element: any) => {
                arrayImagenes.push(
                    <View>
                        <Image style={styles.ImgEvent} source={{ uri: element.image }} />
                    </View>
                )
            });
            setImage(arrayImagenes);

        } catch (error) {
            console.log('error');
        }

    }


    useEffect(() => {
        obtenerEventos();
    }, []);



 

    return (
        <ImageBackground source={require('../img/background-dark.jpg')} resizeMode="cover" style={styles.backgroundImage}>
            <View style={styles.container}>
                <Text style={styles.mainTitle}>Real Jardín Botánico App</Text>
                <View style={styles.events}>
                    <Text style={styles.eventsTitle}>EVENTOS</Text>
                    <Carousel
                    style={{backgroundColor:'red'}}
                        data={image}
                        renderItem={({ item, index }: any) => image[index]}
                        sliderWidth={windowWidth - 44}
                        itemWidth={windowWidth - 44}
                        sliderHeight={200}
                        enableMomentum
                        lockScrollWhileSnapping
                    autoplay
                    autoplayInterval={3000}
                    />
                </View>
                <View>
                    <View style={styles.rowButtons}>
                        <TouchableOpacity
                            style={styles.smallButton}
                            onPress={() => navigation.navigate('List', { title: 'Lista de plantas', type: 'plants' })}
                        >
                            <Text style={styles.buttonText}>Plantas</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.smallButton}
                            onPress={() => navigation.navigate('List', { title: 'Lista de puntos de interés', type: 'place' })}
                        >
                            <Text style={styles.buttonText}>Puntos de interés</Text>
                        </TouchableOpacity>

                    </View>

                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => navigation.navigate('List', { title: 'Lista de itinerarios', type: 'itinerary' })}
                    >
                        <Text style={styles.buttonText}>Itinerarios</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => navigation.navigate('MapScreen')}
                    >
                        <Text style={styles.buttonText}>Mapa</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ImageBackground>

    )
}

const styles = StyleSheet.create({

    backgroundImage: {
        flex: 1,
    },
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-evenly'
    },
    mainTitle: {
        textAlign: 'center',
        fontSize: 35,
        fontWeight: 'bold',
        color: 'white',
    },
    events: {
        backgroundColor: '#419E08',
        height: 122,
        alignSelf: 'stretch',
        marginHorizontal: 20,
        // marginVertical: 50,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        flexDirection: 'column',
        justifyContent: 'space-around',
        alignItems: 'center',
        borderColor: 'white',
        borderWidth: 2,
    },
    eventsTitle: {
        textAlign: 'center',
        fontSize: 35,
        fontWeight: 'bold',
        color: 'white',
        textAlignVertical: 'center',
        paddingVertical:3
    },
    ImgEvent: {
        height: '100%',
        maxHeight:65,
        resizeMode:'contain',
        
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

