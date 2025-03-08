import React from "react";
import HeaderNavbar from '../components/HeaderNavbar';
import HeroSection from '../components/HeroSection';
import TeamSection from '../components/TeamSection';
import BlogSection from '../components/BlogSection';
import AutoScrollSection from '../components/AutoScrollSection';
import Department from '../components/Department';
import ServicesSection from '../components/ServicesSection';
import Testimonial from '../components/Testimonial';
import AppointmentSection from '../components/AppointmentSection';
import BackToTop from '../components/BackToTop';

const Dashboard = () => (
    <>
        <HeaderNavbar />
        <HeroSection />
        <AutoScrollSection />
        <Department />
        <ServicesSection />
        <TeamSection />
        <Testimonial />
        <BlogSection />
        <AppointmentSection />
        <BackToTop />
    </>
);

export default Dashboard;