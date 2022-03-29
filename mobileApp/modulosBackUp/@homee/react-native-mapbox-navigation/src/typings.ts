/** @type {[number, number]}
 * Provide an array with longitude and latitude [$longitude, $latitude]
 */
type Coordinate = [number, number];

type OnLocationChangeEvent = {
  nativeEvent?: {
    latitude: number;
    longitude: number;
  };
};

type OnWaypointArriveEvent = {
  nativeEvent?: {
    remainingWaypoints: number;
  };
};

type OnArriveEvent = {
  nativeEvent?: {
    onArrive: string;
  };
};

type OnRouteProgressChangeEvent = {
  nativeEvent?: {
    distanceTraveled: number;
    durationRemaining: number;
    fractionTraveled: number;
    distanceRemaining: number;
  };
};

type OnErrorEvent = {
  nativeEvent?: {
    message?: string;
  };
};

export interface IMapboxNavigationProps {
  origin: Coordinate;
  destination: Coordinate;
  waypoints?: Coordinate[];
  shouldSimulateRoute?: boolean;
  onLocationChange?: (event: OnLocationChangeEvent) => void;
  onRouteProgressChange?: (event: OnRouteProgressChangeEvent) => void;
  onWaypointArrive?: (event: OnWaypointArriveEvent) => void;
  onError?: (event: OnErrorEvent) => void;
  onCancelNavigation?: () => void;
  onArrive?: (event: OnArriveEvent) => void;
  showsEndOfRouteFeedback?: boolean;
  hideStatusView?: boolean;
}
