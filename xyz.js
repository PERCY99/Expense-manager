import queryString from 'query-string';
import { get } from 'lodash-es';

import { isTeacher, isStudent } from 'utils/tokenUtils';

const isRoleTeacher = isTeacher();

let { settings, class_props, ...otherParams } = queryString.parse(window.location.search);
try {
  settings = settings ? JSON.parse(window.atob(settings)) : {};
} catch (error) {
  console.log('error in parsing settings -- ', error);
  settings = {};
}
try {
  class_props = class_props ? JSON.parse(window.atob(class_props)) : {};
} catch (error) {
  console.log('error in parsing class_props -- ', error);
  class_props = {};
}

console.log('received queryParams -- ', {
  class_props, settings, otherParams
});

const timer = get(settings, 'timer', true);
const correctAnswer = get(settings, 'displaySolutions', isRoleTeacher);
const explanation = get(settings, 'displaySolutionsExplanations', isRoleTeacher);
const enableGems = get(settings, 'enableGems', isStudent());
const hint = get(settings, 'displayHints', true);
const revision = get(settings, 'isRevision', false);
const exitButton = get(settings, 'displayExitButton', false);
const skipButton = isRoleTeacher && get(settings, 'skipButton', isRoleTeacher);
const isViewOnlyMode = get(settings, 'isViewOnlyMode', false) && isRoleTeacher;

function handleTimerChange(data) {
  console.log('handleTimerChange', data);
}

function handleTimerEnd(data) {
  console.log('handleTimerEnd', data);
}

function handleOverTime(data) {
  console.log('handleOverTime', data);
}

const timerProps = {
  // durationInSeconds: 10 // for countdown timer
  intervalInMS: 1000,
  allowOvertime: true, // true or false
  type: 'countUp', // countUp or countDown
  handleTimerChange,
  handleTimerEnd,
  handleOverTime
};

const showElements = {
  timer,
  correctAnswer,
  explanation,
  hint,
  revision,
  header: true,
  footer: true,
  backButton: true,
  skipButton,
  submitButton: true,
  nextButton: true,
  exitButton,
  exitConfirmModal: true,
  progressBar: true,
  progressCount: true,
  imageZoom: true,
  reportIssue: true,
};

const showElementsInViewOnly = {
  header: false,
  correctAnswer,
  explanation,
  hint,
  revision,
  footer: true,
  submitButton: false,
  nextButton: false,
};

export const issues = [
  { title: 'The answer is incorrect' },
  { title: 'There are duplicate answer options' },
  { title: 'The question is not loading correctly' },
  { title: 'I cannot submit my answer' },
  { title: 'Other' }
];

const quizProps = {
  showElements: isViewOnlyMode ? showElementsInViewOnly : showElements,
  timerProps,
  classes: {},
  issues,
  enableGems,
  handleCheckClick: () => { },
};

export default quizProps;
