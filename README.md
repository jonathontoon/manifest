
# ❏ Manifest

[![GitHub Release](https://img.shields.io/github/release/jonathontoon/manifest.svg)](https://github.com/jonathontoon/manifest/releases/latest)
[![Size](https://img.shields.io/bundlephobia/minzip/manifest?style=flat)](https://github.com/jonathontoon/manifest/releases/latest)
[![Project License](https://img.shields.io/github/license/jonathontoon/manifest.svg)](https://github.com/jonathontoon/manifest/blob/master/LICENSE)

![Manifest](https://i.imgur.com/yIS8dNW.png)

### Table of Contents

- [Introduction](#introduction)
- [FAQ](#faq)
- [Report Bugs](#report-bugs)
- [Donate](#Donate)
- [Acknowledgements](#acknowledgements)

## Introduction
Manifest is a grid-based pinboard for note taking. Simply click and drag anywhere to create a note and snap it to the grid set by your current window size. All notes can be be moved, resized and deleted. Your browser's local storage is also utilized to save notes between sessions.

## FAQ

### 1. Is this available as some kind of web extension?
In order to avoid investing too much in a single eco-system there's no plan to create an extension right now.

### 2. What about a desktop app?
Given that the easiest way to make a desktop app would use something like [Electron](https://github.com/electron) or most likely [DeskGap](https://github.com/patr0nus/DeskGap), which are just web views themselves, there's nothing really unique that a desktop-specific app could offer. For now at least offline/progressive web app support is a goal for this project.

### 3. Can Manifest work on mobile?
Manifest is not a mobile-centric product. This is intentional, as the specific experience and interactions which offer such experience rely on more accurate types of input. If mobile support was made possible though it would most likely require it's own bespoke experience. In saying that, tablet support is definitely a goal for this project.

### 4. What is Manifest built with?
Simply vanilla JS and SASS, bundled with Parcel.

### 5. Does Manifest use any analytics?
Zero. Manifest provides no connection to a server, and no data is ever sent outside of the browser. All data is stored locally.

## Report Bugs
Please create a Github [issue](https://github.com/jonathontoon/manifest/issues), following the `ISSUE_TEMPLATE.md` and provide as much information as possible regarding the bug, including screenshots or error codes.

## Donate
Manifest is free and will always be free. However if you'd like to contribute a small donation via [LiberaPay](https://liberapay.com/jonathontoon/) to help pay for domain and server costs it would be greatly appreciated.

## Acknowledgements

Thank you to [bnjm](https://www.github.com/bnjm) for help with the grid snapping logic, as well as everyone who helped test the first release.
