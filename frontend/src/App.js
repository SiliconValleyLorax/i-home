import React from "react";
import Navbar from "./components/Navbar";
import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Home from "./pages/Home";
import UploadImage from "./pages/UploadImage";
import ClassRoom from "./pages/ClassRoom";
//booklist 페이지 추가
import BookList from "./pages/BookList";
import BookDetail from "./pages/BookDetail";
import CameraSet from "./pages/CameraSet";
import ScrollToTop from "./ScrollTop";
//import Cam from "./pages/Cam";
//import Camera from "./pages/Camera";
//import CameraPro from "./pages/CameraPro";

function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Navbar />
        <Switch>
          <Route path="/" exact={true} component={Home} />
          <Route path="/uploadImage" component={UploadImage} />
          <Route path="/uploadImage" component={UploadImage} />
          <Route path="/classRoom" component={ClassRoom} />
          <Route path="/cameraSet" component={CameraSet} />
          <Route path="/bookList" component={BookList} />
        </Switch>
      </Router>
    </>
  );
}

export default App;

//<Route path="/cam" component={Cam} />
//<Route path="/camera" component={Camera} />
//<Route path="/cameraPro" component={CameraPro} />
