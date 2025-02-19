import React from "react";
import HeaderNavbar from '../components/HeaderNavbar';
import HeroSection from '../components/HeroSection';
import TeamSection from '../components/TeamSection';
import BlogSection from '../components/BlogSection';
import AutoScrollSection from '../components/AutoScrollSection';
import Department from '../components/Department';

const Dashboard = () => (
    <div className="min-vh-100">
        <HeaderNavbar />
        <HeroSection />
        <AutoScrollSection />
        <Department />
        <TeamSection />
        <BlogSection />
    </div>
);

export default Dashboard;