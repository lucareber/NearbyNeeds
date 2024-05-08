import { Component } from '@angular/core';
import { IonIcon, IonButton, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { Geolocation } from '@capacitor/geolocation';
import { Map, latLng, tileLayer, Layer, marker, icon, Polyline, polyline, layerGroup, divIcon, markerClusterGroup } from 'leaflet';
import 'leaflet.markercluster';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [IonIcon, IonButton, IonHeader, IonToolbar, IonTitle, IonContent, ExploreContainerComponent, ],
})
export class Tab1Page {
  private map: Map|undefined;
  private storeMarkerGroup: any;
  public coordinates: string = "";
  constructor() {}

  ionViewDidEnter() { this.leafletMap(); this.showShopsOnMap(); } 
  


  leafletMap() { 
    if (this.map == undefined) {
      var customClusterIcon = divIcon({
        className: 'custom-cluster-icon',
        html: '<div class="cluster-icon"><span></span></div>',
        iconSize: [400, 400] // Adjust the size as needed
      });
    
      // In setView add latLng and zoom 
      this.map = new Map('mapId', {attributionControl: false}).setView([47.06065556639703, 7.621794883042422], 15); 
      var geoadminUrl = "https://wms.geo.admin.ch/?";   // swisstopo
      tileLayer.wms(geoadminUrl, {
        layers: 'ch.swisstopo.pixelkarte-farbe',
        format: 'image/jpeg',
        detectRetina: true,
        minZoom: 0,
        maxZoom: 20,
        attribution: "Map by <a href = 'https://www.swisstopo.admin.ch/en/home.html'>swisstopo</a>"
      }).addTo(this.map);
      this.storeMarkerGroup = markerClusterGroup({
        iconCreateFunction: function(cluster) {
          const count = cluster.getChildCount(); // Get the count of markers in the cluster
          // Custom cluster icon HTML and CSS styling
          const markerHtmlStyles = `
            background-color: #ffa600;
            color: #000;
            width: 3rem;
            height: 3rem;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            border-radius: 3rem;
            border: 1px solid #FFFFFF;
            font-size: 20px;
            font-weight: 700;`;
          // Return a divIcon with the count of markers
          return divIcon({
            className: "marker-cluster",
            html: `<div style="${markerHtmlStyles}">${count}</div>`
          });
        }
      }).addTo(this.map);
    }
  }

  async getCurrentPosition() { 
    const coordinates = await Geolocation.getCurrentPosition(); 
    if (this.map) { 
      // create custom icon from:
      // https://stackoverflow.com/questions/23567203/leaflet-changing-marker-color 
      const markerHtmlStyles = `
        background-color: #ff6361;
        width: 3rem;
        height: 3rem;
        display: block;
        left: -1.5rem;
        top: -1.5rem;
        position: relative;
        border-radius: 3rem 3rem 0;
        transform: rotate(45deg);
        border: 1px solid #FFFFFF`
      const customPosIcon = divIcon({
        className: "my-custom-pin",
        iconAnchor: [0, 24],
        popupAnchor: [0, -36],
        html: `<span style="${markerHtmlStyles}" />`
      })
      marker([coordinates.coords.latitude, coordinates.coords.longitude], { 
        icon: customPosIcon
      }).addTo(this.map)  
      this.map.panTo(latLng(coordinates.coords.latitude, coordinates.coords.longitude));
    }
  }

  async showShopsOnMap() {
    var localShops = JSON.parse(localStorage.getItem('shops') || '{}');
    if (this.map) { 
      this.storeMarkerGroup.clearLayers();
      // create custom icon from:
      // https://stackoverflow.com/questions/23567203/leaflet-changing-marker-color 
      const markerHtmlStyles = `
        background-color: #ffa600;
        width: 3rem;
        height: 3rem;
        display: block;
        left: -1.5rem;
        top: -1.5rem;
        position: relative;
        border-radius: 3rem 3rem 0;
        transform: rotate(45deg);
        border: 1px solid #FFFFFF`
      const customIcon = divIcon({
        className: "my-custom-pin",
        iconAnchor: [0, 24],
        popupAnchor: [0, -36],
        html: `<span style="${markerHtmlStyles}" />`
      })
      let j = 0;
      while (j < localShops.shops.length) {
        marker([localShops.shops[j].lat, localShops.shops[j].lon], { 
        icon: customIcon
        }).addTo(this.storeMarkerGroup).bindPopup(localShops.shops[j].name) 
        j++
      }

    };
  };
}
