import React, { Component } from 'react';
import { withGoogleMap, GoogleMap } from 'react-google-maps';
class Map extends Component {
   render() {
   const GoogleMapExample = withGoogleMap(props => (
      <GoogleMap
        defaultCenter = { { lat: 40.41106389815237, lng: -3.6907095898143405} }
        defaultZoom = { 17 }
      >
      </GoogleMap>
   ));
   return(
      <div>
        <GoogleMapExample
          containerElement={ <div style={{ height: `500px`, width: '500px' }} /> }
          mapElement={ <div style={{ height: `100%` }} /> }
          options={{ styles: [{ elementType: "labels", featureType: "poi.business", stylers: [{ visibility: "off", }], }], }}
        />
      </div>
   );
   }
};
export default Map;