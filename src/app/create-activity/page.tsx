'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Header, Footer } from '@/components/layout';
import { Loader2, ArrowLeft, Calendar, MapPin, DollarSign, Users, Clock, Info } from 'lucide-react';
import { AddressSearchInput, LocationPicker } from '@/components/map';

const ACTIVITY_CATEGORIES = [
  { value: 'class', label: 'Clase', icon: '📚', description: 'Yoga, baile, cocina...' },
  { value: 'tour', label: 'Tour', icon: '🚶', description: 'Café, ciudad, naturaleza...' },
  { value: 'experience', label: 'Experiencia', icon: '✨', description: 'Degustación, taller...' },
  { value: 'entertainment', label: 'Entretenimiento', icon: '🎭', description: 'Show, espectáculo...' },
  { value: 'wellness', label: 'Bienestar', icon: '🧘', description: 'Spa, meditación...' },
];

const SKILL_LEVELS = [
  { value: 'all_levels', label: 'Todos los niveles' },
  { value: 'beginner', label: 'Principiante' },
  { value: 'intermediate', label: 'Intermedio' },
  { value: 'advanced', label: 'Avanzado' },
];

const DAYS_OF_WEEK = [
  { value: 'monday', label: 'Lun' },
  { value: 'tuesday', label: 'Mar' },
  { value: 'wednesday', label: 'Mié' },
  { value: 'thursday', label: 'Jue' },
  { value: 'friday', label: 'Vie' },
  { value: 'saturday', label: 'Sáb' },
  { value: 'sunday', label: 'Dom' },
];

export default function CreateActivityPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    providerName: '',
    providerContact: '',
    address: '',
    lat: 0,
    lng: 0,
    cityId: 'bogota',
    schedule: '',
    scheduleDays: [] as string[],
    scheduleTime: '',
    duration: '',
    capacity: '',
    price: '',
    isFree: true,
    skillLevel: '',
    imageUrl: '',
  });

  const handleAddressSelect = useCallback((lat: number, lng: number, address: string) => {
    setFormData(prev => ({ ...prev, lat, lng, address }));
  }, []);

  const handleLocationChange = useCallback((lat: number, lng: number, address?: string) => {
    setFormData(prev => ({
      ...prev,
      lat,
      lng,
      ...(address ? { address } : {}),
    }));
  }, []);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        </div>
      </div>
    );
  }

  if (!user) {
    router.push('/login');
    return null;
  }

  const updateField = (field: string, value: string | boolean | string[] | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/activities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          capacity: formData.capacity ? parseInt(formData.capacity) : null,
          price: formData.isFree ? 0 : parseFloat(formData.price),
        }),
      });

      const data = await response.json();

      if (data.success) {
        router.push(`/activity/${data.data.id}`);
      } else {
        alert(data.error || 'Error al crear la actividad');
      }
    } catch (error) {
      console.error('Error creating activity:', error);
      alert('Error al crear la actividad. Por favor intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleDay = (day: string) => {
    const days = formData.scheduleDays.includes(day)
      ? formData.scheduleDays.filter(d => d !== day)
      : [...formData.scheduleDays, day];
    updateField('scheduleDays', days);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      <main className="max-w-2xl mx-auto px-4 py-8" data-testid="create-activity-page-container">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 mb-6"
          data-testid="back-link"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al dashboard
        </Link>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center">
              <Calendar className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white" data-testid="create-activity-title">
                Crear Actividad
              </h1>
              <p className="text-gray-500 dark:text-gray-400">
                Ofrece clases, tours o experiencias recurrentes
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <section>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Información Básica
                </h2>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Cuéntanos sobre tu actividad
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Título de la actividad *
                  </label>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                    Un nombre claro que diga qué van a hacer los participantes
                  </p>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => updateField('title', e.target.value)}
                    placeholder="Clase de salsa para principiantes"
                    required
                    maxLength={100}
                    data-testid="activity-title-input"
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Descripción *
                  </label>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                    Describe qué incluye, qué aprenderán, qué llevar
                  </p>
                  <textarea
                    value={formData.description}
                    onChange={(e) => updateField('description', e.target.value)}
                    rows={4}
                    placeholder="Describe qué harán los participantes..."
                    required
                    maxLength={1000}
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <p className="text-xs text-gray-400 mt-1">{formData.description.length}/1000 caracteres</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Categoría *
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {ACTIVITY_CATEGORIES.map((cat) => (
                      <button
                        key={cat.value}
                        type="button"
                        onClick={() => updateField('category', cat.value)}
                        className={`p-3 rounded-xl border-2 text-center transition-all ${
                          formData.category === cat.value
                            ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/30 dark:border-amber-400 shadow-sm'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                        }`}
                      >
                        <span className="text-2xl block">{cat.icon}</span>
                        <p className="text-sm font-medium mt-1 text-gray-900 dark:text-gray-100">{cat.label}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{cat.description}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Provider */}
            <section className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <div className="flex items-center gap-2 mb-1">
                <Users className="w-5 h-5 text-gray-400" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Proveedor / Instructor
                </h2>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                ¿Quién ofrece esta actividad?
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Nombre del proveedor/instructor *
                  </label>
                  <input
                    type="text"
                    value={formData.providerName}
                    onChange={(e) => updateField('providerName', e.target.value)}
                    placeholder="María García"
                    required
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Contacto *
                  </label>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                    Email o teléfono para que los interesados puedan contactarte
                  </p>
                  <input
                    type="text"
                    value={formData.providerContact}
                    onChange={(e) => updateField('providerContact', e.target.value)}
                    placeholder="maria@ejemplo.com o +57 300 123 4567"
                    required
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>
            </section>

            {/* Location */}
            <section className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <div className="flex items-center gap-2 mb-1">
                <MapPin className="w-5 h-5 text-gray-400" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Ubicación
                </h2>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                ¿Dónde se realizará la actividad?
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Dirección *
                  </label>
                  <AddressSearchInput
                    value={formData.address}
                    onChange={(value) => updateField('address', value)}
                    onLocationSelect={handleAddressSelect}
                    placeholder="Buscar una dirección..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Seleccionar en mapa
                  </label>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                    Haz clic en el mapa para ajustar la ubicación exacta
                  </p>
                  <LocationPicker
                    lat={formData.lat}
                    lng={formData.lng}
                    onLocationChange={handleLocationChange}
                  />
                </div>
              </div>
            </section>

            {/* Schedule */}
            <section className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="w-5 h-5 text-gray-400" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Horario
                </h2>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                ¿Cuándo se realiza la actividad?
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Días de la semana
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {DAYS_OF_WEEK.map((day) => (
                      <button
                        key={day.value}
                        type="button"
                        onClick={() => toggleDay(day.value)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          formData.scheduleDays.includes(day.value)
                            ? 'bg-indigo-600 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        {day.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Hora *
                    </label>
                    <input
                      type="time"
                      value={formData.scheduleTime}
                      onChange={(e) => updateField('scheduleTime', e.target.value)}
                      required
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Duración
                    </label>
                    <input
                      type="text"
                      value={formData.duration}
                      onChange={(e) => updateField('duration', e.target.value)}
                      placeholder="2 horas"
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Descripción del horario *
                  </label>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                    Resumen del horario para mostrar a los usuarios
                  </p>
                  <input
                    type="text"
                    value={formData.schedule}
                    onChange={(e) => updateField('schedule', e.target.value)}
                    placeholder="Todos los martes y jueves a las 7pm"
                    required
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>
            </section>

            {/* Price & Capacity */}
            <section className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <div className="flex items-center gap-2 mb-1">
                <DollarSign className="w-5 h-5 text-gray-400" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Precio y Capacidad
                </h2>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Configura el precio y límite de participantes
              </p>

              <div className="space-y-4">
                <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <input
                    type="checkbox"
                    checked={formData.isFree}
                    onChange={(e) => updateField('isFree', e.target.checked)}
                    className="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <div>
                    <span className="text-gray-700 dark:text-gray-300 font-medium">Actividad gratuita</span>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Marcar si no se cobra por participar</p>
                  </div>
                </label>

                {!formData.isFree && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Precio (COP) *
                    </label>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                      Precio por persona en pesos colombianos
                    </p>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => updateField('price', e.target.value)}
                      placeholder="50000"
                      required={!formData.isFree}
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Capacidad máxima
                  </label>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                    Número máximo de participantes (dejar vacío si es ilimitado)
                  </p>
                  <input
                    type="number"
                    value={formData.capacity}
                    onChange={(e) => updateField('capacity', e.target.value)}
                    placeholder="20"
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Nivel de habilidad
                  </label>
                  <select
                    value={formData.skillLevel}
                    onChange={(e) => updateField('skillLevel', e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Selecciona el nivel</option>
                    {SKILL_LEVELS.map((level) => (
                      <option key={level.value} value={level.value}>{level.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </section>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                {isSubmitting ? 'Creando...' : 'Crear Actividad'}
              </button>
            </div>
          </form>
        </div>

        <div className="mt-6 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                Tu actividad será visible inmediatamente
              </p>
              <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                A diferencia de los eventos, las actividades se publican automáticamente.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
