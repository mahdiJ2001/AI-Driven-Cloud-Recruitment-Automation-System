import axios from 'axios';
import { mockApiData } from './mock-data';

// AWS API Gateway URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://6olkmzndv4.execute-api.us-east-1.amazonaws.com/dev/candidates';

// Disable mock mode - use real Lambda and database
const MOCK_MODE = false;

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    timeout: 30000, // 30 second timeout for AWS Lambda
});

// Add request/response interceptors for better error handling
api.interceptors.request.use(
    (config) => {
        console.log(`Making API request to: ${config.baseURL}${config.url}`);
        return config;
    },
    (error) => {
        console.error('Request error:', error);
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => {
        console.log('API response received:', response.status);
        return response;
    },
    (error) => {
        console.error('API Error:', {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data,
            url: error.config?.url
        });

        // Provide user-friendly error messages
        if (error.response?.status === 400) {
            throw new Error('Invalid request. Please check your data and try again.');
        } else if (error.response?.status === 404) {
            throw new Error('Resource not found.');
        } else if (error.response?.status === 500) {
            throw new Error('Server error. Please try again later.');
        } else if (error.code === 'ECONNABORTED') {
            throw new Error('Request timeout. Please check your connection and try again.');
        }

        return Promise.reject(error);
    }
);

// Types based on your backend schema
export interface SystemSettings {
    id?: number;
    job_description: string;
    candidate_threshold: number;
    candidate_limit: number;
    created_at?: string;
    updated_at?: string;
}

export interface CVScore {
    id: number;
    cv_s3_key: string;
    extracted_text: string;
    ai_score: number;
    created_at: string;
}

export interface FinalSelectedCandidate {
    id: number;
    cv_s3_key: string;
    extracted_text: string;
    ai_score: number;
    profile_summary: string;
    created_at?: string; // Optional since this table doesn't have created_at
}

export interface DashboardStats {
    total_candidates: number;
    selected_candidates: number;
    current_threshold: number;
    threshold_reached: boolean;
}

// Mock delay function for realistic loading states
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// API functions
export const apiService = {
    // System Settings
    getSystemSettings: async (): Promise<SystemSettings> => {
        if (MOCK_MODE) {
            await delay(300); // Simulate network delay
            return mockApiData.systemSettings;
        }
        try {
            const response = await api.get('?table=system_settings');
            const data = response.data || [];
            console.log('System settings API response:', data);

            if (data.length > 0) {
                console.log('Using existing system settings:', data[0]);
                return data[0];
            } else {
                console.log('No system settings found, using defaults');
                return {
                    job_description: '',
                    candidate_threshold: 10,
                    candidate_limit: 5,
                };
            }
        } catch (error) {
            console.error('Error fetching system settings:', error);
            return {
                job_description: '',
                candidate_threshold: 10,
                candidate_limit: 5,
            };
        }
    },

    updateSystemSettings: async (settings: Omit<SystemSettings, 'id' | 'created_at' | 'updated_at'>): Promise<SystemSettings> => {
        if (MOCK_MODE) {
            await delay(500);
            const updated = {
                ...mockApiData.systemSettings,
                ...settings,
                updated_at: new Date().toISOString(),
            };
            // Update mock data for persistence during session
            Object.assign(mockApiData.systemSettings, updated);
            return updated;
        }

        // First, try to get existing settings to see if we need to update or create
        try {
            const existing = await apiService.getSystemSettings();
            if (existing.id) {
                // Update existing record
                const response = await api.put('?table=system_settings', {
                    ...settings,
                    id: existing.id,
                    updated_at: new Date().toISOString(),
                });
                return response.data;
            }
        } catch (error) {
            console.log('No existing settings found, creating new record');
        }

        // Create new record if none exists
        const response = await api.post('?table=system_settings', {
            ...settings,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        });
        return response.data;
    },

    // Dashboard Stats
    getDashboardStats: async (): Promise<DashboardStats> => {
        if (MOCK_MODE) {
            await delay(200);
            // Calculate stats from actual mock data to ensure consistency
            const totalCandidates = mockApiData.cvScores.length;
            const selectedCandidates = mockApiData.finalSelectedCandidates.length;
            const currentThreshold = mockApiData.systemSettings.candidate_threshold;
            const thresholdReached = totalCandidates >= currentThreshold;

            return {
                total_candidates: totalCandidates,
                selected_candidates: selectedCandidates,
                current_threshold: currentThreshold,
                threshold_reached: thresholdReached,
            };
        }

        // Get data from cv_scores and system_settings tables
        // Note: final_selected_candidates may be empty until AI selection process completes
        try {
            const [cvScoresResponse, systemSettingsResponse] = await Promise.all([
                api.get('?table=cv_scores'),
                api.get('?table=system_settings')
            ]);

            const cvScores = cvScoresResponse.data || [];
            const systemSettingsData = systemSettingsResponse.data || [];
            console.log('System settings response:', systemSettingsData);

            const systemSettings = systemSettingsData.length > 0 ? systemSettingsData[0] : null;
            console.log('Parsed system settings:', systemSettings);

            const totalCandidates = cvScores.length;
            const currentThreshold = systemSettings?.candidate_threshold || 10;
            console.log('Current threshold:', currentThreshold, 'from settings:', systemSettings?.candidate_threshold);
            const thresholdReached = totalCandidates >= currentThreshold;

            // Try to get selected candidates count, but handle gracefully if table is empty or doesn't exist
            let selectedCandidates = 0;
            try {
                const finalSelectedResponse = await api.get('?table=final_selected_candidates');
                selectedCandidates = finalSelectedResponse.data ? finalSelectedResponse.data.length : 0;
            } catch (error) {
                console.log('final_selected_candidates table is empty or not accessible, showing 0 selected candidates');
                selectedCandidates = 0;
            }

            return {
                total_candidates: totalCandidates,
                selected_candidates: selectedCandidates,
                current_threshold: currentThreshold,
                threshold_reached: thresholdReached,
            };
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
            // Return default values if main tables fail
            return {
                total_candidates: 0,
                selected_candidates: 0,
                current_threshold: 10,
                threshold_reached: false,
            };
        }
    },

    // CV Scores
    getCVScores: async (): Promise<CVScore[]> => {
        if (MOCK_MODE) {
            await delay(400);
            return mockApiData.cvScores;
        }
        const response = await api.get('?table=cv_scores');
        return response.data;
    },

    // Final Selected Candidates
    getFinalSelectedCandidates: async (): Promise<FinalSelectedCandidate[]> => {
        if (MOCK_MODE) {
            await delay(600);
            return mockApiData.finalSelectedCandidates;
        }
        try {
            const response = await api.get('?table=final_selected_candidates');
            const data = response.data || [];
            console.log('Final selected candidates data:', data);
            console.log('Sample record structure:', data[0]);
            // Sort by AI score in descending order
            return data.sort((a: FinalSelectedCandidate, b: FinalSelectedCandidate) => b.ai_score - a.ai_score);
        } catch (error: any) {
            console.error('Error fetching final selected candidates:', {
                message: error.message,
                status: error.response?.status,
                data: error.response?.data,
                config: error.config
            });

            // If it's a 500 error, the table might have structure issues
            if (error.response?.status === 500) {
                console.error('500 Server Error Details:', error.response?.data);
                console.warn('Server error accessing final_selected_candidates table - check Lambda CloudWatch logs');

                // Try to provide helpful error message to user
                throw new Error(`Database error accessing selected candidates table. Error: ${error.response?.data?.error || 'Unknown server error'}`);
            } else {
                console.log('final_selected_candidates table appears to be empty');
            }
            return [];
        }
    },

    // Download CV - Note: This would require a separate Lambda function for S3 file access
    downloadCV: async (s3Key: string): Promise<Blob> => {
        if (MOCK_MODE) {
            await delay(800);
            // Create a mock PDF blob
            const pdfContent = `Mock CV Content for ${s3Key}`;
            return new Blob([pdfContent], { type: 'application/pdf' });
        }

        // For now, create a text file with CV content since we don't have S3 access in this Lambda
        // You'll need to create a separate Lambda function with S3 permissions for actual file downloads
        const cvContent = `CV File: ${s3Key}\n\nThis would contain the actual CV content from S3.\nTo implement actual downloads, create a separate Lambda function with S3 GetObject permissions.`;
        return new Blob([cvContent], { type: 'text/plain' });
    },

    // Trigger manual selection - would require additional Lambda function
    triggerSelection: async (): Promise<void> => {
        if (MOCK_MODE) {
            await delay(1000);
            return;
        }

        // This would require a separate Lambda function to trigger the selection process
        console.log('Manual selection trigger - requires separate Lambda function');
        throw new Error('Manual selection trigger not implemented yet. This requires a separate Lambda function.');
    },

    // Additional helper methods for CRUD operations

    // Delete a CV score record
    deleteCVScore: async (id: number): Promise<void> => {
        if (MOCK_MODE) {
            await delay(300);
            return;
        }
        await api.delete(`?table=cv_scores&id=${id}`);
    },

    // Delete a final selected candidate
    deleteSelectedCandidate: async (id: number): Promise<void> => {
        if (MOCK_MODE) {
            await delay(300);
            return;
        }
        await api.delete(`?table=final_selected_candidates&id=${id}`);
    },

    // Add a new CV score (useful for testing)
    addCVScore: async (cvScore: Omit<CVScore, 'id'>): Promise<CVScore> => {
        if (MOCK_MODE) {
            await delay(500);
            return { ...cvScore, id: Math.random() } as CVScore;
        }
        const response = await api.post('?table=cv_scores', {
            ...cvScore,
            created_at: new Date().toISOString(),
        });
        return response.data;
    },
};

export default api;