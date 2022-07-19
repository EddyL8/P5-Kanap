
// Récupération des données du local storage
let itemFromCart = JSON.parse(localStorage.getItem("cart"))??[]; //Quentin : pour plus de lisibilité "itemsFromCart" (avec un s à items), voir plus bas
console.log(itemFromCart)


  // Message si le panier est vide
  if (itemFromCart === null || itemFromCart == 0) {//Quentin : itemFromCart est un tableau (cf ligne 3), je doute qu'il puisse se transformer en nombre. C'est peut être itemFromCart.length que tu cherches ;)
    document.getElementById("cart__items").textContent = 'Votre panier est vide.'
    document.querySelector("#totalQuantity").textContent = 0; //Quentin : pourquoi un query selector (plus gourmand en ressource) alors que plus bas tu utilise un getElementById ?
    document.querySelector("#totalPrice").textContent = 0;
  }

  else {
    // Affichage des données du local storage dans la page
    fetch("http://localhost:3000/api/products")
    .then(res => {
        if (res.ok) {
            console.log(res);
            return res.json();
        }
    })
    .then(products => {
        for (i in itemFromCart) { //Quentin : ? tu itères déja sur les items du cart (itemsFromCart) pour récupéré un par un, un (1) item du cart (itemFromCart)
          let productFromApi = products.find(p => p._id === itemFromCart[i].id);//Quentin : attention, itemFromCart est un tableau oui, mais qu'est "i" ? -voir plus bas

          const cart__items = document.getElementById('cart__items');

          // Création des éléments à afficher dans le panier
          let article = document.createElement('article');
          article.setAttribute('class', 'cart__item');
          article.setAttribute('data-id', itemFromCart[i].id);
          article.setAttribute('data-color', itemFromCart[i].color);
          cart__items.appendChild(article);

          const cart__item__img = document.createElement('div');
          cart__item__img.setAttribute('class', 'cart__item__img');
          article.appendChild(cart__item__img);
          const img = document.createElement('img');
          img.src = productFromApi.imageUrl;
          img.alt = productFromApi.altTxt;
          cart__item__img.appendChild(img);

          const cart__item__content = document.createElement('div');
          cart__item__content.setAttribute('class', 'cart__item__content');
          article.appendChild(cart__item__content);
          const cart__item__content__description = document.createElement('div');
          cart__item__content__description.setAttribute('class', 'cart__item__content__description');
          cart__item__content.appendChild(cart__item__content__description);

          const productName = document.createElement('h2');
          cart__item__content__description.appendChild(productName).textContent = `${productFromApi.name}`;

          const productColor = document.createElement('p');
          cart__item__content__description.appendChild(productColor).textContent = `${itemFromCart[i].color}`;

          const productQuantityPrice = document.createElement('p');
          productQuantityPrice.setAttribute('class', 'productQuantityPrice');
          cart__item__content__description.appendChild(productQuantityPrice).textContent = `${itemFromCart[i].quantity * productFromApi.price} €`;

          const cart__item__content__settings = document.createElement('div');
          cart__item__content__settings.setAttribute('class', 'cart__item__content__settings');
          cart__item__content.appendChild(cart__item__content__settings);

          const cart__item__content__settings__quantity = document.createElement('div');
          cart__item__content__settings__quantity.setAttribute('class', 'cart__item__content__settings__quantity');
          cart__item__content__settings.appendChild(cart__item__content__settings__quantity);

          const productQuantity = document.createElement('p');
          productQuantity.textContent = 'Qté : ';
          cart__item__content__settings__quantity.appendChild(productQuantity);

          const input = document.createElement('input');
          input.setAttribute('type', "number");
          input.setAttribute('class', "itemQuantity");
          input.setAttribute('name', "itemQuantity");
          input.setAttribute('min', "1");
          input.setAttribute('max', "100");
          input.setAttribute("value", itemFromCart[i].quantity);
          input.classname = 'itemQuantity';
          cart__item__content__settings__quantity.appendChild(input);

          const cart__item__content__settings__delete = document.createElement('div');
          cart__item__content__settings__delete.setAttribute('class', 'cart__item__content__settings__delete');
          cart__item__content__settings.appendChild(cart__item__content__settings__delete);

          const productDelecte = document.createElement('p');
          productDelecte.setAttribute('class', 'deleteItem')
          productDelecte.textContent = 'Supprimer'
          cart__item__content__settings__delete.appendChild(productDelecte);

          // Suppression d'un produit dans le panier
          productDelecte.addEventListener('click', function (e) {
              e.preventDefault();//Quentin : excellente pratique d'intercepter l'évènement et lui dire que nous décidons

              let idProductToDelete = itemFromCart[i].id;
              let colorProductToDelete = itemFromCart[i].color;
              console.log(idProductToDelete, colorProductToDelete);

              itemFromCart = itemFromCart.filter(p => p.id !== idProductToDelete || p.color !== colorProductToDelete);//Quentin : pourquoi un || (OU logique)) ?
              //Quentin: regarde la fonction findIndex https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex)
              //Quentin : et splice, https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Array/splice
              localStorage.setItem("cart", JSON.stringify(itemFromCart));
              e.target.closest('.cart__item').remove();//Quentin : ça serait quand même bien pratique si on avait déja dans le scope une référence a l'élément Html <article> qui a la classe ".cart__item"... ;)
              alert(`${itemFromCart[i].quantity} ${itemFromCart[i].name} ${itemFromCart[i].color} à été retiré du panier !`);
              location.reload();//Quentin : Heu pourquoi ?
              console.log(itemFromCart)
          })

          // Changement de quantité dans le panier
          input.addEventListener('change', function (e) {
            e.preventDefault();
            itemFromCart[i].quantity = input.value;//Quentin : tu stockes une valeur avant même de tester sa validité ? 

            if (itemFromCart[i].quantity <= 0 || itemFromCart[i].quantity > 100) {
                return alert('Veuillez choisir une quantité comprise entre 1 et 100.')
            }
              localStorage.setItem("cart", JSON.stringify(itemFromCart));
              console.log(itemFromCart);
              location.reload();
          })

            //Quentin : tu recalcule donc le total et la quantité total à chaque item ajouté, tu es sur la bonne voie. :)
            // ça serait bien pratique de pouvoir tout recalculer quand on enlève un item ou quand on change une quantité ... ;)

            // Calcul du total des quantités du panier

            let totalQuantity = 0;
            //Quentin : attention ! c'est tentant de déclarer une variable sans let,const,var et pas mettre de ; mais c'est TRES risqué !

            //Quentin : ok, je comprends la confusion du i. Je te redirige vers la documentation : https://developer.mozilla.org/fr/docs/Web/JavaScript/Guide/Loops_and_iteration
            //et sur la boucle for...of : https://www.youtube.com/watch?v=-v26YUj37Uc

            for (let i = 0; i < itemFromCart.length; i++) {
                totalQuantity += Number(itemFromCart[i].quantity);
                document.getElementById("totalQuantity").textContent = totalQuantity;//Quentin : donc a chaque item, chaque actualisation on va demander au browser de récupérer l'élément avec l'Id totalQuantity. ça serait pratique de lui demander une fois l'élément .. ;)
                console.log(totalQuantity);
            }

            // Calcul du total des prix du panier
            let totalPrice = 0;

            for (let i = 0; i < itemFromCart.length; i++) {
              totalPrice += Number(itemFromCart[i].quantity * productFromApi.price);//Quentin : tu multiplies l'un par l'autre et tu t'assure que c'est bien un nombre qu'on additionne. C'est bien. Mais qu'est-ce qui te garantis que l'un et l'autre sont des nombres ? o_o
              document.getElementById("totalPrice").textContent = totalPrice;
              console.log(totalPrice)
            }
          }
    })
        // Message d'erreur
    .catch(err => console.log(err, 'Données non accessibles'))
  }