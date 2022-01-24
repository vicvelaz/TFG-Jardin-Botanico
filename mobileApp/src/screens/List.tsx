import { StackScreenProps } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import { FlatList, ImageBackground, SafeAreaView, StyleSheet, Text } from 'react-native';
import { db } from '../firebase/firebase-config';


import { Item } from '../components/Item';


interface Props extends StackScreenProps<any, 'List'> { };

interface Data {
    id: string;
    name: string;
    image: string;
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



    const obtenerPlantas = async () => {
        try {
            const data = await db.collection('plants').where('type', '==', 'plant').orderBy('name').get();
            const arrayData: any = data.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            const arrayPlants: Data[] = [];
            arrayData.forEach((element: any) => {
                arrayPlants.push({ id: element.id, name: element.name, image: element.media[0] });
            });
            setstate({
                isLoading: false,
                items: arrayPlants,
                type:'plants',
            })
        } catch (error) {
            console.log(error);
        }
    }

    const getPlaces = async () => {
        try {
            const data = await db.collection('plants').where('type', '==', 'place').orderBy('name').get();
            const arrayData: any = data.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            const arrayPlaces: Data[] = [];
            arrayData.forEach((element: any) => {
                    arrayPlaces.push({ id: element.id, name: element.name, image: element.media[0] });
            });
            setstate({
                isLoading: false,
                items: arrayPlaces,
                type:'plants',
            })
        } catch (error) {
            console.log(error);
        }
    }

    const getItineraries = async () => {
        try {
            const data = await db.collection('itinerary').orderBy('name','desc').get();
            const arrayData: any = data.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            const arrayItineraries: Data[] = [];
            arrayData.forEach((element: any) => {
                arrayItineraries.push({ id: element.id, name: element.name, image: element.media[0] });
            });
            setstate({
                isLoading: false,
                items: arrayItineraries,
                type:'itinerary'
            })
        } catch (error) {
            console.log(error);
        }
    }

    const getItems = async () => {
        switch (route.params?.type) {
            case 'plants':
                obtenerPlantas();

                break;
            case 'place':
                getPlaces();
               
                break;
            case 'itinerary':
                getItineraries();
    
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
                                <Item name={item.name} img={item.image} id={item.id} type={state.type} navigation={navigation} />
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