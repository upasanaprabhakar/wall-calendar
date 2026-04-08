import React, { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth, isToday, addMonths, subMonths, eachDayOfInterval as eachDay } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Plus, CalendarRange, X } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { getHolidaysForDate } from '../data/holidays';
import CustomDropdown from '../components/CustomDropdown';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [notes, setNotes] = useLocalStorage('calendar-notes', {});
  const [generalNotes, setGeneralNotes] = useLocalStorage('calendar-general-notes', []);
  const [newNote, setNewNote] = useState('');
  const [newGeneralNote, setNewGeneralNote] = useState('');
  const [noteCategory, setNoteCategory] = useState('personal');
  const [direction, setDirection] = useState(0);
  const [designGuidelines, setDesignGuidelines] = useState(null);

  // Range selection state
  const [rangeStart, setRangeStart] = useState(null);
  const [rangeEnd, setRangeEnd] = useState(null);
  const [rangeMode, setRangeMode] = useState(false);

  useEffect(() => {
    fetch('/design_guidelines.json')
      .then(res => res.json())
      .then(data => setDesignGuidelines(data))
      .catch(err => console.error('Error loading design guidelines:', err));
  }, []);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const categoryOptions = [
    { value: 'personal', label: 'Personal' },
    { value: 'work', label: 'Work' },
    { value: 'urgent', label: 'Urgent' },
  ];

  const startDay = monthStart.getDay();
  const previousMonthDays = [];
  for (let i = startDay - 1; i >= 0; i--) {
    const date = new Date(monthStart);
    date.setDate(date.getDate() - i - 1);
    previousMonthDays.push(date);
  }

  const totalDays = previousMonthDays.length + monthDays.length;
  const remainingDays = 42 - totalDays;
  const nextMonthDays = [];
  for (let i = 1; i <= remainingDays; i++) {
    const date = new Date(monthEnd);
    date.setDate(date.getDate() + i);
    nextMonthDays.push(date);
  }

  const allDays = [...previousMonthDays, ...monthDays, ...nextMonthDays];

  const handlePreviousMonth = () => {
    setDirection(-1);
    setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    setDirection(1);
    setCurrentDate(addMonths(currentDate, 1));
  };

  const handleToggleRangeMode = () => {
    setRangeMode(prev => !prev);
    setRangeStart(null);
    setRangeEnd(null);
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);

    if (!rangeMode) {
      return;
    }

    if (!rangeStart || (rangeStart && rangeEnd)) {
      setRangeStart(date);
      setRangeEnd(null);
    } else if (isSameDay(date, rangeStart)) {
      setRangeStart(null);
      setRangeEnd(null);
    } else if (date < rangeStart) {
      setRangeStart(date);
      setRangeEnd(null);
    } else {
      setRangeEnd(date);
    }
  };

  const isInRange = (day) => {
    if (!rangeStart || !rangeEnd) return false;
    return day > rangeStart && day < rangeEnd;
  };

  // Add note to ALL dates in range (or just selectedDate if no range)
  const handleAddNote = () => {
    if (!newNote.trim() || !selectedDate) return;

    const notePayload = {
      id: Date.now(),
      text: newNote,
      category: noteCategory,
      createdAt: new Date().toISOString(),
    };

    let updatedNotes = { ...notes };

    if (rangeMode && rangeStart && rangeEnd) {
      // Get every day in the range inclusive
      const rangeDays = eachDayOfInterval({ start: rangeStart, end: rangeEnd });
      rangeDays.forEach((day) => {
        const dateKey = format(day, 'yyyy-MM-dd');
        updatedNotes = {
          ...updatedNotes,
          [dateKey]: [
            ...(updatedNotes[dateKey] || []),
            { ...notePayload, id: Date.now() + Math.random() }, // unique id per day
          ],
        };
      });
    } else {
      const dateKey = format(selectedDate, 'yyyy-MM-dd');
      updatedNotes = {
        ...updatedNotes,
        [dateKey]: [
          ...(updatedNotes[dateKey] || []),
          notePayload,
        ],
      };
    }

    setNotes(updatedNotes);
    setNewNote('');
  };

  const handleAddGeneralNote = () => {
    if (!newGeneralNote.trim()) return;
    setGeneralNotes([
      ...generalNotes,
      {
        id: Date.now(),
        text: newGeneralNote,
        category: noteCategory,
        createdAt: new Date().toISOString(),
      },
    ]);
    setNewGeneralNote('');
  };

  const handleDeleteNote = (dateKey, noteId) => {
    const updatedNotes = {
      ...notes,
      [dateKey]: notes[dateKey].filter(note => note.id !== noteId),
    };
    setNotes(updatedNotes);
  };

  const handleDeleteGeneralNote = (noteId) => {
    setGeneralNotes(generalNotes.filter(note => note.id !== noteId));
  };

  const selectedDateKey = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : null;
  const selectedDateNotes = selectedDateKey ? notes[selectedDateKey] || [] : [];
  const selectedDateHolidays = selectedDateKey ? getHolidaysForDate(selectedDateKey) : [];

  const monthImageUrl = designGuidelines?.images?.monthly_mapping?.[currentDate.getMonth()]?.url || '';

  const getCategoryStyles = (category) => {
    if (!designGuidelines) return '';
    const styles = {
      personal: designGuidelines.components.notes_system.color_coding.personal,
      work: designGuidelines.components.notes_system.color_coding.work,
      urgent: designGuidelines.components.notes_system.color_coding.urgent,
    };
    return styles[category] || styles.personal;
  };

  if (!designGuidelines) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#F9F8F6]">
        <div className="text-[#4A5D53]">Loading calendar...</div>
      </div>
    );
  }

  const variants = {
    enter: (direction) => ({ x: direction > 0 ? 20 : -20, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (direction) => ({ x: direction < 0 ? 20 : -20, opacity: 0 }),
  };

  return (
    <div className="min-h-screen w-full relative">
      {/* Background */}
      <div className="fixed top-0 left-0 w-full h-full -z-10">
        <img
          src={monthImageUrl}
          alt={`Background for ${format(currentDate, 'MMMM')}`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#F9F8F6]/85 via-[#F9F8F6]/60 to-[#F9F8F6]/30" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-screen p-6 sm:p-8 lg:p-12 z-10 relative">

        {/* Sidebar */}
        <aside className="col-span-1 lg:col-span-3 flex flex-col gap-6">

          {/* Month Navigation — NO range toggle here anymore */}
          <div className="bg-white/60 backdrop-blur-2xl border border-white/40 shadow-[0_8px_32px_rgba(26,47,36,0.08)] rounded-3xl p-6">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={handlePreviousMonth}
                className="p-2 rounded-xl hover:bg-white/50 transition-all duration-300"
                data-testid="calendar-prev-month"
              >
                <ChevronLeft className="w-5 h-5 text-[#1A2F24]" />
              </button>
              <AnimatePresence mode="wait" custom={direction}>
                <motion.h2
                  key={format(currentDate, 'MMMM yyyy')}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  className="text-2xl sm:text-3xl font-medium tracking-tight text-[#1A2F24]"
                  data-testid="calendar-month-year"
                >
                  {format(currentDate, 'MMMM yyyy')}
                </motion.h2>
              </AnimatePresence>
              <button
                onClick={handleNextMonth}
                className="p-2 rounded-xl hover:bg-white/50 transition-all duration-300"
                data-testid="calendar-next-month"
              >
                <ChevronRight className="w-5 h-5 text-[#1A2F24]" />
              </button>
            </div>
          </div>

          {/* Selected Date Panel */}
          {selectedDate && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white/60 backdrop-blur-2xl border border-white/40 shadow-[0_8px_32px_rgba(26,47,36,0.08)] rounded-3xl p-6"
              data-testid="selected-date-panel"
            >
              <h3 className="text-xl font-medium tracking-tight text-[#1A2F24] mb-4">
                {format(selectedDate, 'MMMM d, yyyy')}
              </h3>

              {/* Holidays */}
              {selectedDateHolidays.length > 0 && (
                <div className="mb-4" data-testid="holidays-section">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#8A9A5B] mb-2">Holidays</p>
                  <div className="space-y-2">
                    {selectedDateHolidays.map((holiday, idx) => (
                      <div
                        key={idx}
                        className="px-3 py-2 rounded-xl bg-[#8DB4CB]/20 text-[#2C5268] text-sm"
                        data-testid={`holiday-${idx}`}
                      >
                        {holiday.name}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Date Notes */}
              <div className="mb-4">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#8A9A5B] mb-2">Notes</p>
                <div className="space-y-2 mb-3">
                  {selectedDateNotes.map((note) => (
                    <motion.div
                      key={note.id}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`px-3 py-2 rounded-xl text-sm ${getCategoryStyles(note.category)} flex justify-between items-start`}
                      data-testid={`date-note-${note.id}`}
                    >
                      <span>{note.text}</span>
                      <button
                        onClick={() => handleDeleteNote(selectedDateKey, note.id)}
                        className="text-current opacity-50 hover:opacity-100 ml-2"
                        data-testid={`delete-date-note-${note.id}`}
                      >
                        &#215;
                      </button>
                    </motion.div>
                  ))}
                </div>

                {/* Range Mode Toggle — now lives inside the notes panel */}
                <div className="mb-3">
                  <button
                    onClick={handleToggleRangeMode}
                    className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-sm font-medium transition-all duration-300 ${
                      rangeMode
                        ? 'bg-[#8A9A5B] text-white shadow-sm'
                        : 'bg-white/40 text-[#4A5D53] border border-white/50 hover:bg-white/60'
                    }`}
                    data-testid="range-mode-toggle"
                  >
                    <CalendarRange className="w-4 h-4" />
                    {rangeMode ? 'Range Mode: ON' : 'Enable Range Selection'}
                  </button>

                  {/* Range hint */}
                  {rangeMode && (
                    <div className="mt-2 text-center min-h-[20px]">
                      {!rangeStart && (
                        <p className="text-xs text-[#4A5D53]/70">Click a start date on the calendar</p>
                      )}
                      {rangeStart && !rangeEnd && (
                        <p className="text-xs text-[#8A9A5B] font-medium">
                          From {format(rangeStart, 'd MMM')} — click an end date
                        </p>
                      )}
                      {rangeStart && rangeEnd && (
                        <div className="flex items-center justify-center gap-2">
                          <p className="text-xs text-[#8A9A5B] font-medium">
                            {format(rangeStart, 'd MMM')} &#8594; {format(rangeEnd, 'd MMM')}
                          </p>
                          <button
                            onClick={() => { setRangeStart(null); setRangeEnd(null); }}
                            className="text-[#4A5D53]/50 hover:text-[#E07A5F] transition-colors"
                            title="Clear range"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <CustomDropdown
                    value={noteCategory}
                    onChange={setNoteCategory}
                    options={categoryOptions}
                  />
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddNote()}
                      placeholder={
                        rangeMode && rangeStart && rangeEnd
                          ? `Add note to ${format(rangeStart, 'd MMM')}–${format(rangeEnd, 'd MMM')}...`
                          : 'Add a note...'
                      }
                      className="flex-1 px-3 py-2 rounded-xl bg-white/50 border border-white/40 text-sm text-[#4A5D53] placeholder-[#4A5D53]/50 focus:outline-none focus:ring-2 focus:ring-[#8A9A5B]/30"
                      data-testid="note-input"
                    />
                    <button
                      onClick={handleAddNote}
                      className="p-2 rounded-xl bg-[#8A9A5B] text-white hover:bg-[#8A9A5B]/90 transition-all duration-300"
                      data-testid="add-note-button"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* General Notes Panel */}
          <div className="bg-white/60 backdrop-blur-2xl border border-white/40 shadow-[0_8px_32px_rgba(26,47,36,0.08)] rounded-3xl p-6 flex flex-col min-h-[300px]">
            <h3 className="text-xl font-medium tracking-tight text-[#1A2F24] mb-4">General Notes</h3>

            <div className="flex-1 overflow-y-auto space-y-2 mb-3 custom-scrollbar max-h-[400px]">
              {generalNotes.map((note) => (
                <motion.div
                  key={note.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`px-3 py-2 rounded-xl text-sm ${getCategoryStyles(note.category)} flex justify-between items-start`}
                  data-testid={`general-note-${note.id}`}
                >
                  <span>{note.text}</span>
                  <button
                    onClick={() => handleDeleteGeneralNote(note.id)}
                    className="text-current opacity-50 hover:opacity-100 ml-2"
                    data-testid={`delete-general-note-${note.id}`}
                  >
                    &#215;
                  </button>
                </motion.div>
              ))}
            </div>

            <div className="space-y-2">
              <CustomDropdown
                value={noteCategory}
                onChange={setNoteCategory}
                options={categoryOptions}
              />
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newGeneralNote}
                  onChange={(e) => setNewGeneralNote(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddGeneralNote()}
                  placeholder="Add a general note..."
                  className="flex-1 px-3 py-2 rounded-xl bg-white/50 border border-white/40 text-sm text-[#4A5D53] placeholder-[#4A5D53]/50 focus:outline-none focus:ring-2 focus:ring-[#8A9A5B]/30"
                  data-testid="general-note-input"
                />
                <button
                  onClick={handleAddGeneralNote}
                  className="p-2 rounded-xl bg-[#8A9A5B] text-white hover:bg-[#8A9A5B]/90 transition-all duration-300"
                  data-testid="add-general-note-button"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Calendar */}
        <main className="col-span-1 lg:col-span-9 flex flex-col min-h-[600px] lg:min-h-0">
          <div className="bg-white/60 backdrop-blur-2xl border border-white/40 shadow-[0_8px_32px_rgba(26,47,36,0.08)] rounded-3xl p-6 flex flex-col h-full">

            {/* Day Headers */}
            <div className="grid grid-cols-7 gap-2 mb-4">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div
                  key={day}
                  className="text-center text-xs font-bold uppercase tracking-[0.2em] text-[#8A9A5B] py-2"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={format(currentDate, 'yyyy-MM')}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="grid grid-cols-7 gap-2 flex-grow auto-rows-fr"
                data-testid="calendar-grid"
              >
                {allDays.map((day, idx) => {
                  const dateKey = format(day, 'yyyy-MM-dd');
                  const dayNotes = notes[dateKey] || [];
                  const dayHolidays = getHolidaysForDate(dateKey);
                  const isCurrentMonth = isSameMonth(day, currentDate);
                  const isTodayDate = isToday(day);
                  const isSelected = selectedDate && isSameDay(day, selectedDate);
                  const isRangeStart = rangeStart && isSameDay(day, rangeStart);
                  const isRangeEnd = rangeEnd && isSameDay(day, rangeEnd);
                  const inRange = isInRange(day);
                  const isEndpoint = isRangeStart || isRangeEnd;

                  return (
                    <motion.div
                      key={idx}
                      onClick={() => isCurrentMonth && handleDateClick(day)}
                      className={[
                        'relative h-full w-full min-h-[80px] sm:min-h-[100px] flex flex-col p-2 sm:p-3 rounded-2xl border transition-all duration-300 cursor-pointer',
                        !isCurrentMonth ? 'opacity-40 pointer-events-none' : '',
                        isEndpoint
                          ? 'bg-[#8A9A5B] border-[#8A9A5B] shadow-md'
                          : inRange
                          ? 'bg-[#8A9A5B]/15 border-[#8A9A5B]/30'
                          : isTodayDate
                          ? 'border-[#E07A5F]/30 bg-[#E07A5F]/10 font-bold'
                          : isSelected
                          ? 'ring-2 ring-[#8A9A5B] bg-white/60 border-transparent'
                          : 'border-transparent hover:border-white/60 hover:bg-white/50 hover:shadow-sm',
                      ].join(' ')}
                      whileHover={isCurrentMonth ? { scale: 1.02 } : {}}
                      data-testid={`calendar-day-${dateKey}`}
                    >
                      <span className={`text-sm sm:text-base ${
                        isEndpoint
                          ? 'text-white font-semibold'
                          : isTodayDate
                          ? 'text-[#E07A5F]'
                          : 'text-[#1A2F24]'
                      }`}>
                        {format(day, 'd')}
                      </span>



                      {/* Holiday indicator */}
                      {dayHolidays.length > 0 && (
                        <div
                          className={`w-1.5 h-1.5 rounded-full absolute bottom-2 sm:bottom-3 right-2 sm:right-3 shadow-sm ${
                            isEndpoint ? 'bg-white/70' : 'bg-[#8DB4CB]'
                          }`}
                          data-testid={`holiday-indicator-${dateKey}`}
                        />
                      )}
                    </motion.div>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Calendar;