'use client';

import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SystemSettingsForm } from '@/components/system-settings-form';
import { CandidateProgressDashboard } from '@/components/candidate-progress-dashboard';
import { SelectedCandidatesInterface } from '@/components/selected-candidates-interface';
import { CandidatesInterface } from '@/components/candidates-interface';
import { SystemSettings } from '@/lib/api';
import { GearIcon, BarChartIcon, PersonIcon, CheckCircledIcon } from '@radix-ui/react-icons';

export default function Dashboard() {
  const [systemSettings, setSystemSettings] = useState<SystemSettings | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSettingsUpdate = (settings: SystemSettings) => {
    setSystemSettings(settings);
    setRefreshKey(prev => prev + 1);
  };

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2">
            <div>
              <h1 className="text-2xl font-bold font-mono">AI Candidate Selection Dashboard</h1>
              <p className="text-sm text-muted-foreground font-mono">
                Intelligent recruiting powered by AI
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center gap-2 font-mono">
              <BarChartIcon className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="all-candidates" className="flex items-center gap-2 font-mono">
              <PersonIcon className="h-4 w-4" />
              All Candidates
            </TabsTrigger>
            <TabsTrigger value="selected-candidates" className="flex items-center gap-2 font-mono">
              <CheckCircledIcon className="h-4 w-4" />
              Selected Candidates
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2 font-mono">
              <GearIcon className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <CandidateProgressDashboard
              key={`progress-${refreshKey}`}
              systemSettings={systemSettings}
              onRefresh={handleRefresh}
            />
          </TabsContent>

          <TabsContent value="all-candidates" className="space-y-6">
            <CandidatesInterface
              key={`all-candidates-${refreshKey}`}
              onRefresh={handleRefresh}
            />
          </TabsContent>

          <TabsContent value="selected-candidates" className="space-y-6">
            <SelectedCandidatesInterface
              key={`selected-candidates-${refreshKey}`}
              onRefresh={handleRefresh}
            />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <SystemSettingsForm
              key={`settings-${refreshKey}`}
              onSettingsUpdate={handleSettingsUpdate}
            />
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <p className="font-mono">© 2025 AI Candidate Selection System</p>
            <p className="font-mono">Powered by AWS Bedrock & Next.js</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
