
// trigger notifivation if near by a shop with products
addEventListener('notificationTest', async (resolve, reject, args) => {
  const deviceLocation = await CapacitorGeolocation.getCurrentPosition();
  const shops = CapacitorKV.get('shops');
  var localShops = JSON.parse(shops.value);
  for (const element of localShops.shops) {
    var dist = Math.sqrt(Math.pow(111.3 * (deviceLocation.latitude - element.lat), 2) + Math.pow(71.5 * (deviceLocation.longitude - element.lon), 2));
    if (dist <= 0.5) {
      const products = CapacitorKV.get('products');
      var localProducts = JSON.parse(products.value);
      let valuesSet = new Set();
      for (const object of localProducts.products) {
        valuesSet.add(object.store);
      }
      if (valuesSet.has(element.name)) {
        try {
          let scheduleDate = new Date();
          scheduleDate.setSeconds(scheduleDate.getSeconds() + 5);
          CapacitorNotifications.schedule([
            {
              id: 42,
              title: 'Einkaufsladen in der Nähe!',
              body: element.name + ' (Distanz: ' + Math.round(dist * 1000) + 'm)',
              scheduleAt: scheduleDate,
            },
          ]);
          resolve();
        } catch (err) {
          console.error(err);
          reject(err);
        }
      }
    }
  }
});


// Save a value to the Capacitor KV store
addEventListener('saveStore', async (resolve, reject, args) => {
  try {
    CapacitorKV.set('shops', args.shops);
    resolve();
  } catch (err) {
    console.error(err);
    reject(err);
  }
});

// Save a value to the Capacitor KV store
addEventListener('saveProduct', async (resolve, reject, args) => {
  try {
    CapacitorKV.set('products', args.products);
    resolve();
  } catch (err) {
    console.error(err);
    reject(err);
  }
});


// function starts when app is closed (repeating -> according to capacitor.confic.ts)
addEventListener('checkIn', async (resolve, reject, args) => {
 const deviceLocation = await CapacitorGeolocation.getCurrentPosition();
 const shops = CapacitorKV.get('shops');
 var localShops = JSON.parse(shops.value);
 
 for (const element of localShops.shops) {
   var dist = Math.sqrt(Math.pow(111.3 * (deviceLocation.latitude - element.lat), 2) + Math.pow(71.5 * (deviceLocation.longitude - element.lon), 2));
   if (dist <= 0.5) {
     const products = CapacitorKV.get('products');
     var localProducts = JSON.parse(products.value);
     let valuesSet = new Set();
     for (const object of localProducts.products) {
       valuesSet.add(object.store);
     }
     if (valuesSet.has(element.name)) {
       try {
         let scheduleDate = new Date();
         scheduleDate.setSeconds(scheduleDate.getSeconds() + 5);
         CapacitorNotifications.schedule([
           {
             id: 42,
             title: 'Einkaufsladen in der Nähe!',
             body: element.name + ' (Distanz: ' + Math.round(dist * 1000) + 'm)',
             scheduleAt: scheduleDate,
           },
         ]);
         resolve();
       } catch (err) {
         console.error(err);
         reject(err);
       }
     }
   }
 }
});

