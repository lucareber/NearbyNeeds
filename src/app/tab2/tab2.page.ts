import { Component, SimpleChanges } from '@angular/core';
import { IonToast, IonSearchbar, IonRadioGroup, IonRadio, IonGrid, IonRow, IonCol, IonList, IonTextarea, IonDatetime, IonPopover, IonInput, IonModal, IonFooter, IonIcon, IonLabel, IonItem, IonButton, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [IonToast, IonSearchbar, IonRadioGroup, IonRadio, IonGrid, IonRow, IonCol, IonList, IonTextarea, IonDatetime, IonPopover, IonInput, IonModal, IonFooter, IonIcon, IonLabel, IonItem, IonButton, IonHeader, IonToolbar, IonTitle, IonContent, ExploreContainerComponent],
})
export class Tab2Page {

  constructor(private toastController: ToastController) {}

  public newProductName: string = "";
  public newProductAmount: string = "";
  public newProductStore: string = "";
  public storeRadioFilterString: string = "";
  public storeListFilterString: string = "";

  ngOnInit(){
    this.getExistingShops()
    this.getExistingProducts()
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes)
  }

  async getExistingShops() {
    var localShops = JSON.parse(localStorage.getItem('shops') || '{"shops": []}');
    localShops = localShops.shops;
    console.log(localShops);
    return localShops;
  } 

  async getExistingProducts() {
    var localProducts = JSON.parse(localStorage.getItem('products') || '{"products": []}');
    console.log(localProducts);
    // empty the currently displayed product list
    const productDisplayList = document.getElementById("containerProducts")!
    productDisplayList.innerHTML = "";
    var data = localProducts.products
    console.log(data)
    // get all stores with products
    const uniqueStores = new Set()
    data.forEach((element: any) => uniqueStores.add(element.store))
    // iterate through all stores and plot the items
    for (const storeObj of Array.from(uniqueStores).sort()) {
      if ((String(storeObj).toLocaleLowerCase().startsWith(this.storeListFilterString.toLocaleLowerCase()))) {
        const storeShopList = document.createElement('ion-list');
        storeShopList.setAttribute("key", String(storeObj))
        storeShopList.style.marginTop = "16px";
        const storeShopTBar = document.createElement('ion-toolbar');
        const storeShopListName = document.createElement('ion-label');
        storeShopListName.innerHTML = String(storeObj);
        storeShopListName.style.paddingLeft = "16px";
        storeShopListName.style.paddingRight = "16px";
        storeShopListName.style.fontSize = "2em";
        storeShopListName.style.fontWeight = "700";
        storeShopTBar.appendChild(storeShopListName);
        storeShopList.appendChild(storeShopTBar);
        const productTableItem = document.createElement('ion-item');
        const productTable = document.createElement('ion-grid');
        for (const productObj of data) {
          if (productObj.store === storeObj) {
            const productTableRow = document.createElement('ion-row');
            productTableRow.classList.add("ion-align-items-center");
            // amount
            const productTableAmount = document.createElement('ion-col');
            productTableAmount.setAttribute("size", "2");
            productTableAmount.classList.add("ion-align-items-center");
            productTableAmount.innerHTML = String(productObj.amount);
            productTableRow.appendChild(productTableAmount);
            // product (name)
            const productTableName = document.createElement('ion-col');
            productTableName.classList.add("ion-align-items-center");
            productTableName.innerHTML = String(productObj.name);
            productTableRow.appendChild(productTableName);
            // delete button
            const productTableDelete = document.createElement('ion-col');
            productTableDelete.setAttribute("size", "auto");
            productTableDelete.classList.add("ion-align-items-center");
            const productTableDeleteBut = document.createElement('ion-button');
            productTableDeleteBut.setAttribute("id", productObj.uid);
            productTableDeleteBut.onclick = event => this.deleteProduct(event) 
            productTableDeleteBut.setAttribute("color", "success");
            const productTableDeleteButIcon = document.createElement("ion-icon");
            productTableDeleteButIcon.setAttribute("name", "checkmark-circle-outline");
            productTableDeleteButIcon.setAttribute("size", "large");
            productTableDeleteBut.appendChild(productTableDeleteButIcon);
            productTableDelete.appendChild(productTableDeleteBut);
            productTableRow.appendChild(productTableDelete);
            productTable.appendChild(productTableRow);
          };
        };
        productTableItem.appendChild(productTable)
        storeShopList.appendChild(productTableItem);
        productDisplayList.appendChild(storeShopList);
      };
    };
  };

  async updateStoreListFilter(event: any) {
    this.storeListFilterString = event.target.value;
    this.getExistingProducts();
  };
  
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
      if (productToBeDeleted != data[j].uid) {
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
    if (this.newProductName != "" && this.newProductStore != "") {
      var jsonStringProduct = {name: this.newProductName, amount: this.newProductAmount, store: this.newProductStore, uid: crypto.randomUUID()};
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
      const toast = await this.toastController.create({
        message: 'Produkt und Einkaufsladen müssen definiert sein.',
        duration: 3000,
        position: 'top',
        color: "danger"
      });
      await toast.present();
    };

  };

  async resetProductVariable() {
    this.newProductName = "";
    this.newProductAmount = "";
    this.newProductStore = "";
  };


  async updateStoreRadioFilter(event: any) {
    this.storeRadioFilterString = event.target.value;
    this.fillStoreRadio();
  }

  async fillStoreRadio() {
    // get the shops from the local storage
    var shops = await this.getExistingShops();
    // sort the list of store dicts
    shops = shops.sort((a : any, b : any) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0))
    // add a radio-group to the content
    const selectShopContent = document.getElementById("radioShopsContent")!;
    // remove displayed radio from the display
    selectShopContent.innerHTML = "";
    // iterate through the shops an add them to the radio
    const selectRadioShop = document.createElement('ion-radio-group');
    selectRadioShop.addEventListener('ionChange', (e : CustomEvent) => {
      this.createProductStore(e);
    });
    for (const element of shops) {
      if (element.name.toLocaleLowerCase().startsWith(this.storeRadioFilterString.toLocaleLowerCase())) {
        const shopItem = document.createElement('ion-item');
        const shopRadio = document.createElement('ion-radio');
        shopRadio.setAttribute("value", element.name);
        const shopName = document.createElement('ionLabel');
        var shopNameString = "<b>" + element.name + "</b></br>";
        if (element.address != '') {
          shopNameString += element.address;
        }
        else {
          shopNameString += element.lat.toFixed(5) + " / " + element.lon.toFixed(5)
        };
        shopName.innerHTML = shopNameString;
        shopRadio.appendChild(shopName);
        shopItem.appendChild(shopRadio);
        selectRadioShop.appendChild(shopItem);
        selectShopContent.appendChild(selectRadioShop);
      };
    };
    selectRadioShop.setAttribute('value', this.newProductStore);
  };

  async updateStoreButton() {
    const storeSelectButton = document.getElementById('openSetStore')!;
    storeSelectButton.innerHTML = "";
    if (this.newProductStore != "") {
      const storeSelButLabel = document.createElement('ion-label');
      storeSelButLabel.innerHTML = this.newProductStore;
      storeSelButLabel.setAttribute("slot", "end");
      storeSelectButton.appendChild(storeSelButLabel);
    }
    const storeSelButIcon = document.createElement('ion-icon');
    storeSelButIcon.setAttribute("name", "storefront-outline");
    storeSelButIcon.setAttribute("size", "large");
    storeSelButIcon.setAttribute("slot", "start");
    storeSelectButton.appendChild(storeSelButIcon);
    // remove store filtering (reset string)
    this.storeRadioFilterString = "";
    console.log(this.newProductStore)
  };


  async saveStoreExit() {
    (document.getElementById("dialogShopSelection") as HTMLIonModalElement).dismiss();
  };
}


