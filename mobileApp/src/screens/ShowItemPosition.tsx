import React from 'react'
import { StyleSheet, View, Alert, Text, PermissionsAndroid, Dimensions } from 'react-native';
import MapboxGL , {Logger} from '@react-native-mapbox-gl/maps';
import Geolocation from 'react-native-geolocation-service';
import { booleanPointInPolygon, point, polygon } from '@turf/turf';
import { StackScreenProps } from '@react-navigation/stack';

interface Props extends StackScreenProps<any, 'ShowItemPosition'> { };

export const ShowItemPosition = ({ route, navigation }: Props) => {
    //constantes del jardin con coordenadas fijas
    const centerLng : number = -3.690750;
    const centerLat : number = 40.411147;
    const perimetro = polygon([[
      [-3.6925971508026127,40.41231565042066],
      [-3.6919802427291875,40.40973422067125],
      [-3.6890941858291626,40.40976689761599],
      [-3.68891716003418,40.409893520626945],
      [-3.6890029907226562,40.41200114608072],
      [-3.6904352903366084,40.41233607272957],
      [-3.6904406547546387,40.41256888661311],
      [-3.690462112426758,40.41262198440359],
      [-3.691293597221374,40.41258930884518],
      [-3.691293597221374,40.41247085981296],
      [-3.6925971508026127,40.41231565042066]
    ]]);

    //estados para la posicion del usuario
    const [userPositionLat, setUserPositionLat] = React.useState<number>(40.412386);
    const [userPositionLong, setUserPositionLong] = React.useState<number>(-3.691977);
    const [alertShown, setAlertShown] = React.useState<boolean>();
    const [itemName, setItemName] = React.useState<string>();
    const [itemTerrace, setItemTerrace] = React.useState<string>();
    const [itemLng,setItemLng] = React.useState<number>(-3.691977);
    const [itemLat,setItemLat] = React.useState<number>(40.412386);

    React.useEffect(() => {
        disableLogger();
        setItemName(route.params?.info.name);
        setItemTerrace(route.params?.info.terrace);
        setItemLng(route.params?.info.position._long);
        setItemLat(route.params?.info.position._lat);
    }, []);

    const disableLogger = () => {
      Logger.setLogCallback(log => {
        const { message } = log;
      
        // expected warnings - see https://github.com/mapbox/mapbox-gl-native/issues/15341#issuecomment-522889062
        if (
          message.match('Request failed due to a permanent error: Canceled') ||
          message.match('Request failed due to a permanent error: Socket Closed') ||
          message.match('MapRenderer::onSurfaceCreated GlyphsRasterizationMode was specified without providing LocalIdeographFontFamily. Switching glyphsRasterizationMode to NoGlyphsRasterizedLocally mode.')
        ) {
          return true;
        }
        return false;
      });
    }

    return (
      <View style={styles.page}>
        <View style={styles.container}>
          <MapboxGL.MapView style={styles.map} styleURL={"mapbox://styles/ramxnchv/cl006l6ye000614mufkp230xm"}>
            <MapboxGL.Camera zoomLevel={17.5} centerCoordinate={[itemLng,itemLat]} />
            <MapboxGL.PointAnnotation id={route.params?.id} anchor={{x:0.5,y:0.5}}  coordinate={[itemLng,itemLat]}></MapboxGL.PointAnnotation>
          </MapboxGL.MapView>
        </View>
        <View style={textStyle.viewTextStyle}>
            <Text style={textStyle.baseText}>{itemName}</Text>
            <Text style={textStyle.titulo}>{itemTerrace}</Text>
        </View>
      </View>
    );
}

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const textStyle = StyleSheet.create({
    baseText: {
      color: "black",
      fontSize: 20
    },
    titulo: {
      color: "gray",
      fontSize: 15
    },
    viewTextStyle: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#fff",
      padding: 20,
      height: 500,
      width: 400,
    }
  });
  
  const styles = StyleSheet.create({
    page: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#F5FCFF'
    },
    container: {
      height: windowHeight-150,
      width: windowWidth,
      backgroundColor: 'tomato'
    },
    map: {
      flex: 1
    }
  });