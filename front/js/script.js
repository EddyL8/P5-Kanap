// requête de l'api et récupération des données
fetch('http://localhost:3000/api/products')
    .then(res => {
        if (res.ok) {
            return res.json();
          }
        })
        
    // insertion des éléments dans la page d'accueil (DOM)
    .then((products) => {
      for (product of products) {
          document.getElementById("items").innerHTML += `<a href="./product.html?id=${product._id}">
              <article>
                  <img src="${product.imageUrl}" alt="${product.altTxt}"/>
                  <h3 class="productName">${product.name}</h3>
                  <p class="productDescription">${product.description}</p>
              </article>
          </a>`;
          }     
      })
    
    // message d'erreur
    .catch(err => console.log(err))