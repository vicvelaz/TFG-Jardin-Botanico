import React from 'react'

import { Text, View, StyleSheet, Button, TouchableOpacity, ImageBackground, Image, Dimensions } from 'react-native'
import { StackScreenProps } from '@react-navigation/stack';
import Carousel from 'react-native-snap-carousel';

interface Props extends StackScreenProps<any, any> { };

const windowWidth = Dimensions.get('window').width;

export const MainMenu = ({ navigation }: Props) => {

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

    return (
        <View style={styles.container}>
            <ImageBackground source={require('../img/background-dark.jpg')} resizeMode="cover" style={styles.image}>
                <Text style={styles.mainTitle}>Real Jardín Botánico App</Text>
                <View style={styles.events}>
                    <Text style={styles.eventsTitle}>EVENTOS</Text>
                        <Carousel
                            data={data}
                            renderItem={({ item, index }: any) => data[index]}
                            sliderWidth={windowWidth - 44}
                            itemWidth={windowWidth - 44}
                            sliderHeight={200}
                            lockScrollWhileSnapping
                            autoplay
                            autoplayInterval={3000}
                        />
                </View>
                <View style={styles.rowButtons}>
                    <TouchableOpacity
                        style={styles.smallButton}
                        onPress={() => navigation.navigate('PlantsList')}
                    >
                        <Text style={styles.buttonText}>Plantas</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.smallButton}
                        onPress={() => navigation.navigate('PuntosInteresList')}
                    >
                        <Text style={styles.buttonText}>Puntos de interés</Text>
                    </TouchableOpacity>

                </View>

                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate('ItinerariosList')}
                >
                    <Text style={styles.buttonText}>Itinerarios</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate('MapScreen')}
                >
                    <Text style={styles.buttonText}>Mapa</Text>
                </TouchableOpacity>
            </ImageBackground>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',

    },
    image: {
        flex: 1,
        justifyContent: "center"
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
        marginVertical: 50,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        flexDirection: 'column',
        justifyContent: 'space-around',
        alignItems: 'center',
        borderColor:'white',
        borderWidth:2,
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
        borderColor:'white',
        borderWidth:2,
        width:'48%'
    },
    button: {
        backgroundColor: '#419E08',
        justifyContent: 'center',
        paddingVertical: 10,
        borderRadius: 10,
        borderColor:'white',
        borderWidth:2,
        marginTop: 20,
        marginHorizontal: 20
    },
    buttonText: {
        fontSize: 17,
        alignSelf: 'center',
        fontWeight: 'bold',
        color: 'white',
        marginHorizontal: 20,
        width:'100%',
        textAlign:'center'
    }
});

