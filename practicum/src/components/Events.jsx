import React, { useState, useEffect } from "react";

export default function EventsReunions() {
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState("");
  const [newDate, setNewDate] = useState("");
  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    const storedEvents = JSON.parse(localStorage.getItem("events")) || [];
    setEvents(storedEvents);
  }, []);

  useEffect(() => {
    if (events.length > 0) {
      localStorage.setItem("events", JSON.stringify(events));
    }
  }, [events]);

  const addEvent = () => {
    if (newEvent.trim() && newDate.trim()) {
      if (editIndex !== null) {
        const updatedEvents = events.map((event, index) =>
          index === editIndex ? { name: newEvent, date: newDate } : event
        );
        setEvents(updatedEvents);
        setEditIndex(null);
      } else {
        setEvents([...events, { name: newEvent, date: newDate }]);
      }
      setNewEvent("");
      setNewDate("");
    }
  };

  const deleteEvent = (index) => {
    const updatedEvents = events.filter((_, i) => i !== index);
    setEvents(updatedEvents);
  };

  const editEvent = (index) => {
    setNewEvent(events[index].name);
    setNewDate(events[index].date);
    setEditIndex(index);
  };

  return (
    <div className="min-h-screen bg-blue-50 p-6 flex justify-center items-center">
      <div className="w-full max-w-2xl backdrop-blur-lg bg-white/70 rounded-3xl shadow-2xl p-8 border border-white/30">
        <h2 className="text-3xl font-extrabold text-center text-blue-700 mb-8 tracking-wide">
          ✨ Upcoming Events & Reunions ✨
        </h2>

        <div className="space-y-4 mb-10">
          {events.map((event, index) => (
            <div
              key={index}
              className="flex justify-between items-center bg-white/80 border border-gray-200 rounded-2xl p-4 shadow-md hover:shadow-xl transition duration-300 hover:scale-[1.01]"
            >
              <div>
                <p className="text-lg font-semibold text-gray-800">{event.name}</p>
                <p className="text-sm text-gray-600">{event.date}</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => editEvent(index)}
                  className="px-4 py-1 text-sm font-semibold text-white bg-green-600 hover:bg-green-700 rounded-full transition duration-200 hover:shadow-md"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteEvent(index)}
                  className="px-4 py-1 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 rounded-full transition duration-200 hover:shadow-md"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-4">
          <input
            value={newEvent}
            onChange={(e) => setNewEvent(e.target.value)}
            placeholder="Event Title"
            className="px-4 py-3 rounded-xl border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
          <input
            type="date"
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
            className="px-4 py-3 rounded-xl border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
          <button
            onClick={addEvent}
            className="mt-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold rounded-xl hover:from-blue-600 hover:to-purple-600 transition duration-300 shadow-lg hover:shadow-xl"
          >
            {editIndex !== null ? "Update Event" : "Add Event"}
          </button>
        </div>
      </div>
    </div>
  );
}
