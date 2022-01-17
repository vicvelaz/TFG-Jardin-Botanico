import React, { useState } from 'react'

import { Text, View, StyleSheet, Button, TouchableOpacity, ImageBackground, Image, Dimensions } from 'react-native'
import { StackScreenProps } from '@react-navigation/stack';
import Carousel from 'react-native-snap-carousel';

import { firebase, db } from '../firebase/firebase-config';
import { QuerySnapshot } from 'firebase/firestore';

interface Props extends StackScreenProps<any, any> { };

const windowWidth = Dimensions.get('window').width;

export const MainMenu = ({ navigation }: Props) => {

    const ejemplo = db.collection('plants');
    // let data: any[] = [];

    // console.log(`Ejemplo:    ${ejemplo.get()}`);

    // console.log(ejemplo);
    //listado de eventos
    const [eventos, setEventos] = useState<string[]>([]);
    const [imagenes, setImagenes] = useState<any[]>([]);

    const obtenerEventos = async () => {

        try {
            console.log('1');
            const data = await db.collection('events').get();
            const arrayData: any = data.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            const arrayImagenes: string[] = [];
            arrayData.forEach((element: any) => {
                arrayImagenes.push(element.image);
            });

            setEventos(arrayImagenes);
            // console.log(`EVENTOS:   ${eventos}`);
            console.log(`ARRAYDATA:   ${arrayData[0].image}`);
            console.log(`ARRAYDATA:   ${arrayData[1].image}`);
            // tratarImagenes();
            // imagenesEventos();
        } catch (error) {
            console.log('error');
        }

    }

    //     const tratarImagenes = async () => {
    //         let newImagenes:any = [];
    //         try {
    //             console.log('Eventos en tratarImagenes'+eventos);
    //             eventos.forEach(async (evento:any) => {
    //                 let ref = firebase.storage().ref(evento.image);
    //                 let url = await ref.getDownloadURL();
    //                 newImagenes.push(url);
    //                 console.log('url: '+url);
    //             });
    //             setImagenes(newImagenes);
    //             console.log('newImagenes: '+newImagenes);
    //         } catch (error) {
    //             console.log('error');
    //         }
    //         console.log('2');
    //     }

    const imagenesEventos = async() => {
        eventos.forEach(element => {
            data.push(
                <View>
                    <Image style={styles.ImgEvent} source={{ uri: element }} />
                </View> 
            );
            setImagenes(data);
        });
      

    }

    // React.useEffect(() => {
    //     obtenerEventos();
    //     // tratarImagenes();
    //     imagenesEventos();
    //     console.log(imagenes);
    //     console.log(`EVENTOS:   ${eventos[0]}`);
    // }, []);





    const foto = (
        <View >
            <Image style={styles.ImgEvent} source={require('../img/expbotanicas.png')} />
        </View>
    )
    const foto1 = (
        <View >
            <Image style={styles.ImgEvent} source={require('../img/naturalezaencendida2021.jpg')} />
        </View>
    )
    const foto2 = (
        <View >
            <Image style={styles.ImgEvent} source={require('../img/rjbnavidad.png')} />
        </View>
    )

     const data = [foto, foto1, foto2];
    // console.log(data);

    return (
        <ImageBackground source={require('../img/background-dark.jpg')} resizeMode="cover" style={styles.backgroundImage}>
            <View style={styles.container}>
                <Text style={styles.mainTitle}>Real Jardín Botánico App</Text>
                <View style={styles.events}>
                    <Text style={styles.eventsTitle}>EVENTOS</Text>
                    <Carousel
                        data={imagenes}
                        renderItem={({ item, index }: any) => imagenes[index]}
                        sliderWidth={windowWidth - 44}
                        itemWidth={windowWidth - 44}
                        sliderHeight={200}
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
    },
    ImgEvent: {
        width: '100%',
        resizeMode: 'contain',
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

