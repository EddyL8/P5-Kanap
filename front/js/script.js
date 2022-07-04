// Requête de l'api et récupération des données
fetch('http://localhost:3000/api/products')
    .then(res => {
        if (res.ok) {
          console.log(res);
            return res.json();
          }
        })
        
    // Insertion des éléments dans la page d'accueil
    .then((products) => {
      console.log(products);
      for (product of products) {
        console.log(product);
          document.getElementById("items").innerHTML += `<a href="./product.html?id=${product._id}">
              <article>
                  <img src="${product.imageUrl}" alt="${product.altTxt}"/>
                  <h3 class="productName">${product.name}</h3>
                  <p class="productDescription">${product.description}</p>
              </article>
          </a>`;
          }     
      })
    
    // Message d'erreur
    .catch(err => console.log(err, 'Données non accessibles'))