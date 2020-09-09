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
        term_1.default.register(['youtube', 'yt'], youtube);
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