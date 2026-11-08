import {entries as source,type Entry} from '../data/entries.ts';
// Editorial translations of approved public content. Dates and IDs remain shared.
const ko:Record<string,[string,string,string,string[]]>={
'born':['출생','개인 이력','2001년 7월 5일 출생.',['생년월일: 2001년 7월 5일.']],
'navy-enlistment':['대한민국 해군 입대','대한민국 해군','2025년 8월 18일 해군 입대.',['입대일: 2025년 8월 18일.']],
'jade-apple-studio':['산학협력 연구 프로젝트','제이드애플스튜디오 · 성균관대학교 IoT 연구실','프라이빗 블록체인 네트워크와 웹 플랫폼을 개발했습니다.',['프로젝트명: 블록체인 기반 SNS 인플루언서 마케팅 플랫폼 개발.','지도교수: 정재훈.','웹 플랫폼을 위한 프라이빗 블록체인 네트워크를 설계하고 Hyperledger Fabric 스마트 컨트랙트와 블록체인 기반 웹 플랫폼을 개발했습니다.']],
'computing-student-council':['사무국장','소프트웨어융합대학 학생회','학과 행사를 기획하고 학생과 교수 간의 소통, 학생 복지를 지원했습니다.',['학과 행사를 기획하고 학생과 교수 간의 소통을 지원했습니다.','학생 복지 업무와 예산·협력업체 관리, 총회 진행을 담당했습니다.']],
'navy':['AI개발특기병','대한민국 해군','정보 추출, 시뮬레이션, 영상 모니터링 연구에 필요한 AI를 개발합니다.',['대한민국 해군에서 AI개발특기병으로 복무 중입니다.']],
'opic':['OPIc','ACTFL','AL',['취득 등급은 Advanced Low(AL)입니다.']],
'information-processing':['정보처리기사','한국산업인력공단','정보처리 국가기술자격.',['정보처리 분야 국가기술자격을 취득했습니다.']],
'bannangco':['대표이사','(주)반낭코','서비스 개발과 웹·백엔드 연동, LLM 기반 데이터 파이프라인 구축을 이끌었습니다.',['12명으로 구성된 팀을 이끌었습니다.','관광지 입장권 메타검색 플랫폼 MusePicker의 데이터 수집 파이프라인과 LLM 기반 분류를 개발했습니다.','미팅GO, 프렌딩, Splash의 기획, 웹 개발, 백엔드 연동, 클라우드 인프라 및 QA에 참여했습니다.']],
'codime':['기술개발팀 · 매니저','㈜코디미','LoRA로 Stable Diffusion을 fine-tuning하고, 이미지 생성과 데이터 수집 워크플로를 개발했습니다.',['LoRA를 활용해 Stable Diffusion을 fine-tuning했습니다.','같은 인물의 이미지를 일관되게 생성하는 프롬프트 워크플로와 Selenium을 활용한 패션 이미지 수집 워크플로를 개발했습니다.']],
'cassopi':['대표','CassoPi(카소피)','3인 팀을 이끌며 NFT 마켓플레이스, 스마트 컨트랙트, 여러 사람이 함께 글을 남기는 게시판 서비스를 개발했습니다.',['3명으로 구성된 팀을 이끌었습니다.','NFT 마켓플레이스와 여러 사람이 함께 글을 남기는 온라인 게시판 서비스 개발에 참여했습니다.']],
'snu-hci':['연구 인턴','서울대학교 · HCI 연구실','시각화와 인터페이스를 연구했습니다.',['지도교수: 서진욱.','프로젝트: 시계열 데이터 군집의 몰입형 시각화, 디자인 키트를 활용한 모바일 UI 자동 생성, Academic MOIRAI: 지적 관계 매핑.','서울대학교 연구실에서 인턴으로 활동하던 2023년 가을, 정보시각화와 시각적분석 수업을 청강하며 연구실 구성원들과 Academic MOIRAI를 만들었습니다.','팀에서는 React와 D3로 철학자 타임라인, 지도, 인물 관계 상세 화면을 구현하고, 검색 결과와 선택한 인물이 각 화면에 함께 표시되도록 연동했습니다.','Academic MOIRAI는 Wikidata의 인물 관계와 Wikipedia의 설명을 함께 활용합니다. 프로젝트 포스터에는 Doc2Vec으로 구한 텍스트 유사도를 네트워크상 거리에 반영하는 방법이 담겨 있습니다.']],
'ibk':['산학협력 연구 프로젝트','IBK투자증권 · 성균관대학교','Sector Clustering과 인터랙티브 분석으로 과거 시장에서 서로 비슷한 시기를 찾는 방법을 연구했습니다.',['프로젝트명: ML과 빅데이터 분석을 이용한 시장 유사성 기반 최적 투자전략 발굴 모델 개발.','지도교수: YoungSook Hwang.','Sector Clustering 기법을 연구하고 검증했습니다. 알고리즘을 Python 모듈로 구현하고, 웹 기반 EDA 인터페이스를 개발했습니다.','팀에서 개발한 Sector Clustering 파이프라인은 섹터별 시장 특성에 RobustScaler, TruncatedSVD, Affinity Propagation을 적용해 과거 시장에서 서로 비슷한 시기를 찾습니다.','팀에서는 React·Django·MongoDB를 기반으로 시장 분석, EDA, 포트폴리오 화면을 구현했습니다.','이 플랫폼은 과거 시장의 유사도를 분석한 결과를 포트폴리오 탐색과 백테스팅에 활용하도록 구성되어 있습니다.']],
'skku':['소프트웨어학과 학사','성균관대학교','학사 학위 · 평점 3.94 / 4.5.',['시스템프로그래밍실습(2023년 가을학기), 공학컴퓨터프로그래밍(2023년 봄학기) 수업의 조교로 활동했습니다.']],
'fancake':['개발팀장 (CTO)','fanCake','크리에이터의 영상 클립을 NFT로 거래하는 플랫폼을 개발한 창업 프로젝트입니다.',['창업 프로젝트에서 CTO로 개발팀을 이끌었습니다.','팀에서는 크리에이터와 팬을 인터뷰하고, 크리에이터의 협조를 받아 MVP에 영상을 등록했습니다.','팀에서는 Google Analytics 분석 결과와 사용성 테스트를 바탕으로 사용자 경험을 개선했습니다.']],
'makers-secretariat':['1기 사무국장','메이커즈 사무국 · 포항제철고등학교','교내 학생들과 지역 학생들을 위한 메이커 대회를 운영했습니다.',['메이커즈 사무국 1기 사무국장으로 활동했습니다.','포항제철고등학교 ‘무한상상 메이커즈’ 대회와 포항 ‘함께하는 메이커즈’ 대회를 개최했습니다.','‘함께하는 메이커즈’에서는 포항 지역 중학생을 모집해 고등학생, 멘토와 팀을 이루고 함께 문제를 해결하도록 했습니다.']],
'pohang':['고등학교','포항제철고등학교','컴퓨터·과학 분야의 활동과 학생 주도 활동에 참여했습니다.',['컴퓨터 동아리 New Folder를 창설했습니다.','정보·과학 분야 공로상을 받았습니다.']],
'ict-volunteer':['ICT 교육 담당 · 고등학교 팀장','월드프렌즈코리아 해외ICT봉사단 · 태국 수랏타니','아두이노와 한국 문화를 가르쳤습니다.',['고등학교 팀의 ICT 교육을 총괄했습니다.','교재를 만들고 수업을 미리 연습한 뒤, 수랏피타야 학교에서 4주간 아두이노와 한국 문화를 가르쳤습니다.']],
'metaverse':['3D 게임 개발 팀장','SKKU Metaverse Studio','Spore Survival · VR 생존 게임.',['Spore Survival 프로젝트를 이끌고 GIGDC에 출품했습니다.','사용 도구: Unity 3D, C#, VFX, XR Interaction Toolkit.']],
 'triple-s':['창설자 및 회장','SKKU Triple-S club','회원 100명 이상이 활동하는 교내 스포츠 동아리입니다.',['초대 및 제2대 회장을 역임했습니다.','회원 100명 이상의 교내 공식 스포츠 동아리를 창설하고 운영했습니다.']],
'mentor-2022':['C 프로그래밍 멘토 · 팀장','고등학교 성균SW멘토링 · 매향여자정보고등학교','방과 후 프로그래밍 멘토링을 진행했습니다.',['월 2회 C 프로그래밍 멘토링을 진행했습니다.']],
'mentor-2021':['Python 프로그래밍 멘토','고등학교 성균SW멘토링 · 수일고등학교','방과 후 프로그래밍 멘토링을 진행했습니다.',['Python 프로그래밍 멘토링을 진행했습니다.']],
'hit':['회원 · 중급 스터디','SKKU HIT (Hackers InTrusion)','정보보안을 공부했습니다.',['정기 정보보안 스터디에 참여했습니다.']],
'likelion':['NFT 블록체인 애플리케이션 교육','멋쟁이사자처럼 · 카카오 그라운드X','Klaytn 기반 애플리케이션 개발 교육에 참여했습니다.',['멋쟁이사자처럼과 카카오 그라운드X가 공동 진행한 교육입니다.','GroundX의 Klaytn 블록체인 네트워크를 활용해 NFT 애플리케이션을 개발했습니다.']],
'hackathon-2022':['최우수상','한국컴퓨터교육학회','SW중심대학 캡스톤 디자인 및 AI 해커톤 경진대회.',['SW중심대학 캡스톤 디자인 및 AI 해커톤 경진대회 최우수상.']],
'ai-competition-2022':['장려상','SW중심대학협의회','SW중심대학 공동 AI 경진대회.',['SW중심대학 공동 AI 경진대회 장려상.']],
'craftsman':['프로그래밍기능사','한국산업인력공단','프로그래밍 분야 국가기술자격 · 구 정보처리기능사.',['현재 자격 명칭은 프로그래밍기능사(구 정보처리기능사)입니다. 날짜는 처음 자격을 취득한 날입니다.']],
'tashkent':['','타슈켄트 국제학교 (Tashkent International School)','국제학교에 재학했습니다.',['Director’s Honor Roll에 3회, Principal’s Honor Roll에 1회 선정되었습니다. 각각의 선정 시기는 기록되어 있지 않습니다.']],
'dubai':['','American School of Dubai','국제학교에 재학했습니다.',['American School of Dubai에 재학했습니다.']],
'hcmc':['','International School of Ho Chi Minh City','국제학교에 재학했습니다.',['International School of Ho Chi Minh City에 재학했습니다.']],
 'ta-fall':['조교 · 시스템프로그래밍실습','성균관대학교','담당교수: 이준원.',['담당교수: 이준원.']],
 'ta-spring':['조교 · 공학컴퓨터프로그래밍','성균관대학교','담당교수: 정윤경.',['담당교수: 정윤경.']],
};

const moves:Record<string,string>={'move-hcmc':'베트남 호치민시티','move-seoul':'대한민국 서울','move-dubai':'아랍에미리트 두바이','move-tashkent':'우즈베키스탄 타슈켄트','move-ulsan':'대한민국 울산','move-pohang':'대한민국 포항','move-suwon':'대한민국 수원'};
for(const [id,city] of Object.entries(moves)){const final=(city.charCodeAt(city.length-1)-0xAC00)%28;const to=final===0||final===8?'로':'으로';ko[id]=[`${city}${to} 이사`,city,`${city}${to} 거주지를 옮겼습니다.`,[`${city}${to} 이사했습니다.`]];}
const awards:Record<string,string>={'deans-list':'Dean’s List','recommendation':'학과 추천 장학금','excellence-2022':'성적우수 장학금','excellence-2023':'성적우수 장학금','leader-spring':'학생성공 리더 장학금','leader-fall':'학생성공 리더 장학금'};
for(const [id,title] of Object.entries(awards))ko[id]=[title,'성균관대학교',id==='deans-list'?'우수한 학업 성적으로 Dean’s List에 선정되었습니다.':`${title}을 받았습니다.`,[id==='deans-list'?'해당 학기에 Dean’s List에 선정되었습니다.':'해당 학기에 장학금을 받았습니다.']];
// Original titles are those supplied in the current CV; translated titles are identified in details.
export const paperTitles:Record<string,{en:string;ko:string;original:string;language:'en'|'ko'}>={
'battle-records-kcc-2026':{en:source.find(e=>e.id==='battle-records-kcc-2026')!.title,ko:'역사 전투 기록 정보추출을 위한 근거 보존형 스키마와 자원 구축',original:'역사 전투 기록 정보추출을 위한 근거 보존형 스키마와 자원 구축',language:'ko'},
'drone-hyperspectral-2024':{en:'An Autoencoder Bottleneck Compression Framework for Mission-Oriented Drone Hyperspectral Image Transmission',ko:source.find(e=>e.id==='drone-hyperspectral-2024')!.title,original:source.find(e=>e.id==='drone-hyperspectral-2024')!.title,language:'ko'},
'ship-fire-smoke-2026':{en:source.find(e=>e.id==='ship-fire-smoke-2026')!.title,ko:'공개자료 기반 함정형 다중 CCTV·화재연기 조기경보 시스템의 설계와 예비 검증',original:'공개자료 기반 함정형 다중 CCTV·화재연기 조기경보 시스템의 설계와 예비 검증',language:'ko'},
'defense-ms-records-2026':{en:'Evidence-Preserving Information Extraction and Representation of Historical Battle Records for Defense M&S Input',ko:source.find(e=>e.id==='defense-ms-records-2026')!.title,original:source.find(e=>e.id==='defense-ms-records-2026')!.title,language:'ko'},
'civilian-impact-2026':{en:'From Scenarios to Dynamic Graphs and Persona Banks: LLM-Based Civilian Impact Simulation for Operational Planning Support',ko:source.find(e=>e.id==='civilian-impact-2026')!.title,original:source.find(e=>e.id==='civilian-impact-2026')!.title,language:'ko'},
'parent-resolution':{en:source.find(e=>e.id==='parent-resolution')!.title,ko:source.find(e=>e.id==='parent-resolution')!.title,original:source.find(e=>e.id==='parent-resolution')!.title,language:'en'},
'kiit-2023':{en:source.find(e=>e.id==='kiit-2023')!.title,ko:'가상 환경에서의 고차원 시계열 데이터 시각화',original:'가상 환경에서의 고차원 시계열 데이터 시각화',language:'ko'},
'icact-2022':{en:source.find(e=>e.id==='icact-2022')!.title,ko:source.find(e=>e.id==='icact-2022')!.title,original:source.find(e=>e.id==='icact-2022')!.title,language:'en'},
};
const papers:Record<string,[string,string,string[]]>={
'battle-records-kcc-2026':['한국컴퓨터종합학술대회 (KCC)','한국컴퓨터종합학술대회 논문집, 2026.',['2026년 한국컴퓨터종합학술대회(KCC) 논문집에 수록된 논문입니다.']],
'drone-hyperspectral-2024':['해양과학기술','해양과학기술 제61호, 2026년 6월.',['해양과학기술 제61호, 2026년 6월.']],
'ship-fire-smoke-2026':['함정기술·무기체계 세미나','함정기술·무기체계 세미나 논문집, 2026.',['2026년 함정기술·무기체계 세미나 논문집에 수록된 논문입니다.']],
'defense-ms-records-2026':['국방M&S 세미나','국방M&S 세미나, 2026 · 구두 발표.',['2026년 국방M&S 세미나에서 구두 발표된 논문입니다.']],
'civilian-impact-2026':['국방M&S 세미나','국방M&S 세미나, 2026.',['국방M&S 세미나, 2026.']],
'parent-resolution':['ACL Rolling Review','ACL Rolling Review에 투고한 원고, 2026년 10월.',['ACL Rolling Review에 투고한 원고이며, 학회 게재가 확정된 논문은 아닙니다.']],
'kiit-2023':['한국정보기술학회','우수논문상 · 동상.',['2023년 11월 한국정보기술학회에서 발표된 논문입니다.','우수논문상(동상)을 수상했습니다.']],
'icact-2022':['ICACT','International Conference on Advanced Communication Technology.',['2022년 국제학술대회에 게재한 논문입니다.']],
};
export function localizedEntries(lang:'en'|'ko'):Entry[]{return source.map(e=>{
 const p=paperTitles[e.id];if(lang==='en')return {...e,title:p?.en??e.title,details:e.id==='hackathon-2022'?['First Prize · SW-centered University Capstone Design & AI Hackathon.']:e.id==='ai-competition-2022'?['Honorable Mention · Joint AI Competition for SW-centered Universities.']:e.details,summary:e.id==='information-processing'?'National technical qualification in information processing.':e.id==='craftsman'?'National technical qualification in programming.':e.summary};
 const a=ko[e.id],b=papers[e.id];if(p&&b)return {...e,title:p.ko,organization:b[0],summary:b[1],details:b[2],status:e.status==='Submitted manuscript'?'투고 원고':e.status==='Conference paper'?'학술대회 논문':e.status};
 if(!a)throw new Error(`Missing Korean entry: ${e.id}`);return {...e,title:a[0],organization:a[1],summary:a[2],details:a[3]};
});}
