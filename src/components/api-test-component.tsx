'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { apiService } from '@/lib/api';
import { Loader2, Database, CheckCircle, XCircle } from 'lucide-react';

interface TestResult {
    name: string;
    status: 'success' | 'error' | 'pending';
    message: string;
    data?: any;
}

export function APITestComponent() {
    const [testing, setTesting] = useState(false);
    const [results, setResults] = useState<TestResult[]>([]);

    const runTests = async () => {
        setTesting(true);
        setResults([]);

        const tests = [
            {
                name: 'System Settings',
                test: () => apiService.getSystemSettings()
            },
            {
                name: 'CV Scores',
                test: () => apiService.getCVScores()
            },
            {
                name: 'Final Selected Candidates',
                test: () => apiService.getFinalSelectedCandidates()
            },
            {
                name: 'Dashboard Stats',
                test: () => apiService.getDashboardStats()
            }
        ];

        for (const { name, test } of tests) {
            try {
                setResults(prev => [...prev, { name, status: 'pending', message: 'Testing...' }]);

                const data = await test();

                setResults(prev => prev.map(result =>
                    result.name === name
                        ? {
                            name,
                            status: 'success',
                            message: `✓ Success - Retrieved ${Array.isArray(data) ? data.length : 1} record(s)`,
                            data: Array.isArray(data) ? `${data.length} records` : 'Single record'
                        }
                        : result
                ));
            } catch (error) {
                setResults(prev => prev.map(result =>
                    result.name === name
                        ? {
                            name,
                            status: 'error',
                            message: `✗ Error: ${error instanceof Error ? error.message : 'Unknown error'}`
                        }
                        : result
                ));
            }
        }

        setTesting(false);
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'success':
                return <CheckCircle className="h-4 w-4 text-green-600" />;
            case 'error':
                return <XCircle className="h-4 w-4 text-red-600" />;
            case 'pending':
                return <Loader2 className="h-4 w-4 animate-spin text-blue-600" />;
            default:
                return null;
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'success':
                return <Badge className="bg-green-100 text-green-800 border-green-200 font-mono">Success</Badge>;
            case 'error':
                return <Badge className="bg-red-100 text-red-800 border-red-200 font-mono">Error</Badge>;
            case 'pending':
                return <Badge className="bg-blue-100 text-blue-800 border-blue-200 font-mono">Testing...</Badge>;
            default:
                return null;
        }
    };

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 font-mono">
                    <Database className="h-5 w-5" />
                    AWS Lambda API Connection Test
                </CardTitle>
                <CardDescription className="font-mono">
                    Test the connection to your AWS Lambda CRUD API via API Gateway
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                    <Button
                        onClick={runTests}
                        disabled={testing}
                        className="flex items-center gap-2 font-mono"
                    >
                        {testing ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Testing...
                            </>
                        ) : (
                            <>
                                <Database className="h-4 w-4" />
                                Test API Connection
                            </>
                        )}
                    </Button>
                </div>

                {results.length > 0 && (
                    <div className="space-y-2">
                        <h4 className="font-semibold font-mono">Test Results:</h4>
                        {results.map((result, index) => (
                            <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                                <div className="flex items-center gap-2">
                                    {getStatusIcon(result.status)}
                                    <span className="font-medium font-mono">{result.name}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    {result.data && (
                                        <span className="text-sm text-muted-foreground font-mono">
                                            {result.data}
                                        </span>
                                    )}
                                    {getStatusBadge(result.status)}
                                </div>
                            </div>
                        ))}

                        <div className="mt-4 p-3 bg-muted rounded-lg">
                            <p className="text-sm font-mono text-muted-foreground">
                                <strong>API Endpoint:</strong> {process.env.NEXT_PUBLIC_API_URL}
                            </p>
                            <p className="text-sm font-mono text-muted-foreground mt-1">
                                <strong>Mock Mode:</strong> {process.env.NEXT_PUBLIC_USE_MOCK_API === 'false' ? 'Disabled (Using Real API)' : 'Enabled'}
                            </p>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}