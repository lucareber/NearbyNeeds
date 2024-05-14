import { Component } from '@angular/core';
import { IonIcon, IonButton, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { Geolocation } from '@capacitor/geolocation';
import { Map, latLng, tileLayer, Layer, marker, icon, Polyline, polyline, layerGroup, divIcon, markerClusterGroup } from 'leaflet';
import 'leaflet.markercluster';
import { BackgroundRunner } from '@capacitor/background-runner'
import { interval, Subscription} from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [IonIcon, IonButton, IonHeader, IonToolbar, IonTitle, IonContent, ExploreContainerComponent, ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})

export class Tab1Page {

  // adding constants for map, marker group and device coordinates
  private map: any //Map|undefined;
  private storeMarkerGroup: any;
  public coordinates: string = "";
  // public mySubscription: Subscription

  constructor() {     // trigger notifications while the app is open -> not necessary 
    this.init()       //, this.mySubscription=interval(5000).subscribe((x =>{this.scheduleNotification()}));
  };

  async init() {
    try {
      const permissions = await BackgroundRunner.requestPermissions({
        apis: ['notifications', 'geolocation'],
      });
      console.log('permissions', permissions);
    } catch (err) {
      console.log(`ERROR: ${err}`);
    }
  }


  // Schedule a notification from background (only when the app is open -> old function not in use)
  async scheduleNotification() {
    const coordinates = await Geolocation.getCurrentPosition();
    var localShops = JSON.parse(localStorage.getItem('shops') || '{"shops": []}');
    for (const element of localShops.shops) {
      var dist = Math.sqrt(Math.pow(111.3 * (coordinates.coords.latitude - element.lat), 2) + Math.pow(71.5 * (coordinates.coords.longitude - element.lon), 2));
      if (dist <= 0.5) {
        var localProducts = JSON.parse(localStorage.getItem('products') || '{}')
        let valuesSet = new Set();
        for (const object of localProducts.products) {
          valuesSet.add(object.store);
        }
        if (valuesSet.has(element.name)) {
          console.log('now')
          await BackgroundRunner.dispatchEvent({
            label: 'com.capacitor.background.check',
            event: 'notificationTest',
            details: {},
          });
        };
      };
    };
  };


  // update the app if enter the view
  ionViewDidEnter() { this.leafletMap(); this.showShopsOnMap(); } 
  
  // initializing the map
  leafletMap() { 
    if (this.map == undefined) { 
      var customClusterIcon = divIcon({
        className: 'custom-cluster-icon',
        html: '<div class="cluster-icon"><span></span></div>',
        iconSize: [400, 400] // Adjust the size as needed
      });
    
      // in setView add latLng and zoom 
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
          const count = cluster.getChildCount(); // get the count of markers in the cluster
          // create custom icon from:
          // https://stackoverflow.com/questions/23567203/leaflet-changing-marker-color 
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
            font-size: 16px;
            font-weight: 700;`;
          // return a divIcon with the count of markers
          return divIcon({
            className: "marker-cluster",
            html: `<div style="${markerHtmlStyles}">${count}</div>`
          });
        }
      }).addTo(this.map);
    }
    else {
      this.map.off();
      this.map.remove();
      this.map = undefined;
      this.leafletMap();
    };
  };

  // retrieve the current position of the device and display it on the map
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
      });
      marker([coordinates.coords.latitude, coordinates.coords.longitude], { 
        icon: customPosIcon
      }).addTo(this.map)  
      this.map.panTo(latLng(coordinates.coords.latitude, coordinates.coords.longitude));
    };
  };

  // display of locally stored stores on the map
  async showShopsOnMap() {
    var localShops = JSON.parse(localStorage.getItem('shops') || '{"shops": []}');
    console.log(localShops)
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
        icon: customIcon                // add a popup with the name
        }).addTo(this.storeMarkerGroup).bindPopup(localShops.shops[j].name) 
        j++
      }
    };
  };
};
