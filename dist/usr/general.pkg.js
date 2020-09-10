"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-enable no-unused-vars */
const term_1 = __importDefault(require("../term"));
const axios_1 = __importDefault(require("axios"));
const logging_1 = __importDefault(require("../logging"));
exports.default = {
    install() {
        term_1.default.register(['clap'], clap);
        term_1.default.register(['bless'], bless);
        term_1.default.register(['al-bless'], quran);
        term_1.default.register(['youtube', 'yt'], youtube);
        initQuran();
    }
};
function clap({ args }, reply) { reply(args.join('👏') + '👏'); }
function bless(_, reply) {
    logging_1.default('calling bless api', 1);
    axios_1.default.get('http://labs.bible.org/api/?passage=random&type=json')
        .then((res) => {
        logging_1.default('response from bless api', 1);
        if (res.status < 200 || res.status > 300)
            return;
        const { bookname, chapter, verse, text } = res.data[0];
        reply(`**${bookname} ${chapter}:${verse}** ${text}`);
    })
        .catch(e => logging_1.default(e));
}
const quranIndex = [];
async function initQuran() {
    const res = await axios_1.default.get('http://api.quran.com:3000/api/v3/chapters');
    if (res.status < 200 || res.status > 300)
        return;
    const { data } = res;
    let startingVerse = 1;
    data.chapters.forEach(({ verses_count }) => {
        quranIndex.push([startingVerse, verses_count]);
        startingVerse += verses_count;
    });
}
async function quran(_, reply) {
    try {
        logging_1.default('calling quran api', 1);
        const chapter = Math.floor(Math.random() * quranIndex.length);
        const [start, run] = quranIndex[chapter];
        const verse = start + Math.floor(Math.random() * run);
        const res = await axios_1.default.get(`http://api.quran.com:3000/api/v3/chapters/${chapter + 1}/verses/${verse}/`);
        if (res.status < 200 || res.status > 300)
            return;
        const { verse_key, text_simple } = res.data.verse;
        reply(`**${verse_key}**  ${text_simple}`);
    }
    catch (e) {
        logging_1.default(e);
    }
}
const yturl = 'https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&key=AIzaSyAMTINdBOQCIE0ArDVVED2Ia5f0zwpIi1w&q=';
function youtube({ args }, reply) {
    axios_1.default.get(yturl + encodeURIComponent(args.join(' ')))
        .then((res) => {
        if (res.status < 200 || res.status > 300)
            return;
        const id = res.data.items[0].id.videoId;
        if (id != null)
            reply(`https://youtube.com/watch?v=${id}`);
    })
        .catch(e => logging_1.default(e));
}
//# sourceMappingURL=general.pkg.js.map