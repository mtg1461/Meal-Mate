import axios from 'axios';



export async function chatGPT(prompt) {
  try{
    const OPENAI_API_KEY = "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";
    const { Configuration, OpenAIApi } = require("openai");
    const configuration = new Configuration({
      apiKey: OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: prompt,
      max_tokens: 200,
      temperature: 0,
    });
    return response.data.choices[0].text
  }catch(error){
    console.log("An error occured!",error);
  }
}




export const getPlacesData = async (type, sw, ne) => {
    try {
        const {data: { data }} = await axios.get(`https://travel-advisor.p.rapidapi.com/${type}/list-in-boundary`, {
            params: {
                bl_latitude: sw.lat,
                tr_latitude: ne.lat,
                bl_longitude: sw.lng,
                tr_longitude: ne.lng,
                restaurant_tagcategory_standalone: '10591',
                restaurant_tagcategory: '10591',
                limit: '200',
                currency: 'USD',
                open_now: 'false',
                lunit: 'km',
                lang: 'en_US'
              },
              headers: {
                'X-RapidAPI-Key': 'ff5113e2bcmsh1e1816c9487771bp18af6ejsnbfda0b3a3b11',
                'X-RapidAPI-Host': 'travel-advisor.p.rapidapi.com'
              }
        });

        return data;
    } catch (error) {
        console.log(error);
    }
}

export const getRecipe = async (ingredientsListAsString) => {
    return new Promise((resolve, reject) => {
      axios
      .get(`https://api.spoonacular.com/recipes/findByIngredients?apiKey=a5720b18b1984deb867ef4363d942a6d&ingredients=${ingredientsListAsString}&number=30`)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        console.error(error);
        reject(error);
      });
    });
}

export const getDirections = async (origin, destination) => {
    const API_KEY = 'AIzaSyB5Av4NXJk9hODXe1T7d3IR5f_cvAp5W2o';
    try {
        const directions = await axios.get(`https://maps.googleapis.com/maps/api/directions/json?origin=${origin[0]},${origin[1]}&destination=${destination[0]},${destination[1]}&key=${API_KEY}`);
        const routes = directions.data.routes;
        let fastestRoute = routes[0];
        let fastestDuration = fastestRoute.legs[0].duration.value;

        for (let i = 1; i < routes.length; i++) {
        const duration = routes[i].legs[0].duration.value;
        if (duration < fastestDuration) {
            fastestRoute = routes[i];
            fastestDuration = duration;
        }
        }

        const firstStep = fastestRoute.legs[0].steps[0];
        const transportationMode = firstStep.travel_mode;
        const distance = firstStep.distance.text;
        const duration = firstStep.duration.text;

        return {
            transportationMode: `Transportation mode: ${transportationMode}`,
            distance: `Distance: ${distance}`,
            duration: `Duration: ${duration}`
          };
      } catch (error) {
        console.log('Error getting directions:', error);
      }
  };

export const getWeatherData = async (latValue, lngValue) => {
    const apiKey = '43f0cec375174bd9999145052233004';
    return fetch(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${latValue},${lngValue}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      return data;
    })
    .catch(error => {
      console.error('Error:', error);
      return error;
    });
}


export async function searchYouTube(keyword) {
  const API_KEY = "AIzaSyB5Av4NXJk9hODXe1T7d3IR5f_cvAp5W2o";
  const BASE_URL = "https://www.googleapis.com/youtube/v3/search";
  const response = await fetch(
    `${BASE_URL}?part=snippet&type=video&maxResults=3&q=${keyword}&key=${API_KEY}`
  );

  const data = await response.json();
  return data;
}


  
