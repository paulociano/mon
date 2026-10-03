# MON Product Roadmap

## Current foundation

The product already includes:

- Fundação Zero for pronunciation, hiragana, katakana and core grammar
- adaptive review for kana and kanji
- gamified learning path with XP, energy, streaks, quests and rewards
- Kanji Atlas, listening, writing, speaking, culture and survival missions
- PWA/offline support
- modular course content and persistent-state layers

## Next implementation slices

### 1. Course engine ✅ foundation implemented
The first adaptive engine is now live behind a dedicated interface:

`buildLesson(nodeId, learnerState) -> lesson`

The engine will choose retrieval, listening, matching, sentence construction, writing and speaking tasks from the learner's recent errors and due reviews.

### 2. Structured curriculum ✅ N5 foundation implemented
Structured content packs now drive the first N5 survival slice. Remaining expansion targets:

- ZERO
- N5
- N4
- N3
- survival missions
- stories
- culture

Each lesson unit should declare objectives, prerequisites, vocabulary, grammar, kana/kanji, exercise templates and mastery requirements.

### 3. Mistake notebook ✅ foundation implemented
The app now stores structured mistakes and exposes a corrective practice queue grouped by:

- kana confusion
- sound duration
- vocabulary
- grammar
- kanji meaning
- kanji reading
- sentence order
- listening
- speaking

### 4. Adaptive SRS ✅ unified scheduler implemented
One scheduler now handles kana, kanji, vocabulary, grammar and corrective errors while keeping domain-specific exercise rendering.

### 5. Rich lesson types ✅ Gate Loop foundation implemented
Add:

- dictation
- minimal-pair listening
- reverse translation
- contextual fill-in
- story comprehension
- timed recognition
- handwriting recall
- spoken roleplay

### 6. Mastery Graph ✅ foundation implemented
Track concept mastery separately across recognition, recall, listening, transfer and production. Weak edges now bias the teaching-method mix and are visible in the Practice hub.

### 7. Content scale
Expand from Foundation Zero into complete N5, then N4 and N3 paths with reusable exercise templates instead of duplicating markup.

### 8. Accounts and sync
Only after the local learning model is stable, add authentication and cloud sync so progress can move across devices.

## Architecture principle

Keep content, learner state, lesson generation and UI rendering as separate seams. The interface should not need to know how SRS intervals are calculated, and curriculum files should not need to know how screens are rendered.


## Quality gate

GitHub Actions now checks JavaScript syntax, local asset references, duplicate HTML IDs, runtime script order and PWA cache coverage on pushes and pull requests.


## MON Gate Loop

The differentiated teaching loop is: Discover → Recall → Transfer → Produce → Reflect. It deliberately delays hints and model answers when the learner has already encountered the content. N5 packs can now generate free recall, blind dictation, contextual cloze, pronunciation contrasts, transfer prompts and hidden-answer roleplay alongside standard exercises.
