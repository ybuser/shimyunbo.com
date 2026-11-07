import type {Language} from './ui';
/** Homepage copy is paired so both languages tell the same personal story. */
export const homeCopy = {
  en: {
    eyebrow: 'A LITTLE MORE ME', heading: 'Curiosity, in motion.',
    intro: 'At a keyboard, on the water, or somewhere up a wall.',
    techLabel: '01 / AT THE KEYBOARD', techTitle: 'New tech? Let me try.',
    techText: 'I like trying out new computer technologies. A new tool is a good excuse for a small experiment.',
    techNote: 'open → try → tinker', sportLabel: '02 / OUT IN THE WORLD',
    sportTabs: 'Activities I enjoy', sportHint: 'Pick a different playground.',
    sailing: {label: 'Sailing', title: 'A little wind. A new direction.', text: 'Reading the wind and finding a way across the water.', note: 'Registered athlete · Korea Sailing Federation', result: 'National high-school runner-up', years: '2017 & 2018', classes: 'Laser 2000 · Laser 4.7'},
    running: {label: 'Running', title: 'One step, then another.', text: 'Away from the keyboard, out for a run.', note: 'A different kind of refresh.'},
    climbing: {label: 'Climbing', title: 'A problem you can climb.', text: 'Finding the next hold and trying a different move.', note: 'Look up. Try again.'},
  },
  ko: {
    eyebrow: '취미와 관심사', heading: '궁금하면 직접 해봅니다.',
    intro: '키보드 앞에서도, 물 위에서도, 벽을 오를 때도.',
    techLabel: '01 / 키보드 앞에서', techTitle: '새로운 기술은 일단 써봅니다.',
    techText: '다양한 컴퓨터 기술을 직접 써보는 걸 좋아합니다. 새로운 도구를 발견하면 간단한 실험부터 해봅니다.',
    techNote: '열어보고 → 써보고 → 바꿔보고', sportLabel: '02 / 운동할 때는',
    sportTabs: '좋아하는 스포츠', sportHint: '다른 운동 이야기도 살펴보세요.',
    sailing: {label: '세일링', title: '바람을 읽으며 나아갑니다.', text: '바람을 읽고 물 위에서 나아갈 방향을 찾습니다.', note: '대한요트협회 등록 선수', result: '전국대회 고등부 2위', years: '2017년 · 2018년', classes: 'Laser 2000 · Laser 4.7'},
    running: {label: '러닝', title: '한 걸음씩 앞으로.', text: '잠시 컴퓨터에서 벗어나 밖으로 달리러 나갑니다.', note: '달리면서 기분을 전환합니다.'},
    climbing: {label: '클라이밍', title: '몸으로 푸는 문제.', text: '다음에 잡을 홀드를 찾고, 여러 동작을 시도합니다.', note: '위를 보며 다시 도전합니다.'},
  },
} satisfies Record<Language, unknown>;
export const sportIds = ['sailing', 'running', 'climbing'] as const;
