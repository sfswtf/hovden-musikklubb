import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Menu, X, Facebook, Instagram, Mail, MapPin, Music2 } from 'lucide-react';
import { MembershipForm } from './components/MembershipForm';
import { AdminDashboard } from './components/AdminDashboard';
import { ProtectedRoute } from './components/ProtectedRoute';
import SupabaseTest from './components/SupabaseTest';
import { VideoGallery } from './components/VideoGallery';
import { ContactForm } from './components/ContactForm';
import { Navigation } from './components/Navigation';
import { supabase } from './lib/supabase';
import type { Database } from './types/supabase';
import { SocialMediaGallery } from './components/SocialMediaGallery';
import { AdminLogin } from './components/AdminLogin';
import { HeroSkeleton, EventCardSkeleton } from './components/SkeletonLoader';
import { AnimatedNavbar } from './components/animations/AnimatedNavbar';
import { AnimatedFooter } from './components/animations/AnimatedFooter';
import { ParallaxHero } from './components/animations/ParallaxHero';
import { AnimatedLogo } from './components/animations/AnimatedLogo';
import { AnimatedButton } from './components/animations/AnimatedButton';
import { AnimatedSection } from './components/animations/AnimatedSection';
import { AnimatedCard } from './components/animations/AnimatedCard';
import { AnimatedText } from './components/animations/AnimatedText';
import { EventModal } from './components/EventModal';
import { ScrollToTop } from './components/ScrollToTop';
import { MusikkfestPage } from './components/MusikkfestPage';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen bg-stone-100">
        <AnimatedNavbar>
          <Navigation />
        </AnimatedNavbar>
        
        {/* Main Content */}
        <main className="pt-16 md:pt-20">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/musikkfest" element={<MusikkfestPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/membership" element={<MembershipPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
            <Route path="/login" element={<AdminLogin />} />
            <Route path="/test" element={<SupabaseTest />} />
          </Routes>
        </main>

        <AnimatedFooter>
          <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <div className="flex items-center gap-2 text-[#f2e1c5]">
                  <Music2 size={24} />
                  <span className="font-bold text-xl">HOVDEN MUSIKKLUBB</span>
                </div>
                <p className="mt-4 text-gray-300">
                  Der fjellene møter musikken.
                </p>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-4">Adresse</h3>
                <div className="flex items-start gap-2 text-gray-300">
                  <MapPin className="mt-1 flex-shrink-0" size={18} />
                  <p>Hovden<br />4755 Hovden<br />Norge</p>
                </div>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-4">Følg Oss</h3>
                <div className="flex space-x-6">
                  <a href="https://www.instagram.com/hovdenmusikklubb/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-300">
                    <Instagram size={24} />
                  </a>
                  <Link to="/contact" className="text-gray-400 hover:text-gray-300">
                    <Mail size={24} />
                  </Link>
                </div>
              </div>
            </div>
            <div className="mt-8 border-t border-gray-700 pt-8 text-center">
              <p className="text-gray-400">
                &copy; 2025 Hovden Musikklubb. Alle rettigheter reservert.
                <Link to="/login" className="ml-4 text-gray-500 hover:text-gray-400 text-sm">
                  Admin
                </Link>
              </p>
              <p className="text-gray-400 text-sm mt-4">
                Created by Sebastian Saethre - Need a site like this?{' '}
                <a href="mailto:sebastian.saethre@gmail.com" className="text-[#1d4f4d] underline hover:text-[#1d4f4d] focus:outline-none focus:ring-2 focus:ring-[#1d4f4d] rounded">
                  Contact me
                </a>
              </p>
            </div>
          </div>
        </AnimatedFooter>
      </div>
    </Router>
  );
}

function HomePage() {
  const [nextEvent, setNextEvent] = useState<Database['public']['Tables']['events']['Row'] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNextEvent() {
      try {
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .eq('status', 'published')
          .gte('event_date', new Date().toISOString())
          .order('event_date', { ascending: true })
          .limit(1)
          .single();

        if (error && error.code !== 'PGRST116') throw error;
        setNextEvent(data);
      } catch (error) {
        console.error('Error fetching next event:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchNextEvent();
  }, []);

  if (loading) {
    return <HeroSkeleton />;
  }

  return (
    <>
      {/* Hero Section */}
      <ParallaxHero imageUrl="/images/hero-background.jpg">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-start items-center pt-20 pb-8">
          <AnimatedLogo
            src="/images/logo.jpg"
            alt="Hovden Musikklubb Logo"
            className="w-[20rem] sm:w-[28rem] md:w-[32rem] h-auto mb-8 rounded-full shadow-lg border-4 border-[#f2e1c5]"
          />
          <div className="text-center mx-auto max-w-3xl">
            <p className="text-xl md:text-2xl text-gray-300 mb-12 leading-relaxed">
              Der fjellånden møter musikksjelen.<br />
              Bli med oss på intime konserter i vårt unike lokale.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-4xl mx-auto">
              <Link to="/events" className="w-full transform transition-transform hover:scale-105">
                <AnimatedButton variant="primary" className="w-full min-h-[80px] flex items-center justify-center text-center px-6 py-4 text-lg sm:text-xl leading-snug bg-[#1d4f4d] hover:bg-[#2a6f6d]">
                  <span className="block w-full max-w-xs mx-auto">Program<br className="hidden sm:block" /> 2025</span>
                </AnimatedButton>
              </Link>
              <Link to="/musikkfest" className="w-full transform transition-transform hover:scale-105">
                <AnimatedButton variant="secondary" className="w-full min-h-[80px] flex items-center justify-center text-center px-6 py-4 text-lg sm:text-xl leading-snug bg-[#e6b800] hover:bg-[#ffcc00]">
                  <span className="block w-full max-w-xs mx-auto">Hovden<br className="hidden sm:block" /> Musikkfest 2025</span>
                </AnimatedButton>
              </Link>
              <Link to="/membership" className="w-full transform transition-transform hover:scale-105">
                <AnimatedButton variant="secondary" className="w-full min-h-[80px] flex items-center justify-center text-center px-6 py-4 text-lg sm:text-xl leading-snug bg-[#f2e1c5] hover:bg-[#fff0d9] text-stone-900">
                  <span className="block w-full max-w-xs mx-auto">Bli Medlem</span>
                </AnimatedButton>
              </Link>
            </div>
          </div>
        </div>
      </ParallaxHero>

      {/* Featured Section */}
      <div className="bg-white py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto space-y-6">
            <Link 
              to="/events" 
              className="bg-[#1d4f4d] rounded-lg p-8 transition-transform hover:scale-105 flex flex-col justify-center items-center text-center min-h-[180px] shadow-md"
            >
              <h2 className="mt-6 text-3xl font-bold tracking-tight text-white">
                {loading ? 'Laster...' : (nextEvent ? 'Neste Arrangement' : 'Ingen planlagte arrangementer')}
              </h2>
              <p className="mt-4 text-lg text-white">
                {nextEvent ? (
                  <>
                    {nextEvent.title} - {new Date(nextEvent.event_date).toLocaleString('no-NO', {
                      timeZone: 'Europe/Oslo',
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </>
                ) : (
                  'Følg med for kommende arrangementer'
                )}
              </p>
            </Link>
            <Link 
              to="/musikkfest" 
              className="bg-[#e6b800] rounded-lg p-8 transition-transform hover:scale-105 flex flex-col justify-center items-center text-center min-h-[180px] shadow-md"
            >
              <h2 className="mt-6 text-3xl font-bold tracking-tight text-white">Hovden Musikkfest 2025</h2>
              <p className="mt-4 text-lg text-white">Opplev årets store musikkbegivenhet på Hovden! Se program og kjøp billetter.</p>
            </Link>
            <Link 
              to="/membership" 
              className="bg-stone-100 rounded-lg p-8 transition-transform hover:scale-105 flex flex-col justify-center items-center text-center min-h-[180px] shadow-md"
            >
              <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">Medlemskap</h2>
              <p className="mt-4 text-lg text-gray-500">
                Bli medlem for eksklusiv tilgang til intime konserter og spesielle arrangementer.
              </p>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

function EventsPage() {
  const [events, setEvents] = useState<Database['public']['Tables']['events']['Row'][]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<Database['public']['Tables']['events']['Row'] | null>(null);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .eq('status', 'published')
          .order('event_date', { ascending: true });

        if (error) throw error;
        setEvents(data || []);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, []);

  // Group events by month
  const eventsByMonth = events.reduce((acc, event) => {
    const date = new Date(event.event_date);
    const monthKey = date.toLocaleString('no-NO', {
      timeZone: 'Europe/Oslo',
      month: 'long'
    });
    
    if (!acc[monthKey]) {
      acc[monthKey] = [];
    }
    acc[monthKey].push(event);
    return acc;
  }, {} as Record<string, Database['public']['Tables']['events']['Row'][]>);

  // Sort months chronologically
  const sortedMonths = Object.keys(eventsByMonth).sort((a, b) => {
    const dateA = new Date(eventsByMonth[a][0].event_date);
    const dateB = new Date(eventsByMonth[b][0].event_date);
    return dateA.getTime() - dateB.getTime();
  });

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, index) => (
            <EventCardSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Program 2025 Banner Image */}
      <img src="/images/program2025.png" alt="Program 2025" className="w-full max-w-4xl mx-auto rounded-lg mb-8 object-cover" style={{height: 'auto'}} />
      <h1 className="text-3xl font-bold mb-8">Program 2025</h1>
      {events.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          Ingen arrangementer planlagt for øyeblikket.
        </div>
      ) : (
        <div className="space-y-12">
          {sortedMonths.map(month => (
            <div key={month} className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 border-b-2 border-[#1d4f4d] pb-2">
                {month}
              </h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {month === 'oktober' ? (
                  <>
                    <Link to="/musikkfest" className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow flex flex-col">
                      <div className="w-full h-48 bg-stone-100 flex items-center justify-center flex-shrink-0">
                        <img className="w-full h-48 object-contain" src="/images/logo.jpg" alt="Hovden Musikkfest" />
                      </div>
                      <div className="p-6 flex-grow flex flex-col">
                        <h3 className="text-xl font-bold mb-2">Hovden Musikkfest</h3>
                        <p className="text-gray-600 mb-4">Klikk for å se festivalprogrammet for oktober.</p>
                      </div>
                    </Link>
                    {/* Show Grendedag as a normal event card in October */}
                    {eventsByMonth[month].filter(event => event.title === 'Grendedag').map(event => (
                      <div
                        key={event.id}
                        className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow flex flex-col"
                        onClick={() => setSelectedEvent(event)}
                      >
                        {event.image_url && (
                          <div className="w-full h-48 bg-stone-100 flex items-center justify-center flex-shrink-0">
                            <img
                              className="w-full h-48 object-contain"
                              src={event.image_url}
                              alt={event.title}
                            />
                          </div>
                        )}
                        <div className="p-6 flex-grow flex flex-col">
                          <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                          <p className="text-gray-600 mb-4">
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
                          <p className="text-gray-700 line-clamp-3 mb-4">{event.description}</p>
                          {event.location && (
                            <p className="text-gray-600 mt-auto">
                              <span className="font-semibold">Sted:</span> {event.location}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </>
                ) :
                  eventsByMonth[month].map(event => (
                    <div
                      key={event.id}
                      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow flex flex-col"
                      onClick={() => setSelectedEvent(event)}
                    >
                      {event.image_url && (
                        <div className="w-full h-48 bg-stone-100 flex items-center justify-center flex-shrink-0">
                          <img
                            className="w-full h-48 object-contain"
                            src={event.image_url}
                            alt={event.title}
                          />
                        </div>
                      )}
                      <div className="p-6 flex-grow flex flex-col">
                        <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                        <p className="text-gray-600 mb-4">
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
                        <p className="text-gray-700 line-clamp-3 mb-4">{event.description}</p>
                        {event.location && (
                          <p className="text-gray-600 mt-auto">
                            <span className="font-semibold">Sted:</span> {event.location}
                          </p>
                        )}
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>
          ))}
        </div>
      )}
      {selectedEvent && (
        <EventModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </div>
  );
}

function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        <img
          src="/images/logo.jpg"
          alt="Hovden Musikklubb Logo"
          className="w-64 h-64 mx-auto mb-8 rounded-full"
          style={{
            filter: 'contrast(1.1)'
          }}
        />
        <h1 className="text-3xl font-bold mb-8">Om Oss</h1>
        <div className="prose max-w-none text-left">
          <p className="mb-6">
            Hovden Musikklubb ble stiftet i år av en gjeng med et felles ønske. Å skape unike musikalske opplevelser. Først og fremst ønsker vi å skape et tilbud for alle som elsker musikk, som tør å bli utfordret og har et hjerte for Hovden. Vi ønsker å dyrke det særegne fellesskapet som alltid har eksistert på Hovden, og som er en av grunnene til at vi velger å bo her oppe i fjellheimen. Vi booker alle sjangere, og er forankret i Setesdalens rike musikalske tradisjon.
          </p>
          <p className="mb-6">
            Som et godt måltid, trenger en bra konsert gode ingredienser. Et lyttende publikum, unike omgivelser, god lyd og ikke minst musikere som har noe på hjertet. Vi ønsker å skape et rom der det er godt å være for både utøvere og de som lytter. Et rom der tankene kan vandre, beina danse og musikalsk kvalitet og fellesskap står fjellstøtt i en ellers urolig verden. Et rom fritt for mobiltelefoner og likes, der det er trygt å gi seg hen og leve i nuet.
          </p>
          <p className="mb-6">
            Hovden Musikkklubb drives av medlemmene, for medlemmene. Vi arrangerer noen få kommersielle konserter i løpet av året, som finansierer aktiviteten resten av året. Som medlem får du være med på alt som skjer, både som publikum og frivillig hvis du ønsker det. Alle midlene i klubben går til å skape unike opplevelser for medlemmene, sosialt og musikalsk. Intimkonserter, korkveld på pub eller hodelykt-konsert på en fjelltopp i oktober? Det er i grunn kun fantasien som setter grenser.
          </p>
        </div>
      </div>
    </div>
  );
}

function MembershipPage() {
  const [showForm, setShowForm] = useState(false);
  return (
    <AnimatedSection>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col items-center justify-center">
        <img
          src="/images/logo.jpg"
          alt="Hovden Musikklubb Logo"
          className="w-[20rem] h-[20rem] mx-auto mb-8 rounded-full"
          style={{ filter: 'contrast(1.1)' }}
        />
        {/* Benefits Section */}
        <AnimatedCard className="w-full max-w-2xl mx-auto mt-2 flex flex-col items-center justify-center text-center">
          <AnimatedText text="Medlemsfordeler" className="text-2xl font-bold mb-4" />
          <ul className="mb-8 text-gray-700 space-y-3 text-lg flex flex-col items-center justify-center">
            <li className="flex items-center gap-3">
              <Music2 size={22} className="text-[#1d4f4d]" />
              <span>Prioritert tilgang til billetter</span>
            </li>
            <li className="flex items-center gap-3">
              <Music2 size={22} className="text-[#1d4f4d]" />
              <span>Eksklusive medlemsarrangementer</span>
            </li>
            <li className="flex items-center gap-3">
              <Music2 size={22} className="text-[#1d4f4d]" />
              <span>Støtt lokal musikkultur</span>
            </li>
          </ul>
          {!showForm && (
            <button 
              onClick={() => setShowForm(true)}
              className="bg-[#1d4f4d] text-white py-4 px-8 text-lg rounded-lg hover:bg-[#1d4f4d] transform hover:scale-105 transition-transform w-full max-w-xs mx-auto mb-2"
            >
              Bli Medlem Nå
            </button>
          )}
          {/* Membership Form */}
          {showForm && (
            <div className="w-full max-w-2xl mx-auto">
              <MembershipForm />
            </div>
          )}
        </AnimatedCard>
      </div>
    </AnimatedSection>
  );
}

function GalleryPage() {
  return (
    <AnimatedSection>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <AnimatedCard className="mb-12 p-10">
          <div className="flex flex-col items-center justify-center text-center">
            <AnimatedText text="Galleri" className="text-4xl font-bold mb-4 text-gray-900 mx-auto" delay={0.33} />
            <AnimatedText text="Utforsk høydepunkter fra våre arrangementer og konserter. Her finner du videoer og bilder som fanger den unike stemningen i Hovden Musikklubb." className="text-lg text-gray-600 max-w-3xl mx-auto mb-8" delay={0.33} />
          </div>
        </AnimatedCard>
        <div className="space-y-12">
          <SocialMediaGallery />
        </div>
      </div>
    </AnimatedSection>
  );
}

function ContactPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold mb-8">Kontakt Oss</h1>
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-bold mb-4">Ta Kontakt</h2>
            <p className="text-lg text-gray-700 mb-4">
              Har du spørsmål? Vi vil gjerne høre fra deg. Send oss en melding, så svarer vi så snart som mulig.
            </p>
            <div className="space-y-4">
              <p className="flex items-center text-lg text-gray-700">
                <MapPin className="mr-2" size={20} />
                Hovden, 4755 Hovden, Norge
              </p>
              <p className="flex items-center text-lg text-gray-700">
                <Mail className="mr-2" size={20} />
                info@hovdenmusikklubb.no
              </p>
            </div>
          </div>
          <ContactForm />
        </div>
      </div>
    </div>
  );
}

export default App;