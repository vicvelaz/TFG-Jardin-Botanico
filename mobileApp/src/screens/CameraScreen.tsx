import { StackScreenProps } from "@react-navigation/stack";
import axios from "axios";
import React, { useState } from "react";
import { ImageBackground, PermissionsAndroid, ScrollView, StyleSheet, TouchableOpacity, View, Dimensions, Image, ActivityIndicator } from "react-native";
import { Text } from "react-native-elements";
import { ImagePickerResponse, launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Carousel from "react-native-snap-carousel";
import * as RNLocalize from "react-native-localize";
import traducir from "../traducir"

interface Props extends StackScreenProps<any, 'CameraScreen'> { };

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export const CameraScreen = ({ route, navigation }: Props) => {

    const [isLoading, setLoading] = useState<boolean>(true);
    const [image, setImage] = useState<JSX.Element[]>([]);
    const [index, setIndex] = useState(0);
    const [isPlant, setIsPlant] = useState<boolean>(true);

    const [name, setName] = useState<string>();
    const [scientificName, setScientificName] = useState<string>();
    const [description, setDescription] = useState<string>();
    const [staticText, setStaticText] = useState<string[]>(['Identificador de Plantas: ','No hay descripción de la planta','Planta no identificada','No se pudo identificar la planta. Intenta hacer otra fotografía con la mayor claridad posible.','Identificando...','Estamos identificando la planta...', 'Reabrir cámara']);

    React.useEffect(() => {
        getLanguage();
        navigation.setOptions({ title: "Identificador de Plantas" });
        requestPermissions();
        abrirCamara();
    }, []);

    const getLanguage = async () => {
        if (RNLocalize.getLocales()[0].languageCode != 'es') {
            const trad = await traducir(['Identificador de Plantas: ','No hay descripción de la planta','Planta no identificada','No se pudo identificar la planta. Intenta hacer otra fotografía con la mayor claridad posible.','Identificando...','Estamos identificando la planta...', 'Reabrir cámara'])
            setStaticText(trad);
        } else {
            setStaticText(['Identificador de Plantas: ','No hay descripción de la planta','Planta no identificada','No se pudo identificar la planta. Intenta hacer otra fotografía con la mayor claridad posible.','Identificando...','Estamos identificando la planta...', 'Reabrir cámara'])
        }
    }

    async function requestPermissions() {
        await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);
    }

    const abrirCamara = async () => {
        try {
            const result = await launchCamera({ mediaType: 'photo', saveToPhotos: true, cameraType: 'back', includeBase64: true, quality: 0.5 });

            if (result.assets !== undefined && result.assets[0].base64 !== undefined) {
                identificarPlanta(result.assets[0].base64);
            }

        } catch (error) {
            console.log(error)
        }
    }

    const identificarPlanta = async (base64photo: string) => {
        const data = {
            api_key: "IyV4BbGuH6LBokANFIkqGXdE7DYetb3TjjPhMX3d4e9sl8E9LI",
            images: [base64photo],
            /* modifiers docs: https://github.com/flowerchecker/Plant-id-API/wiki/Modifiers */
            modifiers: ["crops_fast", "similar_images", "health_all", "disease_similar_images"],
            plant_language: RNLocalize.getLocales()[0].languageCode != 'es' ? "en" : "es",
            /* plant details docs: https://github.com/flowerchecker/Plant-id-API/wiki/Plant-details */
            plant_details: ["common_names",
                "url",
                "name_authority",
                "wiki_description",
                "taxonomy",
                "wiki_image",
                "synonyms"],
            /* disease details docs: https://github.com/flowerchecker/Plant-id-API/wiki/Disease-details */
            disease_details: ["common_names", "url", "description"]
        };

        axios.post('https://api.plant.id/v2/identify', data).then(
            res => {
                console.log('Success:', res.data);
                const d = res.data;
                const arrayImages: JSX.Element[] = [];
                if (d.is_plant) {
                    setIsPlant(true);
                    if(d.suggestions !== null && d.suggestions !== undefined){
                        if(d.suggestions[0].plant_details.common_names !== null && d.suggestions[0].plant_details.common_names !== undefined){
                            navigation.setOptions({ title: staticText[0] + d.suggestions[0].plant_details.common_names[0] });
                        }
                        if(d.suggestions[0].plant_name !== null && d.suggestions[0].plant_name !== undefined){
                            setScientificName(d.suggestions[0].plant_name);
                        }
                        if(d.suggestions[0].plant_details.wiki_description !== null && d.suggestions[0].plant_details.wiki_description !== undefined){
                            console.log(d.suggestions[0].plant_details.wiki_description)
                            console.log(d.suggestions[0].plant_details.wiki_description.value)
                            setDescription(d.suggestions[0].plant_details.wiki_description.value)
                        }else{
                            setDescription('No hay descripción de la planta')
                        }
                        if(d.suggestions[0].similar_images !== null && d.suggestions[0].similar_images !== undefined){
                            d.suggestions[0].similar_images.forEach((element: any) => {
                                arrayImages.push(
                                   <View >
                                       <Image style={styles.image} source={{ uri: element.url }} />
                                   </View>
                               )
                               });
                        }
                    }
                } else {
                    setIsPlant(false)
                    arrayImages.push(
                        <View >
                            <Image style={styles.image} source={require('../img/image-not-found.jpg')} />
                        </View>
                    );
                }

                setImage(arrayImages);
                setLoading(false);

            }).catch(error => {
                console.error('Error: ', error)
            }
        )
    }


    return (
        <ImageBackground source={require('../img/background-dark.jpg')} resizeMode="cover" style={styles.container}>
            <View>
                    {
                        isLoading ? <Text style={styles.scientific_name}>{staticText[4]}</Text> : <Text style={styles.scientific_name}>
                            {isPlant ? scientificName : staticText[2]}</Text>
                    }
                    {isLoading ? 
                    <View style={styles.carousel}>
                        <ActivityIndicator style={styles.activityInd} size="large" color="#00ff00" />
                    </View>
                    : 
                    <View style={styles.carousel}>
                        <Carousel
                            data={image}
                            renderItem={({ item, index }: any) => image[index]}
                            sliderWidth={windowWidth - 44}
                            itemWidth={windowWidth - 44}
                            sliderHeight={200}
                            enableMomentum
                            lockScrollWhileSnapping
                            onSnapToItem={setIndex}
                            style={{ zIndex: -1 }}
                        />
                        {image.length > 1 &&
                            <Text style={styles.carouselIndex}>{`${index + 1}/${image.length}`}</Text>
                        }
                    </View>
                    }
                    <View style={[styles.block, (scientificName != '' && scientificName != undefined) ? { height: windowHeight - 405 } : { height: windowHeight - 350 }]}>
                        <View style={styles.description}>
                            <ScrollView >
                                {isLoading ? <Text style={styles.descriptionText}>{staticText[5]}</Text> : <Text style={styles.descriptionText}>
                                    {isPlant ? description : staticText[3]}</Text> }
                            </ScrollView>
                        </View>
                        <TouchableOpacity style={styles.button} onPress={() => abrirCamara()}>
                            <Text style={styles.buttonText}>{staticText[6]}</Text>
                        </TouchableOpacity>
                    </View>
                    
                </View>
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
    },
    scientific_name: {
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
    },
    carouselIndex: {
        position: 'absolute',
        bottom: 0,
        color: 'white',
        fontSize: 15,
        textShadowColor: '#419E08',
        textShadowOffset: { width: -2, height: 2 },
        textShadowRadius: 10,
        backgroundColor: 'rgba(128,128,128, 0.85)',
        paddingHorizontal: 5,
        paddingVertical: 1,
        marginBottom: 2,
        borderRadius: 50,
    },
    carousel: {
        height: 250,
        marginHorizontal: 20,
        marginTop: 20,
        marginBottom: 20,
        borderRadius: 10,
        alignItems: 'center',
        borderColor: 'white',
        borderWidth: 2,
    },
    image: {
        height: '100%',
        width: '100%',
        borderRadius: 10,
    },
    block: {
        flexDirection: 'column',
    },
    description: {
        alignItems: 'center',
        borderColor: 'white',
        borderWidth: 2,
        borderRadius: 10,
        marginBottom: 20,
        backgroundColor: '#419E08',
        marginHorizontal: 20,
        flex: 0.8,
    },
    descriptionText: {
        textAlign: 'justify',
        fontSize: 20,
        color: 'white',
        margin: 10,

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
        margin: 20,
    },
    buttonText: {
        fontSize: 17,
        alignSelf: 'center',
        fontWeight: 'bold',
        color: 'white',
        marginHorizontal: 20,
        width: '100%',
        textAlign: 'center'
    },
    activityInd: {
        marginTop: 100
    }
});