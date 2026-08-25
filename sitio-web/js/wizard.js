// Investment Match Wizard
// Multi-step form that recommends projects based on user preferences

function initWizard(containerId) {
  var container = document.getElementById(containerId);
  if (!container) return;

  var state = {
    step: 0,
    budget: null,
    region: null,
    purpose: [],
    type: null,
    priority: null,
  };

  function buildSteps() {
    return [
      {
        title: T('wizard.step1.title'),
        subtitle: T('wizard.step1.subtitle'),
        type: "single",
        key: "budget",
        options: [
          { value: "0-200", label: T('wizard.step1.opt1.label'), icon: "wallet", desc: T('wizard.step1.opt1.desc') },
          { value: "200-350", label: T('wizard.step1.opt2.label'), icon: "banknote", desc: T('wizard.step1.opt2.desc') },
          { value: "350-500", label: T('wizard.step1.opt3.label'), icon: "banknote", desc: T('wizard.step1.opt3.desc') },
          { value: "500-1000", label: T('wizard.step1.opt4.label'), icon: "gem", desc: T('wizard.step1.opt4.desc') },
          { value: "1000+", label: T('wizard.step1.opt5.label'), icon: "crown", desc: T('wizard.step1.opt5.desc') },
        ],
      },
      {
        title: T('wizard.step2.title'),
        subtitle: T('wizard.step2.subtitle'),
        type: "single",
        key: "region",
        options: [
          { value: "", label: T('wizard.step2.all'), icon: "globe", desc: T('wizard.step2.all_desc') },
        ].concat(
          REGIONS.map(function (r) {
            return { value: r.id, label: r.name, icon: r.icon, desc: r.projectCount + " " + T('project.projects') };
          })
        ),
      },
      {
        title: T('wizard.step3.title'),
        subtitle: T('wizard.step3.subtitle'),
        type: "multi",
        key: "purpose",
        options: [
          { value: "renta-corta", label: T('wizard.step3.renta_corta'), icon: "calendar-check", desc: T('wizard.step3.renta_corta_desc') },
          { value: "plusvalia", label: T('wizard.step3.plusvalia'), icon: "trending-up", desc: T('wizard.step3.plusvalia_desc') },
          { value: "retiro", label: T('wizard.step3.retiro'), icon: "armchair", desc: T('wizard.step3.retiro_desc') },
          { value: "uso-familiar", label: T('wizard.step3.uso_familiar'), icon: "users", desc: T('wizard.step3.uso_familiar_desc') },
          { value: "renta-larga", label: T('wizard.step3.renta_larga'), icon: "key", desc: T('wizard.step3.renta_larga_desc') },
          { value: "desarrollo", label: T('wizard.step3.desarrollo'), icon: "hammer", desc: T('wizard.step3.desarrollo_desc') },
        ],
      },
      {
        title: T('wizard.step4.title'),
        subtitle: T('wizard.step4.subtitle'),
        type: "single",
        key: "type",
        options: [
          { value: "", label: T('wizard.step4.any'), icon: "layout-grid", desc: T('wizard.step4.any_desc') },
          { value: "apartamento", label: T('wizard.step4.apartamento'), icon: "building", desc: T('wizard.step4.apartamento_desc') },
          { value: "villa", label: T('wizard.step4.villa'), icon: "house", desc: T('wizard.step4.villa_desc') },
          { value: "townhouse", label: T('wizard.step4.townhouse'), icon: "door-open", desc: T('wizard.step4.townhouse_desc') },
          { value: "terreno", label: T('wizard.step4.terreno'), icon: "trees", desc: T('wizard.step4.terreno_desc') },
          { value: "comercial", label: T('wizard.step4.comercial'), icon: "store", desc: T('wizard.step4.comercial_desc') },
        ],
      },
      {
        title: T('wizard.step5.title'),
        subtitle: T('wizard.step5.subtitle'),
        type: "single",
        key: "priority",
        options: [
          { value: "roi", label: T('wizard.step5.roi'), icon: "bar-chart-3", desc: T('wizard.step5.roi_desc') },
          { value: "price", label: T('wizard.step5.price'), icon: "piggy-bank", desc: T('wizard.step5.price_desc') },
          { value: "location", label: T('wizard.step5.location'), icon: "map-pin", desc: T('wizard.step5.location_desc') },
          { value: "confotur", label: T('wizard.step5.confotur'), icon: "landmark", desc: T('wizard.step5.confotur_desc') },
          { value: "delivery", label: T('wizard.step5.delivery'), icon: "zap", desc: T('wizard.step5.delivery_desc') },
        ],
      },
    ];
  }

  var steps = buildSteps();

  // Rebuild steps on language change
  document.addEventListener('langchange', function() {
    steps = buildSteps();
    render();
  });

  function render() {
    if (state.step >= steps.length) {
      renderResults();
      return;
    }

    var step = steps[state.step];
    var html =
      '<div class="wizard-progress">';
    for (var i = 0; i < steps.length; i++) {
      var cls = "wizard-dot";
      if (i < state.step) cls += " completed";
      if (i === state.step) cls += " active";
      html += '<div class="' + cls + '"></div>';
    }
    html += "</div>";

    html += '<h2 class="text-center mb-2">' + step.title + "</h2>";
    html += '<p class="text-center text-gray mb-8">' + step.subtitle + "</p>";

    html += '<div class="wizard-options">';
    step.options.forEach(function (opt) {
      var selected = "";
      if (step.type === "multi") {
        if (state[step.key] && state[step.key].indexOf(opt.value) > -1) selected = " selected";
      } else {
        if (state[step.key] === opt.value) selected = " selected";
      }
      html +=
        '<div class="wizard-option' + selected + '" data-value="' + opt.value + '">' +
        '<div class="wizard-option-icon">' + ICON(opt.icon, 28, '#5B9BD5') + "</div>" +
        '<div class="wizard-option-label">' + opt.label + "</div>" +
        '<div class="wizard-option-desc">' + opt.desc + "</div>" +
        "</div>";
    });
    html += "</div>";

    html += '<div class="flex justify-center gap-4 mt-8">';
    if (state.step > 0) {
      html += '<button class="btn btn-outline" id="wizardBack">' + T('wizard.back') + '</button>';
    }
    html += '<button class="btn btn-primary btn-lg" id="wizardNext">' + T('wizard.next') + '</button>';
    html += "</div>";

    container.innerHTML = html;

    // Event listeners
    container.querySelectorAll(".wizard-option").forEach(function (el) {
      el.addEventListener("click", function () {
        var val = el.getAttribute("data-value");
        if (step.type === "multi") {
          if (!state[step.key]) state[step.key] = [];
          var idx = state[step.key].indexOf(val);
          if (idx > -1) {
            state[step.key].splice(idx, 1);
          } else {
            state[step.key].push(val);
          }
          el.classList.toggle("selected");
        } else {
          state[step.key] = val;
          container.querySelectorAll(".wizard-option").forEach(function (o) {
            o.classList.remove("selected");
          });
          el.classList.add("selected");
        }
      });
    });

    var nextBtn = document.getElementById("wizardNext");
    if (nextBtn) {
      nextBtn.addEventListener("click", function () {
        state.step++;
        render();
      });
    }

    var backBtn = document.getElementById("wizardBack");
    if (backBtn) {
      backBtn.addEventListener("click", function () {
        state.step--;
        render();
      });
    }
  }

  function getMatchedProjects() {
    var results = PROJECTS.slice();

    // Filter by budget
    if (state.budget) {
      var parts = state.budget.split("-");
      var min = parseInt(parts[0]) * 1000;
      var max = parts[1] === "+" ? Infinity : parseInt(parts[1]) * 1000;
      results = results.filter(function (p) {
        return p.priceFrom >= min * 0.8 && p.priceFrom <= max * 1.2;
      });
    }

    // Filter by region
    if (state.region) {
      results = results.filter(function (p) {
        return p.region === state.region;
      });
    }

    // Filter by type
    if (state.type) {
      results = results.filter(function (p) {
        return p.type === state.type;
      });
    }

    // Score and sort
    results.forEach(function (p) {
      p._score = 0;

      // Purpose match
      if (state.purpose && state.purpose.length > 0) {
        state.purpose.forEach(function (purpose) {
          if (p.investmentProfile && p.investmentProfile.indexOf(purpose) > -1) {
            p._score += 10;
          }
        });
      }

      // Priority scoring
      if (state.priority === "roi" && p.roi) p._score += 15;
      if (state.priority === "price") p._score += (1000000 - p.priceFrom) / 100000;
      if (state.priority === "confotur" && p.confotur) p._score += 15;
      if (state.priority === "delivery" && p.delivery && p.delivery !== "En Desarrollo") p._score += 10;
      if (state.priority === "location" && (p.region === "punta-cana" || p.subLocation.indexOf("Cap Cana") > -1)) p._score += 10;

      // Bonus for featured
      if (p.featured) p._score += 5;
    });

    results.sort(function (a, b) {
      return b._score - a._score;
    });

    return results.slice(0, 6);
  }

  function renderResults() {
    var matches = getMatchedProjects();

    var html = '<div class="wizard-progress">';
    for (var i = 0; i < steps.length; i++) {
      html += '<div class="wizard-dot completed"></div>';
    }
    html += "</div>";

    if (matches.length === 0) {
      html +=
        '<div style="text-align:center; padding: var(--space-8); background: white; border-radius: var(--radius-xl); margin-bottom: var(--space-6);">' +
        '<p style="margin-bottom: var(--space-3);">' + ICON('search', 48, '#5B9BD5') + '</p>' +
        '<h3 style="color: var(--navy); margin-bottom: var(--space-2);">' + T('wizard.no_results') + '</h3>' +
        '<div style="display: flex; gap: var(--space-3); justify-content: center; flex-wrap: wrap; margin-top: var(--space-6);">' +
        '<button class="btn btn-primary" id="wizardRestart">' + T('wizard.restart') + '</button>' +
        '<a href="/proyectos/" class="btn btn-outline">' + T('common.all_projects') + '</a>' +
        '</div></div>';
    } else {
      html += '<h2 class="text-center mb-2">' + T('wizard.results.title') + '</h2>';
      html += '<p class="text-center text-gray mb-8">' + T('wizard.results.subtitle') + '</p>';
      html += '<div class="projects-grid">';
      matches.forEach(function (project) {
        var regionData = getRegionById(project.region);
        var badges = "";
        if (project.confotur) badges += '<span class="badge badge-confotur">CONFOTUR</span> ';
        if (project.roi) badges += '<span class="badge badge-roi">ROI ' + project.roi + "</span> ";

        var imgStyle = project.image
          ? 'background-image: url(\'' + (typeof window.relRoot === 'function' ? window.relRoot() : '') + project.image + '\'); background-size: cover; background-position: center;'
          : 'background: linear-gradient(135deg, var(--navy), var(--teal));';

        html +=
          '<a href="' + getProjectUrl(project) + '" class="card project-card" style="text-decoration:none; color:inherit;">' +
          '<div class="card-image" style="' + imgStyle + '">' +
          '<div style="position:absolute; bottom: var(--space-3); left: var(--space-3);">' + badges + "</div></div>" +
          '<div class="card-body">' +
          '<p class="card-subtitle">' + (regionData ? regionData.name : "") + " &middot; " + getPublicLocation(project) + "</p>" +
          '<h3 class="card-title">' + getPublicName(project) + "</h3>" +
          '<p class="price">' + formatPriceRange(project) + "</p>" +
          '<div class="card-stats">' +
          (project.bedrooms ? '<span class="stat"><strong>' + project.bedrooms + "</strong> " + T('project.bedrooms') + "</span>" : "") +
          '<span class="stat"><strong>' + formatSize(project) + "</strong></span>" +
          "</div></div></a>";
      });
      html += "</div>";
    }

    // Lead capture
    html +=
      '<div style="margin-top: var(--space-8); padding: var(--space-8); background: var(--navy); border-radius: var(--radius-xl); text-align: center;">' +
      '<h3 style="color: var(--white); margin-bottom: var(--space-2);">' + T('wizard.lead.title') + '</h3>' +
      '<p style="color: rgba(255,255,255,0.7); margin-bottom: var(--space-6);">' + T('wizard.lead.subtitle') + '</p>' +
      '<form id="wizardLeadForm" style="max-width: 400px; margin: 0 auto; text-align: left;">' +
      '<div class="lead-form-inline">' +
      '<div class="form-group"><label class="form-label">' + T('form.nombre') + '</label><input type="text" name="nombre" class="form-input" required></div>' +
      '<div class="form-group"><label class="form-label">' + T('form.email') + '</label><input type="email" name="email" class="form-input" required></div>' +
      '<div class="form-group"><label class="form-label">' + T('form.telefono') + '</label><input type="tel" name="telefono" class="form-input"></div>' +
      '<div class="form-group"><label class="form-label">' + T('form.ciudad') + '</label><input type="text" name="ciudad" class="form-input" placeholder="Ej: New York"></div>' +
      '<div class="form-group"><label class="form-label">' + T('form.zipcode') + '</label><input type="text" name="zipCode" class="form-input" placeholder="' + T('form.placeholder.zipcode') + '"></div>' +
      '<input type="hidden" name="montoInversion" value="' + (state.budget || "") + '">' +
      '<input type="hidden" name="region" value="' + (state.region || "") + '">' +
      '<div class="form-group"><label class="form-label">¿Cómo nos encontraste?</label>' +
      '<select name="comoNosEncontro" class="form-select">' +
      '<option value="">Selecciona una opción</option>' +
      '<optgroup label="Referido por">' +
      '<option value="referido-anyelina">Anyelina</option>' +
      '<option value="referido-giordana">Giordana</option>' +
      '<option value="referido-paola">Paola</option>' +
      '<option value="referido-carmen">Carmen</option>' +
      '<option value="referido-cemi">CEMI</option>' +
      '<option value="amistad">Amistad / Conocido</option>' +
      '<option value="referido-otro">Otro referidor/agente</option>' +
      '</optgroup>' +
      '<optgroup label="Búsqueda en Internet">' +
      '<option value="google">Google</option>' +
      '<option value="bing">Bing</option>' +
      '</optgroup>' +
      '<optgroup label="Redes Sociales">' +
      '<option value="instagram-post">Instagram (publicación)</option>' +
      '<option value="instagram-ad">Instagram (anuncio)</option>' +
      '<option value="linkedin-post">LinkedIn (publicación)</option>' +
      '<option value="linkedin-ad">LinkedIn (anuncio)</option>' +
      '<option value="facebook-post">Facebook (publicación)</option>' +
      '<option value="facebook-ad">Facebook (anuncio)</option>' +
      '</optgroup>' +
      '<option value="otros">Otros medios...</option>' +
      '</select>' +
      '<input type="text" name="comoNosEncontroNombre" class="form-input" style="display:none;margin-top:var(--space-2);" placeholder="¿Quién te refirió?">' +
      '<input type="text" name="otrosMedios" class="form-input" style="display:none;margin-top:var(--space-2);" placeholder="¿Cuál?">' +
      '</div>' +
      '<button type="submit" class="btn btn-primary btn-lg btn-block">' + T('form.submit_contact') + '</button>' +
      "</div></form></div>";

    html +=
      '<div class="text-center mt-6"><button class="btn btn-outline" id="wizardRestart">' + T('wizard.restart') + '</button></div>';

    container.innerHTML = html;

    // Initialize lead form for wizard results
    if (typeof initLeadForm === "function") {
      initLeadForm("wizardLeadForm", "wizard");
    }

    var restartBtns = container.querySelectorAll("#wizardRestart");
    restartBtns.forEach(function(btn) {
      btn.addEventListener("click", function () {
        state = { step: 0, budget: null, region: null, purpose: [], type: null, priority: null };
        render();
      });
    });
  }

  // Start
  render();
}
