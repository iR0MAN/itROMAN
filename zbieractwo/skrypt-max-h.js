// Disclaimer
// By uploading a user-generated mod for use with Tribal Wars, the creator grants InnoGames a perpetual, irrevocable, worldwide, royalty-free, non-exclusive license to use, reproduce, distribute, publicly display, modify, and create derivative works of the mod. This license permits InnoGames to incorporate the mod into any aspect of the game and its related services, including promotional and commercial endeavors, without any requirement for compensation or attribution to the uploader. The uploader represents and warrants that they have the legal right to grant this license and that the mod does not infringe upon any third-party rights. German law applies.

// Original UI and game integration: tilaven
// Max-resources-per-hour optimization: iR0MAN / ChatGPT
// version: 1.0.0

(function () {
    'use strict';

    var VERSION = '1.0.0-max-h';

    // pick game language from game_data.locale (Polish on pl_*, English otherwise)
    var I18n = {
        strings: {
            pl: {
                title: 'Zbieractwo — maksimum na godzinę',
                unit: 'Jednostka',
                send: 'Wysyłaj',
                reserve: 'Rezerwa',
                skipFirst: 'Pomiń poziom 1',
                order: 'Kolejność',
                orderLowFirst: 'Od najniższego',
                orderHighFirst: 'Od najwyższego',
                maxTime: 'Maks. czas',
                redirecting: 'Skrypt działa tylko na ekranie zbieractwa, przekierowuję.',
                filled: 'Wypełniono poziom {level} ({name}). Kliknij Start i odpal ponownie dla kolejnych.'
            },
            en: {
                title: 'Scavenge — maximum per hour',
                unit: 'Unit',
                send: 'Send',
                reserve: 'Reserve',
                skipFirst: 'Skip level 1',
                order: 'Order',
                orderLowFirst: 'Lowest first',
                orderHighFirst: 'Highest first',
                maxTime: 'Max time',
                redirecting: 'Script works only in Scavenging page, redirecting.',
                filled: 'Filled level {level} ({name}). Click Start, then run again for the next ones.'
            },
            ar: {
                title: 'مساعد النهب',
                unit: 'الوحدة',
                send: 'إرسال',
                reserve: 'احتياطي',
                skipFirst: 'تخطي المستوى 1',
                order: 'الترتيب',
                orderLowFirst: 'من الأدنى',
                orderHighFirst: 'من الأعلى',
                maxTime: 'أقصى وقت',
                redirecting: 'هذا السكربت يعمل فقط في صفحة النهب، جارٍ إعادة التوجيه.',
                filled: 'تم ملء المستوى {level} ({name}). اضغط ابدأ، ثم شغّل السكربت مرة أخرى للمستويات التالية.'
            },
            cs: {
                title: 'Asistent sběru surovin',
                unit: 'Jednotka',
                send: 'Odeslat',
                reserve: 'Rezerva',
                skipFirst: 'Přeskočit úroveň 1',
                order: 'Pořadí',
                orderLowFirst: 'Od nejnižší',
                orderHighFirst: 'Od nejvyšší',
                maxTime: 'Max. čas',
                redirecting: 'Skript funguje pouze na stránce sběru surovin, přesměrovávám.',
                filled: 'Vyplněna úroveň {level} ({name}). Klikni na Start, poté spusť skript znovu pro další.'
            },
            nl: {
                title: 'Rooftochten-assistent',
                unit: 'Eenheid',
                send: 'Versturen',
                reserve: 'Reserve',
                skipFirst: 'Niveau 1 overslaan',
                order: 'Volgorde',
                orderLowFirst: 'Laagste eerst',
                orderHighFirst: 'Hoogste eerst',
                maxTime: 'Max. tijd',
                redirecting: 'Script werkt alleen op de rooftochten-pagina, doorverwijzen.',
                filled: 'Niveau {level} ({name}) ingevuld. Klik op Start en voer opnieuw uit voor de volgende.'
            },
            fr: {
                title: 'Assistant de collecte',
                unit: 'Unité',
                send: 'Envoyer',
                reserve: 'Réserve',
                skipFirst: 'Ignorer le niveau 1',
                order: 'Ordre',
                orderLowFirst: 'Du plus bas',
                orderHighFirst: 'Du plus haut',
                maxTime: 'Temps max',
                redirecting: 'Le script fonctionne uniquement sur la page de collecte, redirection.',
                filled: 'Niveau {level} ({name}) rempli. Cliquez sur Démarrer, puis relancez pour les suivants.'
            },
            de: {
                title: 'Raubzug-Assistent',
                unit: 'Einheit',
                send: 'Senden',
                reserve: 'Reserve',
                skipFirst: 'Stufe 1 überspringen',
                order: 'Reihenfolge',
                orderLowFirst: 'Niedrigste zuerst',
                orderHighFirst: 'Höchste zuerst',
                maxTime: 'Max. Zeit',
                redirecting: 'Skript funktioniert nur auf der Raubzug-Seite, leite weiter.',
                filled: 'Stufe {level} ({name}) ausgefüllt. Klicke auf Start und führe das Skript erneut aus für die nächsten.'
            },
            es: {
                title: 'Asistente de recolección',
                unit: 'Unidad',
                send: 'Enviar',
                reserve: 'Reserva',
                skipFirst: 'Omitir nivel 1',
                order: 'Orden',
                orderLowFirst: 'Del más bajo',
                orderHighFirst: 'Del más alto',
                maxTime: 'Tiempo máx.',
                redirecting: 'El script solo funciona en la página de recolección, redirigiendo.',
                filled: 'Nivel {level} ({name}) rellenado. Haz clic en Iniciar y vuelve a ejecutar para los siguientes.'
            },
            it: {
                title: 'Assistente Rovistamento',
                unit: 'Unità',
                send: 'Invia',
                reserve: 'Riserva',
                skipFirst: 'Salta livello 1',
                order: 'Ordine',
                orderLowFirst: 'Dal più basso',
                orderHighFirst: 'Dal più alto',
                maxTime: 'Tempo max',
                redirecting: 'Lo script funziona solo nella pagina di rovistamento, reindirizzamento.',
                filled: 'Livello {level} ({name}) compilato. Clicca Avvia, poi riavvia lo script per i successivi.'
            },
            pt: {
                title: 'Assistente de busca minuciosa',
                unit: 'Unidade',
                send: 'Enviar',
                reserve: 'Reserva',
                skipFirst: 'Saltar nível 1',
                order: 'Ordem',
                orderLowFirst: 'Do mais baixo',
                orderHighFirst: 'Do mais alto',
                maxTime: 'Tempo máx.',
                redirecting: 'O script só funciona na página de busca minuciosa, a redirecionar.',
                filled: 'Nível {level} ({name}) preenchido. Clica em Iniciar e executa novamente para os próximos.'
            },
            pt_br: {
                title: 'Assistente de coleta',
                unit: 'Unidade',
                send: 'Enviar',
                reserve: 'Reserva',
                skipFirst: 'Pular nível 1',
                order: 'Ordem',
                orderLowFirst: 'Do mais baixo',
                orderHighFirst: 'Do mais alto',
                maxTime: 'Tempo máx.',
                redirecting: 'O script só funciona na página de coleta, redirecionando.',
                filled: 'Nível {level} ({name}) preenchido. Clique em Iniciar e execute novamente para os próximos.'
            },
            ro: {
                title: 'Asistent curățare',
                unit: 'Unitate',
                send: 'Trimite',
                reserve: 'Rezervă',
                skipFirst: 'Omite nivelul 1',
                order: 'Ordine',
                orderLowFirst: 'De la cel mai mic',
                orderHighFirst: 'De la cel mai mare',
                maxTime: 'Timp max.',
                redirecting: 'Scriptul funcționează doar pe pagina de curățare, redirecționare.',
                filled: 'Nivelul {level} ({name}) completat. Apasă Start, apoi rulează din nou pentru următoarele.'
            },
            sk: {
                title: 'Asistent zberu surovín',
                unit: 'Jednotka',
                send: 'Odoslať',
                reserve: 'Rezerva',
                skipFirst: 'Preskočiť úroveň 1',
                order: 'Poradie',
                orderLowFirst: 'Od najnižšej',
                orderHighFirst: 'Od najvyššej',
                maxTime: 'Max. čas',
                redirecting: 'Skript funguje iba na stránke zberu surovín, presmerovanie.',
                filled: 'Úroveň {level} ({name}) vyplnená. Klikni na Štart, potom spusti znova pre ďalšie.'
            },
            hu: {
                title: 'Gyűjtögetés asszisztens',
                unit: 'Egység',
                send: 'Küldés',
                reserve: 'Tartalék',
                skipFirst: '1. szint kihagyása',
                order: 'Sorrend',
                orderLowFirst: 'Legalacsonyabbtól',
                orderHighFirst: 'Legmagasabbtól',
                maxTime: 'Max. idő',
                redirecting: 'A szkript csak a gyűjtögetés oldalon működik, átirányítás.',
                filled: '{level} ({name}) szint kitöltve. Kattints a Start gombra, majd futtasd újra a többihez.'
            },
            el: {
                title: 'Βοηθός Σάρωσης',
                unit: 'Μονάδα',
                send: 'Αποστολή',
                reserve: 'Εφεδρεία',
                skipFirst: 'Παράλειψη επιπέδου 1',
                order: 'Σειρά',
                orderLowFirst: 'Από το χαμηλότερο',
                orderHighFirst: 'Από το υψηλότερο',
                maxTime: 'Μέγ. χρόνος',
                redirecting: 'Το script λειτουργεί μόνο στη σελίδα σάρωσης, ανακατεύθυνση.',
                filled: 'Συμπληρώθηκε το επίπεδο {level} ({name}). Πάτησε Έναρξη και τρέξε ξανά για τα επόμενα.'
            },
            tr: {
                title: 'Temizlik asistanı',
                unit: 'Birim',
                send: 'Gönder',
                reserve: 'Yedek',
                skipFirst: '1. seviyeyi atla',
                order: 'Sıralama',
                orderLowFirst: 'En düşükten',
                orderHighFirst: 'En yüksekten',
                maxTime: 'Maks. süre',
                redirecting: 'Komut dosyası yalnızca temizlik sayfasında çalışır, yönlendiriliyor.',
                filled: '{level} ({name}) seviyesi dolduruldu. Başlat\'a tıkla, sonra sonrakiler için tekrar çalıştır.'
            },
            ru: {
                title: 'Помощник сбора ресурсов',
                unit: 'Юнит',
                send: 'Отправить',
                reserve: 'Резерв',
                skipFirst: 'Пропустить уровень 1',
                order: 'Порядок',
                orderLowFirst: 'С низшего',
                orderHighFirst: 'С высшего',
                maxTime: 'Макс. время',
                redirecting: 'Скрипт работает только на странице сбора ресурсов, перенаправление.',
                filled: 'Уровень {level} ({name}) заполнен. Нажми Старт, затем запусти снова для следующих.'
            },
            uk: {
                title: 'Помічник збору ресурсів',
                unit: 'Юніт',
                send: 'Відправити',
                reserve: 'Резерв',
                skipFirst: 'Пропустити рівень 1',
                order: 'Порядок',
                orderLowFirst: 'Від найнижчого',
                orderHighFirst: 'Від найвищого',
                maxTime: 'Макс. час',
                redirecting: 'Скрипт працює лише на сторінці збору ресурсів, перенаправлення.',
                filled: 'Рівень {level} ({name}) заповнено. Натисни Старт, потім запусти знову для наступних.'
            }
        },

        // language from game_data.locale: try full locale first (e.g. "pt_br" to
        // tell Brazilian from European Portuguese), then 2-letter, then English.
        lang: function () {
            var locale = ((window.game_data && window.game_data.locale) || '').toLowerCase().replace('-', '_');
            if (this.strings[locale]) {
                return locale;
            }
            var code = locale.slice(0, 2);
            return this.strings[code] ? code : 'en';
        },

        t: function (key, vars) {
            var str = this.strings[this.lang()][key] || this.strings.en[key] || key;
            if (vars) {
                Object.keys(vars).forEach(function (k) {
                    str = str.replace('{' + k + '}', vars[k]);
                });
            }
            return str;
        }
    };

    var RequiredScreen = {
        isOnScreen: function () {
            var p = new URLSearchParams(window.location.search);
            return p.get('screen') === 'place' && p.get('mode') === 'scavenge';
        },

        generateScavengingUrl: function () {
            return window.TribalWars.buildURL('GET', 'place', {
                mode: 'scavenge',
            })
        },

        redirect: function () {
            if (this.isOnScreen()) {
                return;
            }

            window.UI.InfoMessage(I18n.t('redirecting'));
            var url = this.generateScavengingUrl();
            setTimeout(function () {
                window.location.href = url;
            }, 500);
        }
    };

    var AvailableLevels = {
        // free = unlocked and no squad out. Returns [{level, name, lootFactor}] sorted by level.
        get: function () {
            var options = Scavenge.options();
            var available = [];
            Object.keys(options).forEach(function (key) {
                var opt = options[key];
                if (Settings.skipFirst() && opt.base.id === 1) {
                    return;                            // skip the weakest level when asked
                }
                if (!opt.is_locked && !opt.scavenging_squad) {
                    available.push({level: opt.base.id, name: opt.base.name, lootFactor: opt.base.loot_factor});
                }
            });
            available.sort(function (a, b) {
                return a.level - b.level;
            });
            if (Settings.order() === 'desc') {
                available.reverse();               // fill highest level first
            }
            return available;
        }
    };

    var Units = {
        // archer world? on worlds without archers the entry is absent or empty
        hasArchers: function () {
            var el = document.querySelector('.units-entry-all[data-unit="archer"]');
            return !!el && el.textContent.trim() !== '';
        },

        // unit types to consider (no archers/mounted archers on worlds without them)
        names: function () {
            var all = ['spear', 'sword', 'axe', 'archer', 'light', 'marcher', 'heavy'];
            if (this.hasArchers()) {
                return all;
            }
            return all.filter(function (u) {
                return u !== 'archer' && u !== 'marcher';
            });
        },

        // visible input for a unit — mobile DOM may hold a hidden duplicate widget,
        // so pick the one actually rendered (offsetParent is null when hidden)
        input: function (unit) {
            var inputs = document.querySelectorAll('input[name="' + unit + '"]');
            for (var i = 0; i < inputs.length; i++) {
                if (inputs[i].offsetParent !== null) {
                    return inputs[i];
                }
            }
            return inputs[0] || null;
        },

        // how many of this unit are in the village (from the "(N)" text next to the input)
        available: function (unit) {
            var input = this.input(unit);
            if (!input) {
                return 0;
            }
            var link = input.parentNode.querySelector('.units-entry-all');
            if (!link) {
                return 0;
            }
            var match = link.textContent.match(/\d+/);
            return match ? Number(match[0]) : 0;
        },

        // writes the number into the field and notifies the game framework (mobile-safe)
        fill: function (unit, number) {
            var input = this.input(unit);
            if (!input) {
                return;
            }
            input.value = number;
            input.dispatchEvent(new Event('input', {bubbles: true}));
            input.dispatchEvent(new Event('change', {bubbles: true}));
        }
    };

    // user settings saved in localStorage: per-unit reserve (default 0) and
    // whether to send each unit type at all (default true).
    var Settings = {
        KEY: 'maxHourScavengeSettings',
        data: null,

        load: function () {
            if (this.data === null) {
                var stored = {};
                try {
                    stored = JSON.parse(localStorage.getItem(this.KEY)) || {};
                } catch (e) {
                }
                var sr = stored.reserve || {};
                var se = stored.enabled || {};
                var d = {
                    reserve: {}, enabled: {},
                    collapsed: !!stored.collapsed,                       // default expanded
                    order: stored.order === 'desc' ? 'desc' : 'asc',     // default lowest first
                    skipFirst: !!stored.skipFirst,                       // default include level 1
                    maxDuration: Math.max(0, Number(stored.maxDuration) || 0)  // minutes, 0 = no cap
                };
                Units.names().forEach(function (u) {
                    d.reserve[u] = u in sr ? (Number(sr[u]) || 0) : 0;     // default 0
                    d.enabled[u] = u in se ? !!se[u] : true;               // default on
                });
                this.data = d;
            }
            return this.data;
        },

        save: function () {
            try {
                localStorage.setItem(this.KEY, JSON.stringify(this.data));
            } catch (e) {
            }
        },

        reserve: function (unit) {
            return this.load().reserve[unit] || 0;
        },
        enabled: function (unit) {
            return this.load().enabled[unit] !== false;
        },

        setReserve: function (unit, value) {
            this.load().reserve[unit] = Math.max(0, Number(value) || 0);
            this.save();
        },
        setEnabled: function (unit, value) {
            this.load().enabled[unit] = !!value;
            this.save();
        },

        collapsed: function () {
            return !!this.load().collapsed;
        },
        setCollapsed: function (value) {
            this.load().collapsed = !!value;
            this.save();
        },

        order: function () {
            return this.load().order;
        },
        setOrder: function (value) {
            this.load().order = value === 'desc' ? 'desc' : 'asc';
            this.save();
        },

        skipFirst: function () {
            return !!this.load().skipFirst;
        },
        setSkipFirst: function (value) {
            this.load().skipFirst = !!value;
            this.save();
        },

        maxDuration: function () {
            return this.load().maxDuration || 0;
        },
        setMaxDuration: function (value) {
            this.load().maxDuration = Math.max(0, Math.floor(Number(value)) || 0);
            this.save();
        }
    };

    var Scavenge = {
        // raw scavenging options object from the game, keyed "1".."4" ({} if missing)
        options: function () {
            var s = window.ScavengeScreen;
            return (s && s.village && s.village.options) || {};
        }
    };

    // scavenge run duration math:
    // duration_s = (pow(capacity^2 * 100 * loot_factor^2, 0.45) + 1800) * factor,
    // factor = world_speed^-0.55 (1 on speed-1 worlds)
    var Duration = {
        // carry capacity per unit (matches Units.names())
        CARRY: {spear: 25, sword: 15, axe: 10, archer: 10, light: 80, marcher: 50, heavy: 50},

        factor: function () {
            var speed = (window.game_data && Number(window.game_data.speed)) || 1;
            return Math.pow(speed, -0.55);
        },

        // total carry capacity of a squad {unit: count}
        capacity: function (units) {
            var carry = this.CARRY;
            return Object.keys(units).reduce(function (sum, u) {
                return sum + units[u] * (carry[u] || 0);
            }, 0);
        },

        // inverse of the formula: biggest capacity still finishing within maxSeconds.
        // 0 when maxSeconds is under the fixed 1800s floor (no squad is fast enough).
        maxCapacity: function (maxSeconds, lootFactor) {
            var inner = maxSeconds / this.factor() - 1800;
            if (inner <= 0) {
                return 0;
            }
            return Math.sqrt(Math.pow(inner, 1 / 0.45) / (100 * lootFactor * lootFactor));
        }
    };

    var Planner = {
        // Total resources per hour for one scavenging option. The duration factor
        // changes the displayed value, but not which capacity split is optimal.
        hourly: function (capacity, lootFactor) {
            if (capacity <= 0) {
                return 0;
            }
            var loot = capacity * lootFactor;
            var duration = (Math.pow(capacity * capacity * 100 * lootFactor * lootFactor, 0.45) + 1800)
                * Duration.factor();
            return loot * 3600 / duration;
        },

        // Numerically distribute continuous carrying capacity. At every small step,
        // put the next capacity slice where it raises total resources/hour the most.
        // 6000 slices keeps the result accurate while remaining instant on mobile.
        targetCapacities: function (levels, totalCapacity, maxSeconds) {
            var caps = levels.map(function () { return 0; });
            var limits = levels.map(function (lvl) {
                return maxSeconds > 0 ? Duration.maxCapacity(maxSeconds, lvl.lootFactor) : Infinity;
            });
            var slices = Math.min(6000, Math.max(600, Math.ceil(totalCapacity / 5)));
            var step = totalCapacity / slices;
            var left = totalCapacity;

            while (left > 0.0001) {
                var amount = Math.min(step, left);
                var best = -1;
                var bestGain = -Infinity;
                levels.forEach(function (lvl, i) {
                    if (caps[i] >= limits[i]) {
                        return;
                    }
                    var add = Math.min(amount, limits[i] - caps[i]);
                    var gain = Planner.hourly(caps[i] + add, lvl.lootFactor)
                        - Planner.hourly(caps[i], lvl.lootFactor);
                    if (add > 0 && gain > bestGain) {
                        bestGain = gain;
                        best = i;
                    }
                });
                if (best < 0) {
                    break; // every level reached the user's maximum-duration cap
                }
                var used = Math.min(amount, limits[best] - caps[best]);
                caps[best] += used;
                left -= used;
            }
            return caps;
        },

        // Split integer unit counts as closely as possible to the optimized capacity
        // shares. Largest-remainder rounding uses every enabled unit unless a time cap
        // makes that impossible.
        splitUnit: function (count, shares) {
            var raw = shares.map(function (s) { return count * s; });
            var result = raw.map(function (x) { return Math.floor(x); });
            var left = count - result.reduce(function (a, b) { return a + b; }, 0);
            raw.map(function (x, i) {
                return {i: i, remainder: x - Math.floor(x)};
            }).sort(function (a, b) {
                return b.remainder - a.remainder;
            }).slice(0, left).forEach(function (x) {
                result[x.i]++;
            });
            return result;
        },

        plan: function (levels) {
            var names = Units.names();
            var avail = {};
            names.forEach(function (u) {
                avail[u] = Settings.enabled(u)
                    ? Math.max(0, Units.available(u) - Settings.reserve(u))
                    : 0;
            });

            var totalCapacity = names.reduce(function (sum, u) {
                return sum + avail[u] * (Duration.CARRY[u] || 0);
            }, 0);
            var maxSeconds = Settings.maxDuration() * 60;
            var targets = this.targetCapacities(levels, totalCapacity, maxSeconds);
            var targetTotal = targets.reduce(function (a, b) { return a + b; }, 0);
            var shares = targets.map(function (cap) {
                return targetTotal > 0 ? cap / targetTotal : 0;
            });
            var squads = levels.map(function () { return {}; });

            names.forEach(function (u) {
                var countToUse = avail[u];
                if (targetTotal < totalCapacity && totalCapacity > 0) {
                    countToUse = Math.floor(countToUse * targetTotal / totalCapacity);
                }
                var split = Planner.splitUnit(countToUse, shares);
                split.forEach(function (count, i) {
                    squads[i][u] = count;
                });
            });

            return levels.map(function (lvl, i) {
                return {level: lvl.level, name: lvl.name, units: squads[i]};
            });
        }
    };

    var Dispatcher = {
        // the form is shared across levels, so we fill only the FIRST free one.
        // the user clicks Start manually and re-runs the script for the next ones.
        fillFirst: function (plan) {
            var entry = plan[0];
            Units.names().forEach(function (u) {
                Units.fill(u, entry.units[u] || 0);
            });
            return entry;
        }
    };

    // settings panel injected into the scavenge screen (styled like the game UI)
    var SettingsUI = {
        render: function () {
            if (document.getElementById('maz-settings')) {
                return;                                    // already rendered this load
            }
            var container = document.getElementById('scavenge_screen');
            if (!container) {
                return;
            }

            // reuse the game's own unit icons so the table matches the UI
            function icon(unit) {
                var link = document.querySelector('.unit_link[data-unit="' + unit + '"]');
                return link ? link.innerHTML : unit;
            }

            function enableCell(u) {
                return '<input type="checkbox" data-maz-enable="' + u + '"' + (Settings.enabled(u) ? ' checked' : '') + '>';
            }

            function reserveCell(u) {
                return '<input type="text" size="4" data-maz-reserve="' + u + '" value="' + Settings.reserve(u) + '">';
            }

            function cells(builder) {
                return Units.names().map(function (u) {
                    return '<td style="text-align:center">' + builder(u) + '</td>';
                }).join('');
            }

            var table;
            // wide screen → units as columns (horizontal); narrow → units as rows (vertical)
            if (window.matchMedia('(min-width: 600px)').matches) {
                var heads = Units.names().map(function (u) {
                    return '<th style="text-align:center">' + icon(u) + '</th>';
                }).join('');
                table = '<table class="vis"><tbody>'
                    + '<tr><th></th>' + heads + '</tr>'
                    + '<tr><th>' + I18n.t('send') + '</th>' + cells(enableCell) + '</tr>'
                    + '<tr><th>' + I18n.t('reserve') + '</th>' + cells(reserveCell) + '</tr>'
                    + '</tbody></table>';
            } else {
                var rows = Units.names().map(function (u) {
                    return '<tr>'
                        + '<td style="text-align:center">' + icon(u) + '</td>'
                        + '<td style="text-align:center">' + enableCell(u) + '</td>'
                        + '<td style="text-align:center">' + reserveCell(u) + '</td>'
                        + '</tr>';
                }).join('');
                table = '<table class="vis">'
                    + '<thead><tr><th>' + I18n.t('unit') + '</th><th>' + I18n.t('send') + '</th><th>' + I18n.t('reserve') + '</th></tr></thead>'
                    + '<tbody>' + rows + '</tbody></table>';
            }

            // one cohesive box: header bar + table share a single gold frame.
            // ::marker hidden; own ▸ arrow rotates to ▾ via the [open] state.
            if (!document.getElementById('maz-style')) {
                var style = document.createElement('style');
                style.id = 'maz-style';
                style.textContent =
                    '#maz-settings details{margin:8px 0;border:1px solid #c1a264;border-radius:4px;'
                    + 'background:#f4e4bc;overflow:hidden;display:inline-block;min-width:240px}'
                    + '#maz-settings summary{cursor:pointer;padding:6px 10px;font-size:14px;font-weight:bold;'
                    + 'color:#5d4108;list-style:none;user-select:none}'
                    + '#maz-settings summary::-webkit-details-marker{display:none}'
                    + '#maz-settings summary::before{content:"\\25B8";display:inline-block;margin-right:6px;'
                    + 'transition:transform .15s}'
                    + '#maz-settings details[open] summary::before{transform:rotate(90deg)}'
                    + '#maz-settings details[open] summary{border-bottom:1px solid #c1a264}'
                    + '#maz-settings table{margin:8px}'
                    + '#maz-settings .maz-order{margin:0 8px 8px;font-size:13px;color:#5d4108}'
                    // TW confirm-green fill (like .current-quest) + pulsing glow on the Start button to click
                    + '@keyframes maz-pulse{0%,100%{box-shadow:0 0 4px 1px #0e7a1e}50%{box-shadow:0 0 12px 4px #13c600}}'
                    + '.free_send_button.maz-highlight{animation:maz-pulse 1s infinite;color:#fff!important;'
                    + 'border-color:#006712!important;'
                    + 'background:#0bac00!important;'
                    + 'background:linear-gradient(to bottom,#0bac00 0%,#0e7a1e 100%)!important}';
                document.head.appendChild(style);
            }

            // hour/minute dropdowns for the max-time cap — native wheel pickers on
            // mobile, no free-text parsing. 0:00 = cap off.
            var maxH = Math.floor(Settings.maxDuration() / 60);
            var maxM = Settings.maxDuration() % 60;
            var maxHours = [];
            for (var h = 0; h <= 24; h++) {
                maxHours.push(h);
            }
            var maxMinutes = [];
            for (var m = 0; m < 60; m += 5) {
                maxMinutes.push(m);
            }
            // stored value may fall outside the fixed steps (e.g. old text input) —
            // keep it selectable instead of silently snapping elsewhere
            if (maxHours.indexOf(maxH) === -1) {
                maxHours.push(maxH);
            }
            if (maxMinutes.indexOf(maxM) === -1) {
                maxMinutes.push(maxM);
                maxMinutes.sort(function (a, b) { return a - b; });
            }

            function timeOptions(values, selected, pad) {
                return values.map(function (v) {
                    return '<option value="' + v + '"' + (v === selected ? ' selected' : '') + '>'
                        + (pad && v < 10 ? '0' : '') + v + '</option>';
                }).join('');
            }

            var orderRow = '<div class="maz-order">' + I18n.t('order') + ': '
                + '<select data-maz-order>'
                + '<option value="asc"' + (Settings.order() === 'asc' ? ' selected' : '') + '>' + I18n.t('orderLowFirst') + ' (1 → 4)</option>'
                + '<option value="desc"' + (Settings.order() === 'desc' ? ' selected' : '') + '>' + I18n.t('orderHighFirst') + ' (4 → 1)</option>'
                + '</select></div>'
                + '<div class="maz-order"><label><input type="checkbox" data-maz-skip-first'
                + (Settings.skipFirst() ? ' checked' : '') + '> ' + I18n.t('skipFirst') + '</label></div>'
                + '<div class="maz-order">' + I18n.t('maxTime') + ': '
                + '<select data-maz-max-h>' + timeOptions(maxHours, maxH, false) + '</select>'
                + ' : '
                + '<select data-maz-max-m>' + timeOptions(maxMinutes, maxM, true) + '</select>'
                + '</div>';

            var div = document.createElement('div');
            div.id = 'maz-settings';
            div.innerHTML = '<details' + (Settings.collapsed() ? '' : ' open') + '>'
                + '<summary>' + I18n.t('title') + ' <small style="opacity:.6">v' + VERSION + '</small></summary>'
                + table + orderRow + '</details>';

            // place right after the game's explanatory text, not at the top of the screen
            var anchor = container.querySelector('.explanatory-text');
            if (anchor) {
                anchor.insertAdjacentElement('afterend', div);
            } else {
                container.prepend(div);
            }

            var details = div.querySelector('details');
            details.addEventListener('toggle', function () {
                Settings.setCollapsed(!details.open);   // remember open/closed across loads
            });

            div.querySelectorAll('[data-maz-enable]').forEach(function (cb) {
                cb.addEventListener('change', function () {
                    Settings.setEnabled(cb.getAttribute('data-maz-enable'), cb.checked);
                    App.run();                               // re-split with the new setting
                });
            });
            div.querySelectorAll('[data-maz-reserve]').forEach(function (inp) {
                inp.addEventListener('change', function () {
                    Settings.setReserve(inp.getAttribute('data-maz-reserve'), inp.value);
                    App.run();                               // re-split with the new setting
                });
            });
            div.querySelector('[data-maz-order]').addEventListener('change', function () {
                Settings.setOrder(this.value);
                App.run();                                   // refill starting from the chosen end
            });
            div.querySelector('[data-maz-skip-first]').addEventListener('change', function () {
                Settings.setSkipFirst(this.checked);
                App.run();                                   // re-split without level 1
            });
            function onMaxTimeChange() {
                var h = Number(div.querySelector('[data-maz-max-h]').value);
                var m = Number(div.querySelector('[data-maz-max-m]').value);
                Settings.setMaxDuration(h * 60 + m);
                App.run();                                   // re-split under the new cap
            }
            div.querySelectorAll('[data-maz-max-h], [data-maz-max-m]').forEach(function (sel) {
                sel.addEventListener('change', onMaxTimeChange);
            });
        }
    };

    // green pulse on the Start button of the level we just filled. Clicking it sends
    // the squad, so we then advance to the next free level automatically.
    var Highlight = {
        mark: function (option, level) {
            // clear the cue from the previous run
            document.querySelectorAll('.free_send_button.maz-highlight').forEach(function (b) {
                b.classList.remove('maz-highlight');
            });
            if (!option) {
                return;
            }

            var startBtn = option.querySelector('.free_send_button');
            if (!startBtn) {
                return;
            }
            startBtn.classList.add('maz-highlight');

            // the squad send is async; wait until this level drops out of the free
            // set (max ~6s) before re-running, else we'd just re-fill the same level.
            startBtn.addEventListener('click', function () {
                var tries = 0;
                var poll = setInterval(function () {
                    var stillFree = AvailableLevels.get().some(function (l) {
                        return l.level === level;
                    });
                    if (!stillFree) {
                        clearInterval(poll);
                        App.run(true);                       // fill + scroll to the next level
                    } else if (++tries > 20) {
                        clearInterval(poll);                 // send failed (e.g. not enough units)
                    }
                }, 300);
            }, {once: true});
        }
    };

    var App = {
        // recompute the split and fill the first free level's form.
        // scroll=true (only on script launch) scrolls the filled level into view,
        // handy on mobile; settings tweaks re-run without scrolling.
        run: function (scroll) {
            var levels = AvailableLevels.get();
            if (levels.length < 1) {
                return;                                    // nothing free to fill
            }
            var plan = Planner.plan(levels);
            var filled = Dispatcher.fillFirst(plan);
            window.UI.InfoMessage(I18n.t('filled', {level: filled.level, name: filled.name}));

            // level N is the Nth VISIBLE .scavenge-option in document order.
            // mobile keeps hidden duplicate cards (offsetParent null) — skip those.
            var visible = Array.prototype.filter.call(
                document.querySelectorAll('.scavenge-option'),
                function (o) { return o.offsetParent !== null; }
            );
            var option = visible[filled.level - 1];

            Highlight.mark(option, filled.level);
            if (option && scroll) {
                option.scrollIntoView({behavior: 'smooth', block: 'center'});
            }
        },

        start: function () {
            RequiredScreen.redirect();

            if (!RequiredScreen.isOnScreen()) {
                return;
            }

            SettingsUI.render();
            this.run(true);
        }
    };

    App.start();
})();
