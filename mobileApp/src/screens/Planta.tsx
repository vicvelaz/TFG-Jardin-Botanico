import React from 'react'

import { Text, View, StyleSheet, Button, TouchableOpacity, ImageBackground, Image, Dimensions } from 'react-native'
import { StackScreenProps } from '@react-navigation/stack';
import Carousel from 'react-native-snap-carousel';
import { ScrollView } from 'react-native-gesture-handler';

interface Props extends StackScreenProps<any, any> { };

const windowWidth = Dimensions.get('window').width;

export const Planta = ({ navigation }: Props) => {

    const foto = (
        <View >
            <Image style={styles.imagenEvento} source={require('../img/rosa.jpg')} />
        </View>
    )

    const data = [foto, foto, foto];

    

    return (
        <View style={styles.container}>
            <ImageBackground source={require('../img/background-dark.jpg')} resizeMode="cover" style={styles.image}>
                <View style={styles.events}>
                        <Carousel
                            data={data}
                            renderItem={({ item, index }: any) => data[index]}
                            sliderWidth={windowWidth - 44}
                            itemWidth={windowWidth - 44}
                            sliderHeight={200}
                            enableMomentum
                            lockScrollWhileSnapping
                        />
                </View>
                <View style={styles.scroll}>
                <ScrollView >
                    <Text style={styles.mainTitle}>El género Rosa está compuesto por un conocido grupo de arbustos generalmente espinosos y floridos representantes principales de la familia de las rosáceas. Se denomina rosa a la flor de los miembros de este género y rosal a la planta. El número de especies ronda las cien, la mayoría originarias de Asia y un reducido número nativas de Europa, Norteamérica y África noroccidental. Tanto especies como cultivares e híbridos se cultivan como ornamentales por la belleza y fragancia de su flor; pero también para la extracción de aceite esencial, utilizado en perfumería y cosmética, usos medicinales (fitoterapia) y gastronómicos.</Text>
                </ScrollView>
                </View>
                <View style={styles.rowButtons}>
                    <TouchableOpacity
                        style={{ ...styles.button, width: '48%' }}
                    // onPress={() => navigation.navigate('PlantsList')}
                    >
                        <Text style={styles.buttonText}>Escuchar audio</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{ ...styles.button, width: '48%' }}
                    // onPress={() => navigation.navigate('PuntosInteresList')}
                    >
                        <Text style={{ ...styles.buttonText, width: '100%', textAlign: 'center' }}>Mostrar ubicación</Text>
                    </TouchableOpacity>

                </View>

                <TouchableOpacity
                    style={{ ...styles.button, marginTop: 20, marginHorizontal: 20 }}
                // onPress={() => navigation.navigate('ItinerariosList')}
                >
                    <Text style={styles.buttonText}>Ir a la planta</Text>
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
    },
    imagenEvento:{
        height:'100%', 
        width:'100%',
        borderRadius: 10,
    },
    events: {
        height: 200,
        marginHorizontal: 20,
        marginVertical: 50,
        borderRadius: 10,
        alignItems: 'center',
        borderColor: 'white',
        borderWidth: 2,
    },
    mainTitle: {
        textAlign: 'center',
        fontSize: 20,
        color: 'white',
        marginVertical:5,
    },
    scroll: {
        height:160,
        alignItems: 'center',
        borderColor: 'white',
        borderWidth: 2,
        borderRadius: 10,
        marginBottom: 20,
        backgroundColor: '#419E08',
        marginHorizontal: 20,
    },
    rowButtons: {
        flexDirection: "row",
        justifyContent: 'space-between',
        marginHorizontal: 20,
    },
    button: {
        backgroundColor: '#419E08',
        justifyContent: 'center',
        paddingVertical: 10,
        borderRadius: 10,
        borderColor: 'white',
        borderWidth: 2
    },
    buttonText: {
        fontSize: 17,
        alignSelf: 'center',
        fontWeight: 'bold',
        color: 'white',
        marginHorizontal: 20,
    }
});

