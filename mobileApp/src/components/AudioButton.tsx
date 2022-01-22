import React, { useState, useEffect } from 'react'
import { AppState, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Sound from 'react-native-sound';
import { StackNavigationProp } from '@react-navigation/stack';


interface Props {
    audioURL: string,
    navigation:StackNavigationProp<any, "PlantDetails">,
}


export const AudioButton = ({ audioURL,navigation }: Props) => {

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



    if (audioURL == '') {
        return (
            <TouchableOpacity
                disabled={true}
                style={{ ...styles.button, backgroundColor: 'grey' }}
            >
                <Text style={styles.buttonText}>Play audio</Text>

            </TouchableOpacity>
        )
    }


    return (
        audioState == 'playing' || audioState == 'pause'
            ? <View
                style={styles.rowButtons}>
                <TouchableOpacity
                    style={styles.smallButton}
                    onPress={() => { audioState == 'playing' ? executeAction('pause') : executeAction('play') }}
                >
                    <Text style={styles.buttonText}>
                        {audioState == 'playing' ? 'Pause' : 'Resume'}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.smallButton}
                    onPress={() => executeAction('stop')}
                >
                    <Text style={styles.buttonText}>Stop</Text>
                </TouchableOpacity>
            </View>
            : <TouchableOpacity
                style={styles.button}
                onPress={() => executeAction('play')}
            >
                <Text style={styles.buttonText}>Play audio</Text>
            </TouchableOpacity>

    )
}

const styles = StyleSheet.create({
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
        width: '48%'
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
    rowButtons: {
        flexDirection: "row",
        justifyContent: 'space-between',
        width: '48%',
    },
});
