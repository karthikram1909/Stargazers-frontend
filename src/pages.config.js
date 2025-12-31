import ConstellationDetail from './pages/ConstellationDetail';
import Constellations from './pages/Constellations';
import Home from './pages/Home';
import Moon from './pages/Moon';
import PlanetDetail from './pages/PlanetDetail';
import Planets from './pages/Planets';
import SkyMap from './pages/SkyMap';
import StarDetail from './pages/StarDetail';
import Stars from './pages/Stars';
import Wayfinding from './pages/Wayfinding';
import __Layout from './Layout.jsx';


export const PAGES = {
    "ConstellationDetail": ConstellationDetail,
    "Constellations": Constellations,
    "Home": Home,
    "Moon": Moon,
    "PlanetDetail": PlanetDetail,
    "Planets": Planets,
    "SkyMap": SkyMap,
    "StarDetail": StarDetail,
    "Stars": Stars,
    "Wayfinding": Wayfinding,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};