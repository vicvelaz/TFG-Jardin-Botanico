import { StackScreenProps } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import { FlatList, ImageBackground, SafeAreaView, StyleSheet, Text } from 'react-native';
import { firebase, db } from '../firebase/firebase-config';


import { Item } from '../components/Item';







interface Props extends StackScreenProps<any, 'List'> { };

interface Data {
    id: string;
    name: string;
    img: string;
}

interface PropState {
    isLoading: boolean;
    items: Data[];
    type:string;
}

export const List = ({ route, navigation }: Props) => {

    const [state, setstate] = useState<PropState>({
        isLoading: true,
        type:'',
        items: [],
    })


    let data: Data[] = [];


    const obtenerPlantas = async () => {
        try {
            const data = await db.collection('plants').where('type', '==', 'plant').orderBy('name').get();
            const arrayData: any = data.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            const arrayPlanta: Data[] = [];
            arrayData.forEach((element: any) => {
                arrayPlanta.push({ id: element.id, name: element.name, img: element.media[0] });
            });
            setstate({
                isLoading: false,
                items: arrayPlanta,
                type:'plants',
            })
        } catch (error) {
            console.log('error',error);
        }
    }

    const obtenerLugares = async () => {
        try {
            const data = await db.collection('plants').where('type', '==', 'place').orderBy('name').get();
            const arrayData: any = data.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            const arrayLugar: Data[] = [];
            arrayData.forEach((element: any) => {
                    arrayLugar.push({ id: element.id, name: element.name, img: element.media[0] });
            });
            setstate({
                isLoading: false,
                items: arrayLugar,
                type:'plants',
            })
        } catch (error) {
            console.log('error2',error);
        }
    }

    const obtenerItinerarios = async () => {
        try {
            const data = await db.collection('itinerary').orderBy('name','desc').get();
            const arrayData: any = data.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            const arrayItinerario: Data[] = [];
            arrayData.forEach((element: any) => {
                arrayItinerario.push({ id: element.id, name: element.name, img: element.media[0] });
            });
            setstate({
                isLoading: false,
                items: arrayItinerario,
                type:'itinerary'
            })
        } catch (error) {
            console.log('error3',error);
        }
    }

    const getItems = async () => {
        switch (route.params?.type) {
            case 'plants':
                obtenerPlantas();

                break;
            case 'place':
                obtenerLugares();
               
                break;
            case 'itinerary':
                obtenerItinerarios();
    
                break;
            default:
                break;
        }
    }


    useEffect(() => {
        navigation.setOptions({ title: route.params?.title })
        getItems();
    }, [route.params?.title])

    return (
        <SafeAreaView style={styles.container}>
            <ImageBackground source={require('../img/background-dark.jpg')} resizeMode="cover" style={styles.container}>
                {
                    state.isLoading
                        ? <Text style={{ color: 'white', fontSize: 50, textAlign: 'center' }}>Cargando....</Text>
                        : <FlatList
                            style={styles.list}
                            data={state.items}
                            renderItem={({ item }) => (
                                <Item name={item.name} img={item.img} id={item.id} type={state.type} navigation={navigation} />
                            )}
                            keyExtractor={({ id }: Data) => id.toString()}
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