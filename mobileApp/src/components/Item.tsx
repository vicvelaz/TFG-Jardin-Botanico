import React, { Component } from 'react'
import { Image, StyleSheet, Text, TouchableOpacity } from 'react-native'


interface Props {
    name: any;
    img?: string;
    navigation: any;
}


export const Item =({name,navigation}: Props) =>{
        return (
            <TouchableOpacity 
            style={styles.container} 
            onPress={() => navigation.navigate('Planta')}
            >
                <Image style={styles.img} source={require('../img/rosa.jpg')}/>
                <Text style={styles.title}>{name}</Text>
            
            </TouchableOpacity>
        )

}

const styles = StyleSheet.create({
   
    container: {
        padding: 20,
        width: '50%',
        aspectRatio: 1,
        flexDirection:'column',
        justifyContent:'space-around',

    },
    img: {
        backgroundColor: '#419E08',
        width:120,
        height:120,
        borderWidth:2,
        borderColor:'white',
        borderRadius:10,
        alignSelf:'center'
    },
    title: {
        fontSize: 20,
        color:'white',
        fontWeight:'bold',
        textAlign:'center',
    },
});
