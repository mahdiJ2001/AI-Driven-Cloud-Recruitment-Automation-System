'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { UpdateIcon, GearIcon, CheckIcon, ExclamationTriangleIcon } from '@radix-ui/react-icons';
import { apiService, SystemSettings } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

const systemSettingsSchema = z.object({
    job_description: z.string().min(50, 'Job description must be at least 50 characters long'),
    candidate_threshold: z.number().min(1, 'Candidate threshold must be at least 1').max(1000, 'Candidate threshold cannot exceed 1000'),
    candidate_limit: z.number().min(1, 'Candidate limit must be at least 1').max(100, 'Candidate limit cannot exceed 100'),
});

type SystemSettingsFormData = z.infer<typeof systemSettingsSchema>;

interface SystemSettingsFormProps {
    onSettingsUpdate?: (settings: SystemSettings) => void;
}

export function SystemSettingsForm({ onSettingsUpdate }: SystemSettingsFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [currentSettings, setCurrentSettings] = useState<SystemSettings | null>(null);
    const { toast } = useToast();

    const form = useForm<SystemSettingsFormData>({
        resolver: zodResolver(systemSettingsSchema),
        defaultValues: {
            job_description: '',
            candidate_threshold: 10,
            candidate_limit: 5,
        },
    });

    // Fetch current settings on component mount
    useEffect(() => {
        fetchCurrentSettings();
    }, []);

    const fetchCurrentSettings = async () => {
        try {
            setIsFetching(true);
            const settings = await apiService.getSystemSettings();
            setCurrentSettings(settings);
            form.reset({
                job_description: settings.job_description,
                candidate_threshold: settings.candidate_threshold,
                candidate_limit: settings.candidate_limit,
            });
        } catch (error) {
            console.error('Failed to fetch settings:', error);
            toast({
                title: 'Error',
                description: 'Failed to load current settings. Using default values.',
                variant: 'destructive',
            });
        } finally {
            setIsFetching(false);
        }
    };

    const onSubmit = async (data: SystemSettingsFormData) => {
        try {
            setIsLoading(true);
            const updatedSettings = await apiService.updateSystemSettings(data);
            setCurrentSettings(updatedSettings);
            onSettingsUpdate?.(updatedSettings);

            toast({
                title: 'Settings Updated',
                description: 'System settings have been successfully updated.',
            });
        } catch (error) {
            console.error('Failed to update settings:', error);
            toast({
                title: 'Error',
                description: 'Failed to update settings. Please try again.',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const candidateThreshold = form.watch('candidate_threshold');
    const candidateLimit = form.watch('candidate_limit');

    if (isFetching) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-mono">
                        <GearIcon className="h-5 w-5" />
                        System Settings
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-center py-8">
                    <UpdateIcon className="h-8 w-8 animate-spin" />
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <GearIcon className="h-5 w-5" />
                    System Settings
                </CardTitle>
                <CardDescription>
                    Configure job requirements and candidate selection parameters
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="job_description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Job Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Enter the detailed job description that will be used for AI scoring..."
                                            className="min-h-[120px] resize-none"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        This description will be used by AI to score candidate CVs. Be specific about requirements, skills, and qualifications.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="candidate_threshold"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-mono">Candidate Threshold</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder="10"
                                                className="font-mono"
                                                {...field}
                                                onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                                            />
                                        </FormControl>
                                        <FormDescription className="font-mono">
                                            Number of candidates needed before final selection triggers
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="candidate_limit"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-mono">Candidate Limit</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder="5"
                                                className="font-mono"
                                                {...field}
                                                onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                                            />
                                        </FormControl>
                                        <FormDescription className="font-mono">
                                            Number of top candidates to select for final review
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {candidateLimit > candidateThreshold && (
                            <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                                <ExclamationTriangleIcon className="h-4 w-4 text-yellow-600" />
                                <span className="text-sm text-yellow-700">
                                    Warning: Candidate limit ({candidateLimit}) cannot exceed threshold ({candidateThreshold})
                                </span>
                            </div>
                        )}

                        <div className="flex items-center gap-4 pt-4 border-t">
                            <Button
                                type="submit"
                                disabled={isLoading || candidateLimit > candidateThreshold}
                                className="flex items-center gap-2"
                            >
                                {isLoading ? (
                                    <UpdateIcon className="h-4 w-4 animate-spin" />
                                ) : (
                                    <CheckIcon className="h-4 w-4" />
                                )}
                                Save Settings
                            </Button>

                            {currentSettings && (
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-muted-foreground font-mono">Last updated:</span>
                                    <Badge variant="outline" className="font-mono">
                                        {new Date(currentSettings.updated_at || currentSettings.created_at || '').toLocaleDateString()}
                                    </Badge>
                                </div>
                            )}
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}