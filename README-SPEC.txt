# لعبة الذكاء — THE IQ GAME
## Complete Product & Development Specification (UPDATED)

IMPORTANT:

This is not a small demo, toy project, or generic quiz website.

This project is worth ($1,000–$7,000), so be extremely careful while developing it and ensure that the final result is professional, clean, polished, maintainable, visually impressive, and production-quality.

Treat this as a serious commercial-quality mobile party game project.

Do not rush.

Do not create a basic prototype and call it finished.

Think like a senior:
- Product Designer
- UX/UI Designer
- Mobile Game Designer
- Frontend Engineer
- Interaction Designer
- Motion Designer
- Sound Designer
- Arabic RTL specialist
- QA Engineer

Use your full capabilities to make the result feel like a real premium game.

==================================================
1. PROJECT NAME
==================================================

Arabic name:

لعبة الذكاء

English name:

The IQ Game

The official logo is the primary brand identity throughout the project.

IMPORTANT:

Do not replace the official logo with a random logo.

Build the visual identity around the provided logo.

The logo contains:

لعبة الذكاء

and:

The game of intelligence

Use the provided logo as the primary brand identity throughout the project.

==================================================
2. CORE CONCEPT
==================================================

This is a mobile party quiz game designed to be played by multiple people using ONE SMARTPHONE.

This is a PASS-AND-PLAY game.

Players do NOT need multiple phones.

Players do NOT connect their phones together.

There is no multiplayer networking system required for the core game.

There is no lobby.

There are no room codes.

There is no account system.

There is no login system.

The physical smartphone is passed between the two teams.

Design the entire UX around this concept.

The phone should clearly communicate whose turn it is.

Use "Pass the phone" screens whenever appropriate.

Example:

"مرر الجوال للفريق الثاني 📱"

Then:

"اضغط للمتابعة"

This is an essential part of the game.

==================================================
3. LANGUAGE
==================================================

The ENTIRE GAME UI must be Arabic.

Use Arabic RTL everywhere.

Use:

direction: rtl;

The game must NOT look like an English website that has been translated into Arabic.

Design the interface natively for Arabic.

All:

- Buttons
- Labels
- Messages
- Errors
- Instructions
- Scores
- Timers
- Menus
- Dialogues
- Settings
- Game screens

must be Arabic.

English should only appear where it is part of a proper name, brand, game title, or question content where appropriate.

==================================================
4. PLAYER COUNT
==================================================

The minimum number of players is:

2

Players enter their names before starting.

The game creates exactly two teams.

The team assignment is randomized.

If the number of players is EVEN:

Example:

6 players

Team 1:
3 players

Team 2:
3 players

If the number is ODD:

Example:

5 players

Team 1:
2 players

Team 2:
2 players

The remaining player becomes:

"اللاعب المشترك"

This player belongs to both teams.

Example:

Team 1:
Ahmed
Omar

Team 2:
Saif
Mohammed

Shared Player:
Khalid

Khalid participates with whichever team is currently playing.

The team assignment should feel fun and randomized.

==================================================
5. GAME OBJECTIVE
==================================================

The first team to reach:

20 POINTS

wins.

The score does NOT have to stop exactly at 20.

Example:

Team 1 has:

18 points

They answer a hard question correctly:

+3

New score:

21

Team 1 wins immediately.

The winner detection must happen immediately.

==================================================
6. UPDATED ANSWER SYSTEM — MULTIPLE CHOICE
==================================================

IMPORTANT:

The game is NO LONGER an open-answer / text-input quiz.

Players must NOT type answers.

Every normal question must be presented as a multiple-choice question with:

6 answer options.

Exactly ONE option is correct.

The other FIVE options are incorrect distractors.

The player selects one of the six options.

This completely replaces the previous text-answer system.

There is NO AI-based answer evaluation.

There is NO Gemini answer checking.

There is NO semantic answer matching.

There is NO text normalization system for player answers.

There is NO answer input field.

The answer is determined directly from the question database.

==================================================
7. QUESTION STRUCTURE
==================================================

Each normal question should have:

- Question text
- 6 answer options
- Exactly 1 correct answer
- 5 incorrect answers
- Category
- Difficulty
- Unique question ID

Recommended JSON structure:

{
  "id": "cars_easy_001",
  "category": "cars",
  "difficulty": "easy",
  "type": "multiple-choice",
  "question": "ما هي الشركة المصنعة لسيارة موستانج؟",
  "options": [
    "فورد",
    "تويوتا",
    "بي إم دبليو",
    "هوندا",
    "نيسان",
    "مرسيدس"
  ],
  "correctAnswer": "فورد"
}

The exact structure may be improved if necessary, but it must remain easy to maintain and edit.

==================================================
8. YES / NO QUESTIONS
==================================================

Questions from the:

"أسئلة بـ نعم أو لا"

category are SPECIAL.

They must NOT have 6 options.

They must have exactly TWO options:

"نعم"

"لا"

Example:

هل الشمس نجم؟

[ نعم ]

[ لا ]

Only one is correct.

Do not add four fake options to Yes/No questions.

==================================================
9. ANSWER INTERACTION & FLOW
==================================================

The player selects an option by tapping it.

Do not require a separate text submission.

After selecting an answer:

Immediately evaluate the selected option locally.

If correct:

Show a satisfying success state.

Example:

"إجابة صحيحة! 🎉"

Then award the appropriate points.

If incorrect:

Show:

"الإجابة خاطئة 😭"

The player remains on the same question and may select another option.

A wrong answer does NOT immediately deduct points.

The player can continue attempting answers until:

1. They select the correct answer.

OR

2. The timer reaches zero.

==================================================
10. WRONG ANSWER BEHAVIOR
==================================================

Wrong answers have NO immediate score penalty.

Example:

Hard question:

+3 for correct

-2 for timeout

If the player chooses an incorrect option:

Score remains unchanged.

They can choose another option.

If they eventually choose the correct option before time expires:

Award +3.

If the timer reaches zero without a correct answer:

Apply the hard-question timeout penalty:

-2.

The same principle applies to Easy and Medium.

==================================================
11. ANSWER OPTION DESIGN
==================================================

The six options should NOT look like boring radio buttons.

Design them as large, tactile game cards/buttons.

Each option should have:

- Large touch target
- Clear Arabic typography
- Strong visual hierarchy
- Press animation
- Selected state
- Correct state
- Incorrect state
- Disabled state when appropriate

Option cards can:

- Lift on hover/touch
- Press down on tap
- Shake briefly after an incorrect selection
- Glow/highlight after a correct selection

Do not reveal the correct answer before the player selects an option.

==================================================
12. ANSWER SHUFFLING
==================================================

The position of the correct answer must be randomized.

Do NOT always put the correct answer in the same position.

For every question:

Shuffle the options before displaying them.

However:

Do not alter the option text itself.

Only change its displayed position.

This prevents players from learning a fixed answer position.

==================================================
13. GAME FLOW
==================================================

START SCREEN

↓

PLAYER SETUP

↓

PLAYER NAMES

↓

RANDOM TEAM ASSIGNMENT

↓

TEAM REVEAL

↓

GAME INTRODUCTION

↓

TEAM TURN

↓

CATEGORY SELECTION

↓

DIFFICULTY SELECTION

↓

QUESTION WITH 6 OPTIONS (OR 2 FOR YES/NO)

↓

PLAYER SELECTS AN OPTION

↓

IF WRONG:

"الإجابة خاطئة 😭"

↓

PLAYER CAN SELECT ANOTHER OPTION

↓

IF CORRECT:

"إجابة صحيحة! 🎉"

↓

AWARD POINTS

↓

SHOW SCORE UPDATE

↓

PASS PHONE

↓

OTHER TEAM

↓

REPEAT

IF TIMER EXPIRES:

"انتهى الوقت! ⏰"

↓

APPLY TIMEOUT PENALTY

↓

SHOW CORRECT ANSWER

↓

SHOW SCORE UPDATE

↓

PASS PHONE

==================================================
14. CATEGORIES
==================================================

The final game contains these 20 categories:

1. أعلام الدول
2. ماركات ألعاب الفيديو / جيمنج
3. أنواع وماركات السيارات
4. أندية ولعيبة كرة القدم
5. أفلام ومسلسلات
6. أكلات ومطاعم
7. عواصم ومدن
8. شخصيات كرتونية
9. تطبيقات وسوشيال ميديا
10. حيوانات وطبيعة
11. مهن ووظائف
12. أشياء في البيت
13. معالم عالمية
14. أنمي ومانجا
15. أسئلة دينية
16. ألعاب شعبية ولوحية
17. تقنية وأجهزة
18. كلمات من لهجات عربية
19. أسئلة بـ نعم أو لا
20. عجائب ومعلومات عامة

==================================================
15. QUESTION RANDOMIZATION
==================================================

Questions must be randomized.

The system must track used question IDs during the current game.

A question must NOT repeat during the same game unless there are no unused questions remaining in that category/difficulty pool.

==================================================
16. UPDATED SCORE RULES & DIFFICULTY SYSTEM
==================================================

--------------------------------
EASY
--------------------------------

Correct answer:
+1 point

Timeout / no answer:
0 points

Wrong selection:
0 immediate penalty

--------------------------------
MEDIUM
--------------------------------

Correct answer:
+2 points

Timeout / no answer:
-1 point

Wrong selection:
0 immediate penalty

--------------------------------
HARD
--------------------------------

Correct answer:
+3 points

Timeout / no answer:
-2 points

Wrong selection:
0 immediate penalty

Scores ARE allowed to go below zero.

==================================================
17. QUESTION TIMER
==================================================

Every question starts with:

3 MINUTES = 180 seconds.

The timer begins when the question becomes active.

When timer reaches zero:
Show timeout state ("انتهى الوقت! ⏰"), apply the penalty according to difficulty, reveal correct answer, and pass turn.

External search assists pause the timer.

"حذف 4 خيارات" does NOT pause the timer.

==================================================
18. ASSIST SYSTEM — UPDATED
==================================================

Each team has its own independent assist inventory.

Every team starts with:

Instagram Search:
6 uses per team

TikTok Search:
4 uses per team

ChatGPT Search:
2 uses per team

"حذف 4 خيارات":
3 uses per team

==================================================
19. ELIMINATE FOUR ASSIST ("حذف 4 خيارات")
==================================================

The "حذف 4 خيارات" assist is a special in-game power-up.

When activated:

1. Immediately consume 1 use from team inventory.
2. The system randomly removes FOUR incorrect answer options.
3. NEVER remove the correct answer.
4. Player is left with 2 options (1 correct, 1 incorrect) for a 50/50 choice.
5. Disabled for "Yes/No" questions.

UX Effect:
- Four wrong cards shrink/fly away or hide
- Remaining two cards become prominent
- Animation & Sound Effect: "تم حذف 4 خيارات! 🎯"

==================================================
20. EXTERNAL SEARCH ASSISTS
==================================================

Instagram, TikTok, and ChatGPT assists:

1. Deduct assist immediately.
2. Pause question timer.
3. Start 60-second assist timer ("وقت البحث").
4. Team searches on an external device.
5. After 60 seconds, return to question and resume main timer at exact paused value.

Multiple external assists can be used during a question sequentially (one active at a time).

==================================================
21. NO AI DEPENDENCY
==================================================

REMOVE THE PREVIOUS GEMINI ANSWER-EVALUATION SYSTEM COMPLETELY.

Do NOT implement:
- Gemini answer checking
- AI semantic evaluation
- AI confidence scores
- AI answer normalization
- AI fallback evaluation
- API-based answer judging

The game determines correctness locally from the question data.

==================================================
22. QUESTION BANK MIGRATION
==================================================

Convert normal questions into the new multiple-choice structure (1 correct, 5 distractors).

Distractor Guidelines:
- Must be plausible enough to create a challenge.
- Do NOT use ridiculous or obviously fake answers.
- Do NOT create distractors that accidentally become correct.
- Do NOT create duplicate options.
- The correct answer must be unambiguous.

==================================================
23. VISUAL & INTERACTION DESIGN
==================================================

Combine:
1. Claymorphism
2. Skeuomorphism
3. Neumorphism

Make the game feel tactile, energetic, funny, and highly responsive.

==================================================
24. PAGE ARCHITECTURE
==================================================

Modular design with distinct files for screens, structured assets, JSON data, and sounds.

==================================================
25. FINAL SUMMARY RULE
==================================================

The final game is a MULTIPLE-CHOICE PARTY QUIZ.
Normal questions: 6 options
Yes/No questions: 2 options
New assist: "حذف 4 خيارات" (3 per team)
Gemini / AI Evaluation: REMOVED COMPLETELY
Local Deterministic Answer Evaluation: ACTIVE