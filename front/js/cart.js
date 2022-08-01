// Récupération des données du local storage
let itemsFromCart = JSON.parse(localStorage.getItem("cart"))??[];

fetch ('http://localhost:3000/api/products')
  .then(res => {
    if (res.ok) {
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

        // Fonction de changement de quantité dans le panier
        function changeItemsQuantityFromCart() {
          input.addEventListener("change" ,(e) => {
            e.preventDefault();

            // Message si une quantité invalide est saisie
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

        // Fonction de suppression d'un produit dans le panier
        function deleteItemsFromCart() {

        deleteItem.addEventListener("click",(e) => {
          e.preventDefault();

          // Message de demande de confirmation pour supprimer un produit du panier
          if (confirm("Êtes-vous sûr(e) de vouloir supprimer cet article ?")) {    
            const itemsFromCartIndex = itemsFromCart.findIndex(product => product.id === item.id && product.color === item.color);
              
            itemsFromCart.splice(itemsFromCartIndex, 1); 
            localStorage.setItem('cart',JSON.stringify(itemsFromCart)); 
            article.remove();
          } 
          
          // Message si tous les éléments du panier sont supprimés
          if (itemsFromCart === null || itemsFromCart == 0) {
            alert("Il n'y a plus d'articles dans votre panier.");
            window.location.href = "index.html";
          }
          
          totalQuantityAndPriceFromCart();
          })    
        }
        deleteItemsFromCart();
        
        // Fonction de calcul total du prix et des quantités des éléments du panier
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
          
          // Affichage du total des quantités et des prix
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
  .catch(err => console.error(err, 'Données non accessibles'));
  
// FORMULAIRE
// Création des expressions régulières (regex)
const regexName =/^[a-zA-Z-áàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ,.'-\s]+$/;
const regexCity =/^[a-zA-Z-áàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ,.'-\s]+$/;
const regexAddress =/^[a-zA-Z0-9-áàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ,.'-\s]+$/;
const regexEmail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

// Récupération des éléments du formulaire
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

  if (regexName.test(firstName.value) == false || firstName.value == "") {
    firstName.style.border = "#FF3232 solid 3px";
    firstNameErrorMsg.textContent = "Saisie incorrect ou manquante\u26A0\uFE0F";
    return false;
  } 
  
  else {
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
  } 
  
  else {
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
  } 
  else {
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
  } 
  
  else {
    city.style.border = "#00CB00 solid 3px";
    cityErrorMsg.textContent = "\u2714\uFE0F";
    return true;
  }
});

email.addEventListener("input", (e) => {
  e.preventDefault();

  if (regexEmail.test(email.value) == false || email.value == "") {
    email.style.border = "#FF3232 solid 3px";
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

  // Condition qui empêche de générer un numéro de commande si le panier est vide
  if (itemsFromCart === null || itemsFromCart == 0) {
    alert("Votre panier est vide ! Ajoutez des articles pour passer une commande.");
  } 

  else {
    // Tableau des données saisies par l'utilisateur
    let contact = {
      firstName: firstName.value,
      lastName: lastName.value,
      address: address.value,
      city: city.value,
      email: email.value,
    };

    // Message si tous les champs du formulaire ne sont pas renseignés
    if (firstName.value == "" || lastName.value == "" || address.value == "" || city.value == "" || email.value == "") {
        alert("Renseignez tous les champs du formulaire pour passer la commande !");
    }

    else {
      // Création et récupération des id des produits
      const products = itemsFromCart.map(p => p.id);

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
          return res.json();
        }
      })

      .then(data => {
          // Redirection sur la page de confirmation et affichage du numéro de commande généré
          window.location = `confirmation.html?orderId=${data.orderId}`;
          
          // Nettoyage du local storage, vide donc le panier
          localStorage.clear(); 
      })

      // Message d'erreur
      .catch(err => console.error(err, 'Données non accessibles'));
    }
  }
});