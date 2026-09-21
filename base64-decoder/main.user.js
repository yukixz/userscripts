// ==UserScript==
// @name         Universal Base64 Decoder
// @namespace    https://dazzyd.org/
// @author       Dazzy Ding
// @version      0.2.1
// @description  Automatically decode Base64 plain text on all websites, including dynamically loaded content.
// @match        http://*/*
// @match        https://*/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function () {
    'use strict';

    if (!document.body) return;
    const main = document;
    const marker = 'data-universal-base64';
    const excludedSelector = `a, script, style, noscript, template, svg, math, textarea, input, select, button, [contenteditable]:not([contenteditable="false"]), [${marker}], .v2p-decode-block`;
    const decoder = new TextDecoder('utf-8', { fatal: true, ignoreBOM: true });
    const copyStates = new WeakMap();

    const style = document.createElement('style');
    style.textContent = `
        .universal-base64-result {
            --base64-text: #fb923c;
            --base64-background: #fff7ed;
            --base64-tip-text: #1e293b;
            --base64-tip-background: #fff;
            cursor: copy;
            position: relative;
            padding: 2px 4px;
            font-size: 13px;
            color: var(--v2p-color-orange-400, var(--base64-text));
            text-decoration: none;
            background-color: var(--v2p-color-orange-50, var(--base64-background));
            white-space: pre-wrap;
            overflow-wrap: anywhere;
        }
        #Wrapper.Night .universal-base64-result,
        .v2p-theme-dark-default .universal-base64-result,
        [data-darkreader-scheme="dark"] .universal-base64-result {
            --base64-text: #fbe090;
            --base64-background: #593600;
            --base64-tip-text: #adbac7;
            --base64-tip-background: #2d333b;
        }
        .universal-base64-result::after {
            content: attr(data-copy-label);
            pointer-events: none;
            position: absolute;
            z-index: var(--zidx-tip, 99);
            top: -8px;
            left: 50%;
            transform: translate(-50%, -100%);
            overflow: hidden;
            width: max-content;
            min-width: 30px;
            padding: 2px 5px;
            font-size: 12px;
            color: var(--v2p-color-foreground, var(--base64-tip-text));
            text-align: center;
            white-space: nowrap;
            background-color: var(--v2p-color-bg-tooltip, var(--base64-tip-background));
            border-radius: 4px;
            box-shadow: var(--v2p-widget-shadow, 0 9px 24px -3px rgb(0 0 0 / 6%), 0 4px 8px -1px rgb(0 0 0 / 12%));
            opacity: 0;
        }
        .universal-base64-result:hover::after,
        .universal-base64-result:focus-visible::after,
        .universal-base64-result[data-copy-feedback]::after {
            opacity: 1;
        }
    `;
    document.head.append(style);

    function decode(text) {
        if (text.length <= 8 || text.length % 4 !== 0 ||
            !/^[A-Za-z0-9+/]+={0,2}$/.test(text)) return null;

        try {
            const decoded = decoder.decode(Uint8Array.from(atob(text), char => char.charCodeAt(0)));
            // UTF-8 can still contain binary control bytes; allow only tab, LF and CR.
            if (/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F]/u.test(decoded)) return null;
            return decoded;
        } catch (error) {
            // Invalid Base64 and non-UTF-8 candidates are ordinary page text.
            if (error.name === 'InvalidCharacterError' || error instanceof TypeError) return null;
            throw error;
        }
    }

    async function copy(result, text) {
        clearTimeout(copyStates.get(result)?.timer);
        const state = {};
        copyStates.set(result, state);
        let label = '✅ Copied!';
        let duration = 1000;
        try {
            await navigator.clipboard.writeText(text);
        } catch (error) {
            label = 'Copy failed';
            duration = 2000;
            console.error('Failed to copy decoded Base64:', error);
        }
        // A slower earlier request must not overwrite the latest click's feedback.
        if (copyStates.get(result) !== state) return;
        result.dataset.copyLabel = label;
        result.setAttribute('data-copy-feedback', '');
        state.timer = setTimeout(() => {
            result.dataset.copyLabel = 'Click to copy';
            result.removeAttribute('data-copy-feedback');
            copyStates.delete(result);
        }, duration);
    }

    // Pages can rebuild or clone content, discarding per-element listeners.
    // Delegate to the stable container and read only the decoded DOM text.
    function handleCopy(event) {
        if (event.type === 'keydown' && event.key !== 'Enter' && event.key !== ' ') return;
        const target = event.target instanceof Element ? event.target : event.target.parentElement;
        const result = target?.closest(`[${marker}] > .universal-base64-result`);
        if (!result || !main.contains(result)) return;
        if (event.type === 'keydown') event.preventDefault();
        void copy(result, result.textContent);
    }

    main.addEventListener('click', handleCopy);
    main.addEventListener('keydown', handleCopy);

    function processText(node) {
        if (!node.parentElement || node.parentElement.closest(excludedSelector)) return;
        const text = node.data;
        const fragment = document.createDocumentFragment();
        let offset = 0;

        for (const match of text.matchAll(/[A-Za-z0-9+/=]+/g)) {
            const decoded = decode(match[0]);
            if (decoded === null) continue;

            fragment.append(text.slice(offset, match.index));
            const wrapper = document.createElement('span');
            wrapper.setAttribute(marker, '');
            const result = document.createElement('ins');
            result.textContent = decoded;
            result.className = 'universal-base64-result';
            result.dataset.copyLabel = 'Click to copy';
            result.tabIndex = 0;
            result.setAttribute('role', 'button');
            wrapper.append(match[0], ' ', result);
            fragment.append(wrapper);
            offset = match.index + match[0].length;
        }

        if (offset === 0) return;
        fragment.append(text.slice(offset));
        node.replaceWith(fragment);
    }

    function processContent(content) {
        const body = document.body;
        if (!body || !body.contains(content)) return;
        if (content.nodeType === Node.TEXT_NODE) {
            processText(content);
            return;
        }
        if (content.nodeType !== Node.ELEMENT_NODE || content.closest(excludedSelector)) return;
        // Reject excluded subtrees instead of traversing editors and script contents.
        const walker = document.createTreeWalker(content,
            NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT, {
                acceptNode(node) {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        return node.matches(excludedSelector) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_SKIP;
                    }
                    return NodeFilter.FILTER_ACCEPT;
                }
            });
        const nodes = [];
        while (walker.nextNode()) nodes.push(walker.currentNode);
        nodes.forEach(processText);
    }

    const pending = new Set();
    let scheduled = false;
    const observerOptions = { childList: true, subtree: true, characterData: true };

    function collect(node) {
        if (node.nodeType !== Node.TEXT_NODE && node.nodeType !== Node.ELEMENT_NODE) return;
        const element = node.nodeType === Node.ELEMENT_NODE ? node : node.parentElement;
        if (!element || element.closest(excludedSelector)) return;
        pending.add(node);
    }

    const observer = new MutationObserver(records => {
        for (const record of records) {
            if (record.type === 'characterData') collect(record.target);
            else record.addedNodes.forEach(collect);
        }
        if (pending.size === 0 || scheduled) return;
        scheduled = true;
        queueMicrotask(() => {
            scheduled = false;
            // Include mutations queued after the observer callback, before disconnecting.
            for (const record of observer.takeRecords()) {
                if (record.type === 'characterData') collect(record.target);
                else record.addedNodes.forEach(collect);
            }
            observer.disconnect();
            try {
                for (const content of pending) {
                    // A pending ancestor already covers this subtree.
                    let parent = content.parentNode;
                    while (parent && !pending.has(parent)) parent = parent.parentNode;
                    if (!parent) processContent(content);
                }
            } finally {
                pending.clear();
                observer.observe(main, observerOptions);
            }
        });
    });

    processContent(document.body);
    observer.observe(main, observerOptions);
})();
