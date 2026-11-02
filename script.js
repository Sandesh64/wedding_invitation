
const openButton = document.getElementById('openInvitation');
const welcome = document.getElementById('welcome');
const invitation = document.getElementById('invitation');
const music = document.getElementById('backgroundMusic');

music.volume = 0.16;

const musicToggle = document.getElementById('musicToggle');
const musicLabel = document.getElementById('musicLabel');
const toast = document.getElementById('toast');
const dialog = document.getElementById('rsvpDialog');

// VISIBLE SNOWFALL ANIMATION
const snowContainer = document.getElementById('snowfall');

if (snowContainer) {
  for (let i = 0; i < 75; i++) {
    const flake = document.createElement('span');

    flake.className = 'snowflake';
    flake.style.setProperty('--left', `${Math.random() * 100}%`);
    flake.style.setProperty('--size', `${4 + Math.random() * 5}px`);
    flake.style.setProperty('--opacity', `${0.55 + Math.random() * 0.4}`);
    flake.style.setProperty('--duration', `${7 + Math.random() * 9}s`);
    flake.style.setProperty('--delay', `${-Math.random() * 16}s`);
    flake.style.setProperty('--drift', `${-55 + Math.random() * 110}px`);

    snowContainer.appendChild(flake);
  }
}

let toastTimer;

function notify(message) {
  toast.textContent = message;
  toast.classList.add('show');

  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}

// OPEN INVITATION
openButton.addEventListener('click', async () => {
  welcome.classList.add('opening');
  invitation.classList.remove('hidden');

  try {
    await music.play();
    musicToggle.setAttribute('aria-pressed', 'true');
    musicLabel.textContent = 'Music on';
  } catch (e) {
    musicLabel.textContent = 'Tap for music';
  }

  setTimeout(() => {
    invitation.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }, 120);
});

// MUSIC TOGGLE
musicToggle.addEventListener('click', async () => {
  if (music.paused) {
    try {
      await music.play();
      musicToggle.setAttribute('aria-pressed', 'true');
      musicLabel.textContent = 'Music on';
    } catch (e) {
      notify('To enable music, add your audio file as music.mp3 in this website folder.');
    }
  } else {
    music.pause();
    musicToggle.setAttribute('aria-pressed', 'false');
    musicLabel.textContent = 'Music off';
  }
});

// ADD TO CALENDAR
document.querySelectorAll('[data-calendar]').forEach(button => {
  button.addEventListener('click', () => {
    const isWedding = button.dataset.calendar === 'wedding';

    const event = isWedding ? {
      title: 'Wedding Muhurtham — Priya & Subhash',
      start: '20261126T122900',
      end: '20261126T140000',
      location: 'Karmika Bhavana, Yellapur, Uttara Kannada'
    } : {
      title: 'Wedding Reception — Priya & Subhash',
      start: '20261129T110000',
      end: '20261129T140000',
      location: 'Sri Muneshwara Party Hall, Near Nandi Hills, Bangalore'
    };

    const ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Priya and Subhash//Wedding Invitation//EN',
      'BEGIN:VEVENT',
      `UID:${isWedding ? 'wedding' : 'reception'}-priya-subhash-2026`,
      `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')}`,
      `DTSTART;TZID=Asia/Kolkata:${event.start}`,
      `DTEND;TZID=Asia/Kolkata:${event.end}`,
      `SUMMARY:${event.title}`,
      `LOCATION:${event.location}`,
      'DESCRIPTION:Celebrating Priya and Subhash.',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([ics], {
      type: 'text/calendar;charset=utf-8'
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');

    a.href = url;
    a.download = `${isWedding ? 'wedding' : 'reception'}-priya-subhash.ics`;

    document.body.appendChild(a);
    a.click();
    a.remove();

    URL.revokeObjectURL(url);

    notify('Calendar event downloaded. Open it to add the event to your calendar.');
  });
});

// RSVP DIALOG
document.getElementById('rsvpOpen').addEventListener('click', () => {
  dialog.showModal();
});

document.getElementById('rsvpClose').addEventListener('click', () => {
  dialog.close();
});

// RSVP SUBMISSION (WHATSAPP)
document.getElementById('rsvpForm').addEventListener('submit', async (event) => {
  event.preventDefault();

  const name = document.getElementById('guestName').value.trim();
  const attendance = document.getElementById('attendance').value;
  const count = document.getElementById('guestCount').value;

  if (!name) return;

  const message = `Hello! This is ${name}. ${attendance} to Priya & Subhash's wedding celebrations. Number of guests: ${count}.`;

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;

  dialog.close();

  window.open(whatsappUrl, '_blank', 'noopener');

  notify('Your RSVP message is ready to send on WhatsApp.');
});
