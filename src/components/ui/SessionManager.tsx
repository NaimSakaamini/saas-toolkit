'use client';

import React from 'react';
import { Card, Title, Text, Button, Group, Stack, Badge, ActionIcon, Tooltip } from '@mantine/core';
import { useAuth } from '@/services/auth/AuthProvider';

export function SessionManager() {
  const { sessions, terminateSession, terminateAllOtherSessions, loading } = useAuth();
  
  // Format date
  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    }).format(date);
  };
  
  // Parse device info
  const parseDeviceInfo = (deviceInfoStr: string): { 
    userAgent: string; 
    platform: string;
    browser: string;
  } => {
    try {
      const deviceInfo = JSON.parse(deviceInfoStr);
      
      return {
        userAgent: deviceInfo.userAgent || 'Unknown',
        platform: deviceInfo.platform || 'Unknown',
        browser: getBrowserName(deviceInfo.userAgent || '')
      };
    } catch (error) {
      return {
        userAgent: 'Unknown',
        platform: 'Unknown',
        browser: 'Unknown'
      };
    }
  };
  
  // Get browser name from user agent
  const getBrowserName = (userAgent: string): string => {
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    if (userAgent.includes('MSIE') || userAgent.includes('Trident/')) return 'Internet Explorer';
    return 'Unknown';
  };
  
  // Check if session is current
  const isCurrentSession = (sessionId: string): boolean => {
    return localStorage.getItem('sessionId') === sessionId;
  };
  
  // Handle terminate session
  const handleTerminateSession = async (sessionId: string) => {
    if (isCurrentSession(sessionId)) {
      if (!window.confirm('Are you sure you want to terminate your current session? You will be logged out.')) {
        return;
      }
    }
    
    await terminateSession(sessionId);
  };
  
  // Handle terminate all other sessions
  const handleTerminateAllOtherSessions = async () => {
    if (!window.confirm('Are you sure you want to terminate all other sessions?')) {
      return;
    }
    
    await terminateAllOtherSessions();
  };
  
  return (
    <Card withBorder p="lg">
      <Title order={3} mb="md">Active Sessions</Title>
      
      {sessions.length === 0 ? (
        <Text>No active sessions found.</Text>
      ) : (
        <>
          <Stack gap="md" mb="xl">
            {sessions.map((session) => {
              const deviceInfo = parseDeviceInfo(session.deviceInfo);
              const current = isCurrentSession(session.id);
              
              return (
                <Card key={session.id} withBorder p="md">
                  <Group justify="space-between" mb="xs">
                    <Group>
                      <Text fw={500}>
                        {deviceInfo.browser} on {deviceInfo.platform}
                      </Text>
                      {current && (
                        <Badge color="green">Current Session</Badge>
                      )}
                    </Group>
                    <Button 
                      variant="outline" 
                      color="red" 
                      size="xs"
                      onClick={() => handleTerminateSession(session.id)}
                      loading={loading}
                    >
                      {current ? 'Log Out' : 'Terminate'}
                    </Button>
                  </Group>
                  
                  <Text size="sm" c="dimmed">
                    Last active: {formatDate(session.lastActive)}
                  </Text>
                  <Text size="sm" c="dimmed">
                    Created: {formatDate(session.createdAt)}
                  </Text>
                </Card>
              );
            })}
          </Stack>
          
          {sessions.length > 1 && (
            <Button 
              variant="outline" 
              onClick={handleTerminateAllOtherSessions}
              loading={loading}
            >
              Terminate All Other Sessions
            </Button>
          )}
        </>
      )}
    </Card>
  );
} 