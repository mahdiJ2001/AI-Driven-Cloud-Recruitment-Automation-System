'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    DownloadIcon,
    EyeOpenIcon,
    StarIcon,
    CalendarIcon,
    FileTextIcon,
    PersonIcon,
    UpdateIcon,
    ExclamationTriangleIcon,
    StarFilledIcon
} from '@radix-ui/react-icons';
import { apiService, FinalSelectedCandidate } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface SelectedCandidatesInterfaceProps {
    onRefresh?: () => void;
}

export function SelectedCandidatesInterface({ onRefresh }: SelectedCandidatesInterfaceProps) {
    const [candidates, setCandidates] = useState<FinalSelectedCandidate[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [selectedCandidate, setSelectedCandidate] = useState<FinalSelectedCandidate | null>(null);
    const [summaryModalCandidate, setSummaryModalCandidate] = useState<FinalSelectedCandidate | null>(null);
    const [isDownloading, setIsDownloading] = useState<string | null>(null);
    const { toast } = useToast();

    useEffect(() => {
        fetchSelectedCandidates();
    }, []);

    const fetchSelectedCandidates = async () => {
        try {
            const selectedCandidates = await apiService.getFinalSelectedCandidates();
            console.log('Fetched selected candidates:', selectedCandidates);
            console.log('Number of selected candidates:', selectedCandidates.length);
            setCandidates(selectedCandidates.sort((a, b) => b.ai_score - a.ai_score));
        } catch (error: any) {
            console.error('Failed to fetch selected candidates:', error);
            toast({
                title: 'Database Error',
                description: error.message || 'Failed to load selected candidates. Check server logs for details.',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await fetchSelectedCandidates();
        onRefresh?.();
        setIsRefreshing(false);
        toast({
            title: 'Refreshed',
            description: 'Candidate data has been updated.',
        });
    };

    const handleDownloadCV = async (candidate: FinalSelectedCandidate) => {
        try {
            setIsDownloading(candidate.cv_s3_key);
            const blob = await apiService.downloadCV(candidate.cv_s3_key);

            // Create download link
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `CV_${candidate.id}_Score_${candidate.ai_score}.pdf`;
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);

            toast({
                title: 'Downloaded',
                description: 'CV has been downloaded successfully.',
            });
        } catch (error) {
            console.error('Failed to download CV:', error);
            toast({
                title: 'Download Failed',
                description: 'Failed to download CV. Please try again.',
                variant: 'destructive',
            });
        } finally {
            setIsDownloading(null);
        }
    };

    const getScoreColor = (score: number) => {
        if (score >= 90) return 'bg-green-100 text-green-800 border-green-200';
        if (score >= 80) return 'bg-blue-100 text-blue-800 border-blue-200';
        if (score >= 70) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        return 'bg-gray-100 text-gray-800 border-gray-200';
    };

    const getRankIcon = (index: number) => {
        if (index === 0) return <StarFilledIcon className="h-4 w-4 text-yellow-500" />;
        if (index === 1) return <StarFilledIcon className="h-4 w-4 text-gray-400" />;
        if (index === 2) return <StarFilledIcon className="h-4 w-4 text-amber-600" />;
        return <span className="text-sm font-medium text-muted-foreground">#{index + 1}</span>;
    };

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <StarIcon className="h-5 w-5" />
                        Selected Candidates
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-center py-8">
                    <div className="animate-pulse space-y-4 w-full">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="h-16 bg-gray-200 rounded"></div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">
                        Selected Candidates
                    </h2>
                    <p className="text-muted-foreground">
                        Top candidates selected by AI for final review
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

            {candidates.length === 0 ? (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <ExclamationTriangleIcon className="h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No Candidates Selected Yet</h3>
                        <p className="text-muted-foreground text-center max-w-sm">
                            Candidates will appear here once the threshold is reached and final selection is triggered.
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <Tabs defaultValue="list" className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="list">List View</TabsTrigger>
                        <TabsTrigger value="detailed">Detailed View</TabsTrigger>
                    </TabsList>

                    <TabsContent value="list" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between">
                                    <span className="font-mono">Candidates Ranking</span>
                                    <Badge variant="secondary" className="font-mono">{candidates.length} Selected</Badge>
                                </CardTitle>
                                <CardDescription>
                                    Candidates ranked by AI score from highest to lowest
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-16">Rank</TableHead>
                                            <TableHead>AI Score</TableHead>
                                            <TableHead className="w-1/3">Summary</TableHead>
                                            <TableHead className="w-24">CV</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {candidates.map((candidate, index) => (
                                            <TableRow key={candidate.id}>
                                                <TableCell className="font-medium">
                                                    <div className="flex items-center gap-2">
                                                        {getRankIcon(index)}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge className={`font-mono text-sm font-semibold ${getScoreColor(candidate.ai_score)}`}>
                                                        {candidate.ai_score}/100
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => setSummaryModalCandidate(candidate)}
                                                        className="flex items-center gap-1"
                                                    >
                                                        <FileTextIcon className="h-3 w-3" />
                                                        View Summary
                                                    </Button>
                                                </TableCell>
                                                <TableCell>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleDownloadCV(candidate)}
                                                        disabled={isDownloading === candidate.cv_s3_key}
                                                        className="flex items-center gap-1"
                                                    >
                                                        <DownloadIcon className="h-3 w-3" />
                                                        PDF
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="detailed" className="space-y-4">
                        <div className="grid gap-6 md:grid-cols-2">
                            {candidates.map((candidate, index) => (
                                <Card key={candidate.id} className="relative">
                                    <CardHeader>
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-center gap-2">
                                                {getRankIcon(index)}
                                                <CardTitle className="text-lg font-mono">
                                                    Candidate #{candidate.id}
                                                </CardTitle>
                                            </div>
                                            <Badge className={`font-mono text-sm font-semibold ${getScoreColor(candidate.ai_score)}`}>
                                                {candidate.ai_score}/100
                                            </Badge>
                                        </div>

                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div>
                                            <h4 className="font-semibold mb-2 flex items-center gap-2">
                                                <PersonIcon className="h-4 w-4" />
                                                AI Profile Summary
                                            </h4>
                                            <p className="text-sm text-muted-foreground leading-relaxed">
                                                {candidate.profile_summary}
                                            </p>
                                        </div>

                                        <div className="flex gap-2 pt-4 border-t">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setSelectedCandidate(candidate)}
                                                className="flex items-center gap-1"
                                            >
                                                <FileTextIcon className="h-3 w-3" />
                                                View Full CV
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleDownloadCV(candidate)}
                                                disabled={isDownloading === candidate.cv_s3_key}
                                                className="flex items-center gap-1"
                                            >
                                                <DownloadIcon className="h-3 w-3" />
                                                Download CV
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>
                </Tabs>
            )}

            {/* CV Detail Modal/Overlay */}
            {selectedCandidate && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <Card className="max-w-4xl w-full max-h-[90vh] overflow-hidden">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="flex items-center gap-2">
                                    <FileTextIcon className="h-5 w-5" />
                                    Candidate #{selectedCandidate.id} - Full CV
                                </CardTitle>
                                <div className="flex items-center gap-2">
                                    <Badge className={`font-mono text-sm font-semibold ${getScoreColor(selectedCandidate.ai_score)}`}>
                                        {selectedCandidate.ai_score}/100
                                    </Badge>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setSelectedCandidate(null)}
                                    >
                                        <span className="font-mono">Close</span>
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="overflow-y-auto max-h-[70vh]">
                            <div className="space-y-4">
                                <div>
                                    <h4 className="font-semibold mb-2 font-mono">AI Profile Summary</h4>
                                    <p className="text-sm text-muted-foreground leading-relaxed p-3 bg-muted rounded-lg">
                                        {selectedCandidate.profile_summary}
                                    </p>
                                </div>
                                <div>
                                    <h4 className="font-semibold mb-2">Full CV Text</h4>
                                    <pre className="font-mono text-sm text-muted-foreground leading-relaxed p-3 bg-muted rounded-lg whitespace-pre-wrap">
                                        {selectedCandidate.extracted_text}
                                    </pre>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Summary Modal */}
            {summaryModalCandidate && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <Card className="max-w-2xl w-full max-h-[80vh] overflow-hidden">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="flex items-center gap-2">
                                    <PersonIcon className="h-5 w-5" />
                                    Candidate #{summaryModalCandidate.id} - AI Profile Summary
                                </CardTitle>
                                <div className="flex items-center gap-2">
                                    <Badge className={`font-mono text-sm font-semibold ${getScoreColor(summaryModalCandidate.ai_score)}`}>
                                        {summaryModalCandidate.ai_score}/100
                                    </Badge>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setSummaryModalCandidate(null)}
                                    >
                                        <span className="font-mono">Close</span>
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="overflow-y-auto">
                            <div className="space-y-4">
                                <div>
                                    <h4 className="font-semibold mb-3 font-mono">AI Generated Profile Summary</h4>
                                    <p className="text-sm text-muted-foreground leading-relaxed p-4 bg-muted rounded-lg">
                                        {summaryModalCandidate.profile_summary}
                                    </p>
                                </div>
                                <div className="flex gap-2 pt-4 border-t">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            setSummaryModalCandidate(null);
                                            setSelectedCandidate(summaryModalCandidate);
                                        }}
                                        className="flex items-center gap-1"
                                    >
                                        <FileTextIcon className="h-3 w-3" />
                                        View Full CV
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleDownloadCV(summaryModalCandidate)}
                                        disabled={isDownloading === summaryModalCandidate.cv_s3_key}
                                        className="flex items-center gap-1"
                                    >
                                        <DownloadIcon className="h-3 w-3" />
                                        Download CV
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}