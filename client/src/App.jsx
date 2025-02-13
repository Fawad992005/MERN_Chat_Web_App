import {
  BrowserRouter as Router,
  Routes,
  Route,
  
} from "react-router-dom";
import Login from "./Pages/Login.jsx";

import Signup from "./Pages/Signup.jsx";
import Resetpas from "./Pages/Resetpas.jsx";
import Forgotpass from "./Pages/Forgotpass.jsx";
import { Chatprovider } from "./Context/Chatprovider.jsx";

import Chatpage from "./Pages/Chatpage.jsx";

function App() {
  

  return (
    <>
      <Router>
        <Chatprovider>
          <Routes>
            <Route path="/" element={<Chatpage />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<Forgotpass />} />
            <Route path="/reset-password" element={<Resetpas />} />
          </Routes>
        </Chatprovider>
      </Router>
    </>
  );
}

export default App;
