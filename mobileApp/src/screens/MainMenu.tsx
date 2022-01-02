import React from 'react'

import { Text, View, StyleSheet, Button, TouchableOpacity, ImageBackground } from 'react-native'
import { StackScreenProps } from '@react-navigation/stack';

interface Props extends StackScreenProps<any, any>{};

export const MainMenu = ( {navigation}:Props ) => {


    return (
        <View style={styles.container}>
            <ImageBackground source={require('../img/background-dark.jpg')} resizeMode="cover" style={styles.image}>
            <Text style={styles.mainTitle}>Real Jardín Botánico App</Text>
            <View style={styles.events}>
            <Text style={styles.mainTitle}>EVENTOS</Text>
            </View>
            <View style={styles.rowButtons}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate('PlantsList')}
                >
                    <Text style={styles.buttonText}>Plantas</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate('PuntosInteresList')}
                >
                    <Text style={styles.buttonText}>Puntos de interés</Text>
                </TouchableOpacity>

            </View>

            <TouchableOpacity
                    style={{...styles.button, marginTop:20, marginHorizontal: 20}}
                    onPress={() => navigation.navigate('ItinerariosList')}
                >
                    <Text style={styles.buttonText}>Itineraios</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={{...styles.button, marginTop:20, marginHorizontal: 20}}
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
    image:{
        flex: 1,
        justifyContent: "center"
    },
    mainTitle: {
        textAlign: 'center',
        fontSize: 35,
        fontWeight:'bold',
        color: 'white',
        borderColor: 'green',
    },
    events: {
        backgroundColor:'#0dbd65',
        height: 200,
        alignSelf: 'stretch',
        marginHorizontal:20,
        marginVertical: 50,
        borderRadius:10,
    },
    rowButtons: {
        flexDirection: "row",
        justifyContent:'space-between',
        marginHorizontal:20,
    },
    button: {
        backgroundColor:'#0dbd65',
        justifyContent:'center',
        paddingVertical:10,
        borderRadius:10,
    },
    buttonText:{
        fontSize: 20,
        alignSelf:'center',
        fontWeight:'bold',
        color:'white',
        marginHorizontal:20,
    }
});

