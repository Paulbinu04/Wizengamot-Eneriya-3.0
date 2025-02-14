

function extractIngredients(text) {
    let cleaned = text.replace(/[.,]/g, "");
    let ingredientsArray = cleaned.split(/,|and/i).map(item => item.trim()).filter(item => item.length > 0);
    return ingredientsArray.join(" ");
}







// Observe changes in the recipesContainer to adjust its height dynamically
const observer = new MutationObserver(adjustContainerHeight);
observer.observe(document.getElementById("recipesContainer"), { childList: true, subtree: true });