import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { toast } from 'react-hot-toast';
import { Mail, Save, Trash2 } from 'lucide-react';

type MessageStatus = 'new' | 'in_progress' | 'completed';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
  admin_notes: string | null;
  status: MessageStatus;
}

export function ContactMessages() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingNotes, setEditingNotes] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Initialize editing notes with current values
      const notesState: { [key: string]: string } = {};
      data?.forEach(message => {
        notesState[message.id] = message.admin_notes || '';
      });
      setEditingNotes(notesState);
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Could not fetch messages');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: MessageStatus) => {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      toast.success('Status updated');
      fetchMessages();
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Could not update status');
    }
  };

  const updateAdminNotes = async (id: string) => {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .update({ admin_notes: editingNotes[id] })
        .eq('id', id);

      if (error) throw error;
      toast.success('Notes updated');
      fetchMessages();
    } catch (error) {
      console.error('Error updating notes:', error);
      toast.error('Could not update notes');
    }
  };

  const handleReply = (email: string, name: string) => {
    const subject = `Re: Henvendelse fra ${name} - Hovden Musikklubb`;
    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}`;
    window.location.href = mailtoLink;
  };

  const deleteMessage = async (id: string) => {
    if (!window.confirm('Er du sikker på at du vil slette denne meldingen?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('contact_messages')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Melding slettet');
      fetchMessages();
    } catch (error) {
      console.error('Error deleting message:', error);
      toast.error('Kunne ikke slette melding');
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Meldinger</h2>
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-emerald-500 border-r-transparent"></div>
          <p className="mt-2 text-gray-500">Laster meldinger...</p>
        </div>
      ) : messages.length === 0 ? (
        <p className="text-center py-12 text-gray-500">Ingen meldinger å vise</p>
      ) : (
        <div className="grid gap-6">
          {messages.map((message) => (
            <div key={message.id} className="bg-white rounded-lg shadow-sm p-6 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{message.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <p>{message.email}</p>
                    <button
                      onClick={() => handleReply(message.email, message.name)}
                      className="inline-flex items-center gap-1 text-emerald-600 hover:text-emerald-700"
                    >
                      <Mail size={16} />
                      <span>Svar</span>
                    </button>
                    <button
                      onClick={() => deleteMessage(message.id)}
                      className="inline-flex items-center gap-1 text-red-600 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                      <span>Slett</span>
                    </button>
                  </div>
                  <p className="text-sm text-gray-500">
                    {new Date(message.created_at).toLocaleDateString('no-NO', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                <select
                  value={message.status}
                  onChange={(e) => updateStatus(message.id, e.target.value as MessageStatus)}
                  className={`rounded-full px-3 py-1 text-sm font-medium ${
                    message.status === 'new'
                      ? 'bg-yellow-100 text-yellow-800'
                      : message.status === 'in_progress'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-green-100 text-green-800'
                  }`}
                >
                  <option value="new">Ny</option>
                  <option value="in_progress">Under behandling</option>
                  <option value="completed">Fullført</option>
                </select>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <p className="whitespace-pre-wrap">{message.message}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Admin notater
                </label>
                <div className="flex gap-2">
                  <textarea
                    value={editingNotes[message.id] || ''}
                    onChange={(e) => setEditingNotes({
                      ...editingNotes,
                      [message.id]: e.target.value
                    })}
                    rows={2}
                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                    placeholder="Legg til notater..."
                  />
                  <button
                    onClick={() => updateAdminNotes(message.id)}
                    className="inline-flex items-center gap-1 px-3 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
                  >
                    <Save size={16} />
                    <span>Lagre</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 