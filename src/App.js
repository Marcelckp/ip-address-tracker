import './App.css';
import { useState, useEffect, useRef } from 'react';
import { mapBoxKey } from './apiKey';
// import { ipstackKey } from './apiKey';
import axios from 'axios';
import pattern from './images/pattern-bg.png';

import ReactMapGL, { Marker } from 'react-map-gl';

function App() {

  const [currentUsersData, setCurrentUsersData] = useState(null);
  const [change, setChange] = useState(null);

  const [error, setError] = useState(null);
  
  const [viewport, setViewport] = useState({
    latitude: 37.7577,
    longitude: -122.4376,
    zoom: 16,
    pitch: 50
  });

  const IPsearch = useRef(null);

  const [closeModal, setCloseModal] = useState(null);

  const [showHint, setShowHint] = useState(null);

  const [darkMap, setDarkMap] = useState(null)

  useEffect( () => {
    async function data() {
      const ip = await axios.get('https://api.ipify.org/?format=json')
        .then((res) => {
          return res.data.ip;
        })

      await axios.get(`https://ipwhois.app/json/${ip}`)
        .then((res) => {
          // console.log(res.data)
          setCurrentUsersData(res.data);
          setViewport({
            latitude: res.data.latitude,
            longitude: res.data.longitude,
            zoom: 13,
            pitch: 50
          })
        })
    }

  const userPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

  setDarkMap(userPrefersDark)

    return data()
  },[]);

  const searchIPinformation = async(e) => {
    e.preventDefault();

    if (/\b((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\.|$)){4}\b/.test(IPsearch.current.value)) {

      await axios.get(`https://ipwhois.app/json/${IPsearch.current.value}`)
          .then((res) => {
            // console.log(res.data)
            setCurrentUsersData(res.data);
            setViewport({
              latitude: res.data.latitude,
              longitude: res.data.longitude,
              zoom: 13,
              pitch: 50
            });
          }).catch((err) => {
            console.log(err)
          })

      setChange(true);
      setError(false);
    } else {
      IPsearch.current.value = '';
      setError(true);
    }
  }

  return (
    <>
    <div className="App">
      <div className='IP-screen'>
        <h1 className='Title-IP'>IP Address Tracker</h1>
        { error ? <p className='error-markup'>* The IP Address You Entered Is Invalid</p> : null}
        <form className={`${error ? 'error-input-form' : null}`}>
          <input type="text" ref={IPsearch} className={`inputFieldIP`} placeholder='Search for any IP address/Domain' />
          <button className='input-btn' onClick={(e) => searchIPinformation(e)} alt='submit button' ><svg xmlns="https://www.w3.org/2000/svg" width="11" height="14"><path fill="none" stroke="#FFF" strokeWidth="3" d="M2 1l6 6-6 6"/></svg></button>
        </form>
        <div className={`IP-info ${closeModal ? 'hide-modal' : null}`}>
        { currentUsersData ?
          <>
            <div className='div-info-1'>
              <h3>IP ADDRESS</h3>
              <h2>{ currentUsersData.ip }</h2>
            </div>

            <div className='div-info-2'>
              <h3>LOCATION</h3>
              <h2>{ currentUsersData.city }, { currentUsersData.country }, { currentUsersData.region} {currentUsersData.country_code}</h2>
              <h2>{ currentUsersData.region_code}{ currentUsersData.zip }</h2>
            </div>

            <div className='div-info-3'>
              <h3>TIMEZONE</h3>
              <div>
                <img src={ currentUsersData.country_flag} alt={` country ${ currentUsersData.country_name }`} className='Flag' /> 
                <h2>{ currentUsersData.location} { currentUsersData.timezone_gmt }</h2>
              </div>              
            </div>

            <div className='div-info-4'>
              <h3>ISP</h3>
              <h2>{ currentUsersData.isp}</h2>
              <h2>{ currentUsersData.type }</h2>
            </div>
            
          </>
          : 
            <>
              <div className='skeleton-info'>
                <div className='skeleton-div-ipad'></div>
                <div className='skeleton-div-location'></div>
                <div className='skeleton-div-timezone'></div>
                <div className='skeleton-div-isp'></div>
              </div>
            </>
        }
        </div>
      </div>
      { showHint ? <div className='button-information'>
        <p>Hides Modal to view the map, Note: if you change your systems appearance from light to dark or visa vera, you need to refresh the page to change the map theme</p>
      </div> : null }
      <div className="button-toggle" onClick={() => {
          if (closeModal) setCloseModal(false);
          else setCloseModal(true)
        }} onMouseOver={() => setShowHint(true)} onMouseLeave={() => setShowHint(false)}>
        { closeModal ? <p>Open Modal</p> : <p>Close Modal</p>}
      </div>
    </div>
    <div className='first-half' style={{backgroundSize:'cover',backgroundImage: `url(${pattern})` , backgroundPosition: 'center center'}}></div>
    <div className="skeleton second-half"></div>
    { currentUsersData ?
      <div className="second-half skeleton" style={{backgroundSize:'cover',backgroundImage: `url(${pattern})`, backgroundPosition: 'center center'}}>

        <ReactMapGL 
        mapboxApiAccessToken={mapBoxKey}
          {...viewport}
          mapStyle={`${ darkMap ? 'mapbox://styles/mapbox/dark-v9' : 'mapbox://styles/mapbox/light-v8'}`}
          width='100%'
          height='100%'
          onViewportChange={(viewport) => setViewport(viewport)}
        >

        { change ? 
          <Marker latitude={currentUsersData.latitude} offsetTop={-50} longitude={currentUsersData.longitude}>
            <svg xmlns="https://www.w3.org/2000/svg" style={{fill: 'red'}} width="46" height="56"><path fillRule="evenodd" d="M39.263 7.673c8.897 8.812 8.966 23.168.153 32.065l-.153.153L23 56 6.737 39.89C-2.16 31.079-2.23 16.723 6.584 7.826l.153-.152c9.007-8.922 23.52-8.922 32.526 0zM23 14.435c-5.211 0-9.436 4.185-9.436 9.347S17.79 33.128 23 33.128s9.436-4.184 9.436-9.346S28.21 14.435 23 14.435z"/></svg>
          </Marker>
        :
          <Marker latitude={currentUsersData.latitude} offsetTop={-50} longitude={currentUsersData.longitude}>
            <svg xmlns="https://www.w3.org/2000/svg" style={{fill: 'red'}} width="46" height="56"><path fillRule="evenodd" d="M39.263 7.673c8.897 8.812 8.966 23.168.153 32.065l-.153.153L23 56 6.737 39.89C-2.16 31.079-2.23 16.723 6.584 7.826l.153-.152c9.007-8.922 23.52-8.922 32.526 0zM23 14.435c-5.211 0-9.436 4.185-9.436 9.347S17.79 33.128 23 33.128s9.436-4.184 9.436-9.346S28.21 14.435 23 14.435z"/></svg>
          </Marker>
        }
        </ReactMapGL>
      </div>
      : 
      <div className='second-half'>
      </div>
    }
    </>
  );
}

export default App;
