import React from "react";
import { Container } from "react-bootstrap";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import "./App.scss";

import Register from "./pages/Register";
import Login from "./pages/Login";
import ApolloProvider from "./pages/ApolloProvider";
import { AuthProvider } from "./context/auth";
import DynamicRoute from "./util/DynamicRoute";
import Home from "./pages/home/Home";
import { MessageProvider } from "./context/messages";

function App() {
  return (
    <ApolloProvider>
      <AuthProvider>
        <MessageProvider>
          <BrowserRouter>
          <div style={{background:"rgb(0 0 0 / 80%)" , height:"625px"}}>
            <Container className="pt-5 " >
              {/* <1>hi</1> */}
              <Switch>
                <DynamicRoute exact path="/" component={Home} authenticated />
                <DynamicRoute path="/register" component={Register} guest />
                <DynamicRoute path="/login" component={Login} guest />
              </Switch>
            </Container>
            </div>
          </BrowserRouter>
        </MessageProvider>
      </AuthProvider>
    </ApolloProvider>
  );
}

export default App;
