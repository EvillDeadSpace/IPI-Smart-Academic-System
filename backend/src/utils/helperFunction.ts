const DAY_NAMES = ["Ponedjeljak", "Utorak", "Srijeda", "Četvrtak", "Petak", "Subota", "Nedjelja"];

export function formatLecture(l: any) {
  return {
    id: l.id,
    dayOfWeek: l.dayOfWeek,
    dayName: DAY_NAMES[l.dayOfWeek] ?? "Nepoznat dan",
    startTime: l.startTime,
    endTime: l.endTime,
    room: l.room,
    subject: l.subject,
    professor: {
      ...l.professor,
      fullName: `${l.professor.title} ${l.professor.firstName} ${l.professor.lastName}`,
    },
  };
}

export function buildNextLectureResponse(
  lecture: any,
  now: Date,
  currentDay: number,
  currentTime: string,
) {
  const formatted = formatLecture(lecture);

  // Izračunaj minuta do predavanja
  let minutesUntil = 0;
  if (lecture.dayOfWeek === currentDay) {
    const [startH, startM] = lecture.startTime.split(":").map(Number);
    const [curH, curM] = currentTime.split(":").map(Number);
    minutesUntil = startH * 60 + startM - (curH * 60 + curM);
  } else {
    // Dani razlika
    const daysUntil =
      lecture.dayOfWeek > currentDay
        ? lecture.dayOfWeek - currentDay
        : 7 - currentDay + lecture.dayOfWeek;

    const [startH, startM] = lecture.startTime.split(":").map(Number);
    const [curH, curM] = currentTime.split(":").map(Number);
    minutesUntil = daysUntil * 24 * 60 + (startH * 60 + startM) - (curH * 60 + curM);
  }

  // Ljudski readable countdown
  let countdown: string;
  if (minutesUntil < 60) {
    countdown = `Za ${minutesUntil} minuta`;
  } else if (minutesUntil < 1440) {
    const h = Math.floor(minutesUntil / 60);
    const m = minutesUntil % 60;
    countdown = m > 0 ? `Za ${h}h ${m}min` : `Za ${h} sat${h > 1 ? "a" : ""}`;
  } else {
    const days = Math.floor(minutesUntil / 1440);
    countdown = `Za ${days} dan${days > 1 ? "a" : ""}`;
  }

  return {
    ...formatted,
    minutesUntil,
    countdown,
    isToday: lecture.dayOfWeek === currentDay,
  };
}
