import { StackScreenProps } from '@react-navigation/stack';
import React from 'react'
import { FlatList, Image, ImageBackground, SafeAreaView, StatusBar, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, View } from 'react-native';
import { Item } from '../components/Item';

interface Props extends StackScreenProps<any, any> { };

const DATA = [
    {
        id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
        name: 'Rosa',
    },
    {
        id: '3ac68afc-c605-48d3-a4f8-fbd9s1aa97f63',
        name: 'Rosa',
    },
    {
        id: '58694a0f-3da1-471f-bd96-14g5571e29d72',
        name: 'Rosa',
    }, {
        id: 'bd7acbea-c1b1-46c2-aefd5-3ad53abb28ba',
        name: 'Rosa',
    },
    {
        id: '3ac68afc-c605-48d3s-a4f8-fbd91aa97f63',
        name: 'Rosa',
    },
    {
        id: '58694a0f-3da1-47w1f-bd96-145571e29d72',
        name: 'Rosa',
    }, {
        id: 'bd7acbea-c1b1-46c2r-aed5-3ad53abb28ba',
        name: 'Rosa',
    },
    {
        id: '3ac68afc-c605-48dw3-a4f8-fbd91aa97f63',
        name: 'Rosa',
    },
    {
        id: '58694a0f-3da1-471rf-bd96-145571e29d72',
        name: 'Rosa',
    },
];






export const PlantsList = ({ navigation }: Props) => {

    // const Item = ({ title }:any) => (
    //     <TouchableOpacity 
    //     style={styles.item} 
    //     onPress={() => navigation.navigate('Planta')}>
       
    //         <Image style={styles.foto} source={require('../img/rosa.jpg')}/>
    //         <Text style={styles.title}>{title}</Text>
        
    //     </TouchableOpacity>
    // );

    // const renderItem=( {item} :any) =>{
    //     return (
    //         <Item title={item.title} img={item.img} />
    //     );
    // }

    return (
        <SafeAreaView style={styles.container}>
            <ImageBackground source={require('../img/background-dark.jpg')} resizeMode="cover" >
            <FlatList
            style={styles.list}
                data={DATA}
                renderItem={ ({ item }: any) => (
                    <Item  name={item.name} navigation={navigation} />
                )}
                keyExtractor={ (item) => item.id.toString() }
                numColumns={2}
            />
            </ImageBackground>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    list:{
        marginHorizontal:10,
        marginTop:8,
    },
    item: {
        padding: 20,
        width: '50%',
        aspectRatio: 1,
        flexDirection:'column',
        justifyContent:'space-around',

    },
    title: {
        fontSize: 20,
        color:'white',
        fontWeight:'bold',
        textAlign:'center',
    },
    foto: {
        backgroundColor: '#419E08',
        width:120,
        height:120,
        borderWidth:2,
        borderColor:'white',
        borderRadius:10,
        alignSelf:'center'
    }
});