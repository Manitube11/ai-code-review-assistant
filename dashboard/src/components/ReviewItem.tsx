import React from 'react';
import { Card, CardContent, Typography, Chip, Box, Grid } from '@mui/material';
import { ReviewSuggestion } from '../api/reviewApi';

interface ReviewItemProps {
  suggestion: ReviewSuggestion;
  onClick?: () => void;
}

const getSeverityColor = (severity: string): string => {
  switch (severity) {
    case 'low':
      return 'success';
    case 'medium':
      return 'warning';
    case 'high':
      return 'error';
    case 'critical':
      return 'error';
    default:
      return 'default';
  }
};

const ReviewItem: React.FC<ReviewItemProps> = ({ suggestion, onClick }) => {
  return (
    <Card sx={{ mb: 2, cursor: onClick ? 'pointer' : 'default' }} onClick={onClick}>
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
              <Typography variant="subtitle1" fontWeight="bold">
                Lines {suggestion.line_start}-{suggestion.line_end}
              </Typography>
              <Box>
                <Chip 
                  label={suggestion.severity.toUpperCase()} 
                  size="small" 
                  color={getSeverityColor(suggestion.severity) as any}
                  sx={{ mr: 1 }}
                />
                <Chip 
                  label={suggestion.category} 
                  size="small" 
                  variant="outlined"
                />
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1">{suggestion.message}</Typography>
          </Grid>
          {suggestion.suggested_fix && (
            <Grid item xs={12}>
              <Box sx={{ 
                backgroundColor: '#f5f5f5', 
                p: 1, 
                borderRadius: 1, 
                overflowX: 'auto',
                '& pre': { 
                  margin: 0,
                  fontFamily: 'monospace'
                }
              }}>
                <pre>{suggestion.suggested_fix}</pre>
              </Box>
            </Grid>
          )}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default ReviewItem; 