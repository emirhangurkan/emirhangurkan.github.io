// The English markup is the default and the fallback when JavaScript is unavailable.
// Turkish translations are authored here, including the few intentional formatting tags.
const turkish = {
  skip: 'İçeriğe geç',
  navProjects: 'Projeler <span>03</span>',
  navAbout: 'Hakkımda',
  navEmail: 'E-posta <span aria-hidden="true">↗</span>',
  sceneHint: 'DEĞİŞİM İÇİN KAYDIR <span aria-hidden="true">↓</span>',
  reelLabel: 'KURDUĞUM DÜNYALARDAN BİRKAÇI',
  railIntro: 'GİRİŞ', railPlay: '01 / OYNA', railStory: '02 / KEŞFET', railConnect: '03 / BİRLİKTE',
  heroRole: '<span class="live-dot" aria-hidden="true"></span> YAZILIM MÜHENDİSİ / BAĞIMSIZ ÜRETİCİ',
  heroDescription: 'Endüstriyel yazılımlardan oyun dolu dünyalara.<br>Fikirleri kullanabileceğin, oynayabileceğin<br>ve içinde kaybolabileceğin şeylere dönüştürüyorum.',
  getInTouch: 'İLETİŞİME GEÇ',
  exploreWorlds: 'DÜNYALARI KEŞFET<small>MERAKIMIN PEŞİNDEN ÜÇ FARKLI YOL</small>',
  heroNote: '<span class="scroll-cue" aria-hidden="true">↓</span> SAHNEYİ DEĞİŞTİRMEK İÇİN KAYDIR.<br>BİR ÜRETİCİ. ÜÇ DÜNYA.',
  indexPlay: '<small>01</small> OYNA <span aria-hidden="true">↓</span><b>BLOCK BLUUP</b>',
  indexStory: '<small>02</small> KEŞFET <span aria-hidden="true">↓</span><b>GECE DOSYASI</b>',
  indexConnect: '<small>03</small> BİRLİKTE <span aria-hidden="true">↓</span><b>KALRADYA CO-OP</b>',
  selectedWorlds: 'SEÇİLİ DÜNYALAR', scrollToEnter: 'KEŞFETMEK İÇİN KAYDIR ↓',
  playEyebrow: '<span class="chapter-index">01</span> MOBİL OYUN / UNITY · C#',
  playTitle: 'KÜÇÜK<br>HAMLE,<br><em>BÜYÜK OYUN.</em>',
  playDescription: 'Doğru parçayı bul. Biraz yer aç. Bir sonraki hamlene alan yarat. Bir kez daha denemenin keyfi üzerine kurulu, rengârenk bir mobil bulmaca oyunu.',
  storeGoogle: 'BURADAN İNDİR', storeApple: 'BURADAN İNDİR',
  qrSummary: 'Telefonunda oynamak için tara',
  qrHint: 'Telefonunun kamerasını aç ve kodlardan birine doğrult.',
  followPlay: 'OYUNU TAKİP ET', projectContact: 'PROJE İLETİŞİMİ',
  storyEyebrow: '<span class="chapter-index">02</span> VİDEO HİKÂYELER / TÜRKÇE',
  storyTitle: 'DAHA<br>YAKINDAN<br><em>BAK.</em>',
  storyDescription: 'Tarih, efsaneler ve geride bıraktıkları sorular. Sonra ne olduğunu hep merak edenler için anlatılan hikâyeler.',
  storyLink: 'Gece Dosyası’nı keşfet <span aria-hidden="true">↗</span>',
  followStories: 'HİKÂYELERİ TAKİP ET',
  connectEyebrow: '<span class="chapter-index">03</span> AÇIK KAYNAKLI ARAÇ / C# · WINDOWS',
  connectTitle: 'BİRLİKTE<br><em>DAHA İYİ.</em>',
  connectDescription: 'Kurulumla daha az, birlikte oynamakla daha çok zaman geçir. Bannerlord co-op oyuncularının sunucu hazırlamasına, bağlanmasına ve kayıtlarını yönetmesine yardımcı olan açık kaynaklı bir araç.',
  connectLink: 'Projeyi incele <span aria-hidden="true">↗</span>',
  aboutEyebrow: 'DÜNYALARIN ARKASINDAKİ KİŞİ', aboutTitle: 'DOĞAMDAN<br><em>MERAKLIYIM.</em>',
  aboutName: 'Ben Emirhan Gürkan.<span>Yazılım mühendisi. Üretici. Hikâye anlatıcısı.</span>',
  aboutWork: 'Profesyonel hayatımda yazılımı endüstriyle buluşturuyorum: üretim takibi, sistem entegrasyonları ve C#, .NET ile SQL kullanılarak geliştirilen veri araçları. Karmaşık şeyleri daha anlaşılır ve kullanışlı hâle getirmeyi seviyorum.',
  aboutCreate: 'Aynı merak beni Unity oyunlarına, açık kaynaklı araçlara ve Gece Dosyası’na da taşıyor. Farklı biçimler; bir fikri zaman ayırmaya değer bir şeye dönüştürme isteği aynı.',
  storytelling: 'HİKÂYE ANLATICILIĞI',
  contactEyebrow: 'HER GÜZEL FİKİR BİR YERDEN BAŞLAR.', contactTitle: 'HADİ<br><em>KONUŞALIM.</em>',
  personalEmail: 'KİŞİSEL / İŞ VE İŞ BİRLİĞİ',
  socialPersonal: '01 / PROJELERİN ARKASI', socialCode: '02 / KOD VE DENEYLER', socialCareer: '03 / PROFESYONEL PROFİL',
  footerTagline: 'OYUNLAR. ARAÇLAR. HİKÂYELER.', backToTop: 'BAŞA DÖN ↑'
};

const turkishAria = {
  home: 'Emirhan Gürkan, ana sayfa', navigation: 'Ana gezinme',
  interactiveScene: 'Kaydırdıkça değişen proje çizimleri. İsteğe bağlı 3D görünüm açılabilir.',
  journey: 'Portfolyoda yolculuk', selectedProjects: 'Seçili projeler',
  playSocials: 'Block Bluup sosyal medya hesapları', storySocials: 'Gece Dosyası sosyal medya hesapları',
  storeLinks: 'Block Bluup indirme bağlantıları',
  emailContacts: 'E-posta iletişim adresleri'
};

export const sceneCopy = {
  en: {
    intro: ['00 / THE MAKER', 'A sculptural E/G monogram surrounded by the colors of three project worlds.'],
    play: ['01 / BLOCK BLUUP', 'A floating Block Bluup puzzle board with colorful, rounded pieces.'],
    story: ['02 / GECE DOSYASI', 'The Gece Dosyası fingerprint question mark, sculpted in red.'],
    connect: ['03 / KALRADYA CO-OP', 'The Kalradya Co-op bronze shield and crossed swords.']
  },
  tr: {
    intro: ['00 / ÜRETİCİ', 'Üç proje dünyasının renkleriyle çevrili, heykelsi bir E/G monogramı.'],
    play: ['01 / BLOCK BLUUP', 'Renkli, yuvarlak parçalarıyla havada süzülen Block Bluup bulmaca tahtası.'],
    story: ['02 / GECE DOSYASI', 'Kırmızı renkte, parmak izi biçimindeki Gece Dosyası soru işareti.'],
    connect: ['03 / KALRADYA CO-OP', 'Kalradya Co-op’un bronz kalkanı ve çapraz kılıçları.']
  }
};

export function initLanguage(onChange) {
  const switcher = document.querySelector('.language-switch');
  const buttons = [...switcher.querySelectorAll('button[data-language]')];
  const content = [...document.querySelectorAll('[data-i18n]')].map(element => ({ element, english: element.innerHTML }));
  const labels = [...document.querySelectorAll('[data-i18n-aria]')].map(element => ({ element, english: element.getAttribute('aria-label') }));
  const originalTitle = document.title;
  const metaDescription = document.querySelector('meta[name="description"]');
  const originalDescription = metaDescription.content;

  function setLanguage(language, remember = false) {
    const lang = language === 'tr' ? 'tr' : 'en';
    document.documentElement.lang = lang;
    content.forEach(({ element, english }) => { element.innerHTML = lang === 'tr' ? turkish[element.dataset.i18n] : english; });
    labels.forEach(({ element, english }) => { element.setAttribute('aria-label', lang === 'tr' ? turkishAria[element.dataset.i18nAria] : english); });
    buttons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.language === lang)));
    document.title = lang === 'tr' ? 'Emirhan Gürkan — Yazılım. Oyun. Hikâyeler.' : originalTitle;
    metaDescription.content = lang === 'tr' ? 'Emirhan Gürkan — yazılım mühendisi ve bağımsız üretici. Block Bluup, Gece Dosyası ve Kalradya Co-op’u keşfedin; iletişime geçin.' : originalDescription;
    if (remember) { try { localStorage.setItem('portfolio-language', lang); } catch { /* The switch still works without storage. */ } }
    onChange(lang);
  }

  buttons.forEach(button => button.addEventListener('click', () => setLanguage(button.dataset.language, true)));
  let saved = 'en';
  try { saved = localStorage.getItem('portfolio-language') || 'en'; } catch { /* Default to English. */ }
  setLanguage(saved);
  switcher.hidden = false;
}
