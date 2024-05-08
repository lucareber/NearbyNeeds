import { Component, SimpleChanges } from '@angular/core';
import { IonGrid, IonRow, IonCol, IonList, IonTextarea, IonDatetime, IonPopover, IonInput, IonModal, IonFooter, IonIcon, IonLabel, IonItem, IonButton, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { Map, latLng, tileLayer, Layer, marker, icon, Polyline, polyline, Marker } from 'leaflet';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: true,
  imports: [IonGrid, IonRow, IonCol, IonList, IonTextarea, IonDatetime, IonPopover, IonInput, IonModal, IonFooter, IonIcon, IonLabel, IonItem, IonButton, IonHeader, IonToolbar, IonTitle, IonContent, ExploreContainerComponent],
})
export class Tab3Page {
  private mapLocation: any;
  private markerLocation: any;

  constructor() {}

  public newStoreName: string = "";
  public newStoreAddress: string = "";
  public newStoreDescription: string = "";
  public newStoreLocationLat: number = NaN;
  public newStoreLocationLon: number = NaN;

  ngOnInit(){
    this.getExistingShops()
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes)
  }

  async getExistingShops() {
    var localShops = JSON.parse(localStorage.getItem('shops') || '{}');
    console.log(localShops);
    // empty the currently displayed store list
    document.getElementById("containerShops")!.innerHTML = "";
    // read JSON data as JSON and select only the part with the stores (shops)
    var data = localShops.shops
    console.log(data)
    // iterate through all stores and create corresponding elements
    let i = 0;
    const shopDisplayList = document.getElementById("containerShops")!
    while (i < data.length) {
      // add some styling to the list
      shopDisplayList.style.paddingLeft="16px"
      shopDisplayList.style.paddingRight="16px"
      // shop item
      const indivShopItem = document.createElement("ion-item");
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
  } 

  async deleteStore(event: any) {
    var localShops = JSON.parse(localStorage.getItem('shops') || '{}');
    console.log(localShops);
    // empty the currently displayed store list
    document.getElementById("containerShops")!.innerHTML = "";
    // read JSON data as JSON and select only the part with the stores (shops)
    var data = localShops.shops
    var storeToBeDeleted= (event.target as Element).id;
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
    this.getExistingShops()
  };

  async createStoreName(event: any) {
    this.newStoreName = event.target.value;
  };

  async createStoreAddress(event: any) {
    this.newStoreAddress = event.target.value;
  };

  async createStoreDescription(event: any) {
    this.newStoreDescription = event.target.value;
  };

  async createStoreLocation(event: any) {
    this.newStoreLocationLat = event.target.value;
    this.newStoreLocationLon = event.target.value;
  };

  async saveNewStore() {
    if (this.newStoreName != "") {
      var jsonStringShop = {name: this.newStoreName, address: this.newStoreAddress, description: this.newStoreDescription, lat: this.newStoreLocationLat, lon: this.newStoreLocationLon};
      var localShops = JSON.parse(localStorage.getItem('shops') || '{}');
      var dataLocalShops = localShops.shops;
      // check if name not exist
      let k = 0
      var localShopsName = []
      while (k < dataLocalShops.length) { 
        localShopsName.push(dataLocalShops[k].name);
        k++;
      };
      if (localShopsName.includes(this.newStoreName)) {
        document.getElementById('inputNameCreateShop')!.setAttribute("helper-text", "Name existiert bereits.") 
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

        console.log(JSON.parse(localStorage.getItem('shops') || '{}'));
  
        // close the modal (dialog for creating new store)
        var dialogCreateShopElement = document.getElementById("dialogCreateShop") as HTMLIonModalElement 
        dialogCreateShopElement.dismiss()
    
        // update store list
        this.getExistingShops()
      };
    }
    else {
      document.getElementById('inputNameCreateShop')!.setAttribute("helper-text", "Name muss eingegeben werden.") 
    };

  };


  async showLocationMap() {
    // In set View and latLng and zoom
    this.mapLocation = new Map('mapLocationID', {attributionControl: false}).setView([47.06065556639703, 7.621794883042422], 15); 
    tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png', {
      minZoom: 0,
      maxZoom: 20,
      attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.mapLocation);
    this.mapLocation.on('click', (e : any) => {
      console.log(e.latlng);
      this.newStoreLocationLat = e.latlng.lat;
      this.newStoreLocationLon = e.latlng.lng;
      // add marker to clicked position
      const myIcon = icon({ 
        iconUrl: 'leaflet/marker-icon.png', 
        shadowUrl: 'leaflet/marker-shadow.png', 
        iconAnchor: [12, 41], // point of the icon which will correspond to marker's location 
        popupAnchor: [0, -41] // point from which the popup should open relative to the iconAnchor
      }); 
      if (this.markerLocation == undefined) {
        this.markerLocation = new Marker (e.latlng, {icon: myIcon}).addTo(this.mapLocation);
      }
      else (
        this.markerLocation.setLatLng(e.latlng)
      )
    });
  };

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
};

