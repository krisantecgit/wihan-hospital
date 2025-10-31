import React, { useRef } from "react";
import Header from "../Header/Header";
import BecomeCareprenur from "../BecomeCareprenur/BecomeCareprenur";
import Partner from "../Partner/Partner";
import Work from "../Work/Work";
import Banner from "../Banner/Banner";
import WihanPartner from "../WihanPartner/WihanPartner";
import CarePulseScreen from "../CarePulseScreen/CarePulseScreen";
import Footer from "../Footer/Footer";
const Home = () => {
  const mobileInputRef = useRef(null);
  const scrollToMobile = () => {
    if (mobileInputRef.current) {
      mobileInputRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      mobileInputRef.current.focus();
    }
  };
  return (
    <>
      <Header scrollToMobile={scrollToMobile} />
      <BecomeCareprenur mobileInputRef={mobileInputRef} />
      <Partner />
      <Work />
      <WihanPartner />
      <CarePulseScreen />
      <Banner />
      <Footer />
    </>
  );
};

export default Home;
