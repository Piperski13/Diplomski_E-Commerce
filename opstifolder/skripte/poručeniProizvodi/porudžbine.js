import {porudžbine,izbrisiIzPorudžbine} from '../../podaci/porudžbine.js';
import {formatiranjeValute} from '../../alatke/rsdFormat.js';
import {prikaziDatumNarudzbine} from '../../alatke/datum.js';
import {učitavanjeProizvoda,proizvodi} from '../../podaci/proizvodi.js';
import {dodajUKorpu, izračunajKoličinuKorpe} from '../../podaci/korpa.js';

console.log(porudžbine);

učitavanjeProizvoda().then(()=>{     
  renderovanjeUkupnePorudžbine();
});

function renderovanjeUkupnePorudžbine(){
  let generisaniHTML = '';
  let generisaniDetaljiHTML = '';

  porudžbine.forEach(porudzbina => {

    porudzbina.proizvodi.forEach(porucenProizvod =>{
      let odgovarajuciProizvod;

      proizvodi.forEach(proizvod => {
        if(proizvod.id === porucenProizvod.proizvodId){
          odgovarajuciProizvod = proizvod;
        }
      });
     
      generisaniDetaljiHTML += `
          <div class="porudzbina-detalji-grid">
            <div class="proizvod-slika-kontejner">
              <img src=${odgovarajuciProizvod.slika}>
            </div>

            <div class="proizvod-detalji">
              <div class="proizvod-ime">
                ${odgovarajuciProizvod.naziv}
              </div>
              <div class="proizvod-dostava-datum">
                Dolazak: ${prikaziDatumNarudzbine(porucenProizvod.procenjenoVremeIsporuke)}
              </div>
              <div class="proizvod-količina">
                Količina: ${porucenProizvod.količina}
              </div>
              <button class="kupi-ponovo-dugme glavno-dugme js-kupi-ponovo"
              data-proizvod-id="${odgovarajuciProizvod.id}">
                <img class="kupi-ponovo-ikonica" src="slike/ikonice/kupi-ponovo.png">
                <span class="kupi-ponovo-poruka">Kupi ponovo</span>
              </button>
            </div>

            <div class="proizvod-akcije">
              <a href="pracenje.html?porudzbinaId=${porudzbina.id}&proizvodId=${odgovarajuciProizvod.id}">
                <button class="pracenje-paketa-dugme dugme-sekundarno">
                  Praćenje paketa
                </button>
              </a>
            </div>
          </div>
      `;
    });
    function povratakGenerisanihDetalja(generisaniDetaljiHTML){
      return generisaniDetaljiHTML;
    }
    generisaniHTML += `
        <div class="porudzbina-kontejner js-porudžbine-artikal-kontejner-${porudzbina.id}">
          <div class="porudzbina-zaglavlje">
            <div class="porudzbina-zaglavlje-leva-sekcija">
              <div class="porudzbina-datum">
                <div class="porudzbina-zaglavlje-label">Naručeno datuma:</div>
                <div>${prikaziDatumNarudzbine(porudzbina.vremePorudžbine)}</div>
              </div>
              <div class="ukupna-porudzbina">
                <div class="porudzbina-zaglavlje-label">Ukupno:</div>
                <div>${formatiranjeValute(porudzbina.ukupnaCenaDinari)} <span class="rsd-stil">RSD</span></div>
              </div>
            </div>

            <div class="porudzbina-zaglavlje-desna-sekcija">
              <div class="porudzbina-zaglavlje-label">ID Porudžbine:</div>
              <div>${porudzbina.id}</div>
            </div>
            <button class="izbrisi-porudzbinu js-izbrisi-porudzbinu" data-proizvod-id="${porudzbina.id}">X</button>
          </div>
          ${povratakGenerisanihDetalja(generisaniDetaljiHTML)}
        </div>
    `;
    generisaniDetaljiHTML = '';
  });
  document.querySelector('.js-porudžbine-gird').innerHTML = generisaniHTML;
  azurirajKorpaKolicinu();

  document.querySelectorAll('.js-kupi-ponovo').forEach((button)=>{
    button.addEventListener('click',()=>{
      const proizvodId = button.dataset.proizvodId;
      dodajUKorpu(proizvodId);
      azurirajKorpaKolicinu();
    })
  })

  document.querySelectorAll('.js-izbrisi-porudzbinu').forEach((button)=>{
    button.addEventListener('click',()=>{
      const porudzbinaId = button.dataset.proizvodId;
      izbrisiIzPorudžbine(porudzbinaId);
      const kontejner = document.querySelector(`.js-porudžbine-artikal-kontejner-${porudzbinaId}`);
      kontejner.remove();
      renderovanjeUkupnePorudžbine();
    })
  })

  function azurirajKorpaKolicinu(){        
    let korpaKoličina = izračunajKoličinuKorpe();   
    if(!korpaKoličina){         
      return;
    }
    document.querySelector('.js-količina-u-kolicima').innerHTML = korpaKoličina;
  }
};