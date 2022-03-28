let url = new URL(document.location.href); 
let idProduct = url.searchParams.get('id')


// Récupérer le produit via l'API
fetch(`http://localhost:3000/api/products/${idProduct}`)
    .then(function (response) {
    if (response.ok) {
        return response.json();
    }
    })
    .then(function (data) {
        console.log(data)
        productBlock(data);
    })
    .catch(function (error) {});


// Construction du block produit
function productBlock(data){
    const productBlockDiv = document.getElementById("product-page");
    
    let colorsBlocks = ""
    for(color of data.colors ){
        newColor = color.replace('/', '');
        colorsBlocks += `<div class="color ${newColor}"></div>`
    }

    productBlockDiv.innerHTML = `
    <article>
        <img src="${data.imageUrl}" alt="${data.altTxt}">
        <div id="product-description">
            <h2>${data.name}</h2>
            <p>${data.description}</p>
            <p class="price">${data.price} €</p>
        </div>
    </article>`
}