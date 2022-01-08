import { StackScreenProps } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import { FlatList, ImageBackground, SafeAreaView, StyleSheet, Text } from 'react-native';

import { Item } from '../components/Item';







interface Props extends StackScreenProps<any, 'List'> { };

interface Data{
    id:string;
    name:string;
    img:string;
}

interface PropState{
    isLoading:boolean;
    items:Data[];
    
}

export const List = ({ route, navigation }: Props) => {
    
    const [state, setstate] = useState<PropState>({
        isLoading:true,
        items:[],
    })


    let data:Data[]=[];

    const getItems=async () => {
        switch (route.params?.type) {
            case 'plants':
                
                 data = [{
                    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
                    name: 'Rosa',
                    img: '../img/rosa.jpg',
                },
                {
                    id: '3ac68afc-c605-48d3-a4f8-fbd9s1aa97f63',
                    name: 'Abeto',
                    img: '../img/rosa.jpg',
                },
                {
                    id: '58694a0f-3da1-471f-bd96-14g5571e29d72',
                    name: 'Cactus',
                    img: '../img/rosa.jpg',
                }, {
                    id: 'bd7acbea-c1b1-46c2-aefd5-3ad53abb28ba',
                    name: 'Helecho',
                    img: '../img/rosa.jpg',
                },
                {
                    id: '3ac68afc-c605-48d3s-a4f8-fbd91aa97f63',
                    name: 'Bromelia',
                    img: '../img/rosa.jpg',
                },
                {
                    id: '58694a0f-3da1-47w1f-bd96-145571e29d72',
                    name: 'Ficus',
                    img: '../img/rosa.jpg',
                }, {
                    id: 'bd7acbea-c1b1-46c2r-aed5-3ad53abb28ba',
                    name: 'Manzano',
                    img: '../img/rosa.jpg',
                },
                {
                    id: '3ac68afc-c605-48dw3-a4f8-fbd91aa97f63',
                    name: 'Romero',
                    img: '../img/rosa.jpg',
                },
                {
                    id: '58694a0f-3da1-471rf-bd96-145571e29d72',
                    name: 'Trébol',
                    img: '../img/rosa.jpg',
                },]
                break;
            case 'place':
                 data = [{
                    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
                    name: 'Terraza del plano de la flor',
                    img: '../img/rosa.jpg',
                },
                {
                    id: '3ac68afc-c605-48d3-a4f8-fbd9s1aa97f63',
                    name: 'Terraza de las escuelas',
                    img: '../img/rosa.jpg',
                },
                {
                    id: '58694a0f-3da1-471f-bd96-14g5571e29d72',
                    name: 'Almez',
                    img: '../img/rosa.jpg',
                }, {
                    id: 'bd7acbea-c1b1-46c2-aefd5-3ad53abb28ba',
                    name: 'terraza de los cuadros',
                    img: '../img/rosa.jpg',
                }]
                break;
            case 'itinerary':
                data = [{
                    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
                    name: 'Arboles singulares',
                    img: '../img/rosa.jpg',
                },
                {
                    id: '3ac68afc-c605-48d3-a4f8-fbd9s1aa97f63',
                    name: 'Arboles del Quijote',
                    img: '../img/rosa.jpg',
                },
                {
                    id: '58694a0f-3da1-471f-bd96-14g5571e29d72',
                    name: 'Paseo de las rosas',
                    img: '../img/rosa.jpg',
                }, {
                    id: 'bd7acbea-c1b1-46c2-aefd5-3ad53abb28ba',
                    name: 'Flores comestibles',
                    img: '../img/rosa.jpg',
                },
                {
                    id: '3ac68afc-c605-48d3s-a4f8-fbd91aa97f63',
                    name: 'Plantas de Peppa Pig',
                    img: '../img/rosa.jpg',
                }]
                break;
            default:
                break;
        }
        
        setstate({
            isLoading:false,
            items: data,
        })
    }


    useEffect(() => {
        navigation.setOptions({ title: route.params?.title })
        getItems();
    }, [])

    return (
        <SafeAreaView style={styles.container}>
            <ImageBackground source={require('../img/background-dark.jpg')} resizeMode="cover" style={styles.container}>
                {
                    state.isLoading
                    ?<Text style={{ color:'white',fontSize:50,textAlign:'center'}}>Cargando....</Text>
                    : <FlatList
                    style={styles.list}
                    data={state.items}
                    renderItem={({ item }) => (
                        <Item name={item.name} img={item.img} navigation={navigation} />
                    )}
                    keyExtractor={({id}:Data) =>  id.toString()}
                    numColumns={2}
                />
                }
               
            </ImageBackground>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    list: {
        marginHorizontal: 10,
        marginTop: 8,
    }
});