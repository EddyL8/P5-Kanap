// Récupération des données du local storage
const itemsFromCart = JSON.parse(localStorage.getItem("cart"))??[];

fetch ('http://localhost:3000/api/products')
  .then(res => {
    if (res.ok) {
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
            input.addEventListener("change" ,(itemQuantity) => {

              if(input.value >= 1 && input.value <= 100) {
                let item = input.closest('article');
                input.id = item.dataset.id;
                input.color = item.dataset.color;
                input.value = itemQuantity.target.value;
                
                let itemsFromCart = JSON.parse(localStorage.getItem("cart"))??[];
                itemsFromCart.find(product => product.id === input.id && product.color === input.color).quantity = input.value;
                localStorage.setItem('cart',JSON.stringify(itemsFromCart));
                totalQuantityAndPriceFromCart();            
              }

              else if(input.value <= 0 || input.value > 100) {
                alert('Veuillez saisir une quantité entre 1 et 100.');
              }
            })  
          } 
          changeItemsQuantityFromCart();

        // Suppression d'un produit dans le panier
        function deleteItemsFromCart() {
          const deleteItem = document.getElementsByClassName('deleteItem');
          const itemsFromCart = JSON.parse(localStorage.getItem("cart"))??[];
          
          for (let i = 0; i < deleteItem.length; i++) {
            let deleteItems = deleteItem[i];
            let item = deleteItem[i].closest('article');

            deleteItems.addEventListener("click",(e) => {
              e.preventDefault();    
              const itemsFromCartIndex = itemsFromCart.findIndex(product => 
                    product.id === item.dataset.id && product.color === item.dataset.color);
                
              itemsFromCart.splice(itemsFromCartIndex, 1); 
              localStorage.setItem('cart',JSON.stringify(itemsFromCart)); 
                
              location.reload();
              }      
            )    
          }
        }
        deleteItemsFromCart()
        
        // Calcul total du prix et des quantités des éléments du panier
        function totalQuantityAndPriceFromCart() {
          const itemsFromCart = JSON.parse(localStorage.getItem("cart"))??[]

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