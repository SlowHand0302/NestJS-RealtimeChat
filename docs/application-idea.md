# Application Ideas

## Raw Ideas

- To use my application, users must have to scan image, upload file, sync their storage to my application to read content, then after translation process completed, they have to save all the translations by their own (can download or write directly in to cloud storage).

- My application will using AI prompting for translating - I will provide 2 options to users, they can sync their AI account (by OAuth or API key) like openAI, gemini, anthropic,... or using the given one (with limits)

- I will allow user customize the AI translation by using their own prompting or adjusting the given prompt which are provided by me and store in my DB - I also recommend the AI model that they should use base on the selected prompt. All the customizations will be stored in my DB if they want to reuse

- My application also provide features that help users summarize plots, lore, relationships timeline between characters graph, character development timeline chart, base on the given translated works from their storage ( must be synced with cloud to read data ) which can help improve the translations. Those data will be stored by users and they can determine where to store. If they want to reuse, they must upload or sync with their storage, or I can save it in indexDB/local storage (if using browser), in their memory (if using PC) (This feature is optional because the concerns about legal and ethical )

- I will store their settings for each translations, it will help they don't need to config at the start when they want to continue. The saved data contain the name of work, description - if any, timestamp, selected prompt - if using the given ones, linked rules - if synced the rule storage for the work, selected AI model (synced / given model), original works storage link - if synced, translations storage - if enable writing result directly to their storage.

- I will allow them upload image for translation, and the result will return the image with translated text ( this feature is optional but the one that I want the most. If I implement this feature for personal use it will fine, but if I want to publish it, I must have to add limits includes: Do not add thumbnails; Do not add page numbers; Do not perfectly recreate official fonts; Do not implement multi-image / batch translation; Translate dialogue text only, not SFX by default)

Below is a **direct, no-fluff, complete wrap-up**, followed by **ready-to-use Terms of Service & Privacy wording**.
This is written so you can **implement + ship** without second-guessing.

---

## ✅ I SHOULD DO (SAFE & DEFENSIBLE)

### 1. User-provided content only

- Users upload images/files or sync **their own cloud**
- You never provide content

**Why:**
Keeps you as a _tool_, not a content source.

---

### 2. Stateless processing

- Process content in memory
- Delete immediately after response
- No server-side storage of:
    - original works
    - translations
    - summaries
    - graphs

**Why:**
Avoids hosting derivative copyrighted works.

---

### 3. User-owned output storage

- Users download results or write directly to **their cloud**
- User chooses where data is saved

**Why:**
Responsibility stays with the user, not your platform.

---

### 4. Prompt-based AI translation

- Store **only prompt templates**
- Prompts contain instructions, not content
- Users can customize and reuse prompts

**Why:**
Prompts are metadata, not copyrighted material.

---

### 5. BYO AI key + optional provided key

- Allow users to bring OpenAI / Gemini / Anthropic keys
- If you provide a key, disclose AI provider clearly

**Why:**
Transparency + ToS compliance with AI providers.

---

### 6. Image translation (manga) — strict limits

- One image → one output
- Translate **dialogue bubbles only**
- Neutral fonts
- No SFX translation by default

**Why:**
Keeps feature as _reading assistance_, not scanlation.

---

### 7. Multi-panel pages allowed

- Normal manga page = OK

**Why:**
Still a single page, not bulk reproduction.

---

### 8. Multi-page images → warn or restrict

- Detect unusual aspect ratios
- Ask user to crop or confirm
- Treat as ONE image only

**Why:**
Prevents chapter-level processing.

---

### 9. Analysis features (summary, graph, lore)

- Generated only from **user-stored content**
- Saved only by the user
- No cross-user or global knowledge

**Why:**
Avoids building a substitute for the original work.

---

### 10. Metadata storage only

You may store:

- work name
- description (user-written)
- timestamps
- selected prompt ID
- selected model
- cloud links (references only)

**Why:**
Metadata ≠ copyrighted content.

---

## ❌ I SHOULD NOT DO (RED LINES)

### 1. No server-side content storage

❌ No saving:

- images
- translated images
- text
- summaries
- graphs

**Why:**
You become a content host.

---

### 2. No batch / bulk translation

❌ No:

- folder upload
- chapter translation
- ZIP export
- “translate all pages”

**Why:**
Matches scanlation workflows → high legal risk.

---

### 3. No page logic

❌ No:

- page numbers
- thumbnails
- auto page splitting
- chapter ordering

**Why:**
Signals publishing intent.

---

### 4. No perfect font recreation

❌ No:

- official manga fonts
- publisher-identical typography

**Why:**
Looks like an unofficial edition.

---

### 5. No SFX redraw / art editing by default

❌ No:

- erasing artwork
- redrawing backgrounds
- embedding translated SFX

**Why:**
Alters artwork, not just text comprehension.

---

### 6. No community or sharing features

❌ No:

- public galleries
- shared translations
- public lore databases

**Why:**
Distribution = platform liability.

---

### 7. No training AI on user content

❌ No:

- fine-tuning
- prompt optimization
- analytics based on uploaded works

**Why:**
Copyright + privacy violations.

---

### 8. No marketing language implying replacement

❌ Avoid:

- “scanlation”
- “read manga for free”
- “official-quality translation”

**Why:**
Intent matters legally.

---
