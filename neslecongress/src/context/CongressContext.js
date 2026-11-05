import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { api } from '../api';
import { useAuth } from './AuthContext';

const CongressContext = createContext(null);

const empty = {
  event: null,
  notification: null,
  tools: [],
  days: [],
  sessions: [],
  speakers: [],
  venue: null,
  polls: [],
  questions: [],
  resources: [],
  exhibitors: [],
};

function replaceById(list, item) {
  return list.map((row) => (row.id === item.id ? item : row));
}

export function CongressProvider({ children }) {
  const { user, setUser } = useAuth();
  const [data, setData] = useState(empty);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    if (!user) {
      setData(empty);
      setReady(false);
      return;
    }
    setError('');
    const payload = await api('/bootstrap');
    setData(payload);
    setReady(true);
  }, [user]);

  useEffect(() => {
    let active = true;
    if (!user) return undefined;
    setReady(false);
    api('/bootstrap')
      .then((payload) => {
        if (active) {
          setData(payload);
          setReady(true);
        }
      })
      .catch((err) => {
        if (active) {
          setError(err.message);
          setReady(true);
        }
      });
    return () => {
      active = false;
    };
  }, [user?.id]);

  const rememberUser = (next) => {
    if (next) setUser(next);
  };

  const toggleSession = async (id) => {
    const result = await api(`/sessions/${id}/bookmark`, { method: 'POST' });
    setData((prev) => ({ ...prev, sessions: replaceById(prev.sessions, result.session) }));
    rememberUser(result.user);
  };

  const toggleSpeaker = async (id) => {
    const result = await api(`/speakers/${id}/favorite`, { method: 'POST' });
    setData((prev) => ({ ...prev, speakers: replaceById(prev.speakers, result.speaker) }));
    rememberUser(result.user);
  };

  const vote = async (pollId, optionId) => {
    const poll = await api(`/polls/${pollId}/vote`, { method: 'POST', body: { option_id: optionId } });
    setData((prev) => ({ ...prev, polls: replaceById(prev.polls, poll) }));
  };

  const addQuestion = async ({ text, topic }) => {
    const question = await api('/questions', { method: 'POST', body: { text, topic } });
    setData((prev) => ({ ...prev, questions: [question, ...prev.questions] }));
    return question;
  };

  const upvoteQuestion = async (id) => {
    const question = await api(`/questions/${id}/upvote`, { method: 'POST' });
    setData((prev) => ({ ...prev, questions: replaceById(prev.questions, question) }));
  };

  const toggleResource = async (id) => {
    let previous;
    setData((prev) => {
      previous = prev.resources;
      return {
        ...prev,
        resources: prev.resources.map((row) => (row.id === id ? { ...row, saved: !row.saved } : row)),
      };
    });
    try {
      const result = await api(`/resources/${id}/save`, { method: 'POST' });
      setData((prev) => ({ ...prev, resources: replaceById(prev.resources, result.resource) }));
      rememberUser(result.user);
      return result.resource;
    } catch (error) {
      setData((prev) => ({ ...prev, resources: previous || prev.resources }));
      throw error;
    }
  };

  const toggleExhibitor = async (id) => {
    let previous;
    setData((prev) => {
      previous = prev.exhibitors;
      return {
        ...prev,
        exhibitors: prev.exhibitors.map((row) => (row.id === id ? { ...row, saved: !row.saved } : row)),
      };
    });
    try {
      const result = await api(`/exhibitors/${id}/save`, { method: 'POST' });
      setData((prev) => ({ ...prev, exhibitors: replaceById(prev.exhibitors, result.exhibitor) }));
      rememberUser(result.user);
      return result.exhibitor;
    } catch (error) {
      setData((prev) => ({ ...prev, exhibitors: previous || prev.exhibitors }));
      throw error;
    }
  };

  return (
    <CongressContext.Provider
      value={{
        ...data,
        ready,
        error,
        reload: load,
        toggleSession,
        toggleSpeaker,
        vote,
        addQuestion,
        upvoteQuestion,
        toggleResource,
        toggleExhibitor,
      }}
    >
      {children}
    </CongressContext.Provider>
  );
}

export function useCongress() {
  return useContext(CongressContext);
}
