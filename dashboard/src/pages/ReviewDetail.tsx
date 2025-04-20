import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Container, 
  Typography, 
  Paper, 
  Divider, 
  Button,
  CircularProgress,
  Alert,
  Chip
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import RefreshIcon from '@mui/icons-material/Refresh';
import { fetchReviewById, Review } from '../api/reviewApi';
import SuggestionCard from '../components/SuggestionCard';

interface RouteParams {
  id: string;
  [key: string]: string;
}

const ReviewDetail: React.FC = () => {
  const { id } = useParams<RouteParams>() as RouteParams;
  const navigate = useNavigate();
  const [review, setReview] = useState<Review | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [rerunning, setRerunning] = useState<boolean>(false);

  const loadReview = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchReviewById(id);
      setReview(data);
    } catch (err) {
      console.error('Failed to fetch review:', err);
      setError('Failed to load review details. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReview();
  }, [id]);

  const handleBack = () => {
    navigate('/');
  };

  const handleRerunReview = async () => {
    if (!review) return;
    
    try {
      setRerunning(true);
      setError(null);
      
      // Call API to rerun review
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}/reviews/${id}/rerun`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to rerun review: ${response.statusText}`);
      }
      
      const updatedReview = await response.json();
      setReview(updatedReview);
    } catch (err) {
      console.error('Failed to rerun review:', err);
      setError('Failed to rerun review. Please try again later.');
    } finally {
      setRerunning(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg">
        <Box mt={4}>
          <Alert severity="error">{error}</Alert>
          <Box mt={2}>
            <Button 
              variant="outlined" 
              startIcon={<ArrowBackIcon />} 
              onClick={handleBack}
            >
              Back to Reviews
            </Button>
          </Box>
        </Box>
      </Container>
    );
  }

  if (!review) {
    return (
      <Container maxWidth="lg">
        <Box mt={4}>
          <Alert severity="warning">Review not found</Alert>
          <Box mt={2}>
            <Button 
              variant="outlined" 
              startIcon={<ArrowBackIcon />} 
              onClick={handleBack}
            >
              Back to Reviews
            </Button>
          </Box>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box mt={4}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Button 
            variant="outlined" 
            startIcon={<ArrowBackIcon />} 
            onClick={handleBack}
          >
            Back to Reviews
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<RefreshIcon />}
            onClick={handleRerunReview}
            disabled={rerunning}
          >
            {rerunning ? 'Rerunning...' : 'Re-run Review'}
          </Button>
        </Box>

        <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h5" component="h1" gutterBottom>
            Code Review: {review.review_id}
          </Typography>
          
          <Box display="flex" alignItems="center" my={2}>
            <Typography variant="subtitle1" mr={1}>
              Execution Time:
            </Typography>
            <Chip 
              label={`${review.execution_time.toFixed(2)}s`} 
              size="small" 
              color="primary" 
              variant="outlined"
            />
          </Box>

          <Divider sx={{ my: 2 }} />
          
          <Typography variant="h6" gutterBottom>
            Summary
          </Typography>
          <Typography variant="body1" paragraph>
            {review.summary}
          </Typography>
          
          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            Suggestions ({review.suggestions.length})
          </Typography>
          
          {review.suggestions.length === 0 ? (
            <Alert severity="success">
              No issues found in the code!
            </Alert>
          ) : (
            <Box mt={2}>
              {review.suggestions.map((suggestion, index) => (
                <SuggestionCard key={index} suggestion={suggestion} />
              ))}
            </Box>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default ReviewDetail; 