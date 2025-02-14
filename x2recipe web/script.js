const API_KEY = "1abd6eaccaf9401982e0e8cd01eecca4";

function extractIngredients(text) {
    let cleaned = text.replace(/[.,]/g, "");
    let ingredientsArray = cleaned.split(/,|and/i).map(item => item.trim()).filter(item => item.length > 0);
    return ingredientsArray.join(" ");
}

document.getElementById("getRecipesBtn").addEventListener("click", function() {
    const inputText = document.getElementById("foodInput").value;
    const ingredients = extractIngredients(inputText);
    const button = this;
    
    if (!ingredients) {
        alert("Please enter some text describing your near-expiry food items.");
        return;
    }
    
    button.innerHTML = '<img src="cooking.gif" alt="Loading..." style="height: 75px;">';
    button.disabled = true;

    const url = `https://api.spoonacular.com/recipes/complexSearch?query=${encodeURIComponent(ingredients)}&apiKey=${API_KEY}`;

    var myHeaders = new Headers();
    myHeaders.append("apikey", API_KEY);

    var requestOptions = {
        method: 'GET',
        redirect: 'follow',
        headers: myHeaders
    };

    fetch(url, requestOptions)
        .then(response => response.json())
        .then(data => {
            displayRecipes(data.results);
            button.innerHTML = 'Get Recipes';
            button.disabled = false;
        })
        .catch(error => {
            console.error("Error fetching recipes:", error);
            alert("Error fetching recipes. Please try again later.");
            button.innerHTML = 'Get Recipes';
            button.disabled = false;
        });
});

function displayRecipes(recipes) {
    const container = document.getElementById("recipesContainer");
    container.innerHTML = "";
    if (!recipes || recipes.length === 0) {
        container.innerHTML = "<p>No recipes found. Try different food items.</p>";
        container.classList.add('active');
        adjustContainerHeight();
        return;
    }
    recipes.slice(0, 10).forEach(recipe => {
        const recipeDiv = document.createElement("div");
        recipeDiv.className = "recipe";
        recipeDiv.innerHTML = `
            <h3>${recipe.title}</h3>
            <img src="${recipe.image}" alt="${recipe.title}">
            <button onclick="displayRecipeDetails(${recipe.id}, this)">View Recipe</button>
            <div class="recipe-details" id="details-${recipe.id}"></div>
        `;
        container.appendChild(recipeDiv);
    });
    container.classList.add('active');
    adjustContainerHeight();
}

function displayRecipeDetails(recipeId, button) {
    const detailsDiv = document.getElementById(`details-${recipeId}`);
    const recipeDiv = button.closest('.recipe');
    const recipeImage = recipeDiv.querySelector('img');
    if (detailsDiv.classList.contains('active')) {
        detailsDiv.classList.remove('active');
        detailsDiv.style.maxHeight = '0';
        recipeImage.style.opacity = '1';
        button.textContent = 'View Recipe';
        adjustContainerHeight();
        return;
    }

    button.innerHTML = '<img src="cooking.gif" alt="Loading..." style="height: 75px;">';
    button.disabled = true;

    const url = `https://api.spoonacular.com/recipes/${recipeId}/information?includeNutrition=true&apiKey=${API_KEY}`;

    var myHeaders = new Headers();
    myHeaders.append("apikey", API_KEY);

    var requestOptions = {
        method: 'GET',
        redirect: 'follow',
        headers: myHeaders
    };

    fetch(url, requestOptions)
        .then(response => response.json())
        .then(data => {
            detailsDiv.innerHTML = `
                <div class="recipe">
                    <h3>${data.title}</h3>
                    <img src="${data.image}" alt="${data.title}" onload="adjustHeight(${recipeId})">
                    <p><strong>Ingredients:</strong></p>
                    <ul>
                        ${data.extendedIngredients.map(ingredient => `<li>${ingredient.original}</li>`).join('')}
                    </ul>
                    <p><strong>Instructions:</strong></p>
                    <p>${data.instructions}</p>
                    <button onclick="hideRecipeDetails(${recipeId}, this)">Hide Instructions</button>
                </div>
            `;
            detailsDiv.classList.add('active');
            detailsDiv.style.maxHeight = detailsDiv.scrollHeight + 'px';
            recipeImage.style.opacity = '0';
            button.innerHTML = 'Hide Recipe';
            button.disabled = false;
            adjustContainerHeight();
        })
        .catch(error => {
            console.error("Error fetching recipe details:", error);
            alert("Error fetching recipe details. Please try again later.");
            button.innerHTML = 'View Recipe';
            button.disabled = false;
        });
}

function hideRecipeDetails(recipeId, button) {
    const detailsDiv = document.getElementById(`details-${recipeId}`);
    const recipeDiv = button.closest('.recipe');
    const recipeImage = recipeDiv.querySelector('img');
    detailsDiv.classList.remove('active');
    detailsDiv.style.maxHeight = '0';
    recipeImage.style.opacity = '1';
    button.textContent = 'View Recipe';
    adjustContainerHeight();
}

function adjustHeight(recipeId) {
    const detailsDiv = document.getElementById(`details-${recipeId}`);
    if (detailsDiv.classList.contains('active')) {
        detailsDiv.style.maxHeight = detailsDiv.scrollHeight + 'px';
        adjustContainerHeight();
    }
}

function adjustContainerHeight() {
    const container = document.getElementById("recipesContainer");
    container.style.maxHeight = container.scrollHeight + 'px';
}

// Observe changes in the recipesContainer to adjust its height dynamically
const observer = new MutationObserver(adjustContainerHeight);
observer.observe(document.getElementById("recipesContainer"), { childList: true, subtree: true });