import type {Language} from './ui';
export const articleCopy = {
  en: {
    eyebrow: 'THE JOURNAL', heading: 'Latest updates',
    intro: 'News, field notes, and everything in between.',
    indexLabel: 'ARTICLE INDEX', orderLabel: 'Newest first · Undated pages last',
    placeholderNote: 'Five empty posts for now. The stories will follow.',
    placeholder: 'Empty post', undated: 'Undated', recordDate: 'Record date',
    back: '← Latest updates', article: 'ARTICLE',
    emptyTitle: 'A page waiting for its story.',
    emptyText: 'This is an empty placeholder. The article has not been written yet.',
    dateNote: 'The date above belongs to the planned story. This post is not yet published.',
    undatedNote: 'No topic or publication date has been set for this page.',
    more: 'Other pages', returnHome: 'Back to the journal',
  },
  ko: {
    eyebrow: 'THE JOURNAL', heading: '최신 소식',
    intro: '새로운 소식과 현장에서의 기록, 그리고 그 사이의 이야기.',
    indexLabel: '아티클 목록', orderLabel: '최신순 · 날짜 미정 글은 아래에',
    placeholderNote: '지금은 다섯 개의 빈 포스트입니다. 이야기는 차차 채워갑니다.',
    placeholder: '빈 포스트', undated: '날짜 미정', recordDate: '기록 날짜',
    back: '← 최신 소식', article: '아티클',
    emptyTitle: '이야기를 기다리는 페이지.',
    emptyText: '아직 본문을 작성하지 않은 빈 포스트입니다.',
    dateNote: '위 날짜는 앞으로 담을 이야기의 날짜입니다. 본문은 아직 발행되지 않았습니다.',
    undatedNote: '아직 주제와 발행 날짜를 정하지 않았습니다.',
    more: '다른 페이지', returnHome: '소식 목록으로 돌아가기',
  },
} satisfies Record<Language, Record<string,string>>;
