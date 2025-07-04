import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import type { Database } from '../types/supabase';

type Event = Database['public']['Tables']['events']['Row'];

interface EventModalProps {
  event: Event;
  onClose: () => void;
}

export function EventModal({ event, onClose }: EventModalProps) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onClose();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold text-gray-900">{event.title}</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
          </div>
          
          {event.image_url && (
            <div className="w-full h-64 bg-stone-100 flex items-center justify-center mb-6 rounded-lg">
              <img
                src={event.image_url}
                alt={event.title}
                className="w-full h-64 object-contain"
              />
            </div>
          )}
          
          <div className="space-y-4">
            <p className="text-gray-600">
              {new Date(event.event_date).toLocaleString('no-NO', {
                timeZone: 'Europe/Oslo',
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
            
            <div className="prose max-w-none">
              {event.description.split('\n').map((paragraph, index) => (
                <p key={index} className="mb-4">{paragraph}</p>
              ))}
            </div>
            
            {event.location && (
              <p className="text-gray-600">
                <span className="font-semibold">Sted:</span> {event.location}
              </p>
            )}
            
            {event.ticket_price && (
              <p className="text-gray-600">
                <span className="font-semibold">Pris:</span> {event.ticket_price} kr
              </p>
            )}
            
            {event.title && event.title.toLowerCase().includes('tønes') ? (
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <a
                  href="/membership"
                  className="inline-block bg-[#1d4f4d] text-white px-6 py-3 rounded-md hover:bg-[#2a6f6d] text-center"
                >
                  Bli Medlem
                </a>
                {event.tickets_url && (
                  <a
                    href={event.tickets_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-[#e6b800] text-black px-6 py-3 rounded-md hover:bg-[#ffcc00] text-center"
                  >
                    Kjøp Billetter
                  </a>
                )}
              </div>
            ) : (
              event.tickets_url && (
                <a
                  href={event.tickets_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-[#1d4f4d] text-white px-6 py-3 rounded-md hover:bg-[#2a6f6d] mt-4"
                >
                  Kjøp Billetter
                </a>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 