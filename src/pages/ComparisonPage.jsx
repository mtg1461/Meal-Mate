import ComparisonCSS from "./style/comparison.module.css";
import {getRecipe, getPlacesData, getDirections, getWeatherData, chatGPT, searchYouTube} from "../api";
import React, {useEffect, useState, createRef} from "react";
import List from "../components/List/List";
import useStyles from "../components/List/styles.js"
import { Grid } from "@material-ui/core";
import PlaceDetails from "../components/PlaceDetails/PlaceDetails";
import Map from "../components/Map/Map";

const ingredients = [
    "Acorn squash", "Adobo sauce", "Agave nectar", "Alfredo sauce", "Almond butter", "Almond extract", "Almond flour", "Almond milk", "Amaranth", "Anchovies", "Angel hair pasta", "Apple butter", "Apple cider", "Apple cider vinegar", "Apple juice", "Apple pie spice", "Apples", "Applesauce", "Apricots", "Arborio rice", "Artichoke hearts", "Artichokes", "Asparagus", "Avocado oil", "Avocados",
    "Bacon", "Bacon bits", "Bagels", "Baking powder", "Baking soda", "Balsamic glaze", "Balsamic vinegar", "Banana peppers", "Bananas", "Barbecue sauce", "Basil", "Bay leaves", "Beef", "Beef broth", "Beef jerky", "Beef roast", "Beef sirloin", "Beer", "Beets", "Bell peppers", "Berries", "Biscuits", "Bittersweet chocolate", "Black beans", "Black olives", "Black pepper", "Blackberries", "Blue cheese", "Blueberries", "Bouillon cubes", "Bourbon", "Brandy", "Bread crumbs", "Bread flour", "Breadsticks", "Brie cheese", "Broccoli", "Broccoli rabe", "Brown rice", "Brown sugar", "Brussels sprouts", "Buckwheat flour", "Buns", "Butter", "Butter beans", "Buttermilk",
    "Cabbage", "Cake flour", "Cakes", "Candy canes", "Candy melts", "Canned tomatoes", "Canned tuna", "Cantaloupe", "Capers", "Caramel sauce", "Caraway seeds", "Cardamom", "Carrots", "Cashews", "Cassava flour", "Cauliflower", "Cayenne pepper", "Celery", "Celery seed", "Champagne", "Cheddar cheese", "Cheese", "Cheese spread", "Cherries", "Cherry pie filling", "Chia seeds", "Chicken", "Chicken breasts", "Chicken broth", "Chicken drumsticks", "Chicken legs", "Chicken stock", "Chickpeas", "Chili powder", "Chipotle peppers", "Chocolate chips", "Chocolate frosting", "Chocolate sauce", "Cilantro", "Cinnamon", "Cloves", "Cocoa powder", "Coconut", "Coconut flour", "Coconut milk", "Coconut oil", "Coffee", "Cognac", "Collard greens", "Confectioners' sugar", "Cooking spray", "Corn", "Corn bread mix", "Corn chips", "Corn flour", "Corn meal", "Corn starch", "Corn syrup", "Corned beef", "Cornish hens", "Cottage cheese", "Country ham", "Crab meat", "Cranberries", "Cranberry juice", "Cream cheese", "Cream of tartar", "Cremini mushrooms", "Creme fraiche", "Croutons", "Crystallized ginger", "Cucumber", "Cumin", "Curry powder", "Custard",
    "Daiya cheese", "Dark chocolate", "Dates", "Dijon mustard", "Dill", "Dried apricots", "Dried basil", "Dried cranberries", "Dried oregano", "Dried thyme", "Duck",
    "Egg noodles", "Eggplant", "Eggs", "Elbow macaroni", "Enchilada sauce", "Endive", "English muffins", "Espresso powder", "Evaporated milk",
    "Fava beans", "Fennel", "Feta cheese", "Figs", "Filet mignon", "Fish", "Fish sauce", "Flank steak", "Flaxseed", "Focaccia bread", "Fontina cheese", "Fruit cocktail", "Fruit preserves", "Fudge",
    "Garam masala", "Garbanzo beans", "Garlic", "Garlic powder", "Ghee", "Ginger", "Gingersnaps", "Gluten-free flour", "Gouda cheese", "Graham crackers", "Granola", "Grape juice", "Grapefruit", "Grapes", "Greek yogurt", "Green beans", "Green bell peppers", "Green onions", "Green tea", "Greens", "Ground beef", "Ground chicken", "Ground cinnamon", "Ground cumin", "Ground ginger", "Ground lamb", "Ground pork", "Ground turkey", "Guacamole", "Gummy bears",
    "Half-and-half", "Halibut", "Ham", "Hamburger buns", "Hard-boiled eggs", "Hazelnuts", "Heavy cream", "Hoisin sauce", "Honey", "Honeydew melon", "Horseradish", "Hot chocolate mix", "Hot dogs", "Hot sauce", "Hummus",
    "Ice cream", "Iceberg lettuce", "Instant coffee", "Irish cream liqueur", "Italian bread", "Italian cheese blend", "Italian sausage",
    "Jalapeno peppers", "Jams and jellies", "Jasmine rice", "Jelly beans", "Jicama", "Jumbo pasta shells",
    "Kalamata olives", "Kale", "Ketchup", "Kidney beans", "Kiwi", "Kumquats",
    "Lamb", "Lamb chops", "Lasagna noodles", "Lavender", "Leeks", "Lemon extract", "Lemon juice", "Lemon pepper", "Lemons", "Lentils", "Lettuce", "Lima beans", "Lime juice", "Limes", "Linguine", "Lobster", "Long-grain rice", "Low-fat milk", "Low-sodium soy sauce", "Lump crab meat",
    "M&M's", "Macadamia nuts", "Macaroni", "Mackerel", "Madeira wine", "Malt vinegar", "Mandarin oranges", "Mangoes", "Maple syrup", "Maraschino cherries", "Margarine", "Marinara sauce", "Marjoram", "Marshmallow fluff", "Marshmallows", "Mascarpone cheese", "Matzo meal", "Mayonnaise", "Meatballs", "Meatloaf mix", "Meat tenderizer", "Melon", "Meringue powder", "Milk chocolate", "Millet", "Mint",
    "Miso", "Mixed nuts", "Molasses", "Monterey jack cheese", "Mozzarella cheese", "Muesli", "Muffin mix", "Mushrooms", "Muskmelon", "Mussels",
    "Nacho chips", "Navy beans", "Nectarines", "Nutmeg", "Nutritional yeast",
    "Oat bran", "Oat flour", "Oatmeal", "Octopus", "Olive oil", "Olives", "Onion powder", "Onions", "Orange juice", "Oranges", "Oregano", "Oreo cookies", "Oysters",
    "Pancake mix", "Pancetta", "Papaya", "Paprika", "Parmesan cheese", "Parsley", "Parsnips", "Pasta", "Peaches", "Peanut butter", "Peanuts", "Pear juice", "Pears", "Peas", "Pecan pieces", "Pecans", "Pepper jack cheese", "Peppermint extract", "Peppermint candies", "Peppers", "Pesto sauce", "Phyllo dough", "Pine nuts", "Pineapple", "Pinto beans", "Pistachios", "Pizza crust", "Pizza sauce", "Plantains", "Plums", "Polenta", "Pomegranate juice", "Pomegranates", "Popcorn", "Poppy seeds", "Pork", "Pork chops", "Pork roast", "Portobello mushrooms", "Pot roast", "Potato chips", "Potatoes", "Poultry seasoning", "Powdered sugar", "Prosciutto", "Protein powder", "Prunes", "Pudding mix", "Pumpkin", "Pumpkin pie spice", "Pumpkin seeds", "Pumpernickel bread", "Purple grapes", "Quinoa",
    "Radicchio", "Radishes", "Raisins", "Ranch dressing", "Raspberries", "Red beans", "Red bell peppers", "Red onion", "Red wine", "Red wine vinegar", "Refried beans", "Rhubarb", "Rice", "Rice flour", "Rice milk", "Ricotta cheese", "Ritz crackers", "Roast beef", "Roasted red peppers", "Romaine lettuce", "Rosemary", "Rum extract", "Rum",
    "Saffron", "Sage", "Sake", "Salad dressing", "Salami", "Salmon", "Salsa", "Sausage", "Scallops", "Sea salt", "Seaweed", "Sesame oil", "Sesame seeds", "Sharp cheddar cheese", "Shaved chocolate", "Sherry", "Shiitake mushrooms", "Shrimp", "Sliced almonds", "Sliced bread", "Sliced cheese", "Smoked paprika", "Smoked salmon", "Snapper", "Soba noodles", "Soda crackers", "Sour cream", "Soy milk", "Soy sauce", "Spaghetti", "Sparkling water", "Spinach", "Split peas", "Sprinkles", "Squash", "Sriracha sauce", "Steak sauce", "Steak seasoning", "Steel-cut oats", "Stevia", "Strawberries", "String beans", "Stuffing mix", "Sugar",  
    "Sunflower seeds", "Swiss cheese", "Swordfish",
    "Taco seasoning", "Tahini", "Tangerines", "Tapioca pearls", "Tarragon", "Tartar sauce", "Tea bags", "Tempeh", "Teriyaki sauce", "Thyme", "Tofu", "Tomato juice", "Tomato paste", "Tomato sauce", "Tomatoes", "Tortellini", "Tortilla chips", "Trout", "Tuna", "Turkey", "Turmeric",
    "Udon noodles",
    "Unsweetened chocolate", "Unsweetened cocoa powder",
    "Vanilla extract", "Vanilla ice cream", "Vanilla pudding mix", "Veal", "Vegetable oil", "Vegetable shortening", "Vegetables", "Vegetarian bacon", "Vegetarian sausage", "Veggie burger", "Vermicelli", "Vinaigrette dressing", "Vinegar", "Vodka",
    "Walnuts", "Water chestnuts", "Watercress", "Watermelon", "Wheat bran", "Wheat flour", "Whipped cream", "Whipped topping", "Whiskey", "White beans", "White bread", "White chocolate chips", "White fish", "White onion", "White pepper", "White rice", "White sugar", "White vinegar", "Whole wheat flour", "Wonton wrappers", "Worcestershire sauce",
    "Xanthan gum",
    "Yeast", "Yellow bell peppers", "Yellow onion", "Yellow squash", "Yogurt",
    "Ziti"
]
    



const ComparisonPage = () => {
    const classes = useStyles();

    const [currentIngredientList, setCurrentIngredientList] = useState(false);
    const [places, setPlaces] = useState([]);
    const [elRefs, setElRefs] = useState([]);
    const [elRefs2, setElRefs2] = useState([]);
    const [locationText, setLocationText] = useState("");
    const [currentPosition, setCurrentPosition] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [checkboxDisplay, setCheckboxDisplay] = useState([]);
    const [pageButtonDisplay, setPageButtonDisplay] = useState([]);
    const [checkboxChecked, setCheckboxChecked] = useState({})
    const [filteredIngredients, setFilteredIngredients] = useState(ingredients);
    const [maxPageNumber, setMaxPageNumber] = useState();
    const [foods, setFoods] = useState([])
    
    useEffect(() => {
        const refs = Array(places?.length).fill().map((_, i) => elRefs[i] || createRef());
        setElRefs(refs);
        document.querySelector("#foodList").style.display = "none";
        document.querySelector("#placeList").style.display = "none";
    },[]);

    const pageChange = ((page, givenIngredients)=>{
        var filteredValues;
        var display = [];
        var newList = [];
        if (givenIngredients === "") {
            filteredValues = filteredIngredients;
        }else{
            filteredValues = givenIngredients;
        }
        if(filteredValues.length%30 === 0){
            setMaxPageNumber(parseInt(filteredValues.length/30));
        }else{
            setMaxPageNumber(parseInt(filteredValues.length/30)+1);
        }
        if(maxPageNumber === 1){
            setPageButtonDisplay(["none", "none"]);
        }else if(page === 1){
            setPageButtonDisplay(["none", "inline-block"]);
        }else if(page === maxPageNumber){
            setPageButtonDisplay(["inline-block", "none"]);
        }else{
            setPageButtonDisplay(["inline-block", "inline-block"]);
        }
        for (let index = page*30-30; index < page*30; index++) {
            if(filteredValues[index]){
                display.push("block");
                newList.push(filteredValues[index]);
            }else{
                display.push("none");
                newList.push("");
            }
        }
        setCheckboxDisplay(display);
        setCurrentIngredientList(newList);
        setTimeout(setCheckedValues,100)
    });

    const setCheckedValues = () => {
        var checkboxInputs = document.querySelectorAll(".checkboxList > input");
        checkboxInputs.forEach(element => {
            try {
                element.checked = checkboxChecked[element.value];
            } catch (error) {
                element.checked = false;
            }
        });
    }

    const compareButton = () => {
        const contents = document.querySelectorAll(".content");
        const compareTitle = document.querySelector("#compareButtonTitle");
        if (compareTitle.innerHTML === "Loading...") {
            console.log("It is still loading. Please wait...");
        }
        else if(compareTitle.innerHTML === "START"){
            
            compareTitle.innerHTML = "COMPARE";
            document.querySelector("#compareButton").style.background = "linear-gradient(0deg, #ffffff, #feddff, #feddff, #fff)";
            document.querySelector("#background1 > h1").style.top = "3vh";
            document.querySelector("#background2 > h1").style.top = "3vh";
            document.querySelector("#background2 > .content > h5").innerHTML = locationText;
            setTimeout(()=>{
                contents.forEach(element => {
                    element.style.display = "block";
                });
            },600)
        }
        else if(compareTitle.innerHTML === "COMPARE"){
            console.log(checkboxChecked);
            compareTitle.innerHTML = "Loading...";
            var finalIngredientList = [];
            for (let element in checkboxChecked) {
                if (checkboxChecked[element]) {
                    finalIngredientList.push(element.toLowerCase());
                }                
            }
            var ingredientsString = "";
            finalIngredientList.forEach((item)=>{
                ingredientsString += item+",";
            })
            ingredientsString = ingredientsString.slice(0,-1);
            var foodListForAI;
            getRecipe(ingredientsString)
            .then((data) =>{
                console.log(data);
                setFoods(data);
                foodListForAI = data;
                const contents = document.querySelectorAll(".content");
                contents.forEach(content => {
                    content.style.display = "none";                    
                });
                document.querySelector("#foodList").style.display = "block";
                document.querySelector("#placeList").style.display = "block";
                var weatherText;
                getWeatherData(currentPosition[0],currentPosition[1])
                .then(
                    data => {
                        weatherText = data.current.condition.text
                        var newStringPlaces = "";
                        var newStringFood = ""
                        foodListForAI.map((food, i) => {
                            newStringFood += `Food ${i+1}: name="${food.title}\n"`
                        })
                        
                        places.map((place, i) => {
                            newStringPlaces += `Restaurant ${i+1}: name="${place.name}", distance="${place.distance_string}", price="${place.price}, website="${place.website}\n`
                        })
                        

                        var promptForAI = `This is a program to compare if it is better for the user to cook at home using the ingredients 
                        they have or it is better for them to buy food from outside. I will provide you some information about restaurants 
                        that are close to the use, main ingredients that the user has in his/her fridge, possible recipes that can be created 
                        using the ingredients that user has, and weather data of the user's location. I want you to analysis the data provided 
                        and write a one paragraph report indicating whether it is better to cook at home or to buy food from outside. Please do
                        not be generic. You should pick one side.
                        
                        Here are some information about the restaurants around the user:
                        ${newStringPlaces}

                        Here is the ingredient list that the user has:
                        ${ingredientsString}

                        Here are some recipes that can be created by using the ingredients:
                        ${newStringFood}

                        Here is the weather data of the location that the user resides:
                        ${weatherText}

                        I want you to generate an output starting with "yes" or "no". Start your answer with "yes" if you think it is better to 
                        buy food from outside. Start you answer with "no" if you think it is better to cook food at home using the ingredients provided.
                        Please analysis the information in terms of price, time, and weather. Then include it in your answer. Please only respond 
                        with a short paragraph. Do not forget to start you sentence with "yes" or "no".Please refer the user as "you" in your answer.
                        `
                        
                        chatGPT(promptForAI)
                        .then(response => {
                            compareTitle.innerHTML = "GO BACK"
                            console.log("here is the response returned",response);
                            const aiReport = document.querySelector("#aiReport");

                            aiReport.innerHTML = response;
                            document.querySelector("#reportBox").style.display = "block";
                        })
                        .catch(err => {
                            console.error(err);
                        });                        
                    }
                    )
                .catch(error => console.error(error));
                })
            .catch(error=>{
                console.log(error);
            })
            
            

            
            

            const refs = Array(foods?.length).fill().map((_, i) => elRefs2[i] || createRef());
            setElRefs2(refs);

            
        }else if(compareTitle.innerHTML === "GO BACK"){
            
        }

        
    }
    

    const getBoundingBox = (centerLat, centerLng, distance) => {
        const radius = 3963.189; // Earth's radius in miles
        const latRadians = centerLat * Math.PI / 180;
        const distanceLat = distance / radius * (180 / Math.PI);
        const distanceLng = distance / (radius * Math.cos(latRadians)) * (180 / Math.PI);
      
        const swLat = centerLat - distanceLat / 2;
        const swLng = centerLng - distanceLng / 2;
        const neLat = centerLat + distanceLat / 2;
        const neLng = centerLng + distanceLng / 2;
      
        return {
          sw: {lat: swLat, lng: swLng},
          ne: {lat: neLat, lng: neLng}
        };
      }
      
    const IncreaseCurrentPage = (()=>{
        setCurrentPage(currentPage+1);
        pageChange(currentPage+1, "");          
    });

    const DecreaseCurrentPage = (()=>{
        setCurrentPage(currentPage-1);
        pageChange(currentPage-1, "");
    });

    const SetCurrentPageToOne = (()=>{
        setCurrentPage(1);
        pageChange(1, "");
    });

    useEffect(() =>{
        if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition(async (position) => {
    
                const {longitude, latitude} = position.coords;
                setCurrentPosition([latitude,longitude]);
                const response = await fetch(`https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/reverseGeocode?f=pjson&featureTypes-&location=${longitude},${latitude}`);
    
                const data =  await response.json();
                setLocationText(String(data.address.Subregion)+", "+String(data.address.Region));
                const areaBox = getBoundingBox(latitude, longitude, 4);
                const placesData = await getPlacesData("restaurants",areaBox.sw, areaBox.ne);
                const filteredPlaces = placesData.filter((place) => place.photo);
                console.log(filteredPlaces);
                setPlaces(filteredPlaces);
                });
            }
    },[]);

   const stylesForPageButtons = {
        background: "none",
        border: "none",
        position: "relative",
        display: "inline-block",
        fontSize: "3rem",
        fontWeight: "700",
        cursor: "pointer"
   }

   useEffect(()=>{
    var checkboxInputs = document.querySelectorAll(".checkboxList > input");
    checkboxInputs.forEach(element => {
        element.addEventListener("change", (event)=>{
            let randomString = element.value;
            let ref = checkboxChecked;
            ref[randomString] = event.target.checked;
            setCheckboxChecked(ref);
        })
    });
   },[]);
    
   useEffect(() => {
        SetCurrentPageToOne();
        let element = document.querySelector("#ingredientSearch");
        element.addEventListener("input", () => {
            var timeoutId;
            window.clearTimeout();
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                searchBarChange(element.value);
            }, 1000);
            
            // Cancel the timeout before it fires
                        
        })
    }, []);

    const searchBarChange = (value) => {
        console.log("called");
        setCurrentPage(1);
        const searchValue = value;
        if(searchValue !== ""){
            const filteredValues = ingredients.filter((ingredient) =>
            ingredient.toLowerCase().includes(searchValue.toLowerCase())
            );
            setFilteredIngredients(filteredValues);
            pageChange(1, filteredValues);
        }else{
            setFilteredIngredients(ingredients);
            pageChange(1, ingredients);
        }
    }

    const exitReport = () => {
        document.querySelector("#reportBox").style.display = "none";
    }

    const searchBarStyle = {
        position: "relative",
        left: "50%",
        transform: "translateX(-50%)",
        border: "none",
        boxShadow: "0 0 5px black",
        borderRadius: "15px",
        padding: "10px"
    }

    const blackBackgroundStyle = {
        position:"fixed", 
        height:"100%", 
        width:"50vw",
        top: "0%",
        background: "black",
        opacity: "50%",
        zIndex:"1"
    }

    const reportStyle ={
        position: "fixed",
        height: "fit-content",
        width: "30vw",
        fontSize: "1.1rem",
        background: "linear-gradient(0deg, #ffffff, #feddff, #feddff, #fff)",
        borderRadius: "30px",
        zIndex: "2",
        border: "none",
        boxShadow: "0 0 8px black",
        transition: "none",
        left: "50%",
        top: "40%",
        transform: "translate(-50%,-50%)",
        padding: "25px"
    }

    const exitButtonStyle = {
        position: "absolute",
        height: "40px",
        width: "40px",
        borderRadius: "50%",
        backgroundColor: "red",
        border: "none",
        boxShadow: "0 0 5px black",
        fontSize: "1.5rem",
        fontWeight: "bolder",
        top: "0",
        left: "0",
        transform: "translate(-20%,-20%)"        
    }

    return (
        <div>
            <div id="reportBox" style={{display:"none"}}>
                <div style={{...blackBackgroundStyle, left:"0vw"}}></div>
                <div style={reportStyle}>
                    <button style={exitButtonStyle} onClick={exitReport}>&#10005;</button>
                    <h3 style={{textAlign:"center"}}>REPORT</h3>
                    <p id="aiReport"></p>
                </div>
                <div style={{...blackBackgroundStyle, left:"50vw"}}></div>
            </div>

            <div className={ComparisonCSS.background1} id="background1">
                <h1 className={ComparisonCSS.CookAtHomeTitle}>Cook At Home</h1>
                <div id="foodList">
                        <Grid container spacing={3} className={classes.list} style={{width: "48vw", marginLeft: "1vw", marginTop: "62px", height: "80vh"}}>
                                {foods?.map((food, i) => (
                                <Grid ref={elRefs2[i]}item key={i} xs={12} className="contentCard">
                                    <PlaceDetails 
                                    place={food}
                                    refProp={elRefs2[i]}
                                    current={currentPosition}
                                    />
                                </Grid>
                                ))}
                        </Grid>
                    </div>
                <div className="content" style={{display: "none"}}>
                    <button className={ComparisonCSS.buttons}>Ingredients</button>
                    <br /><br />
                    <input type="text" placeholder="search ingredients..." style={searchBarStyle} id="ingredientSearch"/>
                    <br /><br />
                    <div style={{display: "inline-block", position: "relative"}} className="checkboxList">
                        <input type="checkbox" id="value1" name="value-1" value={currentIngredientList[0]} />
                        <label htmlFor="value1" style={{display: checkboxDisplay[0]}}>{currentIngredientList[0]}</label>      

                        <input type="checkbox" id="value2" name="value-2" value={currentIngredientList[1]} />
                        <label htmlFor="value2" style={{display: checkboxDisplay[1]}}>{currentIngredientList[1]}</label>

                        <input type="checkbox" id="value3" name="value-3" value={currentIngredientList[2]} />
                        <label htmlFor="value3" style={{display: checkboxDisplay[2]}}>{currentIngredientList[2]}</label>

                        <input type="checkbox" id="value4" name="value-4" value={currentIngredientList[3]} />
                        <label htmlFor="value4" style={{display: checkboxDisplay[3]}}>{currentIngredientList[3]}</label>

                        <input type="checkbox" id="value5" name="value-5" value={currentIngredientList[4]} />
                        <label htmlFor="value5" style={{display: checkboxDisplay[4]}}>{currentIngredientList[4]}</label>

                        <input type="checkbox" id="value6" name="value-6" value={currentIngredientList[5]} />
                        <label htmlFor="value6" style={{display: checkboxDisplay[5]}}>{currentIngredientList[5]}</label>

                        <input type="checkbox" id="value7" name="value-7" value={currentIngredientList[6]} />
                        <label htmlFor="value7" style={{display: checkboxDisplay[6]}}>{currentIngredientList[6]}</label>

                        <input type="checkbox" id="value8" name="value-8" value={currentIngredientList[7]} />
                        <label htmlFor="value8" style={{display: checkboxDisplay[7]}}>{currentIngredientList[7]}</label>

                        <input type="checkbox" id="value9" name="value-9" value={currentIngredientList[8]} />
                        <label htmlFor="value9" style={{display: checkboxDisplay[9]}}>{currentIngredientList[8]}</label>

                        <input type="checkbox" id="value10" name="value-10" value={currentIngredientList[9]} />
                        <label htmlFor="value10" style={{display: checkboxDisplay[9]}}>{currentIngredientList[9]}</label>

                        <input type="checkbox" id="value11" name="value-11" value={currentIngredientList[10]} />
                        <label htmlFor="value11" style={{display: checkboxDisplay[10]}}>{currentIngredientList[10]}</label>

                        <input type="checkbox" id="value12" name="value-12" value={currentIngredientList[11]} />
                        <label htmlFor="value12" style={{display: checkboxDisplay[11]}}>{currentIngredientList[11]}</label>

                        <input type="checkbox" id="value13" name="value-13" value={currentIngredientList[12]} />
                        <label htmlFor="value13" style={{display: checkboxDisplay[12]}}>{currentIngredientList[12]}</label>

                        <input type="checkbox" id="value14" name="value-14" value={currentIngredientList[13]} />
                        <label htmlFor="value14" style={{display: checkboxDisplay[13]}}>{currentIngredientList[13]}</label>

                        <input type="checkbox" id="value15" name="value-15" value={currentIngredientList[14]} />
                        <label htmlFor="value15" style={{display: checkboxDisplay[14]}}>{currentIngredientList[14]}</label>
                    </div>
                    <div style={{display: "inline-block", position: "relative"}} className="checkboxList">
                        <input type="checkbox" id="value16" name="value-16" value={currentIngredientList[15]} />
                        <label htmlFor="value16" style={{display: checkboxDisplay[15]}}>{currentIngredientList[15]}</label>      

                        <input type="checkbox" id="value17" name="value-17" value={currentIngredientList[16]} />
                        <label htmlFor="value17" style={{display: checkboxDisplay[16]}}>{currentIngredientList[16]}</label>

                        <input type="checkbox" id="value18" name="value-18" value={currentIngredientList[17]} />
                        <label htmlFor="value18" style={{display: checkboxDisplay[17]}}>{currentIngredientList[17]}</label>

                        <input type="checkbox" id="value19" name="value-19" value={currentIngredientList[18]} />
                        <label htmlFor="value19" style={{display: checkboxDisplay[18]}}>{currentIngredientList[18]}</label>

                        <input type="checkbox" id="value20" name="value-20" value={currentIngredientList[19]} />
                        <label htmlFor="value20" style={{display: checkboxDisplay[19]}}>{currentIngredientList[19]}</label>

                        <input type="checkbox" id="value21" name="value-21" value={currentIngredientList[20]} />
                        <label htmlFor="value21" style={{display: checkboxDisplay[20]}}>{currentIngredientList[20]}</label>

                        <input type="checkbox" id="value22" name="value-22" value={currentIngredientList[21]} />
                        <label htmlFor="value22" style={{display: checkboxDisplay[21]}}>{currentIngredientList[21]}</label>

                        <input type="checkbox" id="value23" name="value-23" value={currentIngredientList[22]} />
                        <label htmlFor="value23" style={{display: checkboxDisplay[22]}}>{currentIngredientList[22]}</label>

                        <input type="checkbox" id="value24" name="value-24" value={currentIngredientList[23]} />
                        <label htmlFor="value24" style={{display: checkboxDisplay[23]}}>{currentIngredientList[23]}</label>

                        <input type="checkbox" id="value25" name="value-25" value={currentIngredientList[24]} />
                        <label htmlFor="value25" style={{display: checkboxDisplay[24]}}>{currentIngredientList[24]}</label>

                        <input type="checkbox" id="value26" name="value-26" value={currentIngredientList[25]} />
                        <label htmlFor="value26" style={{display: checkboxDisplay[25]}}>{currentIngredientList[25]}</label>

                        <input type="checkbox" id="value27" name="value-27" value={currentIngredientList[26]} />
                        <label htmlFor="value27" style={{display: checkboxDisplay[26]}}>{currentIngredientList[26]}</label>

                        <input type="checkbox" id="value28" name="value-28" value={currentIngredientList[27]} />
                        <label htmlFor="value28" style={{display: checkboxDisplay[27]}}>{currentIngredientList[27]}</label>

                        <input type="checkbox" id="value29" name="value-29" value={currentIngredientList[28]} />
                        <label htmlFor="value29" style={{display: checkboxDisplay[28]}}>{currentIngredientList[28]}</label>

                        <input type="checkbox" id="value30" name="value-30" value={currentIngredientList[29]} />
                        <label htmlFor="value30" style={{display: checkboxDisplay[29]}}>{currentIngredientList[29]}</label>
                    </div>

                    <p>
                        <button style={{...stylesForPageButtons, display: pageButtonDisplay[0]}} onClick={DecreaseCurrentPage}>&#8249;</button>
                        <button style={{...stylesForPageButtons, fontSize: "2rem"}} onClick={SetCurrentPageToOne}>{maxPageNumber === 0 ? 0 : currentPage}/{parseInt(maxPageNumber)}</button>
                        <button style={maxPageNumber < 2 ? {display: "none"} : {...stylesForPageButtons, display: pageButtonDisplay[1]}} onClick={IncreaseCurrentPage}>&#8250;</button>
                    </p>
                </div>
            </div>
            <div className={ComparisonCSS.background2} id="background2">
                <h1 className={ComparisonCSS.BuyFromOutsideTitle}>Buy From Outside</h1>
                <div id="placeList">
                    <br /><br /><br /><br />
                    <Grid container spacing={3} className={classes.list} style={{width: "48vw", marginLeft: "1vw", height: "80vh"}}>
                        {places?.map((place, i) => (
                        <Grid ref={elRefs[i]}item key={i} xs={12} className="contentCard">
                            <PlaceDetails 
                            place={place}
                            refProp={elRefs[i]}
                            current={currentPosition}
                            />
                        </Grid>
                        ))}
                    </Grid>
                </div>
                <div className="content" style={{display: "none", width:"46vw", position:"relative", transform:"translateX(2vw)", height:"30vw"}}>
                    <button className={ComparisonCSS.buttons}>Location</button><br />
                    <h5 style={{textAlign:"center", color:"#b52f22"}}> </h5>
                    <Map 
                        coordinates={currentPosition && {lat:currentPosition[0],lng:currentPosition[1]}}
                        setCoordinates={()=>{}}
                        setBounds={()=>{}}
                    />
                </div>
            </div>
            <div className={ComparisonCSS.middleLine}></div>
            <div className={ComparisonCSS.compareButtonBox} id="compareButton" onClick={compareButton}>
                <button className={ComparisonCSS.compare} id="compareButtonTitle">START</button>
            </div>
        </div>
    )
}

export default ComparisonPage