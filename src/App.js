import React, { useState, useEffect } from "react";
import './App.css';
import store from "./redux/store";
import { BrowserRouter as Router, Routes, Route, useParams} from 'react-router-dom';
import Header from './componets/Header';
import Aside from './componets/Aside';
import PageMain from './componets/pages/PageMain';
import PageTracks from './componets/pages/PageTracks';
import PagePlayList from './componets/pages/PagePlayList';
import PageProfileEditing from './componets/pages/PageProfileEditing';
import PageSinglePlaylist from './componets/pages/PageSinglePlaylist';
import MusicPlayerSlider from './componets/pages/MusicPlayerSlider'
import PageSearchTracks from './componets/pages/PageSearchTracks';
import PageCreatingAndEditingPlaylist from './componets/pages/PageCreatingAndEditingPlaylist';
import PageMyPlaylist from './componets/pages/PageMyPlaylist';
import PageMyTracks from './componets/pages/PageMyTracks';


function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(store.getState().auth);
  let {id} = useParams();

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      const authState = store.getState().persistedReducer.auth;
      setIsLoggedIn(authState.token);
    })
    return () => unsubscribe()
  }, [])

  return (
    <Router>
      <Header props={isLoggedIn}></Header>
      <Routes>
        {isLoggedIn ?
        <>
        <Route element={<Aside />} >
          <Route path="/" element={<PageMain props={isLoggedIn}/>} />
          <Route path="playlists" element={<PagePlayList />} />
          <Route path="profileEditing" element={<PageProfileEditing />} />
          <Route path="playlist/:id" element={<PageSinglePlaylist />} />
          <Route path="tracks" element={<PageTracks/>} /> 
          <Route path="player" element={<MusicPlayerSlider/>} /> 
          <Route path="creatingPlaylist" element={<PageCreatingAndEditingPlaylist/>}/>
          <Route path="editPlaylist/:id" element={<PageCreatingAndEditingPlaylist/>}/>
          <Route path="search" element={<PageSearchTracks />} />
          <Route path="myPlaylist" element={<PageMyPlaylist />} />
          <Route path="myTracks" element={<PageMyTracks/>} />
        </Route>
        </>
        :
        <> 
        <Route path="/" element={<PageMain props={isLoggedIn}/>} />
        <Route element={<Aside />} >
          <Route path="playlists" element={<PagePlayList />} />
          <Route path="profileEditing" element={<PageProfileEditing />} />
          <Route path="playlist/:id" element={<PageSinglePlaylist />} />
          <Route path="tracks" element={<PageTracks/>} /> 
          <Route path="player" element={<MusicPlayerSlider/>} /> 
          <Route path="myTracks" element={<PageMyTracks/>} />
          <Route path="creatingPlaylist" element={<PageCreatingAndEditingPlaylist/>}/>
          <Route path="editPlaylist/:id" element={<PageCreatingAndEditingPlaylist/>}/>
          <Route path="search"  element={<PageSearchTracks />}/>
          <Route path="myPlaylist" element={<PageMyPlaylist />} />
        </Route>
        </>
      }
      </Routes>
    </Router>
  );
}

export default App;
