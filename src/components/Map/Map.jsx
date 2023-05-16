import React, { useState } from 'react';
import GoogleMapReact from 'google-map-react';
import { Paper, Typography, useMediaQuery } from '@material-ui/core';
import LocationOnOutlinedIcon from '@material-ui/icons/LocationOnOutlined';
import Rating from '@material-ui/lab/Rating';
import useStyles from './styles';

const Map = ({setCoordinates, setBounds, coordinates, places, setChildClicked}) => {
  const classes = useStyles();
  const isDesktop = useMediaQuery('(min-width: 600px)');
  

  return (
    <div className={classes.mapContainer}>
      <GoogleMapReact
          bootstrapURLKeys={{ key: "AIzaSyCSifhAw4rd1juo1g8VjGevyTE_-91HpPs" }}
          defaultCenter={coordinates}
          center={coordinates}
          defaultZoom={15.5}
          margin={[50, 50, 50, 50]}
          options={""}
          onChange={(e)=>{
            setCoordinates({lat: e.center.lat, lng: e.center.lng});
            setBounds({ne: e.marginBounds.ne, sw: e.marginBounds.sw});
          }}
          onChildClick={(child)=> {setChildClicked(child)}}
      >
        {places?.map((place, i) => (
          <div
            className={classes.markerContainer}
            lat={Number(place.latitude)}
            lng={Number(place.longitude)}
            key={i}
          >
            {isDesktop
              ? <Paper elevation={3} className={classes.paper}>
              <Typography className={classes.typography} variant="subtitle2" gutterBottom> {place.name}</Typography>
              <img
                className={classes.pointer}
                src={place.photo && place.photo.images.large.url}
                alt={place.name}
              />
              <Rating name="read-only" size="small" value={Number(place?.rating)} readOnly />
            </Paper>
              : (
                <LocationOnOutlinedIcon color="primary" fontSize="large" />
              )}
            
          </div>
        ))}
        
          
          
      </GoogleMapReact>
    </div>
  )
}

export default Map
