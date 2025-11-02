import Home from './pages/Home';
import Stars from './pages/Stars';
import Moon from './pages/Moon';
import Wayfinding from './pages/Wayfinding';
import Planets from './pages/Planets';
import StarDetail from './pages/StarDetail';
import SkyMap from './pages/SkyMap';
import Constellations from './pages/Constellations';
import Layout from './Layout.jsx';


export const PAGES = {
    "Home": Home,
    "Stars": Stars,
    "Moon": Moon,
    "Wayfinding": Wayfinding,
    "Planets": Planets,
    "StarDetail": StarDetail,
    "SkyMap": SkyMap,
    "Constellations": Constellations,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: Layout,
};