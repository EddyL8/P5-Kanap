// Récupération des données du local storage
let itemsFromCart = JSON.parse(localStorage.getItem("cart"))??[];

fetch ('http://localhost:3000/api/products')
  .then(res => {
    if (res.ok) {
      //Quentin : conseil de bonne pratique : durant le dev, logguer c'est bien :) 
      //Par contre, quand le dev est fini, logguer c'est offrir sur un plateau d'argent à une personne externe le comportement interne de l'application. Voir pire, les données des utilisateurs 😱
      console.log(res);
      return res.json();
    }
  })

  .then(products => {
    // Message si le panier est vide
    if (itemsFromCart === null || itemsFromCart == 0) {
      document.getElementById("cart__items").textContent = 'Votre panier est vide.';
      document.getElementById("totalQuantity").textContent = 0;
      document.getElementById("totalPrice").textContent = 0;
    }

    // Création des éléments et des données de la page à afficher dans le panier
    else {
      for (const item of itemsFromCart) {
        const productFromApi = products.find(p => p._id === item.id);

        const cart__items = document.getElementById('cart__items');
  
        const article = document.createElement('article');
              article.className = "cart__item";
              article.setAttribute('data-id',`${item.id}`);
              article.setAttribute('data-color',`${item.color}`);
              cart__items.appendChild(article);

        const cart__item__img = document.createElement('div');
              cart__item__img.className = "cart__item__img";
              article.appendChild(cart__item__img);

        const img = document.createElement('img');
              img.src=`${productFromApi.imageUrl}`;
              img.setAttribute('alt',`${productFromApi.altTxt}`);
              cart__item__img.appendChild(img);

        const cart__item__content = document.createElement('div');
              cart__item__content.className = "cart__item__content";
              article.appendChild(cart__item__content);

        const cart__item__content__description = document.createElement('div');
              cart__item__content__description.className = "cart__item__content__description";
              cart__item__content.appendChild(cart__item__content__description);

        const nameItem = document.createElement('h2');
              cart__item__content__description.appendChild(nameItem).textContent = `${productFromApi.name}`;

        const colorItem = document.createElement('p');
              cart__item__content__description.appendChild(colorItem).textContent = `${item.color}`;

        const priceItem = document.createElement('p');
              cart__item__content__description.appendChild(priceItem).textContent = `${productFromApi.price} €`;

        const cart__item__content__settings = document.createElement('div');
              cart__item__content__settings.className = "cart__item__content__settings";
              cart__item__content.appendChild(cart__item__content__settings);

        const cart__item__content__settings__quantity = document.createElement('div');
              cart__item__content__settings__quantity.className = "cart__item__content__settings__quantity";
              cart__item__content__settings.appendChild(cart__item__content__settings__quantity);

        const productQuantity = document.createElement('p');
              cart__item__content__settings__quantity.appendChild(productQuantity).textContent = "Qté : ";

        const input = document.createElement('input');
              input.className = "itemQuantity";
              input.setAttribute('type','number');
              input.setAttribute('name','itemQuantity');
              input.setAttribute('min', "1");
              input.setAttribute('max', "100");
              input.setAttribute('value',`${item.quantity}`);
              cart__item__content__settings__quantity.appendChild(input);

        const cart__item__content__settings__delete = document.createElement('div');
              cart__item__content__settings__delete.className = "cart__item__content__settings__delete";
              cart__item__content__settings.appendChild(cart__item__content__settings__delete);

        const deleteItem = document.createElement('p');
              deleteItem.className = "deleteItem";
              cart__item__content__settings__delete.appendChild(deleteItem).textContent = "Supprimer";

        // Changement de quantité dans le panier
        function changeItemsQuantityFromCart() {
          input.addEventListener("change" ,(e) => {
            e.preventDefault();

            if(input.value <= 0 || input.value > 100) {
              alert('Veuillez saisir une quantité entre 1 et 100.');
              return;
            }

            let itemsFromCart = JSON.parse(localStorage.getItem("cart"))??[];
            itemsFromCart.find(product => product.id === item.id && product.color === item.color).quantity = input.value;
            localStorage.setItem('cart',JSON.stringify(itemsFromCart));
            
            totalQuantityAndPriceFromCart();            
          })  
        } 
        changeItemsQuantityFromCart();

        // Suppression d'un produit dans le panier
        function deleteItemsFromCart() {

        deleteItem.addEventListener("click",(e) => {
          e.preventDefault();    
          const itemsFromCartIndex = itemsFromCart.findIndex(product => product.id === item.id && product.color === item.color);
            
          itemsFromCart.splice(itemsFromCartIndex, 1); 
          localStorage.setItem('cart',JSON.stringify(itemsFromCart)); 
          article.remove();
          
          /*
          if (itemsFromCart === null || itemsFromCart == 0) {
            alert("Il n'y a plus d'article dans votre panier.");
            return;
          }
          */

          totalQuantityAndPriceFromCart();
          })    
        }
        deleteItemsFromCart()
        
        // Calcul total du prix et des quantités des éléments du panier
        function totalQuantityAndPriceFromCart() {
          itemsFromCart = JSON.parse(localStorage.getItem("cart"))??[];

          let totalQuantityItems = 0;
          let totalPriceItems = 0;

          for (const item of itemsFromCart) {
            const productFromApi = products.find(p => p._id === item.id);
            
            let quantityItemsFromCart = parseInt(item.quantity);
            let priceItemsFromCart = parseInt(productFromApi.price * item.quantity); 

            totalQuantityItems += quantityItemsFromCart;
            totalPriceItems += priceItemsFromCart;
          }
          
          const totalQuantity = document.getElementById('totalQuantity');
          const totalPrice = document.getElementById('totalPrice');
          totalQuantity.textContent = totalQuantityItems;
          totalPrice.textContent = totalPriceItems;
        }
        totalQuantityAndPriceFromCart();   
      }
    }
  })
    // Message d'erreur
    .catch(err => console.log(err, 'Données non accessibles'))
    
// FORMULAIRE
// Création des expressions régulières (regex)
const regexName =/^[a-zA-Z-áàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ]+$/;
//Quentin : si j'habite au pays de Galles je peux avoir des soucis avec ce RegEx si je réside à Connah's Quay
//https://fr.wikipedia.org/wiki/Liste_des_communautés_du_pays_de_Galles
//oui je pinaille, mais attention avec les RegEx :P
const regexCity =/^[a-zA-Z-áàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ\s]+$/; 
const regexAddress =/^[a-zA-Z0-9-áàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ\s]+$/;
const regexEmail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

// Sélection des éléments du formulaire
const firstName = document.getElementById("firstName");
const lastName = document.getElementById("lastName");
const address = document.getElementById("address");
const city = document.getElementById("city");
const email = document.getElementById("email");

const firstNameErrorMsg = document.getElementById("firstNameErrorMsg");
const lastNameErrorMsg = document.getElementById("lastNameErrorMsg");
const addressErrorMsg = document.getElementById("addressErrorMsg");
const cityErrorMsg = document.getElementById("cityErrorMsg");
const emailErrorMsg = document.getElementById("emailErrorMsg");

// Vérification des champs du formulaire
firstName.addEventListener("input", (e) => {
  e.preventDefault();
  //Quentin : tu peux synthétiser tes booléens en utilisant la négation (!). En outre tu peux gagner "un chouilla" de performance en inversant juste les 2 condition autour du OU. On peut en parler jeudi ;) 
  if (regexName.test(firstName.value) == false || firstName.value == "") {
    //Quentin : excellente idée UX 🤩
    firstName.style.border = "#FF3232 solid 3px"; 
    //Quentin et avec des emoji, super idée ! 🤩 Par contre quitte a partir là dessus, le message d'erreur n'est pas super explicite 😐
    firstNameErrorMsg.textContent = "Saisie incorrect ou manquante\u26A0\uFE0F";
    return false; //Quentin : bonne pratique, cela garantis la compatibilité avec d'ancien browser. Mais avec PreventDefault tu couvres déja un grand nombre de browser
  } else {
    firstName.style.border = "#00CB00 solid 3px";
    firstNameErrorMsg.textContent = "\u2714\uFE0F";
    return true;
  }
});

lastName.addEventListener("input", (e) => {
  e.preventDefault();
  if (regexName.test(lastName.value) == false || lastName.value == "") {
    lastName.style.border = "#FF3232 solid 3px";
    lastNameErrorMsg.textContent = "Saisie incorrect ou manquante\u26A0\uFE0F";
    return false;
  } else {
    lastName.style.border = "#00CB00 solid 3px";
    lastNameErrorMsg.textContent = "\u2714\uFE0F";
    return true;
  }
});

address.addEventListener("input", (e) => {
  e.preventDefault();
  if (regexAddress.test(address.value) == false || address.value == "") {
    address.style.border = "#FF3232 solid 3px";
    addressErrorMsg.textContent = "Saisie incorrect ou manquante\u26A0\uFE0F";
    return false;
  } else {
    address.style.border = "#00CB00 solid 3px";
    addressErrorMsg.textContent = "\u2714\uFE0F";
    return true;
  }
});

city.addEventListener("input", (e) => {
  e.preventDefault();
  if (regexCity.test(city.value) == false || city.value == "") {
    city.style.border = "#FF3232 solid 3px";
    cityErrorMsg.textContent = "Saisie incorrect ou manquante\u26A0\uFE0F";
    return false;
  } else {
    city.style.border = "#00CB00 solid 3px";
    cityErrorMsg.textContent = "\u2714\uFE0F";
    return true;
  }
});

email.addEventListener("input", (e) => {
  e.preventDefault();
   if (regexEmail.test(email.value) == false || email.value == "") { 
    email.style.border = "#FF3232 solid 3px";
    //Quentin : excellente idée l'exemple. 😄
    emailErrorMsg.textContent = "Saisie incorrect ou manquante\u26A0\uFE0F Format attendu : exemple@emailvalide.fr"; 
    return false; 
  }
  else {
    email.style.border = "#00CB00 solid 3px";
    emailErrorMsg.textContent = "\u2714\uFE0F";
    return true;
  }
});

const order = document.getElementById("order");

order.addEventListener("click", (e) => {
  e.preventDefault();

  // Tableau des données saisies par l'utilisateur
  let contact = {
    firstName: firstName.value,
    lastName: lastName.value,
    address: address.value,
    city: city.value,
    email: email.value,
  };

  //Quentin : avec l'objet contact au dessus, tu peux utiliser la fonction .reduce() Elle est un peu étrange à utiliser mais bien pratique 🤔
  //et pas besoin de faire l'égalité === "" , il y a la Truthyness qui aide https://developer.mozilla.org/fr/docs/Glossary/Truthy
  if (
    firstName.value === "" ||
    lastName.value === "" ||
    address.value === "" ||
    city.value === "" ||
    email.value === ""
  ) {
      alert("Renseignez tous les champs du formulaire pour passer la commande !");
  }

  else {
    // Création et récupération des id des produits
    //Quentin : tu peux utiliser la fonction .map() pour faciliter l'opération ;)
    const products = [];
    for (let item of itemsFromCart) {
      products.push(item.id);
    }

    const data = {
      contact, products,
    };

    // Requête de l'API avec la méthode POST et redirection de l'utilisateur vers la page confirmation
    fetch("http://localhost:3000/api/products/order", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Accept": "application/json", 
        "Content-Type": "application/json"
      },
    })

    .then(res => {
      if (res.ok) {
        console.log(res);
        return res.json();
      }
    })

    .then(data => {
        // Redirection sur la page de confirmation et affichage du numéro de commande généré
        window.location = `confirmation.html?orderId=${data.orderId}`;
        console.log(orderId);
        
        localStorage.clear(); 
    })
    // Message d'erreur
    .catch(err => console.log(err, 'Données non accessibles'))
  }
});