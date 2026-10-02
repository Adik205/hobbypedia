/*
  Хоббипедия — скрипты главной, каталога и списка категорий.
  Страницы хобби работают без JavaScript.
*/
(function () {
  "use strict";

  var HP = window.HP;
  if (!HP) return;

  var L = HP.labels;
  var catBySlug = {};
  HP.categories.forEach(function (c) { catBySlug[c.slug] = c; });
  var hobbyBySlug = {};
  HP.hobbies.forEach(function (h) { hobbyBySlug[h.slug] = h; });

  // ---------- Утилиты ----------

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (ch) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch];
    });
  }

  function norm(s) {
    return String(s).toLowerCase().replace(/ё/g, "е").trim();
  }

  function dots(n) {
    return "●".repeat(n) + "○".repeat(5 - n);
  }

  function asList(v) {
    return Array.isArray(v) ? v.map(String) : [String(v)];
  }

  function plural(n, one, few, many) {
    var m10 = n % 10, m100 = n % 100;
    if (m10 === 1 && m100 !== 11) return one;
    if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return few;
    return many;
  }

  function countIn(catSlug) {
    return HP.hobbies.filter(function (h) { return h.category === catSlug; }).length;
  }

  // ---------- Проверка данных (риск «разнобой в метаданных») ----------

  // Диапазон вида "4 000–8 000 ₸" должен лежать внутри порогов своего уровня.
  function checkAmount(h, field, limits, problems) {
    var text = h[field];
    var nums = text ? (String(text).replace(/\s/g, "").match(/\d+/g) || []).map(Number) : [];
    if (!nums.length) {
      problems.push(h.slug + ": не заполнено поле " + field);
      return;
    }
    if (!limits) return; // сам уровень неверный — об этом сообщит основная проверка
    var min = Math.min.apply(null, nums), max = Math.max.apply(null, nums);
    if (min < limits[0] || max > limits[1]) {
      problems.push(h.slug + ": сумма " + field + " = «" + text + "» не совпадает с уровнем");
    }
  }

  function validate() {
    var allowed = {
      cost_start: Object.keys(L.cost),
      cost_monthly: Object.keys(L.cost),
      time_per_week: Object.keys(L.time),
      place: Object.keys(L.place),
      format: Object.keys(L.format),
      activity: Object.keys(L.activity),
      difficulty: ["1", "2", "3", "4", "5"]
    };
    var problems = [];
    HP.hobbies.forEach(function (h) {
      if (!catBySlug[h.category]) problems.push(h.slug + ": неизвестная категория «" + h.category + "»");
      Object.keys(allowed).forEach(function (field) {
        var vals = asList(h[field]);
        if (h[field] === undefined || vals.length === 0) problems.push(h.slug + ": не заполнено поле " + field);
        vals.forEach(function (v) {
          if (allowed[field].indexOf(v) === -1) problems.push(h.slug + ": недопустимое значение " + field + " = «" + v + "»");
        });
      });
      checkAmount(h, "cost_start_kzt", HP.costLimits.start[h.cost_start], problems);
      checkAmount(h, "cost_monthly_kzt", HP.costLimits.monthly[h.cost_monthly], problems);
      var rel = h.related || [];
      if (rel.length < 3 || rel.length > 5) problems.push(h.slug + ": в related должно быть 3–5 хобби, сейчас " + rel.length);
      rel.forEach(function (r) {
        if (!hobbyBySlug[r]) problems.push(h.slug + ": похожее хобби «" + r + "» не найдено");
        if (r === h.slug) problems.push(h.slug + ": хобби ссылается само на себя");
      });
    });
    if (problems.length) {
      console.warn("Хоббипедия: найдены ошибки в js/data.js:\n- " + problems.join("\n- "));
    }
  }

  // ---------- Карточки ----------

  function hobbyCard(h) {
    var cat = catBySlug[h.category];
    var places = h.place.map(function (p) { return L.place[p]; }).join(", ");
    return '' +
      '<article class="card">' +
        '<a class="card-link" href="hobbies/' + esc(h.slug) + '.html">' +
          '<div class="card-head">' +
            '<span class="card-emoji" aria-hidden="true">' + h.emoji + '</span>' +
            '<div><h3 class="card-title">' + esc(h.title) + '</h3>' +
            '<span class="card-cat">' + esc(cat ? cat.name : "") + '</span></div>' +
          '</div>' +
          '<p class="card-summary">' + esc(h.summary) + '</p>' +
          '<dl class="badges">' +
            '<div class="badge-wide" title="Затраты на старт, уровень «' + L.cost[h.cost_start] + '»: ' + L.costStartRange[h.cost_start] + '">' +
              '<dt>На старт</dt><dd><span class="amount">≈ ' + esc(h.cost_start_kzt) + '</span> <span class="lvl lvl-' + h.cost_start + '">' + L.cost[h.cost_start] + '</span></dd></div>' +
            '<div class="badge-wide" title="Расходы в месяц, уровень «' + L.cost[h.cost_monthly] + '»: ' + L.costMonthlyRange[h.cost_monthly] + '">' +
              '<dt>В месяц</dt><dd><span class="amount">≈ ' + esc(h.cost_monthly_kzt) + '</span> <span class="lvl lvl-' + h.cost_monthly + '">' + L.cost[h.cost_monthly] + '</span></dd></div>' +
            '<div><dt>Время</dt><dd>' + L.time[h.time_per_week] + '</dd></div>' +
            '<div><dt>Где</dt><dd>' + esc(places) + '</dd></div>' +
            '<div><dt>Формат</dt><dd>' + L.format[h.format] + '</dd></div>' +
            '<div><dt>Активность</dt><dd>' + L.activity[h.activity] + '</dd></div>' +
            '<div><dt>Сложность</dt><dd><span class="dots" title="' + h.difficulty + ' из 5">' + dots(h.difficulty) + '</span></dd></div>' +
          '</dl>' +
        '</a>' +
        '<ul class="tag-list">' + h.tags.map(function (t) {
          return '<li><a href="catalog.html?q=' + encodeURIComponent(t) + '">' + esc(t) + '</a></li>';
        }).join("") + '</ul>' +
      '</article>';
  }

  function categoryCard(c, withDescription) {
    var n = countIn(c.slug);
    return '' +
      '<a class="category-card" href="catalog.html?category=' + c.slug + '">' +
        '<span class="emoji" aria-hidden="true">' + c.emoji + '</span>' +
        '<span><strong>' + esc(c.name) + '</strong>' +
        '<small>' + n + ' ' + plural(n, "хобби", "хобби", "хобби") + '</small>' +
        (withDescription ? '<p>' + esc(c.description) + '</p>' : '') +
        '</span>' +
      '</a>';
  }

  // ---------- Главная и страница категорий ----------

  function renderCategoryGrids() {
    document.querySelectorAll("[data-render='categories']").forEach(function (el) {
      var withDesc = el.hasAttribute("data-descriptions");
      el.innerHTML = HP.categories.map(function (c) { return categoryCard(c, withDesc); }).join("");
    });
  }

  function renderFeatured() {
    document.querySelectorAll("[data-render='featured']").forEach(function (el) {
      var slugs = (el.getAttribute("data-slugs") || "").split(",").map(function (s) { return s.trim(); });
      el.innerHTML = slugs
        .map(function (s) { return hobbyBySlug[s]; })
        .filter(Boolean)
        .map(hobbyCard)
        .join("");
    });
  }

  function renderCategorySections() {
    document.querySelectorAll("[data-render='category-sections']").forEach(function (el) {
      el.innerHTML = HP.categories.map(function (c) {
        var list = HP.hobbies
          .filter(function (h) { return h.category === c.slug; })
          .sort(function (a, b) { return a.title.localeCompare(b.title, "ru"); });
        return '<section class="section" id="' + c.slug + '">' +
          '<div class="category-intro"><span class="emoji" aria-hidden="true">' + c.emoji + '</span>' +
          '<div><h2>' + esc(c.name) + '</h2><p>' + esc(c.description) + '</p></div></div>' +
          (list.length
            ? '<div class="card-grid">' + list.map(hobbyCard).join("") + '</div>'
            : '<p class="empty-state">Пока здесь нет хобби — скоро появятся.</p>') +
          '</section>';
      }).join("");
    });
  }

  function renderTotals() {
    document.querySelectorAll("[data-render='total']").forEach(function (el) {
      el.textContent = HP.hobbies.length;
    });
  }

  // ---------- Каталог: фильтры и поиск ----------

  function withRanges(ranges) {
    var out = {};
    Object.keys(L.cost).forEach(function (k) { out[k] = L.cost[k] + " (" + ranges[k] + ")"; });
    return out;
  }

  var FILTERS = [
    { key: "start", field: "cost_start", title: "Затраты на старт", options: withRanges(L.costStartRange),
      hint: "Разовые покупки, чтобы начать: снаряжение, инструменты, первые материалы." },
    { key: "month", field: "cost_monthly", title: "Расходы в месяц", options: withRanges(L.costMonthlyRange),
      hint: "Регулярные траты: материалы, абонементы, взносы." },
    { key: "time", field: "time_per_week", title: "Время", options: L.time },
    { key: "place", field: "place", title: "Где", options: L.place },
    { key: "format", field: "format", title: "Формат",
      options: { solo: "одному", group: "с другими" },
      hint: "Хобби, которыми можно заниматься по-разному, подходят под оба варианта." },
    { key: "activity", field: "activity", title: "Активность", options: L.activity },
    { key: "diff", field: "difficulty", title: "Сложность",
      options: { "1": "●○○○○ очень легко", "2": "●●○○○ легко", "3": "●●●○○ средне", "4": "●●●●○ сложно", "5": "●●●●● очень сложно" } }
  ];

  var SORTS = {
    title: function (a, b) { return a.title.localeCompare(b.title, "ru"); },
    difficulty: function (a, b) { return a.difficulty - b.difficulty || SORTS.title(a, b); },
    cost: function (a, b) {
      var rank = { low: 0, medium: 1, high: 2 };
      return (rank[a.cost_start] + rank[a.cost_monthly]) - (rank[b.cost_start] + rank[b.cost_monthly]) || SORTS.title(a, b);
    }
  };

  function readState() {
    var params = new URLSearchParams(window.location.search);
    var state = {
      q: params.get("q") || "",
      category: params.get("category") || "",
      sort: params.get("sort") || "title",
      f: {}
    };
    FILTERS.forEach(function (flt) {
      var raw = params.get(flt.key);
      state.f[flt.key] = raw ? raw.split(",").filter(function (v) { return flt.options[v]; }) : [];
    });
    if (state.category && !catBySlug[state.category]) state.category = "";
    if (!SORTS[state.sort]) state.sort = "title";
    return state;
  }

  function writeState(state) {
    var params = new URLSearchParams();
    if (state.q) params.set("q", state.q);
    if (state.category) params.set("category", state.category);
    FILTERS.forEach(function (flt) {
      if (state.f[flt.key].length) params.set(flt.key, state.f[flt.key].join(","));
    });
    if (state.sort !== "title") params.set("sort", state.sort);
    var qs = params.toString();
    try {
      history.replaceState(null, "", window.location.pathname + (qs ? "?" + qs : ""));
    } catch (e) { /* file:// в некоторых браузерах не даёт менять адрес — не страшно */ }
  }

  function matches(h, state) {
    if (state.category && h.category !== state.category) return false;

    for (var i = 0; i < FILTERS.length; i++) {
      var flt = FILTERS[i];
      var selected = state.f[flt.key];
      if (!selected.length) continue;
      if (flt.key === "format" && h.format === "both") continue;
      var values = asList(h[flt.field]);
      var hit = values.some(function (v) { return selected.indexOf(v) !== -1; });
      if (!hit) return false;
    }

    if (state.q) {
      var cat = catBySlug[h.category];
      var hay = norm([h.title, h.tags.join(" "), cat ? cat.name : ""].join(" "));
      var words = norm(state.q).split(/\s+/).filter(Boolean);
      for (var j = 0; j < words.length; j++) {
        if (hay.indexOf(words[j]) === -1) return false;
      }
    }
    return true;
  }

  function initCatalog(root) {
    var state = readState();

    var chips = root.querySelector("[data-catalog='chips']");
    var intro = root.querySelector("[data-catalog='intro']");
    var form = root.querySelector("[data-catalog='filters']");
    var groups = root.querySelector("[data-catalog='groups']");
    var search = root.querySelector("[data-catalog='q']");
    var sortSel = root.querySelector("[data-catalog='sort']");
    var count = root.querySelector("[data-catalog='count']");
    var results = root.querySelector("[data-catalog='results']");
    var details = root.querySelector("details.filters");
    var headerSearch = document.querySelector(".header-search input");

    if (details && window.matchMedia("(max-width: 860px)").matches) details.removeAttribute("open");

    groups.innerHTML = FILTERS.map(function (flt) {
      return '<fieldset class="filter-group"><legend>' + esc(flt.title) + '</legend>' +
        (flt.hint ? '<p class="filter-hint">' + esc(flt.hint) + '</p>' : '') +
        Object.keys(flt.options).map(function (v) {
          return '<label><input type="checkbox" name="' + flt.key + '" value="' + esc(v) + '"> ' + esc(flt.options[v]) + '</label>';
        }).join("") +
        '</fieldset>';
    }).join("");

    function syncInputs() {
      search.value = state.q;
      if (headerSearch) headerSearch.value = state.q;
      sortSel.value = state.sort;
      FILTERS.forEach(function (flt) {
        groups.querySelectorAll('input[name="' + flt.key + '"]').forEach(function (cb) {
          cb.checked = state.f[flt.key].indexOf(cb.value) !== -1;
        });
      });
    }

    function renderChips() {
      var items = [{ slug: "", name: "Все", emoji: "" }].concat(HP.categories);
      chips.innerHTML = items.map(function (c) {
        var href = c.slug ? "?category=" + c.slug : "?";
        return '<a href="' + href + '" data-cat="' + c.slug + '"' + (state.category === c.slug ? ' aria-current="true"' : '') + '>' +
          (c.emoji ? c.emoji + " " : "") + esc(c.name) + '</a>';
      }).join("");
    }

    function renderIntro() {
      var c = catBySlug[state.category];
      if (!c) {
        intro.hidden = true;
        document.title = "Каталог хобби — Хоббипедия";
        return;
      }
      intro.hidden = false;
      intro.innerHTML = '<span class="emoji" aria-hidden="true">' + c.emoji + '</span>' +
        '<div><h2>' + esc(c.name) + '</h2><p>' + esc(c.description) + '</p></div>';
      document.title = c.name + " — Хоббипедия";
    }

    function render() {
      var list = HP.hobbies.filter(function (h) { return matches(h, state); }).sort(SORTS[state.sort]);
      count.innerHTML = 'Найдено: <strong>' + list.length + '</strong> из ' + HP.hobbies.length;
      if (list.length) {
        results.innerHTML = '<div class="card-grid">' + list.map(hobbyCard).join("") + '</div>';
      } else {
        results.innerHTML = '<div class="empty-state"><p><strong>Ничего не нашлось.</strong></p>' +
          '<p>Попробуйте убрать часть фильтров или изменить запрос.</p>' +
          '<button type="button" class="btn btn-ghost" data-action="reset">Сбросить всё</button></div>';
      }
      renderChips();
      renderIntro();
      writeState(state);
    }

    groups.addEventListener("change", function (e) {
      var cb = e.target;
      if (!cb.name || !state.f[cb.name]) return;
      var arr = state.f[cb.name];
      var idx = arr.indexOf(cb.value);
      if (cb.checked && idx === -1) arr.push(cb.value);
      if (!cb.checked && idx !== -1) arr.splice(idx, 1);
      render();
    });

    search.addEventListener("input", function () {
      state.q = search.value.trim();
      if (headerSearch) headerSearch.value = search.value;
      render();
    });

    if (headerSearch) {
      headerSearch.form.addEventListener("submit", function (e) {
        e.preventDefault();
        state.q = headerSearch.value.trim();
        search.value = headerSearch.value;
        render();
        results.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }

    sortSel.addEventListener("change", function () {
      state.sort = sortSel.value;
      render();
    });

    chips.addEventListener("click", function (e) {
      var a = e.target.closest("a[data-cat]");
      if (!a) return;
      e.preventDefault();
      state.category = a.getAttribute("data-cat");
      render();
    });

    function reset() {
      state.q = "";
      state.category = "";
      FILTERS.forEach(function (flt) { state.f[flt.key] = []; });
      syncInputs();
      render();
    }

    form.addEventListener("reset", function (e) {
      e.preventDefault();
      reset();
    });

    results.addEventListener("click", function (e) {
      if (e.target.closest("[data-action='reset']")) reset();
    });

    syncInputs();
    render();
  }

  // ---------- Запуск ----------

  validate();
  renderTotals();
  renderCategoryGrids();
  renderFeatured();
  renderCategorySections();

  var catalogRoot = document.querySelector("[data-catalog='root']");
  if (catalogRoot) initCatalog(catalogRoot);
})();
