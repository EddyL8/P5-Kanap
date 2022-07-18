
// Récupération des données du local storage
let itemFromCart = JSON.parse(localStorage.getItem("cart"))??[];
console.log(itemFromCart)


  // Message si le panier est vide
  if (itemFromCart === null || itemFromCart == 0) {
    document.getElementById("cart__items").textContent = 'Votre panier est vide.'
    document.querySelector("#totalQuantity").textContent = 0;
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
        for (i in itemFromCart) {
          let productFromApi = products.find(p => p._id === itemFromCart[i].id);

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
              e.preventDefault();

              let idProductToDelete = itemFromCart[i].id;
              let colorProductToDelete = itemFromCart[i].color;
              console.log(idProductToDelete, colorProductToDelete);

              itemFromCart = itemFromCart.filter(p => p.id !== idProductToDelete || p.color !== colorProductToDelete);
              localStorage.setItem("cart", JSON.stringify(itemFromCart));
              e.target.closest('.cart__item').remove();
              alert(`${itemFromCart[i].quantity} ${itemFromCart[i].name} ${itemFromCart[i].color} à été retiré du panier !`);
              location.reload();
              console.log(itemFromCart)
          })

          // Changement de quantité dans le panier
          input.addEventListener('change', function (e) {
            e.preventDefault();
            itemFromCart[i].quantity = input.value;

              if (itemFromCart[i].quantity <= 0 || itemFromCart[i].quantity > 100) {
                  return alert('Veuillez choisir une quantité comprise entre 1 et 100.')
              }
                  localStorage.setItem("cart", JSON.stringify(itemFromCart));
                  console.log(itemFromCart);
                  location.reload();
            })

            // Calcul du total des quantités du panier
            totalQuantity = 0

            for (let i = 0; i < itemFromCart.length; i++) {
                totalQuantity += Number(itemFromCart[i].quantity);
                document.getElementById("totalQuantity").textContent = totalQuantity;
                console.log(totalQuantity);
            }

            // Calcul du total des prix du panier
            totalPrice = 0;

            for (let i = 0; i < itemFromCart.length; i++) {
            totalPrice += Number(itemFromCart[i].quantity * productFromApi.price);
            document.getElementById("totalPrice").textContent = totalPrice;
            console.log(totalPrice)
            }
          }
    })
        // Message d'erreur
    .catch(err => console.log(err, 'Données non accessibles'))
  }