import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Paper,
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Snackbar
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { submitCodeForReview } from '../api/reviewApi';

const SubmitReview: React.FC = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState<string>('');
  const [filePath, setFilePath] = useState<string>('');
  const [language, setLanguage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!code) {
      setError('Please enter code to review.');
      return;
    }
    
    if (!filePath) {
      setError('Please enter a file path.');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const result = await submitCodeForReview(code, filePath, language || undefined);
      
      setSnackbarOpen(true);
      setTimeout(() => {
        navigate(`/reviews/${result.review_id}`);
      }, 1500);
      
    } catch (err) {
      console.error('Error submitting code:', err);
      setError('Failed to submit code for review. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const programmingLanguages = [
    { value: 'python', label: 'Python' },
    { value: 'javascript', label: 'JavaScript' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'java', label: 'Java' },
    { value: 'c', label: 'C' },
    { value: 'cpp', label: 'C++' },
    { value: 'csharp', label: 'C#' },
    { value: 'go', label: 'Go' },
    { value: 'php', label: 'PHP' },
    { value: 'ruby', label: 'Ruby' },
    { value: 'rust', label: 'Rust' },
    { value: 'swift', label: 'Swift' },
    { value: 'kotlin', label: 'Kotlin' }
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Submit Code for Review
      </Typography>
      
      <Paper sx={{ p: 3, mt: 3 }}>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            margin="normal"
            required
            fullWidth
            id="filePath"
            label="File Path"
            name="filePath"
            placeholder="e.g., src/app.py"
            value={filePath}
            onChange={(e) => setFilePath(e.target.value)}
            disabled={loading}
            sx={{ mb: 2 }}
          />
          
          <FormControl fullWidth margin="normal" sx={{ mb: 2 }}>
            <InputLabel id="language-select-label">Programming Language (Optional)</InputLabel>
            <Select
              labelId="language-select-label"
              id="language"
              value={language}
              label="Programming Language (Optional)"
              onChange={(e) => setLanguage(e.target.value)}
              disabled={loading}
            >
              <MenuItem value="">
                <em>Auto-detect from file extension</em>
              </MenuItem>
              {programmingLanguages.map((lang) => (
                <MenuItem key={lang.value} value={lang.value}>
                  {lang.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <TextField
            margin="normal"
            required
            fullWidth
            id="code"
            label="Code"
            name="code"
            multiline
            rows={15}
            placeholder="Paste your code here..."
            value={code}
            onChange={(e) => setCode(e.target.value)}
            disabled={loading}
            variant="outlined"
            sx={{ 
              mb: 3,
              fontFamily: 'monospace',
              '& .MuiInputBase-input': {
                fontFamily: 'monospace'
              }
            }}
          />
          
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          <Box display="flex" justifyContent="flex-end">
            <Button 
              variant="outlined" 
              sx={{ mr: 2 }}
              onClick={() => navigate('/')}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
              endIcon={loading ? <CircularProgress size={20} /> : <SendIcon />}
            >
              {loading ? 'Submitting...' : 'Submit for Review'}
            </Button>
          </Box>
        </Box>
      </Paper>
      
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={handleSnackbarClose}
        message="Review submitted successfully! Redirecting..."
      />
    </Container>
  );
};

export default SubmitReview; 