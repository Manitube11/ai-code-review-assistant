import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Button, 
  Alert, 
  CircularProgress, 
  Card, 
  CardContent,
  CardActions,
  Chip,
  Divider,
  Grid
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { fetchReviews, ReviewListItem } from '../api/reviewApi';
import AddIcon from '@mui/icons-material/Add';
import CodeIcon from '@mui/icons-material/Code';
import { motion } from 'framer-motion';
import AnimatedLogo from '../components/AnimatedLogo';

const ReviewList: React.FC = () => {
  const [reviews, setReviews] = useState<ReviewListItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadReviews = async () => {
      try {
        setLoading(true);
        const data = await fetchReviews();
        setReviews(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching reviews:', err);
        setError('Failed to load reviews. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadReviews();
  }, []);

  const handleCreateReview = () => {
    navigate('/submit');
  };

  const handleViewReview = (id: string) => {
    navigate(`/reviews/${id}`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    }
  };

  const buttonVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.05, boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.1)" },
    tap: { scale: 0.95 }
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh" flexDirection="column">
          <CircularProgress size={60} />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Typography variant="h6" sx={{ mt: 3, color: 'text.secondary' }}>
              Loading reviews...
            </Typography>
          </motion.div>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 6 }}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box mb={5} display="flex" justifyContent="center">
            <AnimatedLogo size="large" />
          </Box>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
            <Typography variant="h4" component="h1">
              Code Reviews
            </Typography>
            <motion.div variants={buttonVariants} initial="initial" whileHover="hover" whileTap="tap">
              <Button 
                variant="contained" 
                color="primary" 
                size="large"
                startIcon={<AddIcon />}
                onClick={handleCreateReview}
                sx={{ 
                  borderRadius: '28px',
                  px: 3,
                  py: 1.2,
                  background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                  boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)'
                }}
              >
                NEW REVIEW
              </Button>
            </motion.div>
          </Box>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          </motion.div>
        )}

        {reviews.length === 0 && !error ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <Box 
              sx={{ 
                p: 5, 
                textAlign: 'center', 
                border: '2px dashed #e0e0e0',
                borderRadius: 2,
                bgcolor: 'rgba(33, 150, 243, 0.04)'
              }}
            >
              <CodeIcon color="primary" sx={{ fontSize: 60, mb: 2, opacity: 0.7 }} />
              <Typography variant="h5" gutterBottom>No Reviews Yet</Typography>
              <Typography variant="body1" color="textSecondary" paragraph>
                Get started by creating your first code review.
              </Typography>
              <motion.div variants={buttonVariants} initial="initial" whileHover="hover" whileTap="tap">
                <Button 
                  variant="contained" 
                  color="primary"
                  onClick={handleCreateReview}
                  sx={{ mt: 2 }}
                >
                  Create Review
                </Button>
              </motion.div>
            </Box>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <Grid container spacing={3}>
              {reviews.map((review) => (
                <Grid item xs={12} sm={6} md={4} key={review.id}>
                  <motion.div variants={itemVariants}>
                    <Card 
                      elevation={2} 
                      sx={{ 
                        height: '100%', 
                        display: 'flex', 
                        flexDirection: 'column',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        '&:hover': {
                          transform: 'translateY(-5px)',
                          boxShadow: '0 8px 20px rgba(0,0,0,0.1)'
                        } 
                      }}
                    >
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                          <Typography variant="h6" component="h2" noWrap>
                            {review.file_path}
                          </Typography>
                          <Chip 
                            label={review.language} 
                            size="small" 
                            color="primary" 
                            variant="outlined"
                          />
                        </Box>
                        <Typography variant="caption" color="text.secondary" display="block" mb={2}>
                          {formatDate(review.created_at)}
                        </Typography>
                        <Divider sx={{ my: 1.5 }} />
                        <Typography variant="body2" color="text.secondary" sx={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          mb: 2
                        }}>
                          {review.summary}
                        </Typography>
                        <Box display="flex" justifyContent="flex-end">
                          <Chip 
                            label={`${review.suggestion_count} suggestions`} 
                            size="small" 
                            color={review.suggestion_count > 0 ? "warning" : "success"}
                          />
                        </Box>
                      </CardContent>
                      <CardActions>
                        <Button 
                          size="small" 
                          color="primary" 
                          onClick={() => handleViewReview(review.id)}
                          sx={{ ml: 'auto' }}
                        >
                          View Details
                        </Button>
                      </CardActions>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        )}
      </Box>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
      >
        <Box textAlign="center" my={5}>
          <Typography variant="body2" color="text.secondary">
            AI Code Review Assistant © 2023
          </Typography>
          <Typography variant="subtitle2" color="primary" sx={{ mt: 1, fontStyle: 'italic' }}>
            Created with ❤️ by ManiTube
          </Typography>
        </Box>
      </motion.div>
    </Container>
  );
};

export default ReviewList; 