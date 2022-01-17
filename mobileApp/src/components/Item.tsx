import React from 'react'
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity } from 'react-native'

const windowWidth = Dimensions.get('window').width;

interface Props {
    name: any;
    img: string;
    id: string;
    navigation: any;
}


export const Item =({name,img,id,navigation}: Props) =>{
        return (
            <TouchableOpacity 
            style={styles.container} 
            onPress={() => navigation.navigate('ItemDetails',{title:name,id:id})}
            >
                <Image 
                style={styles.img} 
                source={{uri:img}}
                />
                <Text style={styles.title}>{name}</Text>
            </TouchableOpacity>
        )
}

const styles = StyleSheet.create({
    container: {
        marginTop:20,
        width: (windowWidth / 2)-10,
        height: (windowWidth / 2)-30,
        flexDirection:'column',
        justifyContent:'space-around',
    },
    img: {
        width:125,
        height:125,
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
        height:50,
        textAlignVertical:'center',
    },
});
