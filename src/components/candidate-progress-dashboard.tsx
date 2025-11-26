'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    PersonIcon,
    TargetIcon,
    CheckCircledIcon,
    ClockIcon,
    ArrowUpIcon,
    UpdateIcon,
    ExclamationTriangleIcon
} from '@radix-ui/react-icons';
import { apiService, DashboardStats, SystemSettings } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface CandidateProgressDashboardProps {
    systemSettings?: SystemSettings | null;
    onRefresh?: () => void;
}

export function CandidateProgressDashboard({ systemSettings, onRefresh }: CandidateProgressDashboardProps) {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        fetchStats();
        // Set up polling for real-time updates
        const interval = setInterval(fetchStats, 30000); // Poll every 30 seconds
        return () => clearInterval(interval);
    }, []);

    const fetchStats = async () => {
        try {
            const dashboardStats = await apiService.getDashboardStats();
            setStats(dashboardStats);
        } catch (error) {
            console.error('Failed to fetch dashboard stats:', error);
            toast({
                title: 'Error',
                description: 'Failed to load dashboard statistics.',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await fetchStats();
        onRefresh?.();
        setIsRefreshing(false);
        toast({
            title: 'Refreshed',
            description: 'Dashboard data has been updated.',
        });
    };

    const progressPercentage = stats
        ? Math.min((stats.total_candidates / stats.current_threshold) * 100, 100)
        : 0;

    const remainingCandidates = stats
        ? Math.max(stats.current_threshold - stats.total_candidates, 0)
        : 0;

    if (isLoading) {
        return (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[...Array(4)].map((_, i) => (
                    <Card key={i}>
                        <CardContent className="p-6">
                            <div className="animate-pulse">
                                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header with refresh button */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Candidate Progress</h2>
                    <p className="text-muted-foreground">
                        Track incoming candidates and selection progress
                    </p>
                </div>
                <Button
                    variant="outline"
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                    className="flex items-center gap-2"
                >
                    <UpdateIcon className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                    Refresh
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center">
                            <div className="rounded-lg bg-gray-100 p-2">
                                <PersonIcon className="h-6 w-6 text-black" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-muted-foreground font-mono">Total Candidates</p>
                                <p className="text-2xl font-bold font-mono">{stats?.total_candidates || 0}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center">
                            <div className="rounded-lg bg-gray-100 p-2">
                                <TargetIcon className="h-6 w-6 text-black" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-muted-foreground font-mono">Threshold</p>
                                <p className="text-2xl font-bold font-mono">{stats?.current_threshold || 0}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center">
                            <div className="rounded-lg bg-gray-100 p-2">
                                <CheckCircledIcon className="h-6 w-6 text-black" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-muted-foreground font-mono">Selected</p>
                                <p className="text-2xl font-bold font-mono">{stats?.selected_candidates || 0}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center">
                            <div className="rounded-lg bg-gray-100 p-2">
                                {stats?.threshold_reached ? (
                                    <CheckCircledIcon className="h-6 w-6 text-black" />
                                ) : (
                                    <ClockIcon className="h-6 w-6 text-black" />
                                )}
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-muted-foreground font-mono">Status</p>
                                <Badge variant={stats?.threshold_reached ? 'default' : 'outline'} className={`mt-1 font-mono ${stats?.threshold_reached ? 'bg-gray-100 text-black' : 'bg-gray-100 text-black border-gray-300'}`}>
                                    {stats?.threshold_reached ? 'Complete' : 'Pending'}
                                </Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Progress Card */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-mono">
                        <ArrowUpIcon className="h-5 w-5" />
                        Progress to Threshold
                    </CardTitle>
                    <CardDescription>
                        {stats?.threshold_reached
                            ? 'Threshold reached! Final candidate selection is complete.'
                            : `${remainingCandidates} more candidate${remainingCandidates !== 1 ? 's' : ''} needed to trigger final selection.`
                        }
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground font-mono">Progress</span>
                            <span className="font-medium font-mono">
                                {stats?.total_candidates || 0} / {stats?.current_threshold || 0}
                            </span>
                        </div>
                        <Progress value={progressPercentage} className="h-2" />
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground font-mono">{progressPercentage.toFixed(1)}% complete</span>
                            {!stats?.threshold_reached && (
                                <Badge variant="outline" className="flex items-center gap-1 font-mono">
                                    <ClockIcon className="h-3 w-3" />
                                    {remainingCandidates} remaining
                                </Badge>
                            )}
                        </div>
                    </div>

                    {stats?.threshold_reached && (
                        <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-md">
                            <CheckCircledIcon className="h-4 w-4 text-green-600" />
                            <span className="text-sm text-green-700 font-medium">
                                Selection process completed! {stats.selected_candidates} candidates have been selected for review.
                            </span>
                        </div>
                    )}

                    {!systemSettings && (
                        <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                            <ExclamationTriangleIcon className="h-4 w-4 text-yellow-600" />
                            <span className="text-sm text-yellow-700">
                                Please configure system settings to track progress accurately.
                            </span>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}