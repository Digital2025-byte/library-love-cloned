import { Route, Routes } from "react-router-dom";
import HomePage from "@/app/HomePage";
import DocsComponentPage from "@/app/docs/[slug]/DocsComponentPage";
import IdeaGroupPage from "@/app/ideas/[slug]/IdeaGroupPage";
import PagesListPage from "@/app/pages/PagesListPage";
import PageEditorPage from "@/app/pages/[slug]/PageEditorPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/docs/:slug" element={<DocsComponentPage />} />
      <Route path="/ideas/:slug" element={<IdeaGroupPage />} />
      <Route path="/pages" element={<PagesListPage />} />
      <Route path="/pages/:slug" element={<PageEditorPage />} />
    </Routes>
  );
}
