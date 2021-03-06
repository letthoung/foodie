import axios from 'axios';

export default class Recipe {
    constructor(rId){
        this.rId = rId;
    }
    async getRecipe(){
        try {
            const result = await axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.rId}`);
            this.title = result.data.recipe.title;
            this.author = result.data.recipe.publisher;
            this.image = result.data.recipe.image_url;
            this.url = result.data.recipe.source_url;
            this.ingredients = result.data.recipe.ingredients;
        } catch (error){
            console.log(error);
            alert("Something went wrong!");
        }
    }
    
    calcTime() {
        // Assume that we need 15mins for 3 ingredients
        const numIng = this.ingredients.length;
        this.time = Math.ceil(numIng/3) * 5;
    }
    
    calcServings() {
        this.servings = 4;
    }
    
    parseIngredient() {
        const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds', 'strips', 'packages'];
        const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound', 'strip', 'package'];
        const units = [...unitsShort, 'kg', 'g'];
        
        const newIngredients = this.ingredients.map(el => {
            // 1) Uniform units
            let ingredient = el.toLowerCase();
            unitsLong.forEach((unit, i) => {
               ingredient = ingredient.replace(unit, unitsShort[i]); 
            });
            
            // 2) Remove parentheses
            ingredient = ingredient.replace(/ *\([^)]*\) */g,' ');
            
            // 3) Parse ingredients into count, unit and ingredient
            const arrIng = ingredient.split(' ');
            //console.log(arrIng);
            //console.log(unitsShort);
            const unitIndex = arrIng.findIndex(element => units.includes(element));
            //console.log(unitIndex);
            
            let objIng;
            if (unitIndex > -1){
                // There is an unit
                const arrCount = arrIng.slice(0, unitIndex);
                let count;
                if (arrCount.length === 1){
                    count = eval(arrCount[0].replace('-','+'));
                } else {
                    count = eval(arrCount.join('+'));
                }
                objIng = {
                    count,
                    unit: arrIng[unitIndex],
                    ingredient: arrIng.slice(unitIndex+1).join(' ')
                }
            } else if (parseInt(arrIng[0],10)){
                // There is no unit but 1st element is a number
                objIng = {
                    count: parseInt(arrIng[0],10),
                    unit: '',
                    ingredient: arrIng.slice(1).join(' ')
                }
            } else {
                // There is no unit and no number
                objIng = {
                    count: 1,
                    unit: '',
                    ingredient
                }
            }
            
            return objIng;
        });
        this.ingredients = newIngredients;
    }
    
    updateServings(type){
        // servings
        const newServings = type ==='dec' ? this.servings - 1 : this.servings + 1;
        
        // increasing
        
        this.ingredients.forEach(ing => {
           ing.count = ing.count * (newServings / this.servings);
        });
        
        // update servings
        this.servings = newServings;
    }
}