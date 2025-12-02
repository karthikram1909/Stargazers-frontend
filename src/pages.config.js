import Home from './pages/Home';
import Stars from './pages/Stars';
import Moon from './pages/Moon';
import Wayfinding from './pages/Wayfinding';
import Planets from './pages/Planets';
import StarDetail from './pages/StarDetail';
import SkyMap from './pages/SkyMap';
import Constellations from './pages/Constellations';
import PlanetDetail from './pages/PlanetDetail';
import ConstellationDetail from './pages/ConstellationDetail';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Home": Home,
    "Stars": Stars,
    "Moon": Moon,
    "Wayfinding": Wayfinding,
    "Planets": Planets,
    "StarDetail": StarDetail,
    "SkyMap": SkyMap,
    "Constellations": Constellations,
    "PlanetDetail": PlanetDetail,
    "ConstellationDetail": ConstellationDetail,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};