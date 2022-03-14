import axios from 'axios';
import * as RNLocalize from "react-native-localize";

const traducir = async (text: string[]) => {
    try {
        console.log(text)
        const response = await axios
            .post(
                'https://translation.googleapis.com/language/translate/v2',
                {},
                {
                    params: {
                        q: JSON.stringify(text),
                        source: 'es',
                        target: RNLocalize.getLocales()[0].languageCode,
                        key: 'AIzaSyBncVh-3ckA9tPjbWstXnSGDRI8ySEnQ08'
                    }
                }
            );

        console.log(response.data.data.translations[0].translatedText.replace(/&quot;/g,'"').replace(/，/g,',').replace(/、/g,',').replace(/“/g,'"').replace(/”/g,'"').replace(/&#39;/g,"`"));

        return JSON.parse(response.data.data.translations[0].translatedText.replace(/、/g,',').replace(/，/g,',').replace(/&quot;/g,'"').replace(/“/g,'"').replace(/”/g,'"').replace(/&#39;/g,"`"));

    } catch (e) {
        console.log(e)
    }
}

export default traducir;