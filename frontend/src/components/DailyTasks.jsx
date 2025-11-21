import React, { useState, useEffect } from 'react';
import { CheckCircle, Circle, Target, Zap, Gift } from 'lucide-react';
import api from '../services/api.js';

export default function DailyTasks({ onTaskComplete }) {
  const [tasks, setTasks] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const data = await api.get('/daily-tasks');
      setTasks(data);
    } catch (err) {
      console.error('Failed to fetch daily tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const completeTask = async (taskId) => {
    try {
      const updated = await api.post(`/daily-tasks/${taskId}/complete`);
      setTasks(updated);
      if (onTaskComplete) {
        onTaskComplete(updated);
      }
    } catch (err) {
      console.error('Failed to complete task:', err);
    }
  };

  if (loading) {
    return (
      <div className="card">
        <div style={{ textAlign: 'center', color: '#6b7280' }}>Loading daily tasks...</div>
      </div>
    );
  }

  if (!tasks || !tasks.tasks || tasks.tasks.length === 0) {
    return null;
  }

  const progress = (tasks.completedCount / tasks.totalTasks) * 100;

  return (
    <div className="card" style={{ marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Target style={{ width: '20px', height: '20px', color: '#16a34a' }} />
          <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>Daily Tasks</h3>
        </div>
        <div style={{ fontSize: '0.875rem', color: '#4b5563' }}>
          {tasks.completedCount}/{tasks.totalTasks} completed
        </div>
      </div>

      {/* Progress Bar */}
      <div style={{ marginBottom: '1rem' }}>
        <div style={{ width: '100%', height: '0.75rem', background: '#e5e7eb', borderRadius: '9999px', overflow: 'hidden' }}>
          <div
            style={{ 
              width: `${progress}%`, 
              height: '100%', 
              background: 'linear-gradient(90deg, #22c55e, #16a34a)',
              borderRadius: '9999px',
              transition: 'width 0.5s ease-out'
            }}
          />
        </div>
      </div>

      {/* Tasks List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {tasks.tasks.map((task, index) => (
          <div
            key={task._id || task.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.75rem',
              borderRadius: '0.5rem',
              border: '2px solid',
              borderColor: task.completed ? '#86efac' : '#e5e7eb',
              background: task.completed ? '#f0fdf4' : '#f9fafb',
              transition: 'all 0.2s'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1 }}>
              {task.completed ? (
                <CheckCircle style={{ width: '20px', height: '20px', color: '#16a34a' }} />
              ) : (
                <Circle style={{ width: '20px', height: '20px', color: '#9ca3af' }} />
              )}
              <div style={{ flex: 1 }}>
                <div style={{ 
                  fontWeight: '600', 
                  color: task.completed ? '#15803d' : '#1f2937',
                  textDecoration: task.completed ? 'line-through' : 'none'
                }}>
                  {task.title}
                </div>
                <div style={{ fontSize: '0.875rem', color: '#4b5563' }}>{task.description}</div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>
                  Progress: {task.current}/{task.target}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {task.reward?.points > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#ca8a04' }}>
                  <Zap style={{ width: '16px', height: '16px' }} />
                  <span style={{ fontSize: '0.875rem', fontWeight: '600' }}>+{task.reward.points}</span>
                </div>
              )}
              {!task.completed && (
                <button
                  onClick={() => completeTask(task._id || task.id)}
                  disabled={task.current < task.target}
                  style={{
                    padding: '0.5rem 0.75rem',
                    background: task.current >= task.target ? '#16a34a' : '#9ca3af',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.375rem',
                    cursor: task.current >= task.target ? 'pointer' : 'not-allowed',
                    fontSize: '0.875rem',
                    fontWeight: '600'
                  }}
                >
                  Complete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Completion Message */}
      {tasks.completedCount === tasks.totalTasks && (
        <div style={{
          marginTop: '1rem',
          padding: '1rem',
          background: 'linear-gradient(to right, #4ade80, #10b981)',
          borderRadius: '0.5rem',
          color: 'white',
          textAlign: 'center'
        }}>
          <Gift style={{ width: '24px', height: '24px', margin: '0 auto 0.5rem' }} />
          <div style={{ fontWeight: 'bold' }}>All tasks completed! 🎉</div>
          <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>Great job today!</div>
        </div>
      )}
    </div>
  );
}

