import React, { useState, useEffect, useRef } from "react";
import Sidebar from "../Sidebar/Sidebar";
import ProfileStats from "../ProfileStats/ProfileStats";
import QuickActions from "../QuickActions/QuickAction";
import Navbar from "../Navbar/Navbar";
import "./Dashboard.css";
import ProfileContent from "../ProfileContent/ProfileContent";
import DashboardContact from "../DashboardContact/DashboardContact";
import Facility from "../Facility/Facility";
import LeaderBoard from "../LeaderBoard/LeaderBoard";
import DepartmentCard from "../DepartmentCard/DepartmentCard";
import CertificateList from "../CertificateList/CertificateList";
import { useParams } from "react-router";
import axiosConfig from "../../../Service/AxiosConfig";
const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { userId } = useParams();
  const [selectedMenu, setSelectedMenu] = useState("Quick Stats");
  const [userData, setUserData] = useState([]);
  const profileContentRef = useRef(null);
  useEffect(() => {
    const abortController = new AbortController();
    const fetchData = async () => {
      try {
        const res = await axiosConfig.get(
          `/hospital/hospitals/?user=${userId}`
        );
        let data = res?.data?.results?.[0];
        setUserData(data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
    return () => {
      abortController.abort();
    };
  }, [userId]);

  useEffect(() => {
    if (profileContentRef.current) {
      profileContentRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [selectedMenu]);

  const renderContent = () => {
    switch (selectedMenu) {
      case "Quick Stats":
        return <ProfileContent userData={userData} />;
      case "Contact Information":
        return <DashboardContact userData={userData} />;
      case "Facilities":
        return <Facility userData={userData} />;
      case "Accreditations":
        return <CertificateList userData={userData} />;
      case "Leaderboard":
        return <LeaderBoard />;
      case "Support Staff":
        return <DepartmentCard userData={userData} />;
      case "Activity":
        return <div>Activity Component</div>;
      default:
        return <ProfileContent userData={userData} />;
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar
        isOpen={sidebarOpen}
        onMenuClick={setSelectedMenu}
        selectedMenu={selectedMenu}
        userData={userData}
      />
      <div className={`content-area ${sidebarOpen ? "shifted" : ""}`}>
        <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="main-layout">
          <div className="profile-content" ref={profileContentRef}>
            <ProfileStats />
            {renderContent()}
          </div>
          <QuickActions />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
