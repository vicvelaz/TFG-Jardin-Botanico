import React, { useEffect, useState } from 'react'
import moment from 'moment'
import { Text, View, StyleSheet, TouchableOpacity, ImageBackground, Image, Dimensions, Alert, LayoutAnimation } from 'react-native'
import { StackScreenProps } from '@react-navigation/stack';
import Carousel from 'react-native-snap-carousel';

import { db } from '../firebase/firebase-config';
import { Overlay } from 'react-native-elements';
import { ScrollView } from 'react-native-gesture-handler';

import * as RNLocalize from "react-native-localize";
import traducir from "../traducir"

interface Props extends StackScreenProps<any, any> { };

interface Data {
    description: string,
    title: string,
    date: string,
}

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export const MainMenu = ({ navigation }: Props) => {


    const [image, setImage] = useState<JSX.Element[]>([]);
    const [visible, setVisible] = useState<boolean>(false);
    const [overlayInfo, setOverlayInfo] = useState<Data>({ title: '', description: '', date: '' })
    const [staticText, setStaticText] = useState<string[]>(['EVENTOS, Plantas, Puntos de interés, Itinerarios, Mapa', 'Identificador de Plantas']);

    //   const onClose = () => setVisible(false);


    const execute = async (title: string, description: string, date: string) => {
        if (RNLocalize.getLocales()[0].languageCode !== 'es') {
            const trad = await traducir([title,description,date]);
            setOverlayInfo({ title: trad[0], description: trad[1], date: trad[2] });

        } else {
            setOverlayInfo({ title: title, description: description, date: date });
        }

        setVisible(!visible);
    }

    const getEvents = async () => {
        const today = new Date();
        try {
            const data = await db.collection('events').where('end_date', '>=', today).orderBy('end_date', 'desc').get();
            const arrayData: any = data.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            const arrayImages: JSX.Element[] = [];
            arrayData.forEach((element: any) => {
                if (moment(today) >= moment.unix(element.start_date.seconds)) {
                    const date = moment.unix(element.start_date.seconds).format('DD/MM/YY') + ' - ' + moment.unix(element.end_date.seconds).format('DD/MM/YY')
                    arrayImages.push(
                        <TouchableOpacity onPress={() => execute(element.name, element.description, date)}>
                            <Image style={styles.ImgEvent}
                                source={{ uri: element.image }}
                            />
                        </TouchableOpacity >
                    )
                }
            });
            setImage(arrayImages);

        } catch (error) {
            console.log(error);
        }

    }

    const getLanguage = async () => {
        if (RNLocalize.getLocales()[0].languageCode != 'es') {
            const trad = await traducir(['EVENTOS', 'Plantas', 'Puntos de interés', 'Itinerarios', 'Mapa', 'Identificador de Plantas'])
            setStaticText(trad);
        } else {
            setStaticText(['EVENTOS', 'Plantas', 'Puntos de interés', 'Itinerarios', 'Mapa', 'Identificador de Plantas'])
        }
    }

    useEffect(() => {
        getEvents();
        getLanguage();
    }, []);


    return (
        <ImageBackground source={require('../img/background-dark.jpg')} resizeMode="cover" style={styles.backgroundImage}>
            <View style={styles.container}>
                <Image source={require('../img/logo.png')} style={styles.logo}></Image>
                <View style={styles.events}>
                    {/*EVENTOS*/}
                    <Text style={styles.eventsTitle}>{staticText[0]}</Text>
                    <Carousel
                        style={{ backgroundColor: 'red' }}
                        data={image}
                        renderItem={({ item, index }: any) => image[index]}
                        sliderWidth={windowWidth - 44}
                        itemWidth={windowWidth - 44}
                        sliderHeight={200}
                        enableMomentum
                        lockScrollWhileSnapping
                    />
                </View>
                <Overlay
                    visible={visible}
                    isVisible={visible}
                    onBackdropPress={() => execute('', '', '')}
                    overlayStyle={styles.overlay}
                >
                    <Text style={styles.overlayTitle}>{overlayInfo.title}</Text>
                    <Text style={styles.overlayDate}>{overlayInfo.date}</Text>
                    <ScrollView scrollToOverflowEnabled>
                        <Text style={styles.overlayText}>{overlayInfo.description}</Text>
                    </ScrollView>
                </Overlay>
                <View>
                    <View style={styles.rowButtons}>
                        <TouchableOpacity
                            style={styles.smallButton}
                            onPress={() => navigation.navigate('List', { title: 'Lista de plantas', type: 'plants' })}
                        >
                            {/*Plantas*/}
                            <Text style={styles.buttonText}>{staticText[1]}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.smallButton}
                            onPress={() => navigation.navigate('List', { title: 'Lista de puntos de interés', type: 'place' })}
                        >
                            {/*Puntos de interés*/}
                            <Text style={styles.buttonText}>{staticText[2]}</Text>
                        </TouchableOpacity>

                    </View>

                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => navigation.navigate('List', { title: 'Lista de itinerarios', type: 'itinerary' })}
                    >
                        {/*Itinerarios*/} 
                        <Text style={styles.buttonText}>{staticText[3]}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => navigation.navigate('MapScreen')}
                    >   
                        {/*Mapa*/} 
                        <Text style={styles.buttonText}>{staticText[4]}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => navigation.navigate('CameraScreen')}
                    >   
                        {/*Identificador de Plantas*/} 
                        <Text style={styles.buttonText}>{staticText[5]}</Text>
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
    logo: {
        width: 354,
        height: 91,
        alignSelf: 'center',
        marginTop: 30,
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
        paddingVertical: 3
    },
    ImgEvent: {
        height: '100%',
        maxHeight: 65,
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
    },
    overlay: {
        backgroundColor: '#419E08',
        maxHeight: windowHeight / 3,
        // height:windowHeight/4,
        alignSelf: 'stretch',
        marginHorizontal: 20,
        borderRadius: 10,
        flexDirection: 'column',
        justifyContent: 'space-around',
        alignItems: 'center',
        borderColor: 'white',
        borderWidth: 2,
        padding: 0,
        paddingBottom: 10,
    },
    overlayTitle: {
        color: 'white',
        textAlign: 'center',
        fontSize: 25,
        marginTop: 10,
        marginHorizontal: 5,
        // backgroundColor:'blue',
        fontWeight: 'bold'
    },
    overlayDate: {
        marginVertical: 5
    },
    overlayText: {
        color: 'white',
        fontSize: 16,
        // width: 200,
        // backgroundColor:'red',
        // marginBottom:15,
        marginHorizontal: 10,
        textAlign: 'justify',

    }
});

