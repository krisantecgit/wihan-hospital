import "./About.css";
import banner from "../../Assets/cover.jpg";
import {
  title,
  our_mission_data,
  our_vision_data,
  our_promise_data,
  serviceShowcaseData,
  aboutus_last,
} from "./about_us.js";
import Header from "../Header/Header.jsx";
import Footer from "../Footer/Footer.jsx";
import ServiceShowcase from "./ServiceShowCase.jsx";
import CoverHero from "../Cover/CoverHero.jsx";

const About = () => {
  return (
    <>
      <Header />
      <CoverHero image={banner} title="About Us" />
      <div className="servicesShowCase">
        {serviceShowcaseData.map((service, index) => (
          <ServiceShowcase
            className="about-us-serviceWrapper"
            key={index}
            data={service}
          />
        ))}
      </div>

      <div className="mission-container">
        <div className="mission-left">
          <h2>{our_mission_data.title}</h2>
          <p dangerouslySetInnerHTML={{ __html: our_mission_data.para1 }} />
          <p dangerouslySetInnerHTML={{ __html: our_mission_data.para2 }} />
          <p dangerouslySetInnerHTML={{ __html: our_mission_data.para3 }} />
        </div>
        <div className="mission-right">
          <img src={our_mission_data.img} alt="Healthcare" />
        </div>
      </div>

      <div
        className="vision-container"
        style={{ backgroundImage: `url(${our_vision_data.img})` }}
      >
        <div className="vision-overlay">
          <h2>{our_vision_data.title}</h2>
          <p>{our_vision_data.para}</p>
        </div>
      </div>
      <div className="promise-box">
        <h2>Our Promise</h2>
        <div className="promise-container">
          {our_promise_data.map((item, index) => (
            <div className="promise-card" key={index}>
              <div className="promise-img">
                <img src={item.img} alt={item.title} />
              </div>
              <h3>{item.title}</h3>
              <p>{item.para}</p>
            </div>
          ))}
        </div>
      </div>
      <div
        className="aboutus-last"
        style={{ backgroundImage: `url(${aboutus_last.img})` }}
      >
        <div className="aboutus-last-overlay">
          <div className="aboutus-last-content">
            <p>{aboutus_last.para}</p>
            {/* <button>{aboutus_last.btn_text}</button> */}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default About;
