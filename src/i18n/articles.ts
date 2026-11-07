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
    eyebrow: '소식과 기록', heading: '최신 소식',
    intro: '새로운 소식부터 현장에서 겪은 일까지, 다양한 이야기를 기록합니다.',
    indexLabel: '글 목록', orderLabel: '최신순 · 날짜가 정해지지 않은 글은 마지막에',
    placeholderNote: '글을 올릴 자리 다섯 개를 마련했습니다. 본문은 차차 채울 예정입니다.',
    placeholder: '본문 준비 중', undated: '날짜 미정', recordDate: '기록 날짜',
    back: '← 최신 소식', article: '글',
    emptyTitle: '아직 본문을 작성하지 않았습니다.',
    emptyText: '앞으로 글을 올릴 수 있도록 비워 둔 페이지입니다.',
    dateNote: '위 날짜는 글에서 다룰 일이 있었던 날이며, 발행일은 아닙니다. 본문은 아직 작성하지 않았습니다.',
    undatedNote: '이 글의 주제와 발행일은 아직 정하지 않았습니다.',
    more: '다른 글', returnHome: '소식 목록으로 돌아가기',
  },
} satisfies Record<Language, Record<string,string>>;
