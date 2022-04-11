import React, { useState, useEffect } from 'react'
import { AppState, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Sound from 'react-native-sound';
import { StackNavigationProp } from '@react-navigation/stack';


interface Props {
    audioURL: string,
    navigation: StackNavigationProp<any, "PlantDetails">|StackNavigationProp<any, "MapScreen">|StackNavigationProp<any, "StartItinerary">,
    plantButton: boolean
}


export const AudioButton = ({ audioURL,navigation,plantButton}: Props) => {

    const [audioState, setAudioState] = useState<string>('off');//Puede estar playing, pause, off
    const [control_Online, setControl_Online] = useState<Sound>();

    useEffect(() => {
        if (audioURL != '') {
            Sound.setCategory('Playback', true);
            setControl_Online(new Sound(audioURL, '', (error) => {
                if (error) { console.log('fallo al cargar el audio', error) }
            }));
        }
        
    }, [])

    // Cierra el audio si pulsamos el botón de atras
    const _handleNavigationFocusChange = () => {
        executeAction('stop');
    }
    navigation.addListener('blur', _handleNavigationFocusChange);

    // Para el audio si nos salimos de la aplicación
    const _handleAppStateChange = () => {
        if (AppState.currentState.match(/inactive|background/) ) {
            executeAction('pause');
        }
    }
    AppState.addEventListener('change', _handleAppStateChange);

    const executeAction = (action: string) => {
        if (action == 'stop') {
            setAudioState('off')
            control_Online?.stop();
            return;
        } 
        
        if (action == 'play') {
            setAudioState('playing')
            control_Online?.play(() => {
                executeAction('stop');
            });
            return;
        } 
        
        if (action == 'pause') {
            setAudioState('pause')
            control_Online?.pause();
            return;
        } 
    }



    if (audioURL == '' || audioURL == undefined) {
        return (
            <TouchableOpacity
                disabled={true}
                style={plantButton ? { ...styles.button, backgroundColor: 'grey' }:{ ...stylesButtonMap.button, backgroundColor: 'grey' }}
            >
                <Text style={plantButton ? styles.buttonText : stylesButtonMap.buttonText}>Audio no disponible</Text>

            </TouchableOpacity>
        )
    }


    return (
        audioState == 'playing' || audioState == 'pause'
            ? <View
                style={plantButton ? styles.rowButtons : stylesButtonMap.rowButtons}>
                <TouchableOpacity
                    style={plantButton ? styles.smallButton : stylesButtonMap.smallButton}
                    onPress={() => { audioState == 'playing' ? executeAction('pause') : executeAction('play') }}
                >
                    <Text style={plantButton ? styles.buttonText : stylesButtonMap.buttonText}>
                        {audioState == 'playing' ? 'Parar' : 'Continuar'}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={plantButton ? styles.smallButton : stylesButtonMap.smallButton}
                    onPress={() => executeAction('stop')}
                >
                    <Text style={plantButton ? styles.buttonText : stylesButtonMap.buttonText}>Detener</Text>
                </TouchableOpacity>
            </View>
            : <TouchableOpacity
                style={plantButton ? styles.button : stylesButtonMap.button}
                onPress={() => executeAction('play')}
            >
                <Text style={plantButton ? styles.buttonText : stylesButtonMap.buttonText}>Iniciar audio</Text>
            </TouchableOpacity>

    )
}

const styles = StyleSheet.create({
    rowButtons: {
        flexDirection: "row",
        justifyContent: 'space-between',
        width: '48%',
    },
    smallButton: {
        backgroundColor: '#419E08',
        justifyContent: 'center',
        paddingVertical: 10,
        borderRadius: 10,
        borderColor: 'white',
        borderWidth: 2,
        width: '45%',
    },
    button: {
        backgroundColor: '#419E08',
        justifyContent: 'center',
        paddingVertical: 10,
        borderRadius: 10,
        borderColor: 'white',
        borderWidth: 2,
        width: '48%'
    },
    buttonText: {
        fontSize: 15,
        alignSelf: 'center',
        fontWeight: 'bold',
        color: 'white',
        marginHorizontal: 20,
        width: '100%',
        textAlign: 'center'
    },
});

const stylesButtonMap = StyleSheet.create({
    rowButtons: {
        flexDirection: "row",
        justifyContent: 'center',
        width: '60%',
        marginLeft: 10
    },
    smallButton: {
        backgroundColor: '#419E08',
        justifyContent: 'center',
        paddingVertical: 10,
        borderRadius: 10,
        borderColor: 'white',
        borderWidth: 2,
        width: '45%'
    },
    button: {
        backgroundColor: '#419E08',
        justifyContent: 'center',
        paddingVertical: 10,
        borderRadius: 10,
        borderColor: 'white',
        borderWidth: 2,
        width: 120,
        marginLeft: 10
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
});
