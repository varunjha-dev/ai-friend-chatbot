import React, { useState } from 'react';
import { Heart, User, Sparkles, Target } from 'lucide-react';
import { saveUserProfile, UserProfile } from '../services/firestoreService';
import { useAuth } from '../hooks/useAuth';

interface PersonalizationFormProps {
  onComplete: (profile: Omit<UserProfile, 'createdAt'>) => void;
}

const PersonalizationForm: React.FC<PersonalizationFormProps> = ({ onComplete }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    gfName: '',
    gfNickname: '',
    userName: '',
    userNickname: '',
    gfInterests: '',
    userInterests: '',
    gfPersonality: 'Tsundere'
  });

  const personalityTypes = [
    { value: 'Tsundere', description: 'Initially cold but gradually shows warmth' },
    { value: 'Yandere', description: 'Extremely loving and possessive' },
    { value: 'Kuudere', description: 'Cool and aloof but caring inside' },
    { value: 'Dandere', description: 'Quiet and shy but sweet' },
    { value: 'Moekko', description: 'Cute and innocent' },
    { value: 'Otaku', description: 'Passionate about hobbies and interests' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      await saveUserProfile(user.uid, formData);
      onComplete(formData);
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen background-pattern flex items-center justify-center p-4">
      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-3xl shadow-2xl p-8 w-full max-w-2xl border border-pink-200 dark:border-purple-500">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full mb-4">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            Let's Personalize Your Experience
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Tell us about yourselves to make the conversation more meaningful 💕
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Girlfriend Details */}
          <div className="bg-pink-50 dark:bg-pink-900/20 rounded-2xl p-6 border border-pink-200 dark:border-pink-500">
            <div className="flex items-center mb-4">
              <Heart className="w-5 h-5 text-pink-500 mr-2" />
              <h3 className="text-lg font-semibold text-pink-700 dark:text-pink-300">Your Girlfriend</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.gfName}
                  onChange={(e) => handleInputChange('gfName', e.target.value)}
                  placeholder="e.g., Anjali"
                  className="w-full px-4 py-3 border border-pink-200 dark:border-pink-500 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-white"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nickname
                </label>
                <input
                  type="text"
                  value={formData.gfNickname}
                  onChange={(e) => handleInputChange('gfNickname', e.target.value)}
                  placeholder="e.g., Bubu"
                  className="w-full px-4 py-3 border border-pink-200 dark:border-pink-500 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-white"
                  required
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Sparkles className="w-4 h-4 inline mr-1" />
                Interests, Hobbies & Goals
              </label>
              <textarea
                value={formData.gfInterests}
                onChange={(e) => handleInputChange('gfInterests', e.target.value)}
                placeholder="e.g., playing badminton, watching romantic movies, career-oriented"
                rows={3}
                className="w-full px-4 py-3 border border-pink-200 dark:border-pink-500 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-white resize-none"
                required
              />
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Personality Type
              </label>
              <select
                value={formData.gfPersonality}
                onChange={(e) => handleInputChange('gfPersonality', e.target.value)}
                className="w-full px-4 py-3 border border-pink-200 dark:border-pink-500 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-white"
              >
                {personalityTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.value} - {type.description}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* User Details */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-500">
            <div className="flex items-center mb-4">
              <User className="w-5 h-5 text-blue-500 mr-2" />
              <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-300">About You</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  value={formData.userName}
                  onChange={(e) => handleInputChange('userName', e.target.value)}
                  placeholder="e.g., Rohit"
                  className="w-full px-4 py-3 border border-blue-200 dark:border-blue-500 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-white"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Your Nickname
                </label>
                <input
                  type="text"
                  value={formData.userNickname}
                  onChange={(e) => handleInputChange('userNickname', e.target.value)}
                  placeholder="e.g., Babu"
                  className="w-full px-4 py-3 border border-blue-200 dark:border-blue-500 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-white"
                  required
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Target className="w-4 h-4 inline mr-1" />
                Your Interests, Hobbies & Goals
              </label>
              <textarea
                value={formData.userInterests}
                onChange={(e) => handleInputChange('userInterests', e.target.value)}
                placeholder="e.g., gym, sarcasm, supporting Anjali"
                rows={3}
                className="w-full px-4 py-3 border border-blue-200 dark:border-blue-500 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-white resize-none"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-4 rounded-xl font-semibold text-lg hover:from-pink-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Setting up your experience...' : 'Start Chatting 💕'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PersonalizationForm;