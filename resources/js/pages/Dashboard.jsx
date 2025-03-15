import React, { useRef } from "react";
import HeaderNavbar from '../components/HeaderNavbar';
import HeroSection from '../components/HeroSection';
import TeamSection from '../components/TeamSection';
import BlogSection from '../components/BlogSection';
import AutoScrollSection from '../components/AutoScrollSection';
import ServicesSection from "../components/ServicesSection";
import Testimonial from "../components/Testimonial";
import Department from "../components/Department";
import AppointmentSection from "../components/AppointmentSection";
import BackToTop from '../components/BackToTop';

const Dashboard = () => {
    const heroSectionRef = useRef(null);

    return (
        <div className="min-vh-100">
            <HeaderNavbar heroRef={heroSectionRef} />
            <HeroSection ref={heroSectionRef} />
            <AutoScrollSection />
            <Department />
            <ServicesSection />
            <TeamSection />
            <Testimonial />
            <BlogSection />
            <AppointmentSection />
            <BackToTop />
        </div>
    );
};

export default Dashboard;