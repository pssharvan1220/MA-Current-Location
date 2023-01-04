import React, { useEffect, useRef, useState } from 'react'
import Map from 'ol/Map';
import View from 'ol/View';
import OSM from 'ol/source/OSM';
import TileLayer from 'ol/layer/Tile';
import './MapView.css'
import Geolocation from 'ol/Geolocation';
import {Circle as CircleStyle, Fill, Stroke, Style} from 'ol/style';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import {Vector as VectorLayer} from 'ol/layer'
import {Vector as VectorSource} from 'ol/source'

export default function MapView() {
  const ref = useRef(null)
  const mapRef = useRef(null)
  const[geolocation,setGeoLocation] = useState({})
  const[pstnFeature,setPstnFeature] = useState(new Feature())

  const view = new View({
    center: [0, 0],
    zoom: 0,
  });

  const handleLiveLocation = () => {
    alert(geolocation.getPosition())
    const coordinates = geolocation.getPosition();
    pstnFeature.setGeometry(coordinates ? new Point(coordinates) : null);
  }

  useEffect(() => {
    if(ref.current && !mapRef.current){
      setGeoLocation(new Geolocation({
          tracking: true,
          trackingOptions: {
            enableHighAccuracy: true,
          },
          projection: view.getProjection(),
      }))

      const positionFeature = new Feature();
      positionFeature.setStyle(
        new Style({
          image: new CircleStyle({
            radius: 8,
            fill: new Fill({
              color: 'red',
            }),
            stroke: new Stroke({
              color: '#fff',
              width: 2,
            }),
          }),
        })
      );
      setPstnFeature(positionFeature)

      const vectorLayer = new VectorLayer({
        source: new VectorSource({
          features: [positionFeature]
        }),
      });

      const map = new Map({
        layers: [
            new TileLayer({source: new OSM()}),
            vectorLayer
        ],
        view: view,
        target:ref.current
      })

      mapRef.current = map
    }
  },[])

  return (
    <>
      <div ref={ref} className="map"></div>
      <button className='btn' onClick={handleLiveLocation}>Go to Live Location</button>
    </>   
  )
}
