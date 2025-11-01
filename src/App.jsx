import React, { useState } from 'react';
import {
  Button,
  CircularProgress,
  Container,
  FormControl,
  Typography,
  Box,
  TextField,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import axois from 'axios';
import './App.css';

function App() {
  const [emailContent, setEmailContent] = useState('');
  const [tone, setTone] = useState('');
  const [generatedReply, setGeneratedReply] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const generateReply = async () => {
    setIsLoading(true);
    setError('');
    setGeneratedReply('');

    try {
      const response=await axois.post('http://localhost:8080/api/email/generate', { emailContent, tone });
      setGeneratedReply(typeof response.data === 'string' ? response.data : JSON.stringify(response.data));
    } catch (error) {
      setError('Failed to generate reply. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        Email Reply Generator
      </Typography>

      <Box sx={{ my: 2 }}>
        <TextField
          label="Email Content"
          multiline
          rows={6}
          fullWidth
          value={emailContent}
          onChange={(e) => setEmailContent(e.target.value)}
        />

        <FormControl fullWidth sx={{ my: 2 }}>
          <InputLabel id="tone-label">Select Tone (Optional)</InputLabel>
          <Select
            labelId="tone-label"
            value={tone}
            label="Select Tone (Optional)"
            onChange={(e) => setTone(e.target.value)}
          >
            <MenuItem value="Formal">Formal</MenuItem>
            <MenuItem value="Informal">Informal</MenuItem>
            <MenuItem value="Friendly">Friendly</MenuItem>
            <MenuItem value="Professional">Professional</MenuItem>
          </Select>
        </FormControl>

        <Button
          variant="contained"
          color="primary"
          onClick={generateReply}
          disabled={isLoading || !emailContent.trim()}
          fullWidth
          >
          {isLoading ? <CircularProgress size={24} /> : 'Generate Reply'}
        </Button>

        {error && (
          <Typography color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}

        {generatedReply && (
          <Box sx={{ mt: 3, p: 2, border: '1px solid #ccc', borderRadius: 2 }}>
            <Typography variant="h6">Generated Reply:</Typography>
            <Typography sx={{ whiteSpace: 'pre-line' }}>{generatedReply}</Typography>
          </Box>
        )}
        <Button variant="outlined" sx={{ mt: 2 }} onClick={() => {
          navigator.clipboard.writeText(generatedReply);
        }}>
          Copy to Clipboard
        </Button>
      </Box>
    </Container>
  );
}

export default App;
