
import { Campus } from './types';

export const VALID_EMAIL_DOMAINS = [
  'hyderabad.bits-pilani.ac.in',
  'goa.bits-pilani.ac.in',
  'pilani.bits-pilani.ac.in',
];

export const BRANCHES = [
  'Chemical Engineering',
  'Civil Engineering',
  'Computer Science',
  'Electrical & Electronics',
  'Electronics & Communication',
  'Electronics & Instrumentation',
  'Mechanical Engineering',
  'Manufacturing Engineering',
  'B. Pharmacy',
  'M.Sc. Biological Sciences',
  'M.Sc. Chemistry',
  'M.Sc. Economics',
  'M.Sc. Mathematics',
  'M.Sc. Physics',
];

export const ADMISSION_YEARS = Array.from({ length: 15 }, (_, i) => new Date().getFullYear() - i);

export const CLUBS = {
  [Campus.PILANI]: [
    'Photography Club', 'Dance Club', 'Mime Club', 'Music Club', 'Dramatics Club',
    'ACM BITS Pilani', 'IEEE BITS Pilani', 'SAE BITS Pilani', 'Astronomy Club',
    'Nirmaan', 'Enactus', 'E-Cell', 'Debating Society'
  ],
  [Campus.GOA]: [
    'SEDS Celestia', 'E-Cell', 'Dance Club', 'Wall Street Club', 'IEEE Student Branch',
    'Google Developer Student Club', 'Scribbler\'s Circle', 'Quiz Club',
    'Choreo', 'Photog', 'Music Society'
  ],
  [Campus.HYDERABAD]: [
    'Oratory Club', 'E-Cell', 'Dance Club', 'Photography Club', 'Theatrix',
    'Crux', 'ACM Student Chapter', 'IEEE Student Branch', 'Enactus',
    'Verba Maximus', 'Journalism and Media Club'
  ],
};
