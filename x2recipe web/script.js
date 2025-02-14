

function extractIngredients(text) {
    let cleaned = text.replace(/[.,]/g, "");
    let ingredientsArray = cleaned.split(/,|and/i).map(item => item.trim()).filter(item => item.length > 0);
    return ingredientsArray.join(" ");
}



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



// Observe changes in the recipesContainer to adjust its height dynamically
const observer = new MutationObserver(adjustContainerHeight);
observer.observe(document.getElementById("recipesContainer"), { childList: true, subtree: true });