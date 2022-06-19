import AppRoutes from "./pages";
import Header from "./components/layouts/header";
import Main from "./components/layouts/main";
import Footer from "./components/layouts/footer";
import "./assets/styles/utility.css";
import "antd/dist/antd.css";

function App() {
  return (
    <>
      <Header />
      <Main>
        <AppRoutes />
      </Main>
      <Footer />
    </>
  );
}

export default App;
