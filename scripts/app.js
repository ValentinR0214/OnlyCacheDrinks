document.getElementById('searchButton').addEventListener('click', fetchCocktail);
function fetchCocktail() {
    const inputElement = document.getElementById('cocktailName');
    const cocktailName = inputElement.value.trim();
    const resultDiv = document.getElementById('result');
    if (!cocktailName) {
        alert("¡No olvides escribir el nombre de un cóctel!");
        return;
    }
    // La URL de la API utiliza el nombre del cóctel ingresado por el usuario
    const url = `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${cocktailName}`;
    resultDiv.innerHTML = '<h2>Cargando...</h2>';
    fetch(url)
        .then(response => {
            if (!response.ok) {
                // Esta línea maneja errores HTTP 4xx/5xx, no el fallo de red (que lomaneja el SW).
                throw new Error('Respuesta del servidor no válida');
            }
            return response.json();
        })
        .then(data => {
            const cocktail = data.drinks ? data.drinks[0] : null;
            if (!cocktail) {
                resultDiv.innerHTML = `<p>No se encontró el cóctel: <strong>${cocktailName}</strong></p>`;
                return;
            }
            // Renderiza el resultado, incluyendo el fallback JSON si es el que se recibió
            resultDiv.innerHTML = `
<div class="card mx-auto" style="max-width: 25rem;">
                <img src="${cocktail.strDrinkThumb}" class="card-img-top" alt="Imagen de ${cocktail.strDrink}">
                <div class="card-body">
                  <h5 class="card-title">${cocktail.strDrink}</h5>
                  <p class="card-text">${cocktail.strInstructions}</p>
                </div>
                <ul class="list-group list-group-flush">
                  <li class="list-group-item"><strong>Categoría:</strong> ${cocktail.strCategory}</li>
                  <li class="list-group-item"><strong>Ingrediente Principal:</strong> ${cocktail.strIngredient1 || 'No especificado'}</li>
                </ul>
              </div>
`;
        })
        .catch(error => {
            // Este catch solo debe atrapar errores del lado del cliente (ej. fallo enel JSON parseo)
            resultDiv.innerHTML = `<p style="color: red;">Error al procesar la resp
uesta: ${error.message}</p>`;
        });
}