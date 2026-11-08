import type {Language} from '../i18n/ui';

export interface ArticlePhoto {
  src: string;
  width: number;
  height: number;
  copy: Record<Language, {afterParagraph: number; alt: string; caption: string}>;
}

export interface Article {
  id: string;
  number: string;
  /** A user-supplied record date, not a claimed publication date. */
  date: string | null;
  status: 'placeholder' | 'published';
  copy: Record<Language, {title: string; category: string; paragraphs: string[]}>;
  photos?: ArticlePhoto[];
  contactEmail?: string;
}

/** Article numbers follow the planned sequence; the homepage sorts dated entries newest first.
 * Unfilled slots remain empty. Never invent a date or story for one.
 */
export const articles: Article[] = [
  {
    id: 'hello-shimyunbo-com', number: '01', date: '2026-11-05', status: 'published',
    contactEmail: 'yunboshim@gmail.com',
    copy: {
      en: {
        title: 'shimyunbo.com is OPEN!', category: 'Website',
        paragraphs: [
          'I built shimyunbo.com to keep my experience in one place and give people a quick introduction to who I am. Welcome!',
          'Spotted a bug? Have an idea that would make the site better? My inbox is open. Feel free to send me an email.',
        ],
      },
      ko: {
        title: 'shimyunbo.com [경]大 오 픈[축]', category: '웹사이트',
        paragraphs: [
          '제 이력을 한곳에 모아 두고, 제가 어떤 사람인지 간단히 소개할 수 있도록 웹페이지를 만들었습니다. 이름 그대로 shimyunbo.com입니다.',
          '둘러보시다가 오류를 발견하셨거나, 이런 게 있으면 좋겠다 싶은 게 있다면 언제든 메일 주세요. 오류 제보와 개선 의견 모두 환영합니다!',
        ],
      },
    },
  },
  {
    id: 'navy-ax-center-opening', number: '02', date: '2026-11-06', status: 'published',
    copy: {
      en: {
        title: 'Demo day at the Navy AX Center in Busan Centum City', category: 'Field notes',
        paragraphs: [
          'The Navy AX Center has opened in Busan’s Centum City, one of five defense AX hubs being established across Korea. I went to the opening with officers from my unit to demonstrate systems I’ve been developing as an enlisted sailor in the Navy.',
          'The room was full of senior officers, mostly field-grade officers and admirals or generals. The entire enlisted contingent? My junior colleague and me. Two of us.',
          'I had the chance to show my work to the Chief of Naval Operations, the Commandant of the Marine Corps, and the Mayor of Busan, among others. A pretty memorable audience for a demo.',
          'The officers from my unit really looked out for me. Thanks to them, I also got to shake hands with the Navy’s top brass, including the Chief of Naval Operations and the Marine Corps Commandant, and receive challenge coins.',
          'Demos, handshakes, challenge coins. A good haul for the day. My face didn’t make the news, though. A little disappointing.',
        ],
      },
      ko: {
        title: '부산 센텀시티 해군 AX 센터 개소식에서 시연했습니다', category: '현장 기록',
        paragraphs: [
          '부산 센텀시티에 해군 AX 센터가 문을 열었습니다. 전국에 구축 중인 국방 AX 거점 다섯 곳 중 해군의 거점입니다.',
          '해군 AI 체계들을 개발하고 있는 수병으로서, 이번 개소식에서 제가 개발한 체계들을 시연할 기회를 얻었습니다. 덕분에 근무지 간부님들과 함께 부산에 다녀왔습니다.',
          '그런데 가 보니 군인 대부분이 영관급 혹은 장성급 장교였습니다. 병사는 저와 제 후임, 딱 두 명이었습니다.',
          '해군 참모총장님, 해병대 사령관님, 부산시장님 등 여러 분께 제가 개발한 체계들을 선보일 수 있었습니다. 평소 하던 개발이 이렇게 많은 분들 앞에서 시연으로 이어지니 좋은 기회였습니다.',
          '근무지 간부님들께서 잘 챙겨주신 덕분에 참모총장님, 해병대 사령관님 같은 해군 대빵분들과 악수도 하고 챌린지 코인도 받았습니다.',
          '시연도 하고 악수도 하고 코인도 받았는데, 정작 뉴스에는 제 얼굴이 안 나왔습니다. 이건 좀 아쉽네요.',
        ],
      },
    },
    photos: [
      {
        src: '/images/articles/navy-ax-center-opening/navy-ax-center-sailors.webp', width: 1152, height: 2048,
        copy: {
          en: {afterParagraph: 1, alt: 'Two sailors beside the Navy and Marine Corps AX hub sign, with faces and name badges mosaicked.', caption: 'At the Navy and Marine Corps AX hub in Centum City.'},
          ko: {afterParagraph: 2, alt: '해군·해병대 AX 거점 간판 앞의 수병 두 명. 얼굴과 이름표는 모자이크 처리했습니다.', caption: '센텀시티 해군·해병대 AX 거점 앞에서.'},
        },
      },
      {
        src: '/images/articles/navy-ax-center-opening/navy-ax-center-crowd.webp', width: 2048, height: 1152,
        copy: {
          en: {afterParagraph: 2, alt: 'Attendees gathered around demonstration screens at the opening, with visible faces mosaicked.', caption: 'The opening ceremony’s demonstration area.'},
          ko: {afterParagraph: 3, alt: '개소식 시연 화면 주변에 모인 참석자들. 보이는 얼굴은 모자이크 처리했습니다.', caption: '시연을 보기 위해 모인 개소식 참석자들.'},
        },
      },
      {
        src: '/images/articles/navy-ax-center-opening/navy-ax-center-demo.webp', width: 2048, height: 1152,
        copy: {
          en: {afterParagraph: 3, alt: 'A sailor demonstrating an AI system on a monitor, with face and name badge mosaicked.', caption: 'Showing one of the systems at the opening.'},
          ko: {afterParagraph: 4, alt: '모니터 앞에서 AI 체계를 시연하는 수병. 얼굴과 이름표는 모자이크 처리했습니다.', caption: '개소식에서 체계를 시연하는 모습.'},
        },
      },
      {
        src: '/images/articles/navy-ax-center-opening/navy-ax-center-coins.webp', width: 2048, height: 1401,
        copy: {
          en: {afterParagraph: 4, alt: 'Two challenge coins in a hand, from the Marine Corps Commandant and the Chief of Naval Operations.', caption: 'The day’s souvenirs: two challenge coins.'},
          ko: {afterParagraph: 5, alt: '손 위에 놓인 해병대 사령관과 해군 참모총장 챌린지 코인 두 개.', caption: '이날 받은 챌린지 코인 두 개.'},
        },
      },
    ],
  },
  ...(['03', '04', '05'] as const).map(number => ({
    id: `placeholder-${number}`, number, date: null, status: 'placeholder' as const,
    copy: {
      en: {title: `An unwritten page · ${number}`, category: 'Placeholder', paragraphs: []},
      ko: {title: `아직 작성하지 않은 글 · ${number}`, category: '본문 준비 중', paragraphs: []},
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
