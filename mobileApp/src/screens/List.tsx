import { StackScreenProps } from '@react-navigation/stack';
import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, FlatList, Image, ImageBackground, LogBox, SafeAreaView, StyleSheet, Text, TextInput } from 'react-native';
import { db } from '../firebase/firebase-config';
import { SearchBar } from 'react-native-elements';
import * as RNLocalize from "react-native-localize";
import traducir from "../traducir"

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
    type: string;
}

export const List = ({ route, navigation }: Props) => {

    LogBox.ignoreLogs(['EventEmitter']); //Para eliminar el warning: EventEmitter.removeListener('keyboardDidHide', ...): Method has been deprecated. Please instead use `remove()` on the subscription returned by `EventEmitter.addListener`. 

    const [state, setstate] = useState<PropState>({
        isLoading: true,
        type: '',
        items: [],
    })

    // const [search, setSearch] = useState<string>("");
    const [items, setItems] = useState<any>([]);
    const [otherServices, setOtherServices] = useState<any>([])
    const [isPlaces, setIsPlaces] = useState<boolean>(false)
    const [staticText, setStaticText] = useState<string[]>(['Puntos de Interés', 'Otros Servicios', 'Busca aquí...']);

    const updateSearch: any = (text: any) => {


        if (text === undefined) { return }


        if (text === "") {
            setItems(state.items);
        } else {

            let filterData = state.items.filter((item: any) => {
                return item.name.toLowerCase().includes(text.toLowerCase());
            })

            setItems(filterData);
        }
    };




    const obtenerPlantas = async () => {
        try {
            const data = await db.collection('plants').where('type', '==', 'plant').orderBy('name').get();
            const arrayData: any = data.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            const arrayPlants: Data[] = [];
            if (RNLocalize.getLocales()[0].languageCode != 'es') {
                for(const element of arrayData){
                    let trad = await traducir([element.name]);
                    arrayPlants.push({ id: element.id, name: trad[0], image: element.media[0] });
                }
            }else{
                arrayData.forEach((element: any) => {
                    arrayPlants.push({ id: element.id, name: element.name, image: element.media[0] });
                });
            }
            
            setItems(arrayPlants);
            setstate({
                isLoading: false,
                items: arrayPlants,
                type: 'plants',
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
            const arrayOtherServices: Data[] = [];

            const os = arrayData.filter((place: any) => place.otherServices !== undefined && place.otherServices);
            const pl = arrayData.filter((place: any) => place.otherServices === undefined || !place.otherServices);

            if (RNLocalize.getLocales()[0].languageCode != 'es') {
                for(const element of pl){
                    let trad = await traducir([element.name]);
                    arrayPlaces.push({ id: element.id, name: trad[0], image: element.media[0] });
                }
                for(const element of os){
                    let trad = await traducir([element.name]);
                    arrayOtherServices.push({ id: element.id, name: trad[0], image: element.media[0] });
                }
            }else{
                pl.forEach((element: any) => {
                    arrayPlaces.push({ id: element.id, name: element.name, image: element.media[0] });
                });
                os.forEach((element: any) => {
                    arrayOtherServices.push({ id: element.id, name: element.name, image: element.media[0] });
                });
            }

            setItems(arrayPlaces);
            setOtherServices(arrayOtherServices);
            setIsPlaces(true)
            setstate({
                isLoading: false,
                items: arrayPlaces,
                type: 'plants',
            })
        } catch (error) {
            console.log(error);
        }
    }

    const getItineraries = async () => {
        try {
            const data = await db.collection('itinerary').orderBy('name', 'desc').get();
            const arrayData: any = data.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            const arrayItineraries: Data[] = [];
            if (RNLocalize.getLocales()[0].languageCode != 'es') {
                for(const element of arrayData){
                    let trad = await traducir([element.name]);
                    arrayItineraries.push({ id: element.id, name: trad[0], image: element.media[0] });
                }
            }else{
                arrayData.forEach((element: any) => {
                    arrayItineraries.push({ id: element.id, name: element.name, image: element.media[0] });
                });
            }
            
            setItems(arrayItineraries);
            setstate({
                isLoading: false,
                items: arrayItineraries,
                type: 'itinerary'
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

    const getLanguage = async () => {
        if (RNLocalize.getLocales()[0].languageCode != 'es') {
            const trad = await traducir(['Puntos de Interés', 'Otros Servicios','Busca aquí...'])
            setStaticText(trad);
        } else {
            setStaticText(['Puntos de Interés', 'Otros Servicios','Busca aquí...'])
        }
    }

    useEffect(() => {
        // navigation.setOptions({ title: route.params?.title });
        getItems();
        getLanguage();
    }, [route.params?.title])

    return (
        <SafeAreaView style={styles.container}>
            <ImageBackground source={require('../img/background-dark.jpg')} resizeMode="cover" style={styles.container}>
                <SearchBar
                    placeholder={RNLocalize.getLocales()[0].languageCode != 'es' ? staticText[2] : "Escribe aquí..."}
                    accessibilityRole="search"
                    platform='android'
                    onChangeText={updateSearch}
                    onKeyPress={(event) => updateSearch(undefined)}
                    onClear={() => setItems(state.items)}
                    showLoading={state.isLoading}
                />

                {/* <TextInput
                placeholder="Escribe aquí..."
                // onTextInput={updateSearch}
                // onSubmitEditing={(event) => updateSearch( event.nativeEvent.text )}
                onChangeText={(event) => updateSearch( event )}
                onKeyPress={(event) => updateSearch( undefined )}
                /> */}

                {isPlaces && <Text style={styles.title}>{staticText[0]}</Text>}
                <FlatList
                    style={styles.list}
                    data={items}
                    renderItem={({ item }) => (
                        <Item
                            name={item.name}
                            img={item.image}
                            id={item.id}
                            type={state.type}
                            navigation={navigation} />
                    )}
                    keyExtractor={({ id }: Data) => id.toString()}
                    numColumns={2}
                />
                {isPlaces && <Text style={styles.title}>{staticText[1]}</Text>}
                {isPlaces && <FlatList
                    style={styles.list}
                    data={otherServices}
                    renderItem={({ item }) => (
                        <Item
                            name={item.name}
                            img={item.image}
                            id={item.id}
                            type={state.type}
                            navigation={navigation} />
                    )}
                    keyExtractor={({ id }: Data) => id.toString()}
                    numColumns={2}
                />}
            </ImageBackground>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
    searchBar: {

    },
    list: {
        marginHorizontal: 10,
        marginTop: 8,
    },
    title: {
        backgroundColor: '#419E08',
        justifyContent: 'center',
        paddingVertical: 5,
        borderRadius: 10,
        borderColor: 'white',
        borderWidth: 2,
        marginTop: 20,
        marginHorizontal: 20,

        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center'
    }
});