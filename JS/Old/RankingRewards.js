// ==UserScript==
// @name         Ranking_rewards.js
// @namespace    http://kancolle.wikia.com/wiki/Ranking/Data
// @version      0.1
// @description  Generate ranking tables for Kancolle wikia
// @author       がか
// @match        http://kancolle.wikia.com/wiki/Ranking/Data
// @grant        none
// ==/UserScript==

// Parse ranking tables' rows on the current page.
// Parse ranking tables' rows on the current page.
function parseRows() {
    const rows = [];
    $(".ranking-table").each((_, table) => {
        const year = $(table).data("year"),
            month = $(table).data("month"),
            day = $(table).data("day"),
            time = $(table).data("time");
        $(table).find("tbody tr").each((_, row) => {
            const cells = $(row).find("td");
            rows.push({
                year: year,
                month: month,
                day: day,
                time: time,
                no: parseInt($(cells[0]).text().trim()),
                name: $(cells[1]).text().trim().match(/(.*) /)[1],
                name_ja: $(cells[1]).text().trim().match(/ \((.*)\)/)[1],
                t1: parseInt($(cells[2]).text()),
                t5: parseInt($(cells[3]).text()),
                t20: parseInt($(cells[4]).text()),
                t100: parseInt($(cells[5]).text()),
                t500: parseInt($(cells[6]).text()),
            });
        });
    });
    return rows;
}

// Generate CSV from parsed rows.
function genCSV(rows) {
    return rows.map(row =>
        [row.year, row.month, row.day, row.time, row.no, row.name, row.name_ja, row.t1 || "", row.t5 || "", row.t20 || "", row.t100 || "", row.t500 || ""]
            .join(",")
    ).join("\n");
}

function NestedMap() {
    return {
        index: [],
        arr: [],
        map: {},
        insert: function(keys, value) {
            let index = this.index;
            let arr = this.arr;
            let map = this.map;
            for (const key of keys) {
                if (! map[key]) {
                    index.push(key);
                    map[key] = { index: [], arr: [], map: {} };
                }
                index = map[key].index;
                arr = map[key].arr;
                map = map[key].map;
            }
            arr.push(value);
        }
    };
}

// Group rows back into tables using dates.
function groupRows(rows) {
    const tables = new NestedMap();
    for (const row of rows) {
        tables.insert([row.year, row.month, `${row.day} ${row.time}`], row);
    }
    return tables;
}

// Generate colored tables in wikitext.
function genWikitext(tables) {
    function color(servers) {
        const sorted_tiers = {
            "t1": servers.map(s => s.t1).sort((a, b) => a - b).filter(x => x > 0),
            "t5": servers.map(s => s.t5).sort((a, b) => a - b).filter(x => x > 0),
            "t20": servers.map(s => s.t20).sort((a, b) => a - b).filter(x => x > 0),
            "t100": servers.map(s => s.t100).sort((a, b) => a - b).filter(x => x > 0),
            "t500": servers.map(s => s.t500).sort((a, b) => a - b).filter(x => x > 0),
        }
        for (const server of servers) {
            function formatCells(tier) {
                const formatters = {
                    "-3" : value => `style="background:#BBDEFB"|'''${value}'''`,
                    "-2" : value => `style="background:#BBDEFB"|${value}`,
                    "-1" : value => `style="background:#BBDEFB"|${value}`,
                    "0"  : value => `${value}`,
                    "1"  : value => `style="background:#FFF9C4"|${value}`,
                    "2"  : value => `style="background:#FFCC80"|${value}`,
                    "3"  : value => `style="background:#FFCDD2"|'''${value}'''`,
                };
                const sorted = sorted_tiers[tier];
                const value = server[tier] || "";
                const i1 = sorted.indexOf(value);
                const i2 = sorted.slice().reverse().indexOf(value);
                if (sorted.length < 6) {
                    server[tier] = formatters[0](value);
                } else if (i1 >= 0 && i1 <= 2) {
                    server[tier] = formatters[i1 - 3](value);
                } else if (i2 >= 0 && i2 <= 2) {
                    server[tier] = formatters[3 - i2](value);
                } else {
                    server[tier] = formatters[0](value);
                }
            }
            formatCells("t1");
            formatCells("t5");
            formatCells("t20");
            formatCells("t100");
            formatCells("t500");
        }
    }

    function genRowWikitext(first, server) {
        return `${first ? "" : "|-\n"}|${server.no}
|lang="ja"|${server.name} (${server.name_ja})
|${server.t1}
|${server.t5}
|${server.t20}
|${server.t100}
|${server.t500}`;
    }

    const monthNames = [
        "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
    ];

    let wikitext = "";
    for (const year of tables.index) {
        wikitext += `==${year}==\n`;
        for (const month of tables.map[year].index) {
            wikitext += `===${monthNames[month - 1]}===\n`;
            for (const time of tables.map[year].map[month].index) {
                wikitext += `{| {{RankingTable|${year}|${month}|${time.split(" ")[0]}|${time.split(" ")[1]}}}\n`;
                const servers = tables.map[year].map[month].map[time].arr;
                color(servers);
                let first = true;
                for (const server of servers) {
                    wikitext += genRowWikitext(first, server) + "\n";
                    first = false;
                }
                wikitext += "|}\n";
            }
        }
    }
    return wikitext;
}

// Parse the page, regenerate and copy colored tables in wikitext.
copy(genWikitext(groupRows(parseRows())));

// Parse the page, generate and copy CSV.
copy(genCSV(parseRows()));
