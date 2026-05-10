'use strict';

const SNIPPETS = {
    1: {
        id: 'yt_w8cgbl', // Id nya bebas, sesuaikan sama a href di /explore/index.html
        slug: 'ytsearch',
        title: 'YouTube Search',
        desc: 'Cari vidio YouTube berdasarkan query, menggunakan Javascript NodeJS ESM MODULE',
        filename: 'ytsearch.js',
        lang: 'JavaScript',
        langShort: 'JS',
        langType: 'javascript',
        icon: 'code',
        updated: '24 April 2026',
        code: `import axios from "axios";

async function ytSearch(query) {
  try {
    if (!query || typeof query !== "string") {
      throw new Error("Query wajib diisi");
    }

    const searchUrl = \`https://www.youtube.com/results?search_query=\${encodeURIComponent(query)}\`;

    const { data: html } = await axios.get(searchUrl, {
      headers: {
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/122 Safari/537.36",
        "accept-language": "en-US,en;q=0.9"
      },
      timeout: 20000
    });

    const match = html.match(/var ytInitialData = (.*?);<\\/script>/s);

    if (!match) {
      throw new Error("Gagal parsing data YouTube");
    }

    const json = JSON.parse(match[1]);

    const contents = json?.contents?.twoColumnSearchResultsRenderer?.primaryContents
      ?.sectionListRenderer?.contents?.[0]?.itemSectionRenderer?.contents || [];

    const results = contents
      .filter(item => item.videoRenderer)
      .map(item => {
        const video = item.videoRenderer;

        return {
          title: video?.title?.runs?.map(v => v.text).join("") || null,
          duration: video?.lengthText?.simpleText || "LIVE / N/A",
          channel: video?.ownerText?.runs?.[0]?.text || null,
          views: video?.viewCountText?.simpleText || null,
          thumbnail: video?.thumbnail?.thumbnails?.pop()?.url || null,
          url: \`https://www.youtube.com/watch?v=\${video.videoId}\`
        };
      });

    return {
      success: true,
      total: results.length,
      results
    };
  } catch (err) {
    return {
      status: false,
      error: err.message
    };
  }
}

// Penggunaan
ytSearch("Dea Afrizal")
  .then(res => console.log(JSON.stringify(res, null, 2)))
  .catch(console.error);`
    },
    
    2: {
        id: 'gh_kvk5qc',
        slug: 'github-stalk',
        title: 'Github Stalker',
        desc: 'Mencari Infomasi Akun Github Seseorang berdasarkan username github',
        filename: 'githubstalk.js',
        lang: 'JavaScript',
        langShort: 'JS',
        langType: 'javascript',
        icon: 'code',
        updated: '24 April 2026',
        code: `import axios from "axios";

async function githubStalk(username) {
  try {
    if (!username) throw new Error("Username required");

    const { data } = await axios.get(\`https://api.github.com/users/\${username}\`, {
      headers: {
        "accept": "application/vnd.github+json",
        "user-agent": "Mozilla/5.0"
      }
    });

    return {
      success: true,
      identity: {
        username: data.login,
        name: data.name || "-",
        id: data.id,
        node_id: data.node_id,
        profile_url: data.html_url,
        avatar: data.avatar_url
      },
      profile: {
        bio: data.bio || "-",
        location: data.location || "-",
        company: data.company || "-",
        blog: data.blog || "-",
        hireable: data.hireable ?? false
      },
      stats: {
        public_repos: data.public_repos,
        public_gists: data.public_gists,
        followers: data.followers,
        following: data.following
      },
      activity: {
        created_at: data.created_at,
        updated_at: data.updated_at,
        type: data.type,
        admin: data.site_admin
      }
    };
  } catch (err) {
    return {
      status: false,
      error: err.response?.data?.message || err.message
    };
  }
}

// Penggunaan
githubStalk("RIFKIror")
  .then(console.log)
  .catch(console.error);`
    },
    
    3: {
    id: "yt_dl_93GhK2",
    slug: "savetube-dl",
    title: "SaveTube Downloader",
    desc: "Download video atau audio YouTube menggunakan Node.js, axios, dan decrypt AES.",
    filename: "savetube.js",
    lang: "JavaScript",
    langShort: "JS",
    langType: "javascript",
    icon: "download",
    updated: "24 Februari 2026",
    code: `import axios from "axios"
import crypto from "crypto"

async function savetube(link, quality = "720") {
  try {
    if (!link) throw new Error("Link nya mana?")

    const match = link.match(/(?:youtube\\.com\\/(?:watch\\?v=|embed\\/|shorts\\/|v\\/)|youtu\\.be\\/)([a-zA-Z0-9_-]{11})/)

    if (!match) throw new Error("URL YouTube tidak valid")
    const videoId = match[1]
    const allowed = ["144","240","360","480","720","1080","mp3"]

    if (!allowed.includes(quality)) {
      throw new Error("Quality tersedia: 144,240,360,480,720,1080,mp3")
    }

    const client = axios.create({
      headers: {
        "content-type": "application/json",
        "origin": "https://yt.savetube.me",
        "user-agent": "Mozilla/5.0 (Linux; Android 15) AppleWebKit/537.36 Chrome/130 Mobile Safari/537.36"
      }
    })

    const cdnReq = await client.get("https://media.savetube.vip/api/random-cdn")
    const cdn = cdnReq.data.cdn

    const infoReq = await client.post(\\\`https://\\\${cdn}/v2/info\\\`, {
      url: \\\`https://www.youtube.com/watch?v=\\\${videoId}\\\`
    })

    const encrypted = Buffer.from(infoReq.data.data, "base64")
    const key = Buffer.from(
      "C5D58EF67A7584E4A29F6C35BBC4EB12",
      "hex"
    )

    const iv = encrypted.subarray(0,16)

    const decipher = crypto.createDecipheriv(
      "aes-128-cbc",
      key,
      iv
    )

    const decrypted = Buffer.concat([
      decipher.update(encrypted.subarray(16)),
      decipher.final()
    ])

    const meta = JSON.parse(decrypted.toString())

    const downloadType = quality === "mp3" ? "audio" : "video"
    const q = quality === "mp3" ? "128" : quality

    const download = await client.post(\\\`https://\\\${cdn}/download\\\`, {
      id: videoId,
      downloadType,
      quality: q,
      key: meta.key
    })

    const dl = download.data?.data?.downloadUrl

    if (!dl) {
      throw new Error("Download URL tidak ditemukan")
    }

    const durationMin = Math.floor(meta.duration / 60)
    const durationSec = meta.duration % 60

    return {
      title: meta.title,
      type: downloadType,
      quality: q,
      duration: \\\`\\\${durationMin}:\\\${durationSec.toString().padStart(2,"0")}\\\`,
      thumbnail: meta.thumbnail || \\\`https://i.ytimg.com/vi/\\\${videoId}/maxresdefault.jpg\\\`,
      download: dl
    }
  } catch (err) {
    return console.log(err.message)
  }
}

(async () => {
  const res = await savetube('https://youtu.be/NLb6h_7NAW0?si=WXx02PumG_4GUe6x')
  console.log(res)
})()`
    },

        4: {
        id: "sv_2zipLzS",
        slug: "saveweb2zip",
        title: "Save Web To Zip",
        desc: "Download 1 website utuh jadi bentuk .zip",
        filename: "saveweb2zip.js",
        lang: "JavaScript",
        langShort: "JS",
        langType: "javascript",
        icon: "download",
        updated: "10 Mei 2026",
        code: `import axios from "axios";

const client = axios.create({
  baseURL: "https://copier.saveweb2zip.com/api",
  timeout: 20000,
  headers: {
    accept: "*/*",
    "content-type": "application/json",
    origin: "https://saveweb2zip.com",
    referer: "https://saveweb2zip.com/",
    "user-agent": "Mozilla/5.0 (Linux; Android 14; SM-A225F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Mobile Safari/537.36",
    "accept-language": "en-US,en;q=0.9",
    "cache-control": "no-cache",
    pragma: "no-cache",
    "sec-ch-ua":
      "\\"Chromium\\";v=\\"137\\", \\"Not/A)Brand\\";v=\\"24\\", \\"Google Chrome\\";v=\\"137\\"",
    "sec-ch-ua-mobile": "?1",
    "sec-ch-ua-platform": "\\"Android\\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-site"
  }
});

async function saveweb2zip(url, config = {}) {
  try {
    if (!url) {
      throw new Error("Full URL is required.");
    }

    if (!/^https:\\/\\//i.test(url)) {
      throw new Error("URL must use https://");
    }

    const payload = {
      url,
      renameAssets: config.renameAssets ?? false,
      saveStructure: config.saveStructure ?? false,
      alternativeAlgorithm: config.alternativeAlgorithm ?? false,
      mobileVersion: config.mobileVersion ?? false
    };

    const { data: start } = await client.post("/copySite", payload);

    if (!start?.md5) {
      throw new Error("Failed to initialize cloning process.");
    }

    let progressData = null;

    while (true) {
      const { data } = await client.get(
        \`/getStatus/\${start.md5}\`
      );

      progressData = data;

      if (data?.isFinished) {
        break;
      }

      await new Promise(resolve =>
        setTimeout(resolve, 1500)
      );
    }

    return {
      success: true,
      metadata: {
        target: url,
        task: progressData.md5,
        files: progressData.copiedFilesAmount || 0,
        finished: progressData.isFinished || false
      },
      result: {
        download:
          \`https://copier.saveweb2zip.com/api/downloadArchive/\${progressData.md5}\`
      },
      status: {
        error_code: progressData.errorCode || null,
        error_message: progressData.errorText || null
      }
    };
  } catch (err) {
    return {
      success: false,
      error: err.message
    };
  }
}

(async () => {
  const result = await saveweb2zip(
    "https://kynns.vercel.app",
    {
      renameAssets: true,
      saveStructure: true
    }
  );
  console.log(JSON.stringify(result, null, 2));
})();`
    }
};

const Highlighter = (() => {
    function esc(str) {
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    const JS_KEYWORDS = new Set([
        'break','case','catch','class','const','continue','debugger','default',
        'delete','do','else','export','extends','finally','for','function',
        'if','in','instanceof','let','new','of','return','static','super',
        'switch','this','throw','try','typeof','var','void','while','with','yield',
        'async','await','get','set'
    ]);
    const JS_MODULE_KW = new Set(['import','export','from','as','default']);
    const JS_BOOLEANS  = new Set(['true','false','null','undefined','NaN','Infinity']);
    const JS_BUILTINS  = new Set([
        'console','Math','Array','Object','Promise','JSON','String','Number',
        'Boolean','Date','RegExp','Error','Map','Set','WeakMap','WeakSet',
        'Symbol','Proxy','Reflect','parseInt','parseFloat','isNaN','isFinite',
        'encodeURI','decodeURI','encodeURIComponent','decodeURIComponent',
        'setTimeout','setInterval','clearTimeout','clearInterval',
        'fetch','require','module','exports','process','Buffer',
        '__dirname','__filename','window','document','navigator','localStorage',
        'sessionStorage','history','location','URL','URLSearchParams',
        'Response','Request','Headers','FormData','Blob','File','FileReader'
    ]);

    
    function highlightJS(src) {
        let out = '';
        let i   = 0;
        const n = src.length;

        while (i < n) {
            const ch  = src[i];
            const ch2 = src[i + 1];

            if (ch === '/' && ch2 === '/') {
                let end = src.indexOf('\n', i);
                if (end === -1) end = n;
                out += `<span class="cmt">${esc(src.slice(i, end))}</span>`;
                i = end;
                continue;
            }

            if (ch === '/' && ch2 === '*') {
                let end = src.indexOf('*/', i + 2);
                if (end === -1) end = n - 2;
                end += 2;
                out += `<span class="cmt">${esc(src.slice(i, end))}</span>`;
                i = end;
                continue;
            }

            if (ch === '`') {
                let j = i + 1;
                while (j < n) {
                    if (src[j] === '\\') { j += 2; continue; }
                    if (src[j] === '`') { j++; break; }
                    j++;
                }
                out += `<span class="tpl">${esc(src.slice(i, j))}</span>`;
                i = j;
                continue;
            }

            if (ch === '"') {
                let j = i + 1;
                while (j < n) {
                    if (src[j] === '\\') { j += 2; continue; }
                    if (src[j] === '"' ) { j++; break; }
                    if (src[j] === '\n') break;
                    j++;
                }
                out += `<span class="str">${esc(src.slice(i, j))}</span>`;
                i = j;
                continue;
            }

            if (ch === "'") {
                let j = i + 1;
                while (j < n) {
                    if (src[j] === '\\') { j += 2; continue; }
                    if (src[j] === "'" ) { j++; break; }
                    if (src[j] === '\n') break;
                    j++;
                }
                out += `<span class="str">${esc(src.slice(i, j))}</span>`;
                i = j;
                continue;
            }

            if (ch === '@' && i + 1 < n && /[a-zA-Z_]/.test(src[i + 1])) {
                let j = i + 1;
                while (j < n && /[a-zA-Z0-9_$.]/.test(src[j])) j++;
                out += `<span class="dec">${esc(src.slice(i, j))}</span>`;
                i = j;
                continue;
            }

            if (/[0-9]/.test(ch) && (i === 0 || !/[a-zA-Z_$]/.test(src[i - 1]))) {
                let j = i;
                if (ch === '0' && (src[i + 1] === 'x' || src[i + 1] === 'X')) {
                    j += 2;
                    while (j < n && /[0-9a-fA-F_]/.test(src[j])) j++;
                } else {
                    while (j < n && /[0-9._eE+\-]/.test(src[j]) && !/[^0-9._eE+\-]/.test(src[j])) {
                        if (/[0-9._]/.test(src[j])) j++;
                        else break;
                    }
                    
                    if (j < n && (src[j] === 'e' || src[j] === 'E')) {
                        j++;
                        if (j < n && (src[j] === '+' || src[j] === '-')) j++;
                        while (j < n && /[0-9]/.test(src[j])) j++;
                    }
                }
                out += `<span class="num">${esc(src.slice(i, j))}</span>`;
                i = j;
                continue;
            }

            if (/[a-zA-Z_$]/.test(ch)) {
                let j = i;
                while (j < n && /[a-zA-Z0-9_$]/.test(src[j])) j++;
                const word    = src.slice(i, j);
                const escaped = esc(word);
                const prevCh  = i > 0 ? src[i - 1] : '';
                const isProp  = prevCh === '.';

                let k = j;
                while (k < n && src[k] === ' ') k++;
                const nextIsCall = src[k] === '(';

                if (isProp) {
                    out += `<span class="pr">${escaped}</span>`;
                } else if (JS_MODULE_KW.has(word)) {
                    out += `<span class="kw2">${escaped}</span>`;
                } else if (JS_KEYWORDS.has(word)) {
                    out += `<span class="kw">${escaped}</span>`;
                } else if (JS_BOOLEANS.has(word)) {
                    out += `<span class="bl">${escaped}</span>`;
                } else if (JS_BUILTINS.has(word)) {
                    out += `<span class="bi">${escaped}</span>`;
                } else if (nextIsCall) {
                    out += `<span class="fn">${escaped}</span>`;
                } else if (/^[A-Z]/.test(word)) {
                    out += `<span class="cls">${escaped}</span>`;
                } else {
                    out += `<span class="va">${escaped}</span>`;
                }
                i = j;
                continue;
            }
            out += esc(ch);
            i++;
        }
        return out;
    }

    return {
        highlight(code, lang) {
            switch (lang) {
                case 'python': return highlightPython(code);
                case 'css':    return highlightCSS(code);
                default:       return highlightJS(code);
            }
        }
    };
})();

const Toast = (() => {
    const container = document.getElementById('toastContainer');
    const ICONS = {
        info:    'info',
        success: 'check_circle',
        error:   'error',
        warn:    'warning'
    };

    function show({ type = 'info', title, desc, duration = 3000 }) {
        const toast = document.createElement('div');
        toast.className = `toast t-${type}`;
        toast.style.setProperty('--toast-dur', `${duration}ms`);

        toast.innerHTML = `
            <div class="toast-icon">
                <span class="material-symbols-outlined">${ICONS[type] || ICONS.info}</span>
            </div>
            <div class="toast-body">
                <div class="toast-title">${title}</div>
                ${desc ? `<div class="toast-desc">${desc}</div>` : ''}
            </div>
            <button class="toast-close" aria-label="Close notification">
                <span class="material-symbols-outlined">close</span>
            </button>
            <div class="toast-progress"></div>
        `;

        toast.querySelector('.toast-close').addEventListener('click', () => dismiss(toast));

        container.appendChild(toast);

        const timer = setTimeout(() => dismiss(toast), duration);

        toast._timer = timer;
        return toast;
    }

    function dismiss(toast) {
        if (!toast || !toast.isConnected) return;
        clearTimeout(toast._timer);
        toast.classList.add('toast-hide');
        toast.addEventListener('animationend', () => toast.remove(), { once: true });
    }

    return { show };
})();

function buildLineNumbers(code) {
    const lineNums = document.getElementById('lineNums');
    const lines    = code.split('\n');
    lineNums.innerHTML = lines
        .map((_, i) => `<span class="ln">${i + 1}</span>`)
        .join('');
}

function initScrollSync() {
    const codeScroll = document.querySelector('.code-scroll');
    const lineNums   = document.getElementById('lineNums');

    if (!codeScroll || !lineNums) return;

    codeScroll.addEventListener('scroll', () => {
        lineNums.scrollTop = codeScroll.scrollTop;
    }, { passive: true });
}

function initCopyButton(rawCode) {
    const btn       = document.getElementById('copyBtn');
    const iconEl    = document.getElementById('copyIcon');
    const labelEl   = document.getElementById('copyLabel');

    let resetTimer = null;

    btn.addEventListener('click', async () => {
        if (btn.classList.contains('copied')) return;

        try {
            await navigator.clipboard.writeText(rawCode);

            btn.classList.add('copied');
            iconEl.textContent  = 'check';
            labelEl.textContent = 'Copied!';

            Toast.show({
                type:  'success',
                title: 'Code Copied!',
                desc:  'Snippet berhasil disalin ke clipboard.',
                duration: 3000
            });

            clearTimeout(resetTimer);
            resetTimer = setTimeout(() => {
                btn.classList.remove('copied');
                iconEl.textContent  = 'content_copy';
                labelEl.textContent = 'Copy';
            }, 4000);

        } catch {
            Toast.show({
                type:  'error',
                title: 'Copy Failed',
                desc:  'Tidak dapat mengakses clipboard. Coba salin manual.',
                duration: 3500
            });
        }
    });
}

function initNavbar() {
    const navbar     = document.getElementById('navbar');
    const burger     = document.getElementById('burger');
    const mobileMenu = document.getElementById('mobileMenu');

    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 20);
    }, { passive: true });

    function closeMobile() {
        burger.classList.remove('open');
        mobileMenu.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
        mobileMenu.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    burger.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = burger.classList.toggle('open');
        mobileMenu.classList.toggle('open', isOpen);
        burger.setAttribute('aria-expanded', String(isOpen));
        mobileMenu.setAttribute('aria-hidden', String(!isOpen));
        document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    document.querySelectorAll('.m-link').forEach(l => l.addEventListener('click', closeMobile));
    document.addEventListener('click', (e) => {
        if (mobileMenu.classList.contains('open') && !navbar.contains(e.target)) closeMobile();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeMobile();
    });
}


function loadSnippet() {
    const params = new URLSearchParams(window.location.search);
    const pathParts = window.location.pathname.split('/').filter(Boolean);
    const lastPart = pathParts[pathParts.length - 1] ?? '';
    const isFile = lastPart.includes('.');
    const slug = isFile
        ? (pathParts[pathParts.length - 2] ?? '')
        : lastPart;

    const id = parseInt(params.get('id'));
    let s = null;

    if (slug) {
        s = Object.values(SNIPPETS).find(item => item.slug === slug);
    }

    if (!s && !isNaN(id) && SNIPPETS[id]) {
        s = SNIPPETS[id];
    }

    if (!s) {
        s = SNIPPETS[Object.keys(SNIPPETS)[0]] ?? null;
    }

    console.log('[Debugging] pathname:', window.location.pathname);
    console.log('[Debugging] pathParts:', pathParts);
    console.log('[Debugging] isFile:', isFile, '| slug:', slug, '| loaded:', s?.title ?? 'NOT FOUND');

    if (!s) {
        document.getElementById('snippetTitle').textContent = '404 — Snippet Not Found';
        document.getElementById('snippetDesc').textContent  = 'Snippet yang kamu cari tidak tersedia.';
        Toast.show({
            type:     'error',
            title:    'Snippet Not Found',
            desc:     `"${slug || id}" tidak ditemukan dalam library.`,
            duration: 4000
        });
        return;
    }

    document.getElementById('bcTitle').textContent      = s.title;
    document.title                                      = `${s.title} — LexCode Snipet`;
    document.getElementById('fileIconEl').textContent   = s.icon;
    document.getElementById('chipFileIcon').textContent = s.icon;
    document.getElementById('filenameText').textContent = s.filename;
    document.getElementById('langBadge').textContent    = s.langShort;
    document.getElementById('updateText').textContent   = s.updated;
    document.getElementById('snippetTitle').textContent = s.title;
    document.getElementById('snippetDesc').textContent  = s.desc;

    const lines = s.code.split('\n').length;
    const chars = s.code.length;
    document.getElementById('statLines').textContent  = lines;
    document.getElementById('statChars').textContent  = chars.toLocaleString();
    document.getElementById('tbFilename').textContent = s.filename;
    document.getElementById('langTag').textContent    = s.lang;
    document.getElementById('sbLang').textContent     = s.lang;

    const highlighted = Highlighter.highlight(s.code, s.langType);
    document.getElementById('codeEl').innerHTML = highlighted;

    buildLineNumbers(s.code);
    initCopyButton(s.code);
    initScrollSync();

    setTimeout(() => {
        Toast.show({
            type:     'info',
            title:    s.title,
            desc:     `${lines} baris · ${s.lang} · Klik Copy untuk menyalin.`,
            duration: 4000
        });
    }, 600);
}

function initKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'c' && document.activeElement.tagName !== 'INPUT') {
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    loadSnippet();
    initKeyboardShortcuts();
});
