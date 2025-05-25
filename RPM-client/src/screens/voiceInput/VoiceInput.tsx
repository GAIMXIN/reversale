import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  CircularProgress,
  TextField,
} from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import StopIcon from '@mui/icons-material/Stop';

export default function VoiceInput() {
  const navigate = useNavigate();
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const audioChunks: Blob[] = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        await processAudio(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);

      // 停止录音的函数
      window.stopRecording = () => {
        mediaRecorder.stop();
        stream.getTracks().forEach(track => track.stop());
        setIsRecording(false);
      };
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (window.stopRecording) {
      window.stopRecording();
    }
  };

  const processAudio = async (audioBlob: Blob) => {
    setIsProcessing(true);
    try {
      // TODO: 调用语音识别API
      // const response = await sendAudioToAPI(audioBlob);
      // setTranscript(response.transcript);
      
      // 模拟API调用
      setTimeout(() => {
        setTranscript('这是语音识别的示例文本。');
        setIsProcessing(false);
      }, 2000);
    } catch (error) {
      console.error('Error processing audio:', error);
      setIsProcessing(false);
    }
  };

  const handleSave = async () => {
    if (!transcript) return;

    try {
      // TODO: 调用API保存转录文本
      // await saveTranscript(transcript);
      
      // 模拟API调用
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    } catch (error) {
      console.error('Error saving transcript:', error);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          Voice Input
        </Typography>
        
        <Typography variant="body1" color="text.secondary" paragraph>
          Tell us about your goals and interests. We'll use this information to provide personalized recommendations.
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <Button
            variant="contained"
            size="large"
            startIcon={isRecording ? <StopIcon /> : <MicIcon />}
            onClick={isRecording ? stopRecording : startRecording}
            disabled={isProcessing}
            sx={{
              width: 200,
              height: 200,
              borderRadius: '50%',
              backgroundColor: isRecording ? '#ff4444' : '#7442BF',
              '&:hover': {
                backgroundColor: isRecording ? '#cc0000' : '#5e3399',
              },
            }}
          >
            {isRecording ? 'Stop Recording' : 'Start Recording'}
          </Button>
        </Box>

        {isProcessing && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {transcript && (
          <Box sx={{ mt: 4 }}>
            <TextField
              fullWidth
              multiline
              rows={4}
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              label="Transcription"
              variant="outlined"
            />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button
                variant="contained"
                onClick={handleSave}
                disabled={!transcript}
              >
                Save and Continue
              </Button>
            </Box>
          </Box>
        )}
      </Paper>
    </Container>
  );
}

// 添加全局类型声明
declare global {
  interface Window {
    stopRecording: () => void;
  }
} 