'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, Plus, Trash2, Calendar } from 'lucide-react';
import { CalculatorInputs } from '@/lib/types';

interface Session {
  id: string;
  session_name: string;
  input_data: CalculatorInputs;
  created_at: string;
  updated_at: string;
}

export default function HomePage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [userId, setUserId] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Get user ID from session storage
    const storedUserId = sessionStorage.getItem('userId');
    if (!storedUserId) {
      router.push('/login');
      return;
    }
    setUserId(storedUserId);
    loadSessions(storedUserId);
  }, [router]);

  const loadSessions = async (uid: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/sessions?userId=${uid}`);
      const data = await response.json();

      if (response.ok) {
        setSessions(data.sessions || []);
      } else {
        setError(data.error || 'Failed to load sessions');
      }
    } catch (err) {
      setError('An error occurred while loading sessions');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadSession = (session: Session) => {
    // Store the session data in session storage
    sessionStorage.setItem('calculatorInputs', JSON.stringify(session.input_data));
    sessionStorage.setItem('currentSessionId', session.id);
    sessionStorage.setItem('currentSessionName', session.session_name);
    // Navigate to calculator
    router.push('/');
  };

  const handleDeleteSession = async (sessionId: string) => {
    if (!confirm('Are you sure you want to delete this session?')) {
      return;
    }

    try {
      const response = await fetch(`/api/sessions/${sessionId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setSessions(sessions.filter((s) => s.id !== sessionId));
      } else {
        setError('Failed to delete session');
      }
    } catch (err) {
      setError('An error occurred while deleting the session');
    }
  };

  const handleCreateNewSession = () => {
    // Clear any stored session data
    sessionStorage.removeItem('calculatorInputs');
    sessionStorage.removeItem('currentSessionId');
    sessionStorage.removeItem('currentSessionName');
    // Navigate to calculator
    router.push('/');
  };

  const handleLogout = () => {
    sessionStorage.removeItem('userId');
    sessionStorage.removeItem('userEmail');
    sessionStorage.removeItem('calculatorInputs');
    sessionStorage.removeItem('currentSessionId');
    sessionStorage.removeItem('currentSessionName');
    router.push('/login');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">
                Premium Finance Illustrator
              </h1>
              <p className="text-gray-600">
                Welcome! Select a previous session to continue or create a new one.
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>

          {/* Action Button */}
          <button
            onClick={handleCreateNewSession}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
          >
            <Plus size={20} />
            New Session
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-600">Loading your sessions...</p>
          </div>
        )}

        {/* Sessions List */}
        {!isLoading && sessions.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Your Previous Sessions
            </h2>
            <div className="grid gap-4">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">
                        {session.session_name}
                      </h3>
                      <div className="flex gap-6 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Calendar size={16} />
                          <span>Created: {formatDate(session.created_at)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar size={16} />
                          <span>Updated: {formatDate(session.updated_at)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleLoadSession(session)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
                      >
                        Load Session
                      </button>
                      <button
                        onClick={() => handleDeleteSession(session.id)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                  {/* Session Preview */}
                  <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700">
                    <p className="mb-2">
                      <strong>Death Benefit:</strong> $
                      {session.input_data.deathBenefit.toLocaleString()}
                    </p>
                    <p className="mb-2">
                      <strong>Annual Premium:</strong> $
                      {session.input_data.annualPremium.toLocaleString()}
                    </p>
                    <p className="mb-2">
                      <strong>Out of Pocket:</strong> $
                      {session.input_data.outOfPocket.toLocaleString()}
                    </p>
                    <p>
                      <strong>Premium Years:</strong> {session.input_data.premiumYears}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && sessions.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-600 mb-6">
              You don't have any saved sessions yet. Create a new session to get started!
            </p>
            <button
              onClick={handleCreateNewSession}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
            >
              <Plus size={20} />
              Create New Session
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
