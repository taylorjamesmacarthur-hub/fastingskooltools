import React, { useState, useEffect } from 'react';
import { TrendingUp, Calendar, Target, Award, Plus, Trash2 } from 'lucide-react';

interface FastingSession {
  id: string;
  date: string;
  duration: number;
  plan: string;
  completed: boolean;
  weight?: number;
  notes?: string;
}

export const ProgressTracker: React.FC = () => {
  const [sessions, setSessions] = useState<FastingSession[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newSession, setNewSession] = useState({
    date: new Date().toISOString().split('T')[0],
    duration: 16,
    plan: '16:8',
    completed: true,
    weight: '',
    notes: ''
  });

  // Load sessions from localStorage on component mount
  useEffect(() => {
    const savedSessions = localStorage.getItem('fastingSessions');
    if (savedSessions) {
      setSessions(JSON.parse(savedSessions));
    }
  }, []);

  // Save sessions to localStorage whenever sessions change
  useEffect(() => {
    localStorage.setItem('fastingSessions', JSON.stringify(sessions));
  }, [sessions]);

  const addSession = () => {
    const session: FastingSession = {
      id: Date.now().toString(),
      date: newSession.date,
      duration: newSession.duration,
      plan: newSession.plan,
      completed: newSession.completed,
      weight: newSession.weight ? parseFloat(newSession.weight) : undefined,
      notes: newSession.notes
    };

    setSessions([session, ...sessions]);
    setNewSession({
      date: new Date().toISOString().split('T')[0],
      duration: 16,
      plan: '16:8',
      completed: true,
      weight: '',
      notes: ''
    });
    setShowAddForm(false);
  };

  const deleteSession = (id: string) => {
    setSessions(sessions.filter(session => session.id !== id));
  };

  const getStats = () => {
    const totalSessions = sessions.length;
    const completedSessions = sessions.filter(s => s.completed).length;
    const completionRate = totalSessions > 0 ? (completedSessions / totalSessions) * 100 : 0;
    const averageDuration = totalSessions > 0 ? sessions.reduce((sum, s) => sum + s.duration, 0) / totalSessions : 0;
    
    const weightsWithDates = sessions
      .filter(s => s.weight)
      .map(s => ({ date: s.date, weight: s.weight! }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    const weightChange = weightsWithDates.length >= 2 
      ? weightsWithDates[weightsWithDates.length - 1].weight - weightsWithDates[0].weight
      : 0;

    return {
      totalSessions,
      completedSessions,
      completionRate,
      averageDuration,
      weightChange
    };
  };

  const stats = getStats();

  return (
    <div className="max-w-6xl mx-auto">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="card p-6 text-center">
          <div className="text-3xl font-bold text-primary-600">{stats.totalSessions}</div>
          <div className="text-sm text-gray-600">Total Sessions</div>
        </div>
        <div className="card p-6 text-center">
          <div className="text-3xl font-bold text-green-600">{stats.completionRate.toFixed(0)}%</div>
          <div className="text-sm text-gray-600">Success Rate</div>
        </div>
        <div className="card p-6 text-center">
          <div className="text-3xl font-bold text-blue-600">{stats.averageDuration.toFixed(1)}h</div>
          <div className="text-sm text-gray-600">Avg Duration</div>
        </div>
        <div className="card p-6 text-center">
          <div className={`text-3xl font-bold ${stats.weightChange <= 0 ? 'text-green-600' : 'text-orange-600'}`}>
            {stats.weightChange > 0 ? '+' : ''}{stats.weightChange.toFixed(1)}kg
          </div>
          <div className="text-sm text-gray-600">Weight Change</div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Add Session Form */}
        <div className="lg:col-span-1">
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Log Session
              </h3>
            </div>

            {showAddForm ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                  <input
                    type="date"
                    value={newSession.date}
                    onChange={(e) => setNewSession({...newSession, date: e.target.value})}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Fasting Plan</label>
                  <select
                    value={newSession.plan}
                    onChange={(e) => {
                      const plan = e.target.value;
                      const duration = parseInt(plan.split(':')[0]);
                      setNewSession({...newSession, plan, duration});
                    }}
                    className="input-field"
                  >
                    <option value="12:12">12:12</option>
                    <option value="14:10">14:10</option>
                    <option value="16:8">16:8</option>
                    <option value="18:6">18:6</option>
                    <option value="20:4">20:4</option>
                    <option value="24:0">24:0 (OMAD)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Weight (kg) - Optional</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newSession.weight}
                    onChange={(e) => setNewSession({...newSession, weight: e.target.value})}
                    className="input-field"
                    placeholder="70.5"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notes - Optional</label>
                  <textarea
                    value={newSession.notes}
                    onChange={(e) => setNewSession({...newSession, notes: e.target.value})}
                    className="input-field"
                    rows={3}
                    placeholder="How did you feel? Any observations?"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="completed"
                    checked={newSession.completed}
                    onChange={(e) => setNewSession({...newSession, completed: e.target.checked})}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <label htmlFor="completed" className="text-sm text-gray-700">
                    Successfully completed
                  </label>
                </div>

                <div className="flex gap-2">
                  <button onClick={addSession} className="btn-primary flex-1">
                    Add Session
                  </button>
                  <button 
                    onClick={() => setShowAddForm(false)}
                    className="btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button 
                onClick={() => setShowAddForm(true)}
                className="btn-primary w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add New Session
              </button>
            )}
          </div>

          {/* Achievements */}
          <div className="card p-6 mt-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Award className="w-5 h-5" />
              Achievements
            </h3>
            <div className="space-y-3">
              {[
                { title: "First Fast", condition: stats.totalSessions >= 1, icon: "🎯" },
                { title: "Week Warrior", condition: stats.totalSessions >= 7, icon: "🔥" },
                { title: "Consistency King", condition: stats.completionRate >= 80, icon: "👑" },
                { title: "Month Master", condition: stats.totalSessions >= 30, icon: "🏆" },
              ].map((achievement, index) => (
                <div key={index} className={`flex items-center gap-3 p-3 rounded-lg ${
                  achievement.condition ? 'bg-green-50 text-green-800' : 'bg-gray-50 text-gray-500'
                }`}>
                  <span className="text-2xl">{achievement.icon}</span>
                  <span className="font-medium">{achievement.title}</span>
                  {achievement.condition && <span className="ml-auto text-green-600">✓</span>}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sessions History */}
        <div className="lg:col-span-2">
          <div className="card p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Recent Sessions
            </h3>

            {sessions.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No sessions logged yet. Add your first session to start tracking!</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {sessions.map((session) => (
                  <div key={session.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${
                          session.completed ? 'bg-green-500' : 'bg-red-500'
                        }`} />
                        <span className="font-semibold text-gray-900">
                          {new Date(session.date).toLocaleDateString()}
                        </span>
                        <span className="bg-primary-100 text-primary-800 px-2 py-1 rounded-lg text-sm font-medium">
                          {session.plan}
                        </span>
                      </div>
                      <button
                        onClick={() => deleteSession(session.id)}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="text-sm text-gray-600 space-y-1">
                      <div>Duration: {session.duration} hours</div>
                      {session.weight && <div>Weight: {session.weight} kg</div>}
                      {session.notes && <div className="italic">"{session.notes}"</div>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};