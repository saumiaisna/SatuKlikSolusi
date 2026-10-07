const params = new URLSearchParams(window.location.search);
const courseName = params.get('matkul')?.trim() || 'Mata Kuliah';
const courseNameLabel = document.querySelector('#course-name');
const tutorList = document.querySelector('#course-tutor-list');
const tutorEmpty = document.querySelector('#course-tutor-empty');
const selectionSection = document.querySelector('#course-selection');
const selectedTutorName = document.querySelector('#selected-tutor-name');
const selectedTutorCohort = document.querySelector('#selected-tutor-cohort');
const selectedTutorGrade = document.querySelector('#selected-tutor-grade');
const selectedTutorAchievement = document.querySelector('#selected-tutor-achievement');
const priceList = document.querySelector('#course-price-list');
const pricingTabs = document.querySelectorAll('[data-course-mode]');
const memberRegistrationForm = 'https://forms.gle/ham1aEZGVH3ZjJRH6';

const tutorsByCourse = {
  'Tata Naskah Dinas': [
    {
      name: 'Isna Saumia',
      cohort: 'KID - 2024',
      grade: 'A (4.00)',
      achievement: '-'
    },
    {
      name: 'Fitria Susilowati',
      cohort: 'KID - 2024',
      grade: 'A (4.00)',
      achievement: 'Juara 1 National Accounting Olympiad 2023'
    }
  ]
};

const pricesByMode = {
  privat: [
    { place: 'Kampus', price: 50000, unit: 'orang' },
    { place: 'Cafe', price: 50000, unit: 'orang' },
    { place: 'Online', price: 40000, unit: 'orang' }
  ],
  kelompok: [
    { place: 'Kampus/Cafe', group: '2-3 orang', price: 45000, unit: 'orang' },
    { place: 'Kampus/Cafe', group: '4-5 orang', price: 40000, unit: 'orang' },
    { place: 'Online', group: '2-5 orang', price: 30000, unit: 'orang' }
  ]
};

courseNameLabel.textContent = courseName;
document.title = `Tutor Mata Kuliah ${courseName} | SKS`;

const tutors = tutorsByCourse[courseName] || [];
let selectedTutor = null;

const renderPrices = (mode) => {
  priceList.replaceChildren();

  pricesByMode[mode].forEach((option) => {
    const card = document.createElement('article');
    card.className = 'course-price-card';

    const title = document.createElement('strong');
    title.className = 'course-price-mode';
    title.textContent = option.place;
    card.append(title);

    if (option.group) {
      const group = document.createElement('small');
      group.className = 'course-price-group';
      group.textContent = option.group;
      card.append(group);
    }

    const price = document.createElement('p');
    price.className = 'course-price-value';
    const amount = document.createElement('span');
    amount.className = 'course-price-amount';
    amount.textContent = `Rp ${option.price.toLocaleString('id-ID')}/`;
    const unit = document.createElement('small');
    unit.className = 'course-price-unit';
    unit.textContent = option.unit;
    price.append(amount, unit);
    card.append(price);

    const bookingLink = document.createElement('a');
    bookingLink.className = 'course-booking-button';
    bookingLink.href = memberRegistrationForm;
    bookingLink.target = '_blank';
    bookingLink.rel = 'noopener noreferrer';
    bookingLink.textContent = 'Booking Tutor';
    card.append(bookingLink);
    priceList.append(card);
  });
};

const selectTutor = (tutor, selectedCard) => {
  selectedTutor = tutor;
  tutorList.querySelectorAll('.course-tutor-card').forEach((card) => {
    const isSelected = card === selectedCard;
    card.classList.toggle('is-selected', isSelected);
    card.setAttribute('aria-pressed', String(isSelected));
  });

  selectedTutorName.textContent = tutor.name;
  selectedTutorCohort.textContent = tutor.cohort;
  selectedTutorGrade.textContent = tutor.grade;
  selectedTutorAchievement.textContent = tutor.achievement;
  selectionSection.hidden = false;
  renderPrices(document.querySelector('[data-course-mode].is-active').dataset.courseMode);
};

if (tutors.length) {
  tutorList.hidden = false;
  tutors.forEach((tutor) => {
    const card = document.createElement('button');
    card.className = 'course-tutor-card';
    card.type = 'button';
    card.setAttribute('aria-pressed', 'false');
    card.setAttribute('aria-label', `Pilih tutor ${tutor.name}`);

    const banner = document.createElement('span');
    banner.className = 'course-tutor-banner';
    banner.setAttribute('aria-hidden', 'true');

    const avatar = document.createElement('span');
    avatar.className = 'course-avatar course-tutor-card-avatar';
    avatar.setAttribute('aria-hidden', 'true');

    const name = document.createElement('strong');
    name.textContent = tutor.name;
    const cohort = document.createElement('span');
    cohort.className = 'course-tutor-cohort';
    cohort.textContent = tutor.cohort;

    const grade = document.createElement('span');
    grade.className = 'course-tutor-summary';
    grade.textContent = `☆  Nilai Mata Kuliah ${tutor.grade}`;
    const achievement = document.createElement('span');
    achievement.className = 'course-tutor-summary';
    achievement.textContent = `♧  Prestasi ${tutor.achievement}`;

    card.append(banner, avatar, name, cohort, grade, achievement);
    card.addEventListener('click', () => selectTutor(tutor, card));
    tutorList.append(card);
  });
} else {
  tutorEmpty.hidden = false;
}

pricingTabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    const mode = tab.dataset.courseMode;
    pricingTabs.forEach((option) => {
      const isSelected = option === tab;
      option.classList.toggle('is-active', isSelected);
      option.setAttribute('aria-pressed', String(isSelected));
    });
    if (selectedTutor) renderPrices(mode);
  });
});
