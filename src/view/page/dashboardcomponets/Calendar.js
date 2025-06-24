import React, { useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useQuery } from '@tanstack/react-query';
import { fetchCursos } from '../../sing/function';

const locales = { 'pt-BR': ptBR };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });

const CalendarWidget = () => {
  const token = localStorage.getItem("token");
  const [searchParams, setSearchParams] = useState({
    nome: "",
    ano_execucao: new Date().getFullYear(),
    programa: "",
    local_realizacao: "",
    acao: "",
  });

  const { data: datacurso } = useQuery({
    queryKey: "calendary",
    queryFn: () => fetchCursos(token, searchParams),
  });

  const isWeekend = (date) => {
    const day = date.getDay(); // 0 = Domingo, 6 = Sábado
    return day === 0 || day === 6;
  };

  const getGradientColor = (startDate, endDate) => {
    const duration = (endDate - startDate) / (1000 * 60 * 60 * 24);
    return duration > 20 ? 'linear-gradient(to right, #2D9CDB, #27AE60)' : '#2D9CDB';
  };

  const events = datacurso?.map((curso) => {
    const startDate = new Date(curso.data_inicio);
    const endDate = curso.data_termino === "0001-01-01T00:00:00"
      ? new Date(startDate.getTime() + (curso.duracao || 1) * 24 * 60 * 60 * 1000)
      : new Date(curso.data_termino);

    const hasValidTime =
      curso.horario !== "nan" &&
      curso.horario_termino !== "nan" &&
      curso.horario &&
      curso.horario_termino;

    if (hasValidTime) {
      const [startHour, startMinute] = curso.horario.split(":");
      const [endHour, endMinute] = curso.horario_termino.split(":");
      startDate.setHours(+startHour, +startMinute);
      endDate.setHours(+endHour, +endMinute);
    }

    return {
      title: curso.nome,
      start: startDate,
      end: endDate,
      allDay: !hasValidTime,
      programa_id: curso.programa_id,
    };
  })
  ?.filter(event => !isWeekend(event.start)) || []; // Remove eventos nos fins de semana
  

  return (
    <div style={{ height: "80vh" }} className='bg-white shadow p-4 rounded'>
      <h2 className="text-lg font-semibold mb-3">Calendário de Cursos</h2>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: "100%" }}
        views={['month', 'work_week', 'week', 'day']} // Remove 'agenda' e finais de semana
        step={60}
        defaultView="month"
        toolbar
        eventPropGetter={(event) => ({
          style: {
            background: getGradientColor(event.start, event.end),
            color: '#fff',
            borderRadius: '4px',
            padding: '2px 6px',
          },
        })}
      />
    </div>
  );
};

export default CalendarWidget;
