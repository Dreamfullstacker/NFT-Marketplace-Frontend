import { Container } from "react-bootstrap";
import { Routes, Route } from "react-router-dom";

// Layout
import Layout from "./layout/Layout";

// pages
import Home from "./pages/Home";
import About from "./pages/About";
import Header from './components/Header'
import Register from "./pages/Register";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import { Provider } from 'react-redux';
import store from './store';

const App = () => {
  return (
    <Provider store={store}>
      <Layout>
        <Container>
          <Header>
            <Routes>
              <Route path="/" element={<Home />} exact />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/about" element={<About />} />
              <Route element={<NotFound />} />
            </Routes>
          </Header>
        </Container>
      </Layout>
    </Provider>
  );
};

export default App;
