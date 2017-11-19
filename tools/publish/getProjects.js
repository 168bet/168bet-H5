#!/usr/bin/env node

/**
 * Created by monkey on 2017/3/29.
 */

var projects = require('./projects.json');

for (var name in projects) {
    console.log("%s", name);
}