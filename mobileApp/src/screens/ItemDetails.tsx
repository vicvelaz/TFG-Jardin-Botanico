import React, { useEffect } from 'react'

import { Text, View, StyleSheet, Button, TouchableOpacity, ImageBackground, Image, Dimensions } from 'react-native'
import { StackScreenProps } from '@react-navigation/stack';
import Carousel from 'react-native-snap-carousel';
import { ScrollView } from 'react-native-gesture-handler';

interface Props extends StackScreenProps<any, 'ItemDetails'> { };

const windowWidth = Dimensions.get('window').width;

export const ItemDetails = ({ route,navigation }: Props) => {
    
    useEffect(() => {
        navigation.setOptions({ title: route.params?.title })
    }, [])

    const foto = (
        <View >
            <Image style={styles.imageCarousel} source={require('../img/rosa.jpg')} />
        </View>
    )

    const data = [foto, foto, foto];

    

    return (
            <ImageBackground source={require('../img/background-dark.jpg')} resizeMode="cover" style={styles.container}>
                <View style={styles.carousel}>
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
                    <Text style={styles.description}>El género Rosa está compuesto por un conocido grupo de arbustos generalmente espinosos y floridos representantes principales de la familia de las rosáceas. Se denomina rosa a la flor de los miembros de este género y rosal a la planta. El número de especies ronda las cien, la mayoría originarias de Asia y un reducido número nativas de Europa, Norteamérica y África noroccidental. Tanto especies como cultivares e híbridos se cultivan como ornamentales por la belleza y fragancia de su flor; pero también para la extracción de aceite esencial, utilizado en perfumería y cosmética, usos medicinales (fitoterapia) y gastronómicos.</Text>
                </ScrollView>
                </View>
                <View style={styles.rowButtons}>
                    <TouchableOpacity
                        style={styles.smallButton}
                    // onPress={() => navigation.navigate('PlantsList')}
                    >
                        <Text style={styles.buttonText}>Escuchar audio</Text>
                    </TouchableOpacity>
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
    imageCarousel:{
        height:'100%', 
        width:'100%',
        borderRadius: 10,
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
    description: {
        textAlign: 'center',
        fontSize: 20,
        color: 'white',
        marginVertical:5,
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

