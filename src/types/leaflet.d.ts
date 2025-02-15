/// <reference types="leaflet" />

declare module 'leaflet' {
  export interface MarkerOptions {
    icon?: L.Icon;
  }

  export type LatLngExpression = L.LatLngExpression;
  export type LatLng = L.LatLng;
  export type CircleMarkerOptions = L.CircleMarkerOptions;
  export type CircleOptions = L.CircleOptions;
  export type LeafletEvent = L.LeafletEvent;
}

declare module '*.png' {
  const content: any;
  export default content;
}

declare module 'leaflet/dist/images/marker-icon-2x.png' {
  const content: any;
  export default content;
}

declare module 'leaflet/dist/images/marker-icon.png' {
  const content: any;
  export default content;
}

declare module 'leaflet/dist/images/marker-shadow.png' {
  const content: any;
  export default content;
} 