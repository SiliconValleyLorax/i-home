import React from "react";
import Navbar from "./components/Navbar";
import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import UploadImage from "./pages/UploadImage";
import ClassRoom from "./pages/ClassRoom";
//booklist 페이지 추가
import BookList from "./pages/BookList";
import BookDetail from "./pages/BookDetail";
import CameraSet from "./pages/CameraSet";
import GallerySet from "./pages/GallerySet";
import Cam from "./pages/Cam";
import Camera from "./pages/Camera";
import CameraPro from "./pages/CameraPro";

function App() {
  return (
    <>
      <Router>
        <Navbar />
        <Switch>
          <Route path="/" />
        </Switch>
      </Router>
      <Router>
        <Route path="/uploadImage" component={UploadImage} />
        <Route path="/classRoom" component={ClassRoom} />
        <Route path="/cameraSet" component={CameraSet} />
        <Route path="/gallerySet" component={GallerySet} />
        <Route path="/bookList" component={BookList} />
        <Route path="/bookDetail" component={BookDetail} />
        <Route path="/cam" component={Cam} />
        <Route path="/camera" component={Camera} />
        <Route path="/cameraPro" component={CameraPro} />
      </Router>
    </>
  );
}

export default App;
