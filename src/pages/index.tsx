import {Routes, Route} from "react-router-dom";
import Products from "./products";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/products" element={<Products />} />
    </Routes>
  );
}
