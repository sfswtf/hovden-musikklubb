import React, { useState } from 'react';
import { useFormStore } from '../stores/formStore';
import { CheckCircle } from 'lucide-react';

const AGE_GROUPS = [
  'Under 18',
  '18-25',
  '26-35',
  '36-60',
  'Over 60'
];

const MUSIC_GENRES = [
  'Rock',
  'Jazz',
  'Classical',
  'Electronic',
  'Folk',
  'Pop',
  'Metal',
  'Hip Hop',
  'Blues',
  'World Music'
];

export function MembershipForm() {
  const submitMembershipForm = useFormStore((state) => state.submitMembershipForm);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    ageGroup: '',
    motivation: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitMembershipForm(formData);
    setFormData({
      name: '',
      email: '',
      phone: '',
      location: '',
      ageGroup: '',
      motivation: ''
    });
    setSubmitted(true);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Medlemskapssøknad</h2>
        {submitted && (
          <div className="flex items-center gap-3 bg-emerald-600 rounded-xl shadow p-4 mb-6 border border-emerald-700 justify-center">
            <CheckCircle className="text-white" size={32} />
            <span className="text-lg font-medium text-white">Takk for din interesse! Vi behandler søknaden din fortløpende.</span>
          </div>
        )}
        {/* Personal Information */}
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2 text-left">Navn *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2 text-left">E-post *</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2 text-left">Telefon (valgfritt)</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2 text-left">Bosted *</label>
            <input
              type="text"
              required
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="F.eks. Hovden, Oslo, etc."
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2 text-left">Aldersgruppe *</label>
            <select
              required
              value={formData.ageGroup}
              onChange={(e) => setFormData({ ...formData, ageGroup: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="">Velg aldersgruppe</option>
              {AGE_GROUPS.map(age => (
                <option key={age} value={age}>{age}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-700 mb-2 text-left">
              Hvorfor ønsker du å bli medlem? (valgfritt)
            </label>
            <textarea
              value={formData.motivation}
              onChange={(e) => setFormData({ ...formData, motivation: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
              rows={4}
            />
          </div>
        </div>
        <button
          type="submit"
          className="w-full mt-6 bg-emerald-600 text-white py-4 px-4 rounded hover:bg-emerald-700 transition-colors text-lg"
        >
          Send Søknad
        </button>
      </div>
    </form>
  );
}