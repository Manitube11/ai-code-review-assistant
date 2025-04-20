import axios from 'axios';

// Types
export interface ReviewSuggestion {
  line_start: number;
  line_end: number;
  file_path: string;
  message: string;
  category: string;
  severity: string;
  suggested_fix?: string;
}

export interface Review {
  review_id: string;
  suggestions: ReviewSuggestion[];
  summary: string;
  execution_time: number;
  created_at: string;
}

export interface ReviewListItem {
  id: string;
  file_path: string;
  language: string;
  summary: string;
  created_at: string;
  status: string;
  suggestion_count: number;
}

// API client
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// API functions
export const fetchReviews = async (): Promise<ReviewListItem[]> => {
  const response = await api.get('/reviews');
  return response.data;
};

export const fetchReviewById = async (id: string): Promise<Review> => {
  const response = await api.get(`/reviews/${id}`);
  return response.data;
};

export const submitCodeForReview = async (
  code: string,
  filePath: string,
  language?: string
): Promise<Review> => {
  const response = await api.post('/review', {
    code,
    file_path: filePath,
    language,
  });
  return response.data;
}; 