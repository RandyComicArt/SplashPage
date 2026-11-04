import { HashRouter, Route, Routes } from 'react-router-dom'
import AppShell from './layout/AppShell.jsx'
import Home from './pages/Home.jsx'
import Discover from './pages/Discover.jsx'
import ComicPage from './pages/ComicPage.jsx'
import SeriesPage from './pages/SeriesPage.jsx'
import GuidesIndex from './pages/GuidesIndex.jsx'
import GuidePage from './pages/GuidePage.jsx'
import Saved from './pages/Saved.jsx'
import NotFound from './pages/NotFound.jsx'

// HashRouter keeps URLs like /SplashPage/#/discover. GitHub Pages serves only
// static files, so a normal path such as /SplashPage/discover would 404 on refresh.
export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<Home />} />
          <Route path="discover" element={<Discover />} />
          <Route path="comics/:comicId" element={<ComicPage />} />
          <Route path="series/:seriesId" element={<SeriesPage />} />
          <Route path="guides" element={<GuidesIndex />} />
          <Route path="guides/:slug" element={<GuidePage />} />
          <Route path="saved" element={<Saved />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}
