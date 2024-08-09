// components/ProjectCarousel.js

import React from 'react';
import Slider from 'react-slick';
import { useDrag, useDrop } from 'react-dnd';
import darkStyles from "../styles/darkmode.module.css";

const ProjectCarousel = ({ projects }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
  };

  const renderProject = (project, index) => {
    const [{ isDragging }, drag] = useDrag(() => ({
      type: 'PROJECT',
      item: { index },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }));

    return (
      <div ref={drag} style={{ opacity: isDragging ? 0.5 : 1 }} key={index}>
        <div style={{ padding: 20, margin: '0 10px' }}>
          <h3>{project.title}</h3>
          <p>{project.description}</p>
        </div>
      </div>
    );
  };

  return (
    <Slider {...settings}>
      {projects && projects.map((project, index) => renderProject(project, index))}
    </Slider>
  );
};

export default ProjectCarousel;
