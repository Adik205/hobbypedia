/*
  Хоббипедия — данные каталога.

  Это единственный источник данных для каталога, фильтров, поиска и страниц
  категорий. Значения полей должны совпадать с паспортом на странице хобби
  (hobbies/<slug>.html) и брать значения ТОЛЬКО из списков ниже (раздел 8 PRD):

    category        — slug категории из списка categories
    cost_start      — low | medium | high
    cost_start_kzt  — примерный диапазон затрат на старт, например "4 000–8 000 ₸"
    cost_monthly    — low | medium | high
    cost_monthly_kzt— примерный диапазон расходов в месяц
    time_per_week   — lt2 (до 2 ч/нед) | 2-5 | 5+
    place           — массив из: home | outdoor | studio
    format          — solo | group | both
    activity        — calm | moderate | active
    difficulty      — 1..5
    related         — 3-5 slug-ов других хобби (страницы должны существовать)

  Диапазоны в тенге должны попадать в пороги своего уровня (costStartRange,
  costMonthlyRange). Если значение заполнено неверно или сумма не совпадает
  с уровнем, в консоли браузера (F12) на странице каталога появится
  предупреждение.
*/

window.HP = {
  labels: {
    cost: { low: "низкий", medium: "средний", high: "высокий" },
    // Пороги уровней расходов (раздел 5.1 PRD). Меняются здесь, в costLimits и на about.html.
    costStartRange: { low: "до 10 000 ₸", medium: "10 000–50 000 ₸", high: "свыше 50 000 ₸" },
    costMonthlyRange: { low: "до 5 000 ₸", medium: "5 000–20 000 ₸", high: "свыше 20 000 ₸" },
    time: { "lt2": "до 2 ч/нед", "2-5": "2–5 ч/нед", "5+": "5+ ч/нед" },
    place: { home: "дома", outdoor: "на улице", studio: "в студии / клубе" },
    format: { solo: "одному", group: "с другими", both: "по-разному" },
    activity: { calm: "спокойная", moderate: "умеренная", active: "активная" }
  },

  // Те же пороги числами — для автоматической проверки диапазонов.
  costLimits: {
    start: { low: [0, 10000], medium: [10000, 50000], high: [50000, Infinity] },
    monthly: { low: [0, 5000], medium: [5000, 20000], high: [20000, Infinity] }
  },

  categories: [
    { slug: "tvorchestvo", name: "Творчество", emoji: "🎨",
      description: "Рисование, фотография, лепка и другие способы что-то создать своими руками и глазами." },
    { slug: "sport", name: "Спорт и активный отдых", emoji: "🏃",
      description: "Хобби для тела: от спокойной йоги до скалолазания." },
    { slug: "kollekcionirovanie", name: "Коллекционирование", emoji: "🪙",
      description: "Собирать, изучать и систематизировать: монеты, марки, открытки и не только." },
    { slug: "tehnologii", name: "Технологии и программирование", emoji: "💻",
      description: "Код, электроника и собственные устройства." },
    { slug: "kulinariya", name: "Кулинария", emoji: "🍞",
      description: "Готовить, печь и разбираться во вкусах." },
    { slug: "priroda", name: "Природа и садоводство", emoji: "🌿",
      description: "Растения, птицы и всё, что растёт и живёт рядом с нами." },
    { slug: "muzyka", name: "Музыка", emoji: "🎸",
      description: "Играть на инструментах, петь и сочинять." },
    { slug: "nastolnye-igry", name: "Настольные игры", emoji: "♟️",
      description: "Шахматы, стратегии и игры для компании." },
    { slug: "rukodelie", name: "Рукоделие", emoji: "🧶",
      description: "Вязание, вышивка, плетение: спокойные занятия с понятным результатом." },
    { slug: "nauka", name: "Наука и образование", emoji: "🔭",
      description: "Наблюдать, исследовать и разбираться, как устроен мир." }
  ],

  hobbies: [
    {
      slug: "vyazanie", title: "Вязание", emoji: "🧶", category: "rukodelie",
      tags: ["дома", "одному", "недорого", "спокойно", "пряжа"],
      cost_start: "low", cost_start_kzt: "4 000–8 000 ₸",
      cost_monthly: "low", cost_monthly_kzt: "2 000–5 000 ₸",
      time_per_week: "2-5", place: ["home"], format: "solo", activity: "calm", difficulty: 2,
      related: ["vyshivka", "makrame", "kalligrafiya"],
      summary: "Спицами или крючком из пряжи создают шарфы, свитеры, игрушки. Успокаивает и даёт вещь, которую можно носить."
    },
    {
      slug: "vyshivka", title: "Вышивка", emoji: "🪡", category: "rukodelie",
      tags: ["дома", "одному", "недорого", "спокойно", "нитки"],
      cost_start: "low", cost_start_kzt: "3 000–7 000 ₸",
      cost_monthly: "low", cost_monthly_kzt: "1 500–4 000 ₸",
      time_per_week: "2-5", place: ["home"], format: "solo", activity: "calm", difficulty: 2,
      related: ["vyazanie", "makrame", "akvarel"],
      summary: "Узоры и картины нитками по ткани: крестиком, гладью или в свободной технике."
    },
    {
      slug: "makrame", title: "Макраме", emoji: "🪢", category: "rukodelie",
      tags: ["дома", "одному", "недорого", "интерьер", "плетение"],
      cost_start: "low", cost_start_kzt: "3 000–6 000 ₸",
      cost_monthly: "low", cost_monthly_kzt: "1 000–3 000 ₸",
      time_per_week: "lt2", place: ["home"], format: "solo", activity: "calm", difficulty: 1,
      related: ["vyazanie", "vyshivka", "komnatnye-rasteniya"],
      summary: "Плетение узлами из шнура: кашпо, панно, браслеты. Первую вещь можно сделать за вечер."
    },
    {
      slug: "akvarel", title: "Рисование акварелью", emoji: "🎨", category: "tvorchestvo",
      tags: ["дома", "на улице", "одному", "рисование", "спокойно"],
      cost_start: "medium", cost_start_kzt: "15 000–30 000 ₸",
      cost_monthly: "low", cost_monthly_kzt: "2 000–5 000 ₸",
      time_per_week: "2-5", place: ["home", "outdoor"], format: "solo", activity: "calm", difficulty: 3,
      related: ["kalligrafiya", "fotografiya", "vyshivka"],
      summary: "Рисование прозрачными водяными красками: пейзажи, цветы, скетчи в путешествиях."
    },
    {
      slug: "fotografiya", title: "Фотография", emoji: "📷", category: "tvorchestvo",
      tags: ["на улице", "одному", "с друзьями", "техника", "путешествия"],
      cost_start: "high", cost_start_kzt: "120 000–300 000 ₸",
      cost_monthly: "low", cost_monthly_kzt: "0–3 000 ₸",
      time_per_week: "2-5", place: ["outdoor", "home"], format: "both", activity: "moderate", difficulty: 3,
      related: ["akvarel", "nablyudenie-za-pticami", "astronomiya", "velosiped"],
      summary: "Учиться видеть кадр, работать со светом и обрабатывать снимки. Начать можно и с телефоном."
    },
    {
      slug: "kalligrafiya", title: "Каллиграфия", emoji: "✒️", category: "tvorchestvo",
      tags: ["дома", "одному", "недорого", "спокойно", "письмо"],
      cost_start: "low", cost_start_kzt: "3 000–8 000 ₸",
      cost_monthly: "low", cost_monthly_kzt: "1 000–3 000 ₸",
      time_per_week: "lt2", place: ["home"], format: "solo", activity: "calm", difficulty: 3,
      related: ["akvarel", "vyshivka", "vyazanie"],
      summary: "Искусство красивого письма: ровные буквы, ритм и шрифты от классики до леттеринга."
    },
    {
      slug: "goncharnoe-delo", title: "Гончарное дело", emoji: "🏺", category: "tvorchestvo",
      tags: ["в студии", "с другими", "глина", "руками", "лепка"],
      cost_start: "medium", cost_start_kzt: "15 000–40 000 ₸",
      cost_monthly: "high", cost_monthly_kzt: "25 000–50 000 ₸",
      time_per_week: "2-5", place: ["studio"], format: "both", activity: "moderate", difficulty: 4,
      related: ["vypechka-hleba", "akvarel", "makrame"],
      summary: "Лепка и работа на гончарном круге: чашки, тарелки и вазы, которые потом обжигают в печи."
    },
    {
      slug: "beg", title: "Бег", emoji: "🏃", category: "sport",
      tags: ["на улице", "одному", "с друзьями", "здоровье", "кардио"],
      cost_start: "medium", cost_start_kzt: "25 000–50 000 ₸",
      cost_monthly: "low", cost_monthly_kzt: "0–3 000 ₸",
      time_per_week: "2-5", place: ["outdoor"], format: "both", activity: "active", difficulty: 1,
      related: ["velosiped", "yoga", "skalolazanie"],
      summary: "Самый доступный вид спорта: нужны кроссовки и немного терпения. Хорошо снимает стресс."
    },
    {
      slug: "skalolazanie", title: "Скалолазание", emoji: "🧗", category: "sport",
      tags: ["в зале", "с другими", "сила", "адреналин", "головоломки"],
      cost_start: "medium", cost_start_kzt: "20 000–45 000 ₸",
      cost_monthly: "high", cost_monthly_kzt: "25 000–40 000 ₸",
      time_per_week: "2-5", place: ["studio", "outdoor"], format: "both", activity: "active", difficulty: 3,
      related: ["yoga", "beg", "velosiped"],
      summary: "Лазание по искусственным и природным скалам. Похоже на головоломку, которую решаешь телом."
    },
    {
      slug: "yoga", title: "Йога", emoji: "🧘", category: "sport",
      tags: ["дома", "в зале", "одному", "недорого", "гибкость"],
      cost_start: "low", cost_start_kzt: "5 000–10 000 ₸",
      cost_monthly: "low", cost_monthly_kzt: "0–5 000 ₸",
      time_per_week: "2-5", place: ["home", "studio"], format: "both", activity: "moderate", difficulty: 2,
      related: ["beg", "skalolazanie", "velosiped"],
      summary: "Упражнения на гибкость, силу и дыхание. Можно заниматься дома на коврике по видео."
    },
    {
      slug: "velosiped", title: "Велопрогулки", emoji: "🚲", category: "sport",
      tags: ["на улице", "с друзьями", "одному", "путешествия", "кардио"],
      cost_start: "high", cost_start_kzt: "80 000–200 000 ₸",
      cost_monthly: "low", cost_monthly_kzt: "1 000–4 000 ₸",
      time_per_week: "2-5", place: ["outdoor"], format: "both", activity: "active", difficulty: 2,
      related: ["beg", "fotografiya", "nablyudenie-za-pticami"],
      summary: "Поездки по городу и за его пределы: спорт, транспорт и маленькие путешествия сразу."
    },
    {
      slug: "komnatnye-rasteniya", title: "Комнатные растения", emoji: "🪴", category: "priroda",
      tags: ["дома", "одному", "недорого", "уют", "растения"],
      cost_start: "low", cost_start_kzt: "3 000–10 000 ₸",
      cost_monthly: "low", cost_monthly_kzt: "500–2 000 ₸",
      time_per_week: "lt2", place: ["home"], format: "solo", activity: "calm", difficulty: 1,
      related: ["makrame", "nablyudenie-za-pticami", "arduino"],
      summary: "Выращивать и размножать растения дома. Несколько минут в день и зелёная квартира."
    },
    {
      slug: "nablyudenie-za-pticami", title: "Наблюдение за птицами", emoji: "🐦", category: "priroda",
      tags: ["на улице", "одному", "с друзьями", "природа", "прогулки"],
      cost_start: "medium", cost_start_kzt: "20 000–45 000 ₸",
      cost_monthly: "low", cost_monthly_kzt: "0–2 000 ₸",
      time_per_week: "2-5", place: ["outdoor"], format: "both", activity: "moderate", difficulty: 2,
      related: ["fotografiya", "astronomiya", "velosiped"],
      summary: "Бёрдвотчинг: находить и узнавать птиц в парках, у воды и за городом. Превращает прогулку в поиск."
    },
    {
      slug: "vypechka-hleba", title: "Выпечка хлеба", emoji: "🍞", category: "kulinariya",
      tags: ["дома", "одному", "недорого", "кухня", "закваска"],
      cost_start: "low", cost_start_kzt: "4 000–10 000 ₸",
      cost_monthly: "low", cost_monthly_kzt: "2 000–5 000 ₸",
      time_per_week: "2-5", place: ["home"], format: "solo", activity: "calm", difficulty: 3,
      related: ["goncharnoe-delo", "komnatnye-rasteniya", "vyazanie"],
      summary: "Домашний хлеб на дрожжах и закваске: мука, вода, соль и немного науки."
    },
    {
      slug: "gitara", title: "Игра на гитаре", emoji: "🎸", category: "muzyka",
      tags: ["дома", "одному", "с друзьями", "музыка", "инструмент"],
      cost_start: "medium", cost_start_kzt: "30 000–50 000 ₸",
      cost_monthly: "low", cost_monthly_kzt: "0–3 000 ₸",
      time_per_week: "2-5", place: ["home"], format: "both", activity: "calm", difficulty: 3,
      related: ["kalligrafiya", "shahmaty", "akvarel"],
      summary: "Самый популярный инструмент для начинающих: несколько аккордов и вы уже играете песни."
    },
    {
      slug: "shahmaty", title: "Шахматы", emoji: "♟️", category: "nastolnye-igry",
      tags: ["дома", "онлайн", "с другими", "недорого", "логика"],
      cost_start: "low", cost_start_kzt: "3 000–8 000 ₸",
      cost_monthly: "low", cost_monthly_kzt: "0–2 000 ₸",
      time_per_week: "2-5", place: ["home", "studio"], format: "both", activity: "calm", difficulty: 4,
      related: ["programmirovanie", "gitara", "numizmatika"],
      summary: "Классическая игра стратегии. Можно играть онлайн в любое время или ходить в клуб."
    },
    {
      slug: "programmirovanie", title: "Программирование", emoji: "💻", category: "tehnologii",
      tags: ["дома", "одному", "недорого", "компьютер", "логика"],
      cost_start: "low", cost_start_kzt: "0–5 000 ₸",
      cost_monthly: "low", cost_monthly_kzt: "0–5 000 ₸",
      time_per_week: "5+", place: ["home"], format: "both", activity: "calm", difficulty: 4,
      related: ["arduino", "shahmaty", "astronomiya"],
      summary: "Писать программы, игры и сайты для себя. Нужен только компьютер и бесплатные инструменты."
    },
    {
      slug: "arduino", title: "Электроника и Arduino", emoji: "🔌", category: "tehnologii",
      tags: ["дома", "одному", "техника", "своими руками", "логика"],
      cost_start: "medium", cost_start_kzt: "15 000–30 000 ₸",
      cost_monthly: "low", cost_monthly_kzt: "2 000–5 000 ₸",
      time_per_week: "2-5", place: ["home"], format: "solo", activity: "calm", difficulty: 3,
      related: ["programmirovanie", "astronomiya", "komnatnye-rasteniya"],
      summary: "Собирать свои устройства: мигающие огни, метеостанции, автополив для цветов."
    },
    {
      slug: "numizmatika", title: "Нумизматика", emoji: "🪙", category: "kollekcionirovanie",
      tags: ["дома", "одному", "недорого", "история", "коллекция"],
      cost_start: "low", cost_start_kzt: "3 000–8 000 ₸",
      cost_monthly: "low", cost_monthly_kzt: "1 000–5 000 ₸",
      time_per_week: "lt2", place: ["home"], format: "both", activity: "calm", difficulty: 2,
      related: ["fotografiya", "shahmaty", "kalligrafiya"],
      summary: "Собирать и изучать монеты: история страны в кармане. Начать можно со сдачи."
    },
    {
      slug: "astronomiya", title: "Любительская астрономия", emoji: "🔭", category: "nauka",
      tags: ["на улице", "одному", "с друзьями", "ночью", "наука"],
      cost_start: "high", cost_start_kzt: "80 000–200 000 ₸",
      cost_monthly: "low", cost_monthly_kzt: "0–2 000 ₸",
      time_per_week: "2-5", place: ["outdoor"], format: "both", activity: "calm", difficulty: 3,
      related: ["nablyudenie-za-pticami", "fotografiya", "arduino"],
      summary: "Наблюдать Луну, планеты и звёздные скопления. Начать можно с бинокля и звёздной карты."
    }
  ]
};
