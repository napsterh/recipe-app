const mealsEl = document.getElementById("meals")
const favoriteContainer = document.getElementById("fav-meals")
const mealPopup = document.getElementById("meal-popup")
const mealInfoEl = document.getElementById("meal-info")
const popupCloseBtn = document.getElementById("close-popup")

const searchTerm = document.getElementById("search-term")
const searchBtn = document.getElementById("search")


const getRandomMeal = async () => {
    const resp = await fetch("https://www.themealdb.com/api/json/v1/1/random.php")
    const respData = await resp.json()
    const randomMeal = respData.meals[0]

    addMeal(randomMeal, true)
}

getRandomMeal()

const addMeal = ( mealData, random = false ) => {
    const meal = document.createElement("div")
    meal.classList.add("meal")
    
    meal.innerHTML = `
        <div>
            ${random ? ` <span class="random">Random Recipe</span> ` : "" }
            <img src="${mealData.strMealThumb}" alt="${mealData.strMeal}" />
        </div>
        div class="meal-body">
            <h4>${mealData.strMeal}</h4>
            <button class="fav-btn">
                <i class="fas fa-heart"></i>
            </button>
        </div>
    `

    const btn = meal.querySelector(".meal-body .fav-btn");

    btn.addEventListener("click", () => {
        if (btn.classList.contains("active")) {
            removeMealLS(mealData.idMeal);
            btn.classList.remove("active");
        } else {
            addMealLS(mealData.idMeal);
            btn.classList.add("active");
        }

        fetchFavMeals();
    });

    meal.addEventListener("click", () => {
        showMealInfo(mealData);
    });

    mealsEl.appendChild(meal);

}

const getMealsLS = () => {
    const mealIds = JSON.parse(localStorage.getItem("mealIds"));

    return mealIds === null ? [] : mealIds;
}

const fetchFavMeals = async () =>  {
    // clean the container
    favoriteContainer.innerHTML = "";

    const mealIds = getMealsLS();

    for (let i = 0; i < mealIds.length; i++) {
        const mealId = mealIds[i];
        meal = await getMealById(mealId);

        addMealFav(meal);
    }
}
fetchFavMeals()

const addMealFav = (mealData) => {
    const favMeal = document.createElement("li");

    favMeal.innerHTML = `
        <img
            src="${mealData.strMealThumb}"
            alt="${mealData.strMeal}"
        /><span>${mealData.strMeal}</span>
        <button class="clear"><i class="fas fa-window-close"></i></button>
    `;

    const btn = favMeal.querySelector(".clear");

    btn.addEventListener("click", () => {
        removeMealLS(mealData.idMeal);

        fetchFavMeals();
    });

    favMeal.addEventListener("click", () => {
        showMealInfo(mealData);
    });

    favoriteContainer.appendChild(favMeal);
}

