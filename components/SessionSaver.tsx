'use client';

import React, { useState } from 'react';
import { Save, Home } from 'lucide-react';
import { CalculatorInputs } from '@/lib/types';

interface SessionSaverProps {
  inputs: CalculatorInputs;
  onSessionSaved?: () => void;
}

export const SessionSaver: React.FC<SessionSaverProps> = ({ inputs, onSessionSaved }) => {
  const [sessionName, setSessionName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showInput, setShowInput] = useState(false);

  const handleSaveSession = async () => {
    if (!sessionName.trim()) {
      setError('Please enter a session name');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const userId = sessionStorage.getItem('userId');
      const currentSessionId = sessionStorage.getItem('currentSessionId');

      if (!userId) {
        setError('User ID not found. Please log in again.');
        return;
      }

      let response;
      if (currentSessionId) {
        // Update existing session
        response = await fetch('/api/sessions', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sessionId: currentSessionId,
            inputData: inputs,
          }),
        });
      } else {
        // Create new session
        response = await fetch('/api/sessions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId,
            sessionName,
            inputData: inputs,
          }),
        });
      }

      const data = await response.json();

      if (response.ok) {
        setSuccess(currentSessionId ? 'Session updated successfully!' : 'Session saved successfully!');
        if (data.session?.id && !currentSessionId) {
          sessionStorage.setItem('currentSessionId', data.session.id);
          sessionStorage.setItem('currentSessionName', sessionName);
        }
        setSessionName('');
        setShowInput(false);
        onSessionSaved?.();
      } else {
        setError(data.error || 'Failed to save session');
      }
    } catch (err) {
      setError('An error occurred while saving the session');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoHome = () => {
    window.location.href = '/home';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="flex gap-3 flex-wrap items-center">
        {showInput ? (
          <div className="flex gap-2 flex-1 min-w-[300px]">
            <input
              type="text"
              placeholder="Enter session name (e.g., 'Scenario 1 - High Returns')"
              value={sessionName}
              onChange={(e) => setSessionName(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSaveSession}
              disabled={isLoading || sessionName.trim() === ''}
              className={`px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition flex items-center gap-2 ${
                isLoading || sessionName.trim() === '' ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <Save size={18} />
              {isLoading ? 'Saving...' : 'Save'}
            </button>
            <button
              onClick={() => {
                setShowInput(false);
                setSessionName('');
                setError('');
              }}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition"
            >
              Cancel
            </button>
          </div>
        ) : (
          <>
            <button
              onClick={() => setShowInput(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition flex items-center gap-2"
            >
              <Save size={18} />
              Save Session
            </button>
            <button
              onClick={handleGoHome}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition flex items-center gap-2"
            >
              <Home size={18} />
              Back to Sessions
            </button>
          </>
        )}

        {error && <div className="text-red-600 text-sm">{error}</div>}
        {success && <div className="text-green-600 text-sm">{success}</div>}
      </div>
    </div>
  );
};
