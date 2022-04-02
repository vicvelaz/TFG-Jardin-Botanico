import { StackScreenProps } from "@react-navigation/stack";
import axios from "axios";
import React from "react";
import { PermissionsAndroid } from "react-native";
import { Text } from "react-native-elements";
import {ImagePickerResponse, launchCamera, launchImageLibrary} from 'react-native-image-picker';

interface Props extends StackScreenProps<any, 'CameraScreen'> { };

export const CameraScreen = ({ route, navigation }: Props) => {

    React.useEffect(() => {
        navigation.setOptions({ title: "Identificador de Plantas" });
        requestPermissions();
        abrirCamara();
    }, []);

    async function requestPermissions() {
        await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);
    }

    const abrirCamara = async () => {
        try{
            const result = await launchCamera({mediaType: 'photo', saveToPhotos: true, cameraType: 'back', includeBase64: true, quality: 0.5});

            if(result.assets !== undefined && result.assets[0].base64 !== undefined){
                console.log(result.assets[0].fileSize)
                identificarPlanta(result.assets[0].base64);
            }
            
        }catch(error){
            console.log(error)
        }
    }

    const identificarPlanta = async (base64photo: string) => {
        const data = {
            api_key: "IyV4BbGuH6LBokANFIkqGXdE7DYetb3TjjPhMX3d4e9sl8E9LI",
            images: [base64photo],
            /* modifiers docs: https://github.com/flowerchecker/Plant-id-API/wiki/Modifiers */
            modifiers: ["crops_fast", "similar_images", "health_all", "disease_similar_images"],
            plant_language: "es",
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
            }).catch(error => {
                console.error('Error: ', error)
            }
        )
    }


    return (
        <Text>Ha habido un error en la imagen</Text>
    )


}