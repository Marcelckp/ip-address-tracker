import './App.css';
import { useState, useEffect, useRef } from 'react'
import { apiKey } from './apiKey';
import { mapBoxKey } from './apiKey';
import axios from 'axios';
import pattern from './images/pattern-bg.png';

import ReactMapGL, { Marker } from 'react-map-gl';

//components
import iconLocSVG from './images/icon-location.svg'

function App() {

  const [currentUsersData, setCurrentUsersData] = useState(null);
  const [currentUserLocation, setCurrentUserLocation] = useState(null);
  
  const [viewport, setViewport] = useState({
    latitude: 37.7577,
    longitude: -122.4376,
    zoom: 16,
    pitch: 50
  });

  const IPsearch = useRef(null);

  useEffect( () => {
    async function data() {
      const ip = await axios.get('https://api.ipify.org/?format=json')
        .then((res) => {
          return res.data.ip;
        })

      // await axios.get(`https://geo.ipify.org/api/v2/country?apiKey=${apiKey}&ipAddress=${ip}`)
      //   .then((res) => {
      //     setCurrentUsersData(res.data);
      //   })
      
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          setCurrentUserLocation(position.coords);
          setViewport({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            zoom: 13,
            pitch: 50
          })
        }, (error) => {
          switch(error.code) {
            case error.PERMISSION_DENIED:
              alert('User Denied the request for Geolocation.');
              break;
            case error.POSITION_UNAVAILABLE:
              alert('Location information is unavailable.');
              break;
            case error.TIMEOUT:
              alert('The request to get user location has timed out');
              break;
            case error.UNKNOWN_ERROR:
              alert('An unknown error has occurred');
              break;
            default:
              alert('An unknown error has occurred');
          }
          console.log(error)
        })
      }else {
        alert('This Browser does no support GeoLocation')
      }
    }

    return data()
  },[]);

  console.log(currentUsersData)
  console.log(currentUserLocation)

  const searchIPinformation = (e) => {
    e.preventDefault();
  }

  return (
    <>
    <div className="App">
      <div className='IP-screen'>
        <h1 className='Title-IP'>IP Address Tracker</h1>
        <form>
          <input type="text" ref={IPsearch} className='inputFieldIP' placeholder='Search for any IP address/Domain' />
          <button onClick={(e) => searchIPinformation(e)}><svg xmlns="http://www.w3.org/2000/svg" width="11" height="14"><path fill="none" stroke="#FFF" strokeWidth="3" d="M2 1l6 6-6 6"/></svg></button>
        </form>
        <div className='IP-info'>
        { currentUsersData ?
          <>
            <div className='div-info-1'>
              <h3>IP ADDRESS</h3>
              <h2>{ currentUsersData.ip }</h2>
            </div>

            <div className='div-info-2'>
              <h3>LOCATION</h3>
              <h2>{ currentUsersData.location.region }, { currentUsersData.location.country }</h2>
              <h2>{ currentUsersData.as.asn }</h2>
            </div>

            <div className='div-info-3'>
              <h3>TIMEZONE</h3>
              <h2>{ currentUsersData.location.country} - { currentUsersData.location.timezone }</h2>
            </div>

            <div className='div-info-4'>
              <h3>ISP</h3>
              <h2>{ currentUsersData.isp }</h2>
            </div>
          </>
          : null
        }
        </div>
      </div>
    </div>
    <div className='first-half' style={{backgroundSize:'cover',backgroundImage: `url(${pattern})` , backgroundPosition: 'center center'}}></div>
    { currentUserLocation ?
      <div className="second-half" style={{backgroundSize:'cover',backgroundImage: `url(${pattern})`}}>

        <ReactMapGL 
        mapboxApiAccessToken={mapBoxKey}
          {...viewport}
          mapStyle={'mapbox://styles/mapbox/dark-v9' || "mapbox://styles/mapbox/light-v9"}
          width='100%'
          height='100%'
          onViewportChange={(viewport) => setViewport(viewport)}
        >

        <Marker latitude={currentUserLocation.latitude} offsetTop={-50} longitude={currentUserLocation.longitude}>
            <img src={iconLocSVG} alt='marker'/>
        </Marker>

        </ReactMapGL>

      </div>
      : 
      <div className='second-half' style={{background: 'lightblue'}}>
      </div>
    }
    </>
  );
}

export default App;
