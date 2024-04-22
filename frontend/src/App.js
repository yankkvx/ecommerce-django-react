import { Container } from "react-bootstrap";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";

import HomeScreen from "./screens/HomeScreen";
import ProductScreen from "./screens/ProductScreen";
import AboutScreen from "./screens/AboutScreen";
import CartScreen from "./screens/CartScreen";

function App() {
    return (
        <Router>
            <div>
                <Header />
                <main className="py-3">
                    <Container>
                        <Routes>
                            <Route path="/" element={<HomeScreen />} exact />
                            <Route
                                path="/products/:id"
                                element={<ProductScreen />}
                            />
                            <Route
                                path="/about-us/"
                                element={<AboutScreen />}
                            />
                            <Route path="/cart/:id?" element={<CartScreen />} />
                        </Routes>
                    </Container>
                </main>
                <Footer />
            </div>
        </Router>
    );
}

export default App;
