import type {Language} from '../i18n/ui';

export interface Article {
  id: string;
  number: string;
  /** A user-supplied record date, not a claimed publication date. */
  date: string | null;
  status: 'placeholder' | 'published';
  copy: Record<Language, {title: string; category: string; paragraphs: string[]}>;
}

/** Article numbers follow the planned sequence; the homepage sorts dated entries newest first.
 * These are deliberately empty. Never invent a date or story for an unfilled slot.
 */
export const articles: Article[] = [
  {
    id: 'hello-shimyunbo-com', number: '01', date: '2026-11-05', status: 'placeholder',
    copy: {
      en: {title: 'A new home at shimyunbo.com', category: 'Website', paragraphs: []},
      ko: {title: '개인 사이트 shimyunbo.com을 만들었습니다', category: '웹사이트', paragraphs: []},
    },
  },
  {
    id: 'navy-ax-center-opening', number: '02', date: '2026-11-06', status: 'placeholder',
    copy: {
      en: {title: 'A demonstration at the Navy AX Center opening in Busan Centum City', category: 'Field notes', paragraphs: []},
      ko: {title: '부산 센텀시티, 해군 AX 센터 개소식에서의 시연', category: '현장 기록', paragraphs: []},
    },
  },
  ...(['03', '04', '05'] as const).map(number => ({
    id: `placeholder-${number}`, number, date: null, status: 'placeholder' as const,
    copy: {
      en: {title: `An unwritten page · ${number}`, category: 'Placeholder', paragraphs: []},
      ko: {title: `아직 쓰지 않은 페이지 · ${number}`, category: '빈 포스트', paragraphs: []},
    },
  })),
];

export function latestArticles(): Article[] {
  return [...articles].sort((a,b) => (b.date ?? '').localeCompare(a.date ?? '') || a.number.localeCompare(b.number));
}

export function articleDate(date: string, lang: Language): string {
  // UTC makes the supplied calendar date independent of build and reader time zones.
  return new Intl.DateTimeFormat(lang === 'ko' ? 'ko-KR' : 'en-US', {
    year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC',
  }).format(new Date(date + 'T00:00:00Z'));
}
