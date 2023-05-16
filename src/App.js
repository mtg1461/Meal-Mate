import {BrowserRouter, Routes, Route} from "react-router-dom";
import MapPage from "./pages/mapPage";
import WelcomePage from "./pages/WelcomePage";
import ComparisonPage from "./pages/ComparisonPage";


const App = () => {
    return(
        <div>
            <BrowserRouter>
             <Routes>
                <Route index element={<MapPage />}/>
                <Route path="/MapPage" element={<MapPage />}/>
                <Route path="/WelcomePage" element={<WelcomePage />}/>
                <Route path="/ComparisonPage" element={<ComparisonPage />}/>
             </Routes>
            </BrowserRouter>
        </div>
    )
}

export default App;