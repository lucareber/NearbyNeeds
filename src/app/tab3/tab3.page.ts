import { Component, SimpleChanges, NgModule } from '@angular/core';
import { IonToast, IonGrid, IonRow, IonCol, IonList, IonTextarea, IonDatetime, IonPopover, IonInput, IonModal, IonFooter, IonIcon, IonLabel, IonItem, IonButton, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { Map, latLng, tileLayer, Layer, marker, icon, Polyline, polyline, Marker, divIcon } from 'leaflet';
import { ToastController } from '@ionic/angular';
import { BackgroundRunner } from '@capacitor/background-runner'

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: true,
  imports: [IonToast, IonGrid, IonRow, IonCol, IonList, IonTextarea, IonDatetime, IonPopover, IonInput, IonModal, IonFooter, IonIcon, IonLabel, IonItem, IonButton, IonHeader, IonToolbar, IonTitle, IonContent, ExploreContainerComponent],
})

export class Tab3Page {

  // adding constants for map and marker 
  private mapLocation: any;
  private markerLocation: any;
  constructor(private toastController: ToastController) {}

  // adding constants for creating new store
  public newStoreName: string = "";
  public newStoreAddress: string = "";
  public newStoreDescription: string = "";
  public newStoreLocationLat: number = NaN;
  public newStoreLocationLon: number = NaN;
  
  // update the app if enter the view
  ionViewDidEnter() { this.getExistingShops(); } 

  // load the stores from the local storage
  async getExistingShops() {
    var localShops = JSON.parse(localStorage.getItem('shops') || '{"shops": []}');
    console.log(localShops);
    // empty the currently displayed store list
    document.getElementById("containerShops")!.innerHTML = "";
    // read JSON data as JSON and select only the part with the stores (shops)
    var data = localShops.shops
    // sort the list of store dicts
    data = data.sort((a : any, b : any) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0))
    // iterate through all stores and create corresponding elements
    let i = 0;
    const shopDisplayList = document.getElementById("containerShops")!
    while (i < data.length) {
      // add some styling to the list
      shopDisplayList.style.paddingLeft="16px"
      shopDisplayList.style.paddingRight="16px"
      // shop item
      const indivShopItem = document.createElement("ion-item");
      indivShopItem.setAttribute("key", data[i].name)
      indivShopItem.style.marginBlock = "16px"
      // shop text 
      const indivShopText = document.createElement("ion-list");
      indivShopText.setAttribute("slot", "start");
      indivShopText.style.maxWidth = "80%"
      indivShopText.style.marginLeft="-16px"
      const indivShopNameItem = document.createElement("ion-item");
      const indivShopName = document.createElement("ion-label");
      indivShopName.style.fontSize = "2em";
      indivShopName.style.fontWeight = "700";
      indivShopName.innerHTML = data[i].name;
      indivShopNameItem.appendChild(indivShopName);
      indivShopText.appendChild(indivShopNameItem);
      const indivShopAddressItem = document.createElement("ion-item");
      const indivShopAddress = document.createElement("ion-label");
      indivShopAddress.innerHTML = data[i].address;
      indivShopAddressItem.appendChild(indivShopAddress);
      indivShopText.appendChild(indivShopAddressItem);
      const indivShopPositionItem = document.createElement("ion-item");
      const indivShopPosition = document.createElement("ion-label");
      const indivShopPositionLink = document.createElement("a");
      const linkString = "https://www.google.com/maps/place/" + data[i].lat + "," + data[i].lon;
      indivShopPositionLink.setAttribute("href", linkString);
      indivShopPositionLink.innerHTML = "Google Maps";
      indivShopPosition.appendChild(indivShopPositionLink);
      indivShopPositionItem.appendChild(indivShopPosition);
      indivShopText.appendChild(indivShopPositionItem);
      const indivShopDescriptionItem = document.createElement("ion-item");
      const indivShopDescription = document.createElement("ion-note");
      indivShopDescription.innerHTML = data[i].description;
      indivShopDescriptionItem.appendChild(indivShopDescription)
      indivShopText.appendChild(indivShopDescriptionItem)
      // delete button
      const indivShopDelete = document.createElement("ion-button");
      indivShopDelete.setAttribute("slot", "end");
      indivShopDelete.setAttribute("id", data[i].name);
      indivShopDelete.onclick = event => this.deleteStore(event) 
      indivShopDelete.setAttribute("color", "danger");
      const indivShopDeleteIcon = document.createElement("ion-icon");
      indivShopDeleteIcon.setAttribute("name", "trash");
      indivShopDeleteIcon.setAttribute("size", "large");
      indivShopDelete.appendChild(indivShopDeleteIcon);
      // add all elements to the display
      indivShopItem.appendChild(indivShopText);
      indivShopItem.appendChild(indivShopDelete);
      shopDisplayList.appendChild(indivShopItem);        
      i++;
    };
  };

  // delete existing stores
  async deleteStore(event: any) {
    var localShops = JSON.parse(localStorage.getItem('shops') || '{"shops": []}');
    console.log(localShops);
    // empty the currently displayed store list
    document.getElementById("containerShops")!.innerHTML = "";
    // read JSON data as JSON and select only the part with the stores (shops)
    var data = localShops.shops
    var storeToBeDeleted = (event.target as Element).id;
    // check if products of store exist 
    var localProducts = JSON.parse(localStorage.getItem('products') || '{"products": []}');
    localProducts = localProducts.products;
    const uniqueStores = new Set()
    localProducts.forEach((element: any) => uniqueStores.add(element.store))
    if (uniqueStores.has(storeToBeDeleted)) {
      const toast = await this.toastController.create({
        message: 'Für diesen Einkaufsladen existiert eine Einkaufsliste mit Produkten.',
        duration: 3000,
        position: 'top',
        color: "danger"
      });
      this.getExistingShops();
      await toast.present();
    }
    else{
      let j = 0;
      var newStoreList = [];
      while (j < data.length) { 
        if (storeToBeDeleted != data[j].name) {
          newStoreList.push(data[j]);
        }
        j++;
      };
      var jsonAsString = JSON.stringify({"shops": newStoreList})
      localStorage.setItem('shops', jsonAsString);   
      this.saveStoresForBackground(jsonAsString);
      this.getExistingShops();
    };
    
  };

  // update store name
  async createStoreName(event: any) {
    this.newStoreName = event.target.value;
  };

  // update store address
  async createStoreAddress(event: any) {
    this.newStoreAddress = event.target.value;
  };

  // update store description
  async createStoreDescription(event: any) {
    this.newStoreDescription = event.target.value;
  };

  // update store location
  async createStoreLocation(event: any) {
    this.newStoreLocationLat = event.target.value;
    this.newStoreLocationLon = event.target.value;
  };

  // save a new store in the local storage
  async saveNewStore() {
    if (this.newStoreName != "" && !Number.isNaN(this.newStoreLocationLat) && !Number.isNaN(this.newStoreLocationLon)) {
      var jsonStringShop = {name: this.newStoreName, address: this.newStoreAddress, description: this.newStoreDescription, lat: this.newStoreLocationLat, lon: this.newStoreLocationLon};
      var localShops = JSON.parse(localStorage.getItem('shops') || '{"shops": []}');
      var dataLocalShops = localShops.shops;
      // check if name not exist
      let k = 0
      var localShopsName = []
      while (k < dataLocalShops.length) { 
        localShopsName.push(dataLocalShops[k].name);
        k++;
      };
      if (localShopsName.includes(this.newStoreName)) {
        const toast = await this.toastController.create({
          message: 'Name existiert bereits.',
          duration: 3000,
          position: 'top',
          color: "danger"
        });
        await toast.present();
      }
      else {
        let j = 0;
        var newStoreList = [jsonStringShop];
        if ('shops' in localShops) {
          while (j < dataLocalShops.length) { 
            newStoreList.push(dataLocalShops[j]);
            j++;
          };
        }
        var jsonASString = JSON.stringify({"shops": newStoreList});
        localStorage.setItem('shops', jsonASString);
        this.saveStoresForBackground(jsonASString);

        console.log(JSON.parse(localStorage.getItem('shops') || '{"shops": []}'));
  
        // close the modal (dialog for creating new store)
        var dialogCreateShopElement = document.getElementById("dialogCreateShop") as HTMLIonModalElement 
        dialogCreateShopElement.dismiss()
        // update store list
        this.getExistingShops()
        // reset the constants
        this.newStoreName = "";
        this.newStoreAddress = "";
        this.newStoreDescription = "";
        this.newStoreLocationLat = NaN;
        this.newStoreLocationLon = NaN;
        this.markerLocation = undefined;
      };
    }
    else {
      const toast = await this.toastController.create({
        message: 'Name und Position müssen zwingend angegeben werden.',
        duration: 3000,
        position: 'top',
        color: "danger"
      });
      await toast.present();
    };
  };

  // show the clicked position on the map
  async showLocationMap() {
    // reset the constants
    this.newStoreLocationLat = NaN;
    this.newStoreLocationLon = NaN;
    this.markerLocation = undefined;
    // in set View and latLng and zoom
    this.mapLocation = new Map('mapLocationID', {attributionControl: false}).setView([47.06065556639703, 7.621794883042422], 15); 
    var geoadminUrl = "https://wms.geo.admin.ch/?";   // swisstopo
    tileLayer.wms(geoadminUrl, {
      layers: 'ch.swisstopo.pixelkarte-farbe',
      format: 'image/jpeg',
      detectRetina: true,
      minZoom: 0,
      maxZoom: 20,
      attribution: "Map by <a href = 'https://www.swisstopo.admin.ch/en/home.html'>swisstopo</a>"
    }).addTo(this.mapLocation);
    this.mapLocation.on('click', (e : any) => {
      console.log(e.latlng);
      this.newStoreLocationLat = e.latlng.lat;
      this.newStoreLocationLon = e.latlng.lng;
      // add marker to clicked position
      // create custom icon from:
      // https://stackoverflow.com/questions/23567203/leaflet-changing-marker-color 
      const markerHtmlStyles = `
        background-color: #58508d;
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
      if (this.markerLocation == undefined) {
        this.markerLocation = new Marker (e.latlng, {icon: customPosIcon}).addTo(this.mapLocation);
      }
      else (
        this.markerLocation.setLatLng(e.latlng)
      )
    });
  };

  // save the clicked position
  async saveLocation() {
    // close the modal (dialog for creating new location)
    var dialogCreateShopElement = document.getElementById("dialogShopPosition") as HTMLIonModalElement;
    dialogCreateShopElement.dismiss();
    // change the displayes text on the button 
    var createLocationButton = document.getElementById("openSetPosition")!;
    createLocationButton.innerHTML = ""
    var createLocationButtonLabel = document.createElement("ion-label");
    createLocationButtonLabel.setAttribute("id", "openSetPositionLabel");
    createLocationButtonLabel.setAttribute("slot", "end");
    if (!Number.isNaN(this.newStoreLocationLat) && !Number.isNaN(this.newStoreLocationLon)) {
      createLocationButtonLabel.innerHTML = this.newStoreLocationLat.toFixed(5) + " / " + this.newStoreLocationLon.toFixed(5);
      createLocationButton.appendChild(createLocationButtonLabel);
    };
    var createLocationButtonIcon = document.createElement('ion-icon');
    createLocationButtonIcon.setAttribute("name", "locate");
    createLocationButtonIcon.setAttribute("size", "large");
    createLocationButtonIcon.setAttribute("slot", "start");
    createLocationButton.appendChild(createLocationButtonIcon);
  };

  // save store for use in background
  async saveStoresForBackground(jsonStringStores: string) {
    const result = await BackgroundRunner.dispatchEvent({
      label: 'com.capacitor.background.check',
      event: 'saveStore',
      details: {'shops': jsonStringStores},
    });
    console.log('save result', result);
  };
};

