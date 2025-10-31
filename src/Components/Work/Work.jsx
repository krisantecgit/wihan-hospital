import React from "react";
import "./Work.css";
const Work = () => {
  const data = [
    {
      id: 1,
      img: require("../../Assets/work1.png"),
      title: "Register Your Hospital",
      description: "Fill in basic details & submit documents",
      number: "01",
    },
    {
      id: 2,
      img: require("../../Assets/work2.png"),
      title: "Verification & Agreement",
      description: "Wihan verifies credentials and signs MoU",
      number: "02",
    },
    {
      id: 3,
      img: require("../../Assets/work3.png"),
      title: "Onboarding & Training",
      description: "Orientation for your hospital staff on referral portal",
      number: "03",
    },
    {
      id: 4,
      img: require("../../Assets/work4.png"),
      title: "Start Referring Patients",
      description: "Enable smooth, tech-driven patient continuity of care",
      number: "04",
    },
  ];
  return (
    <>
      <div className="work-section">
        <h1 className="heading-h1 mb-40">How It Works</h1>
        <div className="work-card">
          {data?.map((item) => {
            return (
              <div className="work-card-content" key={item.id}>
                <img src={item?.img} alt="" className="work-img" />
                <div className="work-overlay">
                  <div>
                    <h6 className="work-text">{item?.title}</h6>
                    <p className="work-description">{item?.description}</p>
                  </div>
                  <div>
                    <b className="work-number">{item?.number}</b>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Work;
