import React from 'react'
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity } from 'react-native'

const windowWidth = Dimensions.get('window').width;

interface Props {
    name: any;
    img: string;
    id: string;
    navigation: any;
    type: string;
}


export const Item = ({ name, img, id, type, navigation }: Props) => {

    const details: String = type === 'plants' ? 'PlantDetails' : 'ItineraryDetails';

    return (
        <TouchableOpacity
            style={styles.container}
            onPress={() => navigation.navigate(details, { title: name, id: id })}
        >
            {img == undefined
                ? <Image
                    style={styles.image}
                    source={require('../img/image-not-found.jpg')}
                />
                : <Image
                    style={styles.image}
                    source={{ uri: img }}
                />}
            <Text style={styles.title}>{name}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
        width: (windowWidth / 2) - 10,
        height: (windowWidth / 2) - 30,
        flexDirection: 'column',
        justifyContent: 'space-around',
    },
    image: {
        width: 125,
        height: 125,
        borderWidth: 2,
        borderColor: 'white',
        borderRadius: 10,
        alignSelf: 'center'
    },
    title: {
        fontSize: 20,
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
        height: 50,
        textAlignVertical: 'center',
    },
});
