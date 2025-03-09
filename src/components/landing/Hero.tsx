'use client';

import { useState, useEffect } from 'react';
import { Container, Title, Text, Button, Group, Stack, Box, rem } from '@mantine/core';
import Link from 'next/link';

interface HeroProps {
  title?: string;
  subtitle?: string;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  primaryButtonLink?: string;
  secondaryButtonLink?: string;
}

export function Hero({
  title = 'Build Your SaaS Faster with Naim SaaS Toolkit',
  subtitle = 'A comprehensive toolkit for building SaaS applications with Next.js and Firebase. Get started quickly with authentication, organization management, and more.',
  primaryButtonText = 'Get Started',
  secondaryButtonText = 'Documentation',
  primaryButtonLink = '/auth/register',
  secondaryButtonLink = '/docs',
}: HeroProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <>
      <style jsx global>{`
        @keyframes float1 {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        
        @keyframes float2 {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .hero-box {
          padding: ${rem(80)} 0;
          border-radius: var(--mantine-radius-lg);
          overflow: hidden;
          position: relative;
          background: linear-gradient(45deg, var(--mantine-color-blue-0) 0%, var(--mantine-color-cyan-0) 100%);
        }
        
        .dark .hero-box {
          background: linear-gradient(45deg, var(--mantine-color-dark-7) 0%, var(--mantine-color-dark-9) 100%);
        }
        
        .floating-circle-1 {
          position: absolute;
          top: 10%;
          right: 5%;
          width: ${rem(300)};
          height: ${rem(300)};
          border-radius: 50%;
          background: rgba(62, 152, 255, 0.1);
          animation: float1 6s ease-in-out infinite;
          z-index: 0;
        }
        
        .floating-circle-2 {
          position: absolute;
          bottom: 15%;
          left: 10%;
          width: ${rem(200)};
          height: ${rem(200)};
          border-radius: 50%;
          background: rgba(62, 152, 255, 0.08);
          animation: float2 8s ease-in-out infinite;
          z-index: 0;
        }
        
        .content-stack {
          position: relative;
          z-index: 1;
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.8s ease-out, transform 0.8s ease-out;
        }
        
        .content-stack.visible {
          opacity: 1;
          transform: translateY(0);
        }
        
        .hero-title {
          font-size: ${rem(48)};
          font-weight: 800;
          line-height: 1.1;
          animation: fadeIn 0.8s ease-out forwards;
        }
        
        @media (max-width: 768px) {
          .hero-title {
            font-size: ${rem(36)};
          }
        }
        
        .hero-subtitle {
          animation: fadeIn 0.8s ease-out 0.3s forwards;
          opacity: 0;
          animation-fill-mode: forwards;
        }
        
        .button-group {
          animation: fadeIn 0.8s ease-out 0.6s forwards;
          opacity: 0;
          animation-fill-mode: forwards;
        }
        
        .primary-button {
          animation: pulse 2s ease-in-out infinite;
          animation-delay: 1s;
        }
      `}</style>
      
      <div className="hero-box">
        <div className="floating-circle-1" />
        <div className="floating-circle-2" />

        <Container size="lg">
          <Stack
            gap="xl"
            align="center"
            className={`content-stack ${isVisible ? 'visible' : ''}`}
          >
            <Title
              order={1}
              ta="center"
              size="h1"
              className="hero-title"
            >
              <Text
                component="span"
                variant="gradient"
                gradient={{ from: 'blue', to: 'cyan', deg: 45 }}
                inherit
              >
                {title}
              </Text>
            </Title>
            
            <Text
              size="xl"
              ta="center"
              maw={700}
              mx="auto"
              className="hero-subtitle"
            >
              {subtitle}
            </Text>
            
            <Group
              mt="xl"
              className="button-group"
            >
              <Button
                component={Link}
                href={primaryButtonLink}
                size="lg"
                variant="gradient"
                gradient={{ from: 'blue', to: 'cyan' }}
                className="primary-button"
              >
                {primaryButtonText}
              </Button>
              <Button
                component={Link}
                href={secondaryButtonLink}
                size="lg"
                variant="outline"
                color="blue"
              >
                {secondaryButtonText}
              </Button>
            </Group>
          </Stack>
        </Container>
      </div>
    </>
  );
} 