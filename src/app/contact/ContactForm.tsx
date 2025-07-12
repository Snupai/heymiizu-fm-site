import React, { useState } from 'react';
import Image from 'next/image';
import CustomSelect from '../../components/CustomSelect';

const PROJECT_TYPES = [
  { value: 'Commercial Spot', label: 'Commercial Spot' },
  { value: 'Intro/Preintro', label: 'Intro/Preintro' },
  { value: 'Overlay', label: 'Overlay' },
  { value: 'Social Media Content', label: 'Social Media Content' },
];
const SEQUENCE_LENGTHS = [
  { value: '<45s', label: '<45s' },
  { value: '1-2min', label: '1-2min' },
  { value: '>2min', label: '>2min' },
];
const ASSETS_OPTIONS = [
  { value: 'Yes', label: 'Yes' },
  { value: 'No', label: 'No' },
];

const initialState = {
  name: '',
  email: '',
  telephone: '',
  company: '',
  projectType: '',
  sequenceLength: '',
  deadline: '',
  assets: '',
  description: '',
};

export default function ContactForm() {
  const [form, setForm] = useState(initialState);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [deadlineError, setDeadlineError] = useState('');
  const [flashFields, setFlashFields] = useState<string[]>([]);
  const [missingFields, setMissingFields] = useState<string[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Special validation for telephone field
    if (name === 'telephone') {
      // Only allow numbers, +, -, and /
      const phoneRegex = /^[0-9+\-/]*$/;
      if (value === '' || phoneRegex.test(value)) {
        setForm({ ...form, [name]: value });
      }
    } else {
      setForm({ ...form, [name]: value });
    }
    setMissingFields(prev => prev.filter(f => f !== name));
    setFlashFields(prev => prev.filter(f => f !== name));
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailBlur = () => {
    if (form.email && !validateEmail(form.email)) {
      setEmailError('Please enter a valid email address.');
    } else {
      setEmailError('');
    }
  };

  const validateDeadline = (deadline: string) => {
    if (!deadline) return false;
    const selectedDate = new Date(deadline);
    const today = new Date();
    const minDate = new Date();
    minDate.setDate(today.getDate() + 12);
    selectedDate.setHours(0, 0, 0, 0);
    minDate.setHours(0, 0, 0, 0);
    return selectedDate >= minDate;
  };

  const handleDeadlineBlur = () => {
    if (form.deadline && !validateDeadline(form.deadline)) {
      setDeadlineError('Deadline must be at least 12 days in the future.');
      setForm({ ...form, deadline: '' });
    } else {
      setDeadlineError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validate required fields
    const missingFields = [];
    if (!form.name) missingFields.push('name');
    if (!form.email) missingFields.push('email');
    if (!form.projectType) missingFields.push('projectType');
    if (!form.sequenceLength) missingFields.push('sequenceLength');
    if (!form.deadline) missingFields.push('deadline');
    if (!form.assets) missingFields.push('assets');
    if (!form.description) missingFields.push('description');
    if (missingFields.length > 0) {
      setMissingFields(missingFields);
      setFlashFields(missingFields);
      setTimeout(() => setFlashFields([]), 5000);
      return;
    }
    
    // Validate email format
    if (!validateEmail(form.email)) {
      setError('Please enter a valid email address.');
      setEmailError('Please enter a valid email address.');
      setFlashFields(['email']);
      setTimeout(() => setFlashFields([]), 15000);
      return;
    }
    
    // Clear any email-specific errors
    setEmailError('');
    setSubmitting(true);
    setError('');
    setSuccess(false);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSuccess(true);
        setForm(initialState);
        setTimeout(() => setSuccess(false), 5000);
      } else {
        const data = await res.json() as { error?: string };
        setError(data.error ?? 'Failed to send.');
      }
    } catch {
      setError('Failed to send.');
    } finally {
      setSubmitting(false);
      setTimeout(() => setFlashFields([]), 15000);
    }
  };

  return (
    <div className="relative w-full flex flex-col items-center px-4 md:px-8 lg:px-0 pb-8">
      <div className="w-full max-w-5xl mx-auto">
        <form onSubmit={handleSubmit} noValidate className="w-full grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10 px-4 md:px-8 lg:px-0">
          {/* Name */}
          <div className="col-span-1 md:col-span-1 flex flex-col">
            <label className="block font-bold mb-1 text-lg">Name</label>
            <div className="relative">
              <input 
                name="name" 
                value={form.name} 
                onChange={handleChange} 
                onBlur={() => setFlashFields(prev => prev.filter(f => f !== 'name'))}
                required 
                maxLength={50} 
                className={`w-full border-4 rounded-2xl px-4 py-3 text-lg placeholder-gray-400 focus:outline-none transition-all ${
                  flashFields.includes('name') ? '[border-color:#f87171] focus:[border-color:#f87171] focus:[box-shadow:0_0_0_2px_#f87171]' : '[border-color:#0088ff] focus:[border-color:#0088ff] focus:[box-shadow:0_0_0_2px_#0088ff]'
                }`} 
                placeholder="Your name" 
              />
              {form.name.length >= 40 && <div className="text-sm text-gray-500 mt-1">{form.name.length}/50</div>}
              {missingFields.includes('name') && <div className="text-red-600 font-bold text-xs absolute -bottom-5 right-2">This field is required.</div>}
            </div>
          </div>
          {/* Email */}
          <div className="col-span-1 md:col-span-1 flex flex-col">
            <label className="block font-bold mb-1 text-lg">E-Mail</label>
            <div className="relative">
              <input 
                name="email" 
                type="email" 
                value={form.email} 
                onChange={handleChange} 
                onBlur={() => { handleEmailBlur(); setFlashFields(prev => prev.filter(f => f !== 'email')); }}
                required 
                maxLength={100} 
                className={`w-full border-4 rounded-2xl px-4 py-3 text-lg placeholder-gray-400 focus:outline-none transition-all ${
                  flashFields.includes('email') ? '[border-color:#f87171] focus:[border-color:#f87171] focus:[box-shadow:0_0_0_2px_#f87171]' : '[border-color:#0088ff] focus:[border-color:#0088ff] focus:[box-shadow:0_0_0_2px_#0088ff]'
                }`} 
                placeholder="Your E-Mail address" 
              />
              {emailError && <div className="text-sm text-red-500 mt-1">{emailError}</div>}
              {form.email.length >= 80 && !emailError && <div className="text-sm text-gray-500 mt-1">{form.email.length}/100</div>}
              {missingFields.includes('email') && <div className="text-red-600 font-bold text-xs absolute -bottom-5 right-2">This field is required.</div>}
            </div>
          </div>
          {/* Telephone (optional) */}
          <div className="col-span-1 md:col-span-1 flex flex-col">
            <label className="block font-bold mb-1 text-lg">Telephone</label>
            <div className="relative">
              <input name="telephone" value={form.telephone} onChange={handleChange} maxLength={20} className="w-full border-4 [border-color:#a3a3a3] rounded-2xl px-4 py-3 text-lg placeholder-gray-400 focus:outline-none focus:[border-color:#a3a3a3] focus:[box-shadow:0_0_0_2px_#a3a3a3] transition-all" placeholder="OPTIONAL - Your contact phonenumber" />
              {form.telephone.length >= 16 && <div className="text-sm text-gray-500 mt-1">{form.telephone.length}/20</div>}
              {missingFields.includes('telephone') && <div className="text-red-600 font-bold text-xs absolute -bottom-5 right-2">This field is required.</div>}
            </div>
          </div>
          {/* Company (optional) */}
          <div className="col-span-1 md:col-span-1 flex flex-col">
            <label className="block font-bold mb-1 text-lg">Company</label>
            <div className="relative">
              <input name="company" value={form.company} onChange={handleChange} maxLength={100} className="w-full border-4 [border-color:#a3a3a3] rounded-2xl px-4 py-3 text-lg placeholder-gray-400 focus:outline-none focus:[border-color:#a3a3a3] focus:[box-shadow:0_0_0_2px_#a3a3a3] transition-all" placeholder="OPTIONAL - Commissioned by ..." />
              {form.company.length >= 80 && <div className="text-sm text-gray-500 mt-1">{form.company.length}/100</div>}
              {missingFields.includes('company') && <div className="text-red-600 font-bold text-xs absolute -bottom-5 right-2">This field is required.</div>}
            </div>
          </div>
          {/* Project Type */}
          <div className="col-span-1 md:col-span-1 flex flex-col">
            <label className="block font-bold mb-1 text-lg">Project Type</label>
            <div className="relative w-full">
              <CustomSelect
                name="projectType"
                value={form.projectType}
                onChange={handleChange}
                onBlur={() => setFlashFields(prev => prev.filter(f => f !== 'projectType'))}
                options={PROJECT_TYPES}
                placeholder="Please select a project type..."
                required
                error={flashFields.includes('projectType')}
              />
              {missingFields.includes('projectType') && <div className="text-red-600 font-bold text-xs absolute -bottom-5 right-2">This field is required.</div>}
            </div>
          </div>
          {/* Sequence Length */}
          <div className="col-span-1 md:col-span-1 flex flex-col">
            <label className="block font-bold mb-1 text-lg">Sequence length</label>
            <div className="relative w-full">
              <CustomSelect
                name="sequenceLength"
                value={form.sequenceLength}
                onChange={handleChange}
                onBlur={() => setFlashFields(prev => prev.filter(f => f !== 'sequenceLength'))}
                options={SEQUENCE_LENGTHS}
                placeholder="Please select sequence length..."
                required
                error={flashFields.includes('sequenceLength')}
              />
              {missingFields.includes('sequenceLength') && <div className="text-red-600 font-bold text-xs absolute -bottom-5 right-2">This field is required.</div>}
            </div>
          </div>
          {/* Deadline */}
          <div className="col-span-1 md:col-span-1 flex flex-col">
            <label className="block font-bold mb-1 text-lg">Deadline</label>
            <div className="relative">
              <input
                name="deadline"
                type="date"
                value={form.deadline}
                onChange={handleChange}
                onBlur={() => { handleDeadlineBlur(); setFlashFields(prev => prev.filter(f => f !== 'deadline')); }}
                min={(function() {
                  const minDate = new Date();
                  minDate.setDate(minDate.getDate() + 12);
                  return minDate.toISOString().split('T')[0];
                })()}
                required
                className={`w-full border-4 rounded-2xl px-4 py-3 text-lg focus:outline-none focus:[border-color:#0088ff] focus:[box-shadow:0_0_0_2px_#0088ff] transition-all ${
                  flashFields.includes('deadline') ? '[border-color:#f87171] focus:[border-color:#f87171] focus:[box-shadow:0_0_0_2px_#f87171]' : '[border-color:#0088ff] focus:[border-color:#0088ff] focus:[box-shadow:0_0_0_2px_#0088ff]'
                } ${form.deadline ? 'text-black' : 'text-gray-400'}`}
              />
              {deadlineError && <div className="text-sm text-red-500 mt-1">{deadlineError}</div>}
              {missingFields.includes('deadline') && <div className="text-red-600 font-bold text-xs absolute -bottom-5 right-2">This field is required.</div>}
            </div>
          </div>
          {/* Any Assets */}
          <div className="col-span-1 md:col-span-1 flex flex-col">
            <label className="block font-bold mb-1 text-lg">Any Assets?</label>
            <div className="relative w-full">
              <CustomSelect
                name="assets"
                value={form.assets}
                onChange={handleChange}
                onBlur={() => setFlashFields(prev => prev.filter(f => f !== 'assets'))}
                options={ASSETS_OPTIONS}
                placeholder="Please select yes or no..."
                required
                error={flashFields.includes('assets')}
              />
              {missingFields.includes('assets') && <div className="text-red-600 font-bold text-xs absolute -bottom-5 right-2">This field is required.</div>}
            </div>
          </div>
          {/* Project Description */}
          <div className="col-span-1 md:col-span-2 flex flex-col items-center">
            <div className="w-full max-w-md relative">
              <label className="block font-bold mb-1 text-lg">Project description</label>
              <div className="relative w-full">
                <textarea 
                  name="description" 
                  value={form.description} 
                  onChange={handleChange} 
                  onBlur={() => setFlashFields(prev => prev.filter(f => f !== 'description'))}
                  required 
                  maxLength={2000} 
                  className={`w-full border-4 rounded-2xl px-4 py-3 text-lg min-h-[120px] placeholder-transparent focus:outline-none focus:[border-color:#0088ff] focus:[box-shadow:0_0_0_2px_#0088ff] transition-all resize-y bg-transparent ${
                    flashFields.includes('description') ? '[border-color:#f87171] focus:[border-color:#f87171] focus:[box-shadow:0_0_0_2px_#f87171]' : '[border-color:#0088ff] focus:[border-color:#0088ff] focus:[box-shadow:0_0_0_2px_#0088ff]'
                  }`} 
                  placeholder="A detailed description about your project" 
                  id="project-description-textarea"
                />
                {form.description === '' && (
                  <span className="pointer-events-none absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-400 text-lg select-none whitespace-pre-line text-center w-[90%]">
                    A detailed description about your project
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between mt-1">
                <div className="text-sm text-gray-500">{form.description.length}/2000</div>
                {missingFields.includes('description') && <div className="text-red-600 font-bold text-xs ml-2">This field is required.</div>}
              </div>
            </div>
          </div>
          {/* Submit Button & Confirmation */}
          <div className="col-span-1 md:col-span-2 flex flex-col items-center mt-0">
            <p className="text-2xl font-black mb-0 leading-tight">All set?</p>
            <p className="text-2xl font-black -mt-2 mb-0.5 leading-tight">Let´s bring your project to life</p>
            <div className="text-sm text-gray-500 mt-2">Send it off!</div>
            <button type="submit" disabled={submitting} className="w-20 h-20 flex items-center justify-center transition-all mb-2 disabled:opacity-60 disabled:cursor-not-allowed shadow-none bg-transparent border-none p-0">
              <Image src="/contact/circle-arrow-up.png" alt="Send" width={56} height={56} />
            </button>
            {success && <div className="mt-4 text-green-600 font-bold text-xl">Email sent successfully!</div>}
            {error && <div className="mt-4 text-red-600 font-bold text-xl">{error}</div>}
          </div>
        </form>
      </div>
    </div>
  );
} 