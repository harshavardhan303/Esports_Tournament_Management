import React from 'react';
import styled from 'styled-components';
import { FaGamepad, FaTrophy, FaEnvelope, FaTwitter, FaDiscord, FaTwitch } from 'react-icons/fa';

const FooterContainer = styled.footer`
  background: #1a2a6c;
  color: white;
  padding: 3rem 2rem 2rem;
  margin-top: 3rem;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
`;

const FooterSection = styled.div`
  margin-bottom: 1.5rem;
`;

const FooterTitle = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 0.5rem;
  }
`;

const FooterLink = styled.a`
  color: #ddd;
  text-decoration: none;
  display: block;
  margin-bottom: 0.5rem;
  transition: color 0.3s;
  
  &:hover {
    color: white;
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const SocialIcon = styled.a`
  color: white;
  font-size: 1.5rem;
  transition: color 0.3s;
  
  &:hover {
    color: #fdbb2d;
  }
`;

const Copyright = styled.div`
  text-align: center;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 0.9rem;
  color: #aaa;
`;

const Footer = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <FooterSection>
          <FooterTitle>
            <FaTrophy /> TEC Esports
          </FooterTitle>
          <p>The premier platform for esports tournament management. Organize, compete, and win in your favorite games.</p>
          <SocialLinks>
            <SocialIcon href="#" target="_blank" rel="noopener noreferrer">
              <FaTwitter />
            </SocialIcon>
            <SocialIcon href="#" target="_blank" rel="noopener noreferrer">
              <FaDiscord />
            </SocialIcon>
            <SocialIcon href="#" target="_blank" rel="noopener noreferrer">
              <FaTwitch />
            </SocialIcon>
          </SocialLinks>
        </FooterSection>
        
        <FooterSection>
          <FooterTitle>
            <FaGamepad /> Popular Games
          </FooterTitle>
          <FooterLink href="#">Valorant</FooterLink>
          <FooterLink href="#">BGMI</FooterLink>
          <FooterLink href="#">Free Fire</FooterLink>
          <FooterLink href="#">Call of Duty: Mobile</FooterLink>
          <FooterLink href="#">Rocket League</FooterLink>
        </FooterSection>
        
        <FooterSection>
          <FooterTitle>
            <FaTrophy /> Tournaments
          </FooterTitle>
          <FooterLink href="#">Upcoming Tournaments</FooterLink>
          <FooterLink href="#">Ongoing Tournaments</FooterLink>
          <FooterLink href="#">Past Results</FooterLink>
          <FooterLink href="#">Tournament Rules</FooterLink>
          <FooterLink href="#">Prize Pools</FooterLink>
        </FooterSection>
        
        <FooterSection>
          <FooterTitle>
            <FaEnvelope /> Contact Us
          </FooterTitle>
          <p>Have questions or need support?</p>
          <p>Email: support@tecesports.com</p>
          <p>Discord: TEC Esports Server</p>
          <p>Hours: 9am - 6pm IST</p>
        </FooterSection>
      </FooterContent>
      
      <Copyright>
        &copy; {new Date().getFullYear()} TEC Esports Tournament Platform. All rights reserved.
      </Copyright>
    </FooterContainer>
  );
};

export default Footer;
