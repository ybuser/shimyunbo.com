import type {Language} from './ui';
/** Homepage copy is paired so both languages tell the same personal story. */
export const homeCopy = {
  en: {
    interestsLabel: 'A few things I think about',
    interests: [
      {number: '01', label: 'RESEARCH', title: 'How does intelligence work?', description: 'Models, context, and the way information becomes understanding.'},
      {number: '02', label: 'BUILDING', title: 'What could I make with this?', description: 'New tools, small experiments, and ideas that become useful software.'},
      {number: '03', label: 'VISUALIZATION', title: 'Could we see it differently?', description: 'Making complex data easier to explore, notice, and understand.'},
    ],
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
    interestsLabel: '이런 것들이 궁금해요',
    interests: [
      {number: '01', label: '연구', title: '지능은 어떻게 작동할까?', description: '모델과 맥락, 그리고 정보가 이해로 이어지는 과정.'},
      {number: '02', label: '개발', title: '이걸로 뭘 만들 수 있을까?', description: '새로운 도구로 실험하고, 아이디어를 쓸모 있는 소프트웨어로 만들기.'},
      {number: '03', label: '시각화', title: '다르게 보면 어떨까?', description: '복잡한 데이터 속 관계와 패턴을 눈으로 탐색하고 이해하기.'},
    ],
    eyebrow: '조금 더 가벼운 자기소개', heading: '호기심은 움직이는 중.',
    intro: '키보드 앞에서, 물 위에서, 가끔은 벽 위에서.',
    techLabel: '01 / 키보드 앞에서', techTitle: '새로운 기술? 일단 써보기.',
    techText: '다양한 컴퓨터 기술을 직접 써보는 걸 좋아해요. 새로운 도구를 만나면 작은 실험부터 시작합니다.',
    techNote: '열어보고 → 써보고 → 바꿔보고', sportLabel: '02 / 바깥으로 나가서',
    sportTabs: '좋아하는 스포츠', sportHint: '다른 놀이터도 골라보세요.',
    sailing: {label: '세일링', title: '바람을 읽고, 방향을 찾고.', text: '물 위에서는 바람을 따라 길을 찾아갑니다.', note: '대한요트협회 등록 선수', result: '전국대회 고등부 2위', years: '2017년 · 2018년', classes: 'Laser 2000 · Laser 4.7'},
    running: {label: '러닝', title: '한 걸음, 그리고 다음 걸음.', text: '키보드에서 잠시 떨어져 밖으로 달리러 갑니다.', note: '조금 다른 방식의 새로고침.'},
    climbing: {label: '클라이밍', title: '몸으로 풀어보는 문제.', text: '다음 홀드를 찾고, 다른 움직임을 시도합니다.', note: '위를 보고, 한 번 더.'},
  },
} satisfies Record<Language, unknown>;
export const sportIds = ['sailing', 'running', 'climbing'] as const;
