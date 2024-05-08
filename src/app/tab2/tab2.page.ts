import { Component, SimpleChanges } from '@angular/core';
import { IonGrid, IonRow, IonCol, IonList, IonTextarea, IonDatetime, IonPopover, IonInput, IonModal, IonFooter, IonIcon, IonLabel, IonItem, IonButton, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { Map, latLng, tileLayer, Layer, marker, icon, Polyline, polyline, Marker } from 'leaflet';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [IonGrid, IonRow, IonCol, IonList, IonTextarea, IonDatetime, IonPopover, IonInput, IonModal, IonFooter, IonIcon, IonLabel, IonItem, IonButton, IonHeader, IonToolbar, IonTitle, IonContent, ExploreContainerComponent],
})
export class Tab2Page {

  constructor() {}

  public newProductName: string = "";
  public newProductAmount: string = "";
  public newProductStore: string = "";

  ngOnInit(){
    this.getExistingShops()
    this.getExistingProducts()
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes)
  }

  async getExistingShops() {
    var localShops = JSON.parse(localStorage.getItem('shops') || '{}');
    console.log(localShops);
  } 

  async getExistingProducts() {
    var localProducts = JSON.parse(localStorage.getItem('products') || '{}');
    console.log(localProducts);
    // empty the currently displayed product list
    document.getElementById("containerProducts")!.innerHTML = "";
    var data = localProducts.products
    console.log(data)
    // iterate through all products and create corresponding elements
    let i = 0;
    const productDisplayList = document.getElementById("containerProducts")!
    while (i < data.length) {
      // add some styling to the list
      productDisplayList.style.paddingLeft="16px"
      productDisplayList.style.paddingRight="16px"
      // product item
      const indivProductItem = document.createElement("ion-item");
      indivProductItem.style.marginBlock = "16px"
      // product text 
      const indivProductText = document.createElement("ion-list");
      indivProductText.setAttribute("slot", "start");
      indivProductText.style.maxWidth = "80%"
      indivProductText.style.marginLeft="-16px"
      const indivProductNameItem = document.createElement("ion-item");
      const indivProductName = document.createElement("ion-label");
      indivProductName.style.fontSize = "2em";
      indivProductName.style.fontWeight = "700";
      indivProductName.innerHTML = data[i].name;
      indivProductNameItem.appendChild(indivProductName);
      indivProductText.appendChild(indivProductNameItem);
      const indivProductAmountItem = document.createElement("ion-item");
      const indivProductAmount = document.createElement("ion-label");
      indivProductAmount.innerHTML = data[i].amount;
      indivProductAmountItem.appendChild(indivProductAmount);
      indivProductText.appendChild(indivProductAmountItem);
      const indivProductStoreItem = document.createElement("ion-item");
      const indivProductStore = document.createElement("ion-label");
      indivProductStore.innerHTML = data[i].store;
      indivProductStoreItem.appendChild(indivProductStore);
      indivProductText.appendChild(indivProductStoreItem);
      // delete button
      const indivProductDelete = document.createElement("ion-button");
      indivProductDelete.setAttribute("slot", "end");
      indivProductDelete.setAttribute("id", data[i].name);
      indivProductDelete.onclick = event => this.deleteProduct(event) 
      indivProductDelete.setAttribute("color", "success");
      const indivProductDeleteIcon = document.createElement("ion-icon");
      indivProductDeleteIcon.setAttribute("name", "checkmark-circle-outline");
      indivProductDeleteIcon.setAttribute("size", "large");
      indivProductDelete.appendChild(indivProductDeleteIcon);
      // add all elements to the display
      indivProductItem.appendChild(indivProductText);
      indivProductItem.appendChild(indivProductDelete);
      productDisplayList.appendChild(indivProductItem);    
      i++;
    };
  } 
  
  async deleteProduct(event: any) {
    var localProducts = JSON.parse(localStorage.getItem('products') || '{}');
    console.log(localProducts);
    // empty the currently displayed product list
    document.getElementById("containerProducts")!.innerHTML = "";
    // read JSON data as JSON and select only the part with the products
    var data = localProducts.products
    var productToBeDeleted= (event.target as Element).id;
    let j = 0;
    var newProductList = [];
    while (j < data.length) { 
      if (productToBeDeleted != data[j].name) {
        newProductList.push(data[j]);
      }
      j++;
    };
    var jsonAsString = JSON.stringify({"products": newProductList})
    localStorage.setItem('products', jsonAsString);   
    this.getExistingProducts()
  }

  async createProductName(event: any) {
    this.newProductName = event.target.value;
  };

  async createProductAmount(event: any) {
    this.newProductAmount = event.target.value;
  };

  async createProductStore(event: any) {
    this.newProductStore = event.target.value;
  };


  async saveNewProduct() {
    if (this.newProductName != "") {
      var jsonStringProduct = {name: this.newProductName, amount: this.newProductAmount, store: this.newProductStore};
      var localProducts = JSON.parse(localStorage.getItem('products') || '{}');
      var dataLocalProducts = localProducts.products;

      let j = 0;
      var newProductList = [jsonStringProduct];
      if ('products' in localProducts) {
        while (j < dataLocalProducts.length) { 
          newProductList.push(dataLocalProducts[j]);
          j++;
        };
      }
      var jsonASString = JSON.stringify({"products": newProductList});
      localStorage.setItem('products', jsonASString);

      console.log(JSON.parse(localStorage.getItem('products') || '{}'));

      // close the modal (dialog for creating new products)
      var dialogCreateProductElement = document.getElementById("dialogCreateProduct") as HTMLIonModalElement 
      dialogCreateProductElement.dismiss()
  
      // update product list
      this.getExistingProducts()
    }
    else {
      document.getElementById('inputNameCreateProduct')!.setAttribute("helper-text", "Name muss eingegeben werden.") 
    };

  };

}





