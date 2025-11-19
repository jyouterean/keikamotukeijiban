'use client';

import { useState } from 'react';
import { ProjectMessage } from '../types';

interface ProjectFormProps {
  nickname: string;
  onSubmit: (message: ProjectMessage) => void;
}

export default function ProjectForm({ nickname, onSubmit }: ProjectFormProps) {
  const [formData, setFormData] = useState({
    projectName: '',
    phoneNumber: '',
    price: '',
    description: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.projectName.trim()) {
      newErrors.projectName = '案件名を入力してください';
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = '電話番号を入力してください';
    } else if (!/^[0-9-]+$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = '正しい電話番号を入力してください';
    }

    if (!formData.price.trim()) {
      newErrors.price = '料金を入力してください';
    }

    if (!formData.description.trim()) {
      newErrors.description = '概要を入力してください';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const message: ProjectMessage = {
      id: Date.now().toString(),
      nickname,
      timestamp: Date.now(),
      tab: '案件',
      projectName: formData.projectName.trim(),
      phoneNumber: formData.phoneNumber.trim(),
      price: formData.price.trim(),
      description: formData.description.trim(),
    };

    onSubmit(message);

    // Reset form
    setFormData({
      projectName: '',
      phoneNumber: '',
      price: '',
      description: '',
    });
  };

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-gray-200 bg-gray-50 px-4 py-3">
        <h2 className="font-semibold text-gray-800">案件を投稿</h2>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-1 flex-col overflow-y-auto p-4">
        <div className="space-y-4">
          <div>
            <label htmlFor="projectName" className="mb-1 block text-sm font-medium text-gray-700">
              案件名 (必須)
            </label>
            <input
              type="text"
              id="projectName"
              value={formData.projectName}
              onChange={(e) => handleChange('projectName', e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder="例: 都内配送"
            />
            {errors.projectName && (
              <p className="mt-1 text-xs text-red-600">{errors.projectName}</p>
            )}
          </div>

          <div>
            <label htmlFor="phoneNumber" className="mb-1 block text-sm font-medium text-gray-700">
              電話番号 (必須)
            </label>
            <input
              type="tel"
              id="phoneNumber"
              value={formData.phoneNumber}
              onChange={(e) => handleChange('phoneNumber', e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder="例: 090-1234-5678"
            />
            {errors.phoneNumber && (
              <p className="mt-1 text-xs text-red-600">{errors.phoneNumber}</p>
            )}
          </div>

          <div>
            <label htmlFor="price" className="mb-1 block text-sm font-medium text-gray-700">
              料金 (必須)
            </label>
            <input
              type="text"
              id="price"
              value={formData.price}
              onChange={(e) => handleChange('price', e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder="例: 15,000円/日"
            />
            {errors.price && (
              <p className="mt-1 text-xs text-red-600">{errors.price}</p>
            )}
          </div>

          <div>
            <label htmlFor="description" className="mb-1 block text-sm font-medium text-gray-700">
              概要 (必須)
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={6}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder="案件の詳細を入力してください"
            />
            {errors.description && (
              <p className="mt-1 text-xs text-red-600">{errors.description}</p>
            )}
          </div>
        </div>

        <div className="mt-6">
          <button
            type="submit"
            className="w-full rounded-lg bg-indigo-600 px-4 py-3 font-semibold text-white transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            投稿する
          </button>
        </div>
      </form>
    </div>
  );
}

