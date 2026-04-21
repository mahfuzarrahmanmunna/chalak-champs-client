import React from 'react';
import Banner from '../components/Banner/Banner';
import NavHeader from '../components/NavHeader/NavHeader';
import ScrollAnimation from '../components/OfflineCourses/ScrollAnimation';

const PracticePage = () => {
    return (
      <div className='bg-white'>
        {/* <Banner /> */}
        {/* <NavHeader/> */}
        <ScrollAnimation/>
      </div>
    );
};

export default PracticePage;