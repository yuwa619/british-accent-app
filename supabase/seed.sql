begin;

with seed_lessons (
  slug,
  title,
  description,
  skill_focus,
  difficulty,
  estimated_minutes,
  sort_order
) as (
  values
    ('clear-british-vowels', 'Clear British vowels for professional speech', 'Build clearer vowel shapes for workplace introductions, updates, and short answers.', 'british_vowels', 'beginner', 6, 1),
    ('schwa-unstressed-syllables', 'The schwa /ə/ and unstressed syllables', 'Practise the relaxed schwa sound that gives British English a natural rhythm.', 'schwa', 'beginner', 6, 2),
    ('dental-fricatives-think-this-that-through', 'Dental fricatives: think, this, that, through', 'Polish /θ/ and /ð/ placement for frequent professional words.', 'dental_fricatives', 'intermediate', 7, 3),
    ('dropping-final-r-non-rhotic', 'Dropping final /r/ in non-rhotic British English', 'Learn how final r behaves in contemporary Southern British speech.', 'non_rhoticity', 'beginner', 7, 4),
    ('word-stress-workplace-vocabulary', 'Word stress in workplace vocabulary', 'Place stress clearly in common professional vocabulary.', 'word_stress', 'intermediate', 8, 5),
    ('sentence-stress-confident-speaking', 'Sentence stress for confident speaking', 'Use sentence stress to make key information easier to follow.', 'sentence_stress', 'intermediate', 8, 6),
    ('connected-speech-linking-smoothly', 'Connected speech: linking words smoothly', 'Connect words naturally while keeping your meaning clear.', 'connected_speech', 'intermediate', 8, 7),
    ('intonation-statements-questions', 'Intonation for statements and questions', 'Practise pitch movement for clear statements, questions, and polite checks.', 'intonation', 'intermediate', 8, 8),
    ('professional-introductions-uk', 'Professional introductions in the UK', 'Shape a clear, warm self-introduction for UK workplaces.', 'workplace_phrases', 'beginner', 6, 9),
    ('interview-answers-structure-rhythm', 'Interview answers with clear structure and rhythm', 'Practise interview answers with calm pacing and signposted structure.', 'interview_practice', 'advanced', 9, 10)
)
insert into public.lessons (
  slug,
  title,
  description,
  skill_focus,
  difficulty,
  estimated_minutes,
  sort_order,
  is_published
)
select
  slug,
  title,
  description,
  skill_focus,
  difficulty,
  estimated_minutes,
  sort_order,
  true
from seed_lessons
on conflict (slug) do update
set title = excluded.title,
    description = excluded.description,
    skill_focus = excluded.skill_focus,
    difficulty = excluded.difficulty,
    estimated_minutes = excluded.estimated_minutes,
    sort_order = excluded.sort_order,
    is_published = excluded.is_published;

delete from public.practice_prompts
where lesson_id in (
  select id
  from public.lessons
  where slug in (
    'clear-british-vowels',
    'schwa-unstressed-syllables',
    'dental-fricatives-think-this-that-through',
    'dropping-final-r-non-rhotic',
    'word-stress-workplace-vocabulary',
    'sentence-stress-confident-speaking',
    'connected-speech-linking-smoothly',
    'intonation-statements-questions',
    'professional-introductions-uk',
    'interview-answers-structure-rhythm'
  )
);

delete from public.lesson_steps
where lesson_id in (
  select id
  from public.lessons
  where slug in (
    'clear-british-vowels',
    'schwa-unstressed-syllables',
    'dental-fricatives-think-this-that-through',
    'dropping-final-r-non-rhotic',
    'word-stress-workplace-vocabulary',
    'sentence-stress-confident-speaking',
    'connected-speech-linking-smoothly',
    'intonation-statements-questions',
    'professional-introductions-uk',
    'interview-answers-structure-rhythm'
  )
);

insert into public.lesson_steps (lesson_id, step_type, title, body, practice_text, reference_text, sort_order)
select lessons.id, step_type, step_title, body, practice_text, reference_text, sort_order
from public.lessons
join (
  values
    ('clear-british-vowels', 'explain', 'Open the vowel clearly', 'Focus on a relaxed jaw and steady vowel length.', 'The manager has a clear plan for the staff.', 'The manager has a clear plan for the staff.', 1),
    ('clear-british-vowels', 'read', 'Workplace vowel drill', 'Read at a calm pace and keep each stressed vowel distinct.', 'Please check the plan and send it back by Friday.', 'Please check the plan and send it back by Friday.', 2),
    ('clear-british-vowels', 'reflect', 'Confidence check', 'Notice which vowel felt easiest to keep clear.', null, null, 3),
    ('schwa-unstressed-syllables', 'explain', 'Relax unstressed syllables', 'The schwa is light and central, helping English sound less syllable-by-syllable.', 'A doctor should consider a better schedule.', 'A doctor should consider a better schedule.', 1),
    ('schwa-unstressed-syllables', 'shadow', 'Schwa rhythm', 'Listen for the softer unstressed syllables, then repeat naturally.', 'I need to apply for a series of positions.', 'I need to apply for a series of positions.', 2),
    ('schwa-unstressed-syllables', 'read', 'Weak syllable drill', 'Keep content words stronger and grammar words lighter.', 'Can we arrange another meeting for tomorrow?', 'Can we arrange another meeting for tomorrow?', 3),
    ('dental-fricatives-think-this-that-through', 'explain', 'Place the tongue gently', 'For /θ/ and /ð/, the tongue tip sits lightly between the teeth.', 'Those three thinkers thought of their thesis.', 'Those three thinkers thought of their thesis.', 1),
    ('dental-fricatives-think-this-that-through', 'read', 'Voiced and voiceless th', 'Alternate think/this so the contrast stays clear.', 'I think this method is better than that one.', 'I think this method is better than that one.', 2),
    ('dental-fricatives-think-this-that-through', 'shadow', 'Meeting phrase', 'Keep the sound gentle rather than forceful.', 'Thanks, that is the thing I wanted to check.', 'Thanks, that is the thing I wanted to check.', 3),
    ('dropping-final-r-non-rhotic', 'explain', 'Final r in British English', 'In many British accents, final r is not pronounced unless a vowel follows.', 'Our manager was better on the computer.', 'Our manager was better on the computer.', 1),
    ('dropping-final-r-non-rhotic', 'read', 'Hold the vowel', 'Let the vowel carry the word ending without adding a strong r.', 'The car is near the door after four.', 'The car is near the door after four.', 2),
    ('word-stress-workplace-vocabulary', 'explain', 'Find the main beat', 'Longer workplace words usually need one clear stressed syllable.', 'Our developer will present the proposal.', 'Our developer will present the proposal.', 1),
    ('word-stress-workplace-vocabulary', 'read', 'Professional vocabulary', 'Give the stressed syllable a little more length and energy.', 'The analysis supports our recommendation.', 'The analysis supports our recommendation.', 2),
    ('sentence-stress-confident-speaking', 'explain', 'Stress the message', 'Make the important content words stand out so listeners can follow quickly.', 'We need to clear the backlog by Friday afternoon.', 'We need to clear the backlog by Friday afternoon.', 1),
    ('sentence-stress-confident-speaking', 'shadow', 'Status update rhythm', 'Keep function words lighter between the main beats.', 'I can send the report after the client call.', 'I can send the report after the client call.', 2),
    ('connected-speech-linking-smoothly', 'explain', 'Link without rushing', 'Connected speech should feel smooth but still intelligible.', 'Could you give it a quick look after lunch?', 'Could you give it a quick look after lunch?', 1),
    ('connected-speech-linking-smoothly', 'read', 'Smooth phrase practice', 'Link final consonants into following vowels.', 'I will pick it up and send it over.', 'I will pick it up and send it over.', 2),
    ('intonation-statements-questions', 'explain', 'Shape the pitch movement', 'Statements often fall; open questions often rise or stay inviting.', 'Could you clarify the deadline for me?', 'Could you clarify the deadline for me?', 1),
    ('intonation-statements-questions', 'shadow', 'Polite checking', 'Use a friendly pitch movement when asking for clarification.', 'Sorry, could you say that again?', 'Sorry, could you say that again?', 2),
    ('professional-introductions-uk', 'explain', 'Short and warm', 'A good workplace introduction is clear, concise, and easy to respond to.', 'Hello, I am Maya. I have just joined the operations team.', 'Hello, I am Maya. I have just joined the operations team.', 1),
    ('professional-introductions-uk', 'read', 'Introduce your role', 'Slow slightly on your name and role.', 'I work on patient records and appointment scheduling.', 'I work on patient records and appointment scheduling.', 2),
    ('interview-answers-structure-rhythm', 'explain', 'Signpost your answer', 'Use a clear beginning, example, result, and reflection.', 'One example is a project where I improved the handover process.', 'One example is a project where I improved the handover process.', 1),
    ('interview-answers-structure-rhythm', 'read', 'STAR rhythm', 'Pause briefly between situation, action, and result.', 'The result was a shorter response time and clearer updates for the team.', 'The result was a shorter response time and clearer updates for the team.', 2)
) as steps(lesson_slug, step_type, step_title, body, practice_text, reference_text, sort_order)
on lessons.slug = steps.lesson_slug;

insert into public.practice_prompts (lesson_id, prompt_type, title, prompt_text, target_sound, difficulty)
select lessons.id, prompt_type, prompt_title, prompt_text, target_sound, difficulty
from public.lessons
join (
  values
    ('clear-british-vowels', 'shadowing', 'Clear vowel workplace sentence', 'The manager has a clear plan for the staff.', 'vowels', 'beginner'),
    ('schwa-unstressed-syllables', 'shadowing', 'Schwa in unstressed syllables', 'I need to apply for a series of positions.', '/ə/', 'beginner'),
    ('dental-fricatives-think-this-that-through', 'sound_drill', 'Think, this, that, through', 'I think this method is better than that one.', '/θ/ /ð/', 'intermediate'),
    ('dropping-final-r-non-rhotic', 'read_aloud', 'Final r in workplace words', 'Our manager was better on the computer.', 'non-rhotic final r', 'beginner'),
    ('word-stress-workplace-vocabulary', 'read_aloud', 'Stress in professional vocabulary', 'Our developer will present the proposal.', 'word stress', 'intermediate'),
    ('sentence-stress-confident-speaking', 'read_aloud', 'Confident status update', 'We need to clear the backlog by Friday afternoon.', 'sentence stress', 'intermediate'),
    ('connected-speech-linking-smoothly', 'shadowing', 'Smooth connected phrase', 'I will pick it up and send it over.', 'connected speech', 'intermediate'),
    ('intonation-statements-questions', 'shadowing', 'Polite clarification question', 'Sorry, could you say that again?', 'intonation', 'intermediate'),
    ('professional-introductions-uk', 'roleplay_seed', 'Professional self-introduction', 'Hello, I am Maya. I have just joined the operations team.', 'introductions', 'beginner'),
    ('interview-answers-structure-rhythm', 'interview_seed', 'Structured interview answer', 'One example is a project where I improved the handover process.', 'interview rhythm', 'advanced')
) as prompts(lesson_slug, prompt_type, prompt_title, prompt_text, target_sound, difficulty)
on lessons.slug = prompts.lesson_slug;

commit;
