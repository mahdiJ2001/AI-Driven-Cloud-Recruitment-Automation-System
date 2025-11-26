'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    PersonIcon,
    UpdateIcon,
    FileTextIcon,
    CalendarIcon,
    ArrowUpIcon,
    DownloadIcon
} from '@radix-ui/react-icons';
import { apiService, CVScore } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface CandidatesInterfaceProps {
    onRefresh?: () => void;
}

export function CandidatesInterface({ onRefresh }: CandidatesInterfaceProps) {
    const [candidates, setCandidates] = useState<CVScore[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [selectedCandidate, setSelectedCandidate] = useState<CVScore | null>(null);
    const { toast } = useToast();

    useEffect(() => {
        fetchCandidates();
    }, []);

    const fetchCandidates = async () => {
        try {
            const cvScores = await apiService.getCVScores();
            setCandidates(cvScores);
        } catch (error) {
            console.error('Failed to fetch candidates:', error);
            toast({
                title: 'Error',
                description: 'Failed to load candidates.',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await fetchCandidates();
        onRefresh?.();
        setIsRefreshing(false);
        toast({
            title: 'Refreshed',
            description: 'Candidates data has been updated.',
        });
    };

    const getScoreBadgeVariant = (score: number) => {
        if (score >= 90) return 'default'; // Green for excellent
        if (score >= 80) return 'secondary'; // Blue for good
        if (score >= 70) return 'outline'; // Gray for average
        return 'destructive'; // Red for poor
    };

    const getScoreColor = (score: number) => {
        if (score >= 90) return 'text-green-600';
        if (score >= 80) return 'text-blue-600';
        if (score >= 70) return 'text-yellow-600';
        return 'text-red-600';
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-mono">
                        <PersonIcon className="h-5 w-5" />
                        All Candidates
                    </CardTitle>
                    <CardDescription className="font-mono">Loading candidates...</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="animate-pulse space-y-4">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="h-12 bg-gray-200 rounded"></div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2 font-mono">
                            <PersonIcon className="h-5 w-5" />
                            All Candidates
                        </CardTitle>
                        <CardDescription className="font-mono">
                            All submitted CVs with AI scoring ({candidates.length} total)
                        </CardDescription>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleRefresh}
                        disabled={isRefreshing}
                        className="font-mono"
                    >
                        <UpdateIcon className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                        Refresh
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                {candidates.length === 0 ? (
                    <div className="text-center py-8">
                        <FileTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-muted-foreground font-mono">No candidates found</p>
                        <p className="text-sm text-muted-foreground font-mono mt-1">
                            CVs will appear here once they are processed
                        </p>
                    </div>
                ) : (
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="font-mono">ID</TableHead>
                                    <TableHead className="font-mono">AI Score</TableHead>
                                    <TableHead className="font-mono">Preview</TableHead>
                                    <TableHead className="font-mono">Submitted</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {candidates.map((candidate) => (
                                    <TableRow key={candidate.id}>
                                        <TableCell className="font-mono font-medium">
                                            #{candidate.id}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Badge
                                                    variant={getScoreBadgeVariant(candidate.ai_score)}
                                                    className="font-mono"
                                                >
                                                    {candidate.ai_score}
                                                </Badge>
                                                <ArrowUpIcon
                                                    className={`h-4 w-4 ${getScoreColor(candidate.ai_score)}`}
                                                />
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-mono max-w-xs">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setSelectedCandidate(candidate)}
                                                className="font-mono"
                                            >
                                                <FileTextIcon className="h-3 w-3 mr-1" />
                                                View Text
                                            </Button>
                                        </TableCell>
                                        <TableCell className="font-mono text-sm">
                                            <div className="flex items-center gap-1">
                                                <CalendarIcon className="h-3 w-3" />
                                                {formatDate(candidate.created_at)}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </CardContent>

            {/* Text Preview Modal */}
            {selectedCandidate && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <Card className="max-w-4xl w-full max-h-[90vh] overflow-hidden">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="flex items-center gap-2 font-mono">
                                    <FileTextIcon className="h-5 w-5" />
                                    Candidate #{selectedCandidate.id} - Extracted Text
                                </CardTitle>
                                <div className="flex items-center gap-2">
                                    <Badge
                                        variant={getScoreBadgeVariant(selectedCandidate.ai_score)}
                                        className="font-mono"
                                    >
                                        Score: {selectedCandidate.ai_score}
                                    </Badge>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setSelectedCandidate(null)}
                                        className="font-mono"
                                    >
                                        Close
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="overflow-y-auto max-h-[70vh]">
                            <pre className="font-mono text-sm text-muted-foreground leading-relaxed p-3 bg-muted rounded-lg whitespace-pre-wrap">
                                {selectedCandidate.extracted_text}
                            </pre>
                        </CardContent>
                    </Card>
                </div>
            )}
        </Card>
    );
}