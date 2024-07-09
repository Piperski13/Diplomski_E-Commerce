import {proizvodi,ucitavanjeProizvoda} from '../../podaci/proizvodi.js';
import {porudzbine} from '../../podaci/porudzbine.js';
import {pprikaziDatumNarudzbinePracenje,trakaNapretka} from '../../alatke/datum.js';
import {izracunajKolicinuKorpe} from "../../podaci/korpa.js"

const url = new URL(window.location.href);
console.log(url.searchParams.get('porudzbinaId'));
console.log(url.searchParams.get('proizvodId'));

// ucitavanjeProizvoda().then(()=>{
//   renderTrackingPage();
// })

async function renderTrackingPage(){
  await ucitavanjeProizvoda();

  let matchingProduct;
  let matchingOrder;
  let matchingdatumPorudzbine;

  const madeOrderId = url.searchParams.get('porudzbinaId');
  const productOrderId = url.searchParams.get('proizvodId');

  porudzbine.forEach(porudzbina => {
    if(porudzbina.id === madeOrderId){

      matchingOrder = porudzbina;
      matchingdatumPorudzbine = porudzbina;

      matchingOrder.proizvodi.forEach(productOrder => {
        if(productOrder.proizvodId === productOrderId){
          matchingOrder = productOrder;
        }
      });
    }
  });
    
  proizvodi.forEach(proizvod => {
    if(proizvod.id === productOrderId ){
      matchingProduct = proizvod;
    }
  });

  const progressionDelivery = trakaNapretka(matchingdatumPorudzbine.vremePorudzbine,matchingOrder.estimatedDeliveryTime);
  // console.log(`matchingdatumPorudzbine.vremePorudzbine: ${matchingdatumPorudzbine.vremePorudzbine}`);
  // console.log(`matchingOrder.estimatedDeliveryTime: ${matchingOrder.estimatedDeliveryTime}`);
  // console.log(`progressionDelivery: ${progressionDelivery}`);

  let generisaniHTML = `
     <div class="porudzbina-tracking">
        <a class="back-to-porudzbine-link link-primary" href="porudzbine.html">
          Pogledajte sve porudžbine 
        </a>

        <div class="dostava-date">
          Dolazak u: ${pprikaziDatumNarudzbinePracenje(matchingOrder.estimatedDeliveryTime)}
        </div>

        <div class="proizvod-info">
          ${matchingProduct.naziv}
        </div>

        <div class="proizvod-info">
          Količina: ${matchingOrder.kolicina}
        </div>

        <img class="proizvod-image" src="${matchingProduct.slika}">

        <div class="progress-labels-container">
          <div class="progress-label ${progressionDelivery <=49 ? 'current-status' : '' }" >
            Priprema
          </div>
          <div class="progress-label 
          ${progressionDelivery >49 && progressionDelivery <=99 ? 'current-status' : '' }">
            Isporučen
          </div>
          <div class="progress-label ${progressionDelivery >=100 ? 'current-status' : '' }">
            Dostavljen
          </div>
        </div>

        <div class="progress-bar-container">
          <div class="progress-bar" 
          style="
          width:${progressionDelivery}%"></div>
        </div>
      </div>
  `;
  document.querySelector('.glavni-sadrzaj').innerHTML = generisaniHTML;
  updatekorpakolicina();

  function updatekorpakolicina(){        
    let korpakolicina = izracunajKolicinuKorpe();   //korpa.js function that calculates korpa kolicina
    if(!korpakolicina){          //essentialy break a function if korpakolicina undefined
      return;
    }
    document.querySelector('.js-kolicina-u-kolicima').innerHTML = korpakolicina;
  }
};
renderTrackingPage();