'use client';

import { useState } from 'react';
import { Calendar, Repeat, AlertCircle, Check, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface CreateSeriesFormProps {
  templateEventId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export function CreateSeriesForm({ templateEventId, onSuccess, onCancel }: CreateSeriesFormProps) {
  useAuth(); // Keep hook for auth context
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    frequency: 'weekly',
    interval: 1,
    dayOfWeek: 1,
    dayOfMonth: 1,
    startDate: '',
    endDate: '',
    occurrences: 10,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.startDate) {
      setError('Por favor completa los campos requeridos');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/series', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          startDate: new Date(formData.startDate).toISOString(),
          endDate: formData.endDate ? new Date(formData.endDate).toISOString() : undefined,
          templateEventId,
        }),
      });

      const data = await response.json();

      if (data.success) {
        onSuccess();
      } else {
        setError(data.error || 'Error al crear la serie');
      }
    } catch {
      setError('Error al crear la serie');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
          <Repeat className="w-5 h-5 text-indigo-600" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Crear Serie de Eventos</h2>
          <p className="text-sm text-gray-500">Repetir este evento automáticamente</p>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre de la serie *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Ej: Taller de Cocina Semanal"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descripción
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Describe la serie de eventos..."
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Frecuencia *
            </label>
            <select
              value={formData.frequency}
              onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="daily">Diario</option>
              <option value="weekly">Semanal</option>
              <option value="biweekly">Quincenal</option>
              <option value="monthly">Mensual</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cada
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={1}
                max={12}
                value={formData.interval}
                onChange={(e) => setFormData({ ...formData, interval: parseInt(e.target.value) || 1 })}
                className="w-20 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <span className="text-gray-500">
                {formData.frequency === 'daily' ? 'día(s)' :
                 formData.frequency === 'weekly' ? 'semana(s)' :
                 formData.frequency === 'biweekly' ? 'quincena(s)' : 'mes(es)'}
              </span>
            </div>
          </div>
        </div>

        {formData.frequency === 'weekly' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Día de la semana *
            </label>
            <select
              value={formData.dayOfWeek}
              onChange={(e) => setFormData({ ...formData, dayOfWeek: parseInt(e.target.value) })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value={0}>Domingo</option>
              <option value={1}>Lunes</option>
              <option value={2}>Martes</option>
              <option value={3}>Miércoles</option>
              <option value={4}>Jueves</option>
              <option value={5}>Viernes</option>
              <option value={6}>Sábado</option>
            </select>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha de inicio *
            </label>
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha de fin
            </label>
            <input
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Número de repeticiones
          </label>
          <input
            type="number"
            min={2}
            max={100}
            value={formData.occurrences}
            onChange={(e) => setFormData({ ...formData, occurrences: parseInt(e.target.value) || 10 })}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            Se crearán {formData.occurrences} eventos en la serie
          </p>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-3 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Creando...
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                Crear Serie
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

interface SeriesCardProps {
  series: {
    id: string;
    name: string;
    description?: string;
    frequency: string;
    stats?: {
      total: number;
      upcoming: number;
      past: number;
    };
  };
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function SeriesCard({ series, onView, onEdit, onDelete: _ }: SeriesCardProps) {
  const getFrequencyLabel = () => {
    switch (series.frequency) {
      case 'daily': return 'Diario';
      case 'weekly': return 'Semanal';
      case 'biweekly': return 'Quincenal';
      case 'monthly': return 'Mensual';
      default: return series.frequency;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
          <Repeat className="w-6 h-6 text-indigo-600" />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">{series.name}</h3>
          {series.description && (
            <p className="text-sm text-gray-500 line-clamp-1 mt-1">{series.description}</p>
          )}
          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {getFrequencyLabel()}
            </span>
            {series.stats && (
              <>
                <span>{series.stats.total} eventos</span>
                <span>{series.stats.upcoming} próximos</span>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onView}
            className="p-2 text-gray-400 hover:text-indigo-600 transition-colors"
          >
            <Calendar className="w-5 h-5" />
          </button>
          <button
            onClick={onEdit}
            className="p-2 text-gray-400 hover:text-indigo-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
