// Récupération des données du local storage
let productsInCart = JSON.parse(localStorage.getItem("cart"))??[];
console.log(productsInCart)

// Message si le panier est vide
if (productsInCart === null || productsInCart == 0) {
  document.getElementById("cart__items").textContent = 'Votre panier est vide.'
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
        for (item of productsInCart) {
          console.log(item)
          let product = products.find((p) => p._id == item.id);
          console.log(product)
          
          if (item.id == product._id) {
              document.getElementById("cart__items").innerHTML += `<article class="cart__item" data-id="${product._id}" data-color="${product.color}">
                          <div class="cart__item__img">
                            <img src="${product.imageUrl}" alt="${product.altTxt}">
                          </div>
                          <div class="cart__item__content">
                            <div class="cart__item__content__description">
                              <h2>${product.name}</h2>
                              <p>${item.color}</p>
                              <p>${product.price} €</p>
                            </div>
                            <div class="cart__item__content__settings">
                              <div class="cart__item__content__settings__quantity">
                                <p>Qté : </p>
                                <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${item.quantity}">
                              </div>
                              <div class="cart__item__content__settings__delete">
                                <p class="deleteItem">Supprimer</p>
                              </div>
                            </div>
                          </div>
                        </article>`;
          }
        }
      })
      
    // Message d'erreur
    .catch(err => console.log(err, 'Données non accessibles'))
}
