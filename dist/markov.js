"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var STX = '\x02';
var EOT = '\x03';
function populate(tree, message, filename) {
    var arr = parse(message);
    for (var i = 0; i < arr.length - 2; i++) {
        append(tree, arr[i], arr[i + 1], arr[i + 2]);
    }
    writeOut(tree, filename);
}
exports.populate = populate;
function talk(tree) {
    var first = next(tree, STX);
    var second = next(tree, STX, first);
    var out = [first];
    while (second !== EOT) {
        out.push(second);
        var n = next(tree, first, second);
        first = second;
        second = n;
    }
    return out.join(' ');
}
exports.talk = talk;
function parse(message) {
    return __spreadArrays([STX], message.split(' '), [EOT]);
}
function append(branch) {
    var add = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        add[_i - 1] = arguments[_i];
    }
    var b = branch;
    add.forEach(function (word) {
        if (!b.children[word])
            b.children[word] = { value: 0, children: {} };
        b.children[word].value++;
        b = b.children[word];
    });
    return b;
}
function next(tree) {
    var words = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        words[_i - 1] = arguments[_i];
    }
    var l = last(tree, words);
    var options = Object.keys(l.children);
    var weighted = [];
    options.forEach(function (option) {
        weighted = __spreadArrays(weighted, Array(l.children[option].value).fill(option));
    });
    return options[Math.floor(Math.random() * options.length)];
}
function last(tree, words) {
    var last = tree;
    words.forEach(function (word, i) {
        last = last.children[word];
        if (!last)
            throw new Error("Word " + word + " at index " + i + " doesn't exist");
    });
    return last;
}
function writeOut(tree, filename) {
    var out = JSON.stringify(tree, function (key, value) { return typeof value === 'object' && Object.keys(value).length === 0 ? undefined : value; });
    fs.writeFile('./trees/' + filename + '.json', out, function (err) { if (err)
        throw err; });
}
