import React,{useEffect, useState} from 'react';
import {Box, Typography, Button, Card, CardMedia, CardContent, CardActions, Chip} from '@material-ui/core';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import PhoneIcon from '@material-ui/icons/Phone';
import Rating from '@material-ui/lab/Rating'
import { searchYouTube } from '../../api';

import useStyles from './styles';

import { getDirections } from '../../api';

const PlaceDetails = ({ place, selected, refProp, current }) => {
  const [transportationMode, setTransportationMode] = useState(null);
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);
  const [foodUsedIngredients, setFoodUsedIngredients] = useState("");
  const [foodUnusedIngredients, setFoodUnusedIngredients] = useState("");
  const [youtubeData, setYoutubeData] = useState(null);
  const [loadMore, setLoadMore] = useState(false);
  
  
  if (selected){
    console.log("this is refProp",refProp);
    refProp?.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } 
  const classes = useStyles();
  const executeDirections = () => {
    getDirections(current, [place.latitude, place.longitude]).then(data =>{
      setTransportationMode(data.transportationMode);
      setDistance(data.distance);
      setDuration(data.duration);
    });
  }
  // useEffect(executeDirections,[])
  useEffect(() =>{
    var newString = "";
    if(!place.location_id){
      place.usedIngredients.forEach(element => {
        newString += element.name+", ";
      });
      newString = newString.slice(0,-2);
      setFoodUsedIngredients(newString)
      newString = "";
      place.unusedIngredients.forEach(element => {
        newString += element.name+", ";
      });
      newString = newString.slice(0,-2);
      setFoodUnusedIngredients(newString);
    }
  },[])
  const displayYoutubeData = () => {
    setLoadMore(true)
    searchYouTube(place.title)
      .then((data) => {
          console.log(data);
          setYoutubeData(data.items);
      })
      .catch(error=>{
          console.log(error);
      })
  }

  return (
    <>
    {!place.location_id ? 
      <Card elevation={6}>
        <CardMedia 
          style={{ height: 350}}
          image={place.image}
          title={place.title}
        />
        <CardContent>
          <Typography gutterBottom varient='h5'>{place.title}</Typography>
        </CardContent>
        <div style={{fontFamily:"sans-serif", textAlign:"center"}}>
          <div style={{fontWeight: "bolder",marginTop:"10px"}}>Used Ingredients</div>
          &#9734;&nbsp;{foodUsedIngredients}<br />
          <div style={{fontWeight: "bolder",marginTop:"10px"}}>Unused Ingredients</div>
          &#9734;&nbsp;{foodUnusedIngredients}<br />
          <br />
          
          {!loadMore ?
            <button onClick={displayYoutubeData}>Load More</button>
          :
            <>
            <div style={{fontWeight: "bolder",marginTop:"10px"}}>Video Tutorials</div>
            <br />
              {youtubeData?.map((item) => (
                <li key={item.id.videoId}>
                  <img src={item.snippet.thumbnails.default.url} alt={item.snippet.title} />
                  <h5>{item.snippet.title}</h5>
                  <a href={`https://www.youtube.com/watch?v=${item.id.videoId}`} target="_blank" rel="noopener noreferrer" style={{fontSize:"0.7rem", fontStyle:"italic", marginTop:"-20px"}}>Watch on YouTube</a><br /><br /><br />
                </li>
              ))}
              <button onClick={()=>{setLoadMore(false)}}>Show Less</button>
            </>
          }
          
        </div>
        <br />
      </Card>    
    :
    <Card elevation={6}>
      <CardMedia 
        style={{ height: 350}}
        image={place.photo ? place.photo.images.large.url : 'https://www.foodserviceandhospitality.com/wp-content/uploads/2016/09/Restaurant-Placeholder-001.jpg'}
        title={place.name}
      />
      <CardContent>
        <Typography gutterBottom varient='h5'>{place.name}</Typography>
        <Box display="flex" justifyContent="space-between" my={2}>
          <Rating name="read-only" value={Number(place.rating)} readOnly />
          <Typography component="legend">{place.num_reviews} review{place.num_reviews > 1 && 's'}</Typography>
        </Box>
        <Box display="flex" justifyContent="space-between">
          <Typography component="legend">Price</Typography>
          <Typography gutterBottom variant="subtitle1">
            {place.price ? place.price : "No Info Found"}
          </Typography>
        </Box>
        <Box display="flex" justifyContent="space-between">
          <Typography component="legend">Ranking</Typography>
          <Typography gutterBottom variant="subtitle1">
            {place.ranking}
          </Typography>
        </Box>
        {place?.awards?.map((award) => (
          <Box display="flex" justifyContent="space-between" my={1} alignItems="center">
            <img src={award.images.small} alt={place.name}/>
            <Typography variant="subtitle2" color="textSecondary">{award.display_name}</Typography>
          </Box>
        ))}
        {place?.cuisine?.map(({ name }) => (
          <Chip key={name} size="small" label={name} className={classes.chip} />
        ))}
        {place.address && (
          <Typography gutterBottom variant="body2" color="textSecondary" className={classes.subtitle}>
            <LocationOnIcon />{place.address}
          </Typography>
        )}
        {place.phone && (
          <Typography variant="body2" color="textSecondary" className={classes.spacing}>
            <PhoneIcon /> {place.phone}
          </Typography>
        )}
        {current && (
        <div style={{fontFamily:"sans-serif"}}>
          <br />
          <div style={{fontWeight: "bolder",marginTop:"10px"}}>Transportation Information</div><br />
          &#9734;&nbsp;{transportationMode}<br />
          &#9734;&nbsp;{distance}<br />
          &#9734;&nbsp;{duration}
        </div>)}
      </CardContent>
      <CardActions>
        <Button size="small" color="primary" onClick={() => window.open(place.web_url, '_blank')}>
          Trip Advisor
        </Button>
        <Button size="small" color="primary" onClick={() => window.open(place.website, '_blank')}>
          Website
        </Button>
      </CardActions>
    </Card>
      }
    </>      
  )
}

export default PlaceDetails
