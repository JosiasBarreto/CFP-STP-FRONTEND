import React, { useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { FaBars, FaBox, FaUsers } from "react-icons/fa";

import InfoCard from "../../component/InfoCard/InfoCard";
import SalesChart from "../../component/Charts/SalesChart";
import Footer from "../../component/Footer/Footer";
import { Route, Routes } from "react-router-dom";
import RegisterUser from "../sing/registouser";
import SchoolDashboard from "../page/dashboardschools";

const Home = () => {
 
 
  return (
    <div className="">
      <SchoolDashboard />
    </div>
  );
};

export default Home;
