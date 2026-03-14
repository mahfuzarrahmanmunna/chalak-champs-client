// src/data/blogData.ts

// TypeScript interfaces
export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: {
    name: string;
    avatar: string;
    bio: string;
  };
  publishDate: string;
  readTime: number; // in minutes
  category: string;
  tags: string[];
  featuredImage: string;
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
  isBookmarked: boolean;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  date: string;
  likesCount: number;
  isLiked: boolean;
  replies?: Comment[];
}

// Mock blog data
export const blogPosts: BlogPost[] = [
  {
    id: "1",
    slug: "effective-english-learning-strategies",
    title: "10 Effective Strategies for Learning English Faster",
    excerpt:
      "Discover proven techniques and methods that can significantly accelerate your English learning journey. From immersive practice to spaced repetition, these strategies will help you achieve fluency more efficiently.",
    content: `# 10 Effective Strategies for Learning English Faster

Learning English effectively requires a combination of proven strategies and consistent practice. In this comprehensive guide, we'll explore ten powerful techniques that can dramatically accelerate your language acquisition process.

## 1. Immerse Yourself in English

One of the most effective ways to learn English quickly is through immersion. Surround yourself with English as much as possible:

- Change your phone and computer language settings to English
- Watch movies and TV shows in English (start with subtitles, then without)
- Listen to English music and podcasts
- Read books, news articles, and blogs in English

## 2. Practice Speaking Every Day

Speaking is often the most challenging skill for English learners, but daily practice is crucial:

- Find a language exchange partner
- Talk to yourself in English (it might feel strange, but it works!)
- Record yourself speaking and listen back to identify areas of improvement
- Join English conversation clubs or online communities

## 3. Use Spaced Repetition for Vocabulary

Instead of cramming vocabulary lists, use spaced repetition systems (SRS):

- Use apps like Anki or Quizlet with spaced repetition features
- Review vocabulary at increasing intervals
- Focus on words and phrases that are relevant to your goals
- Create connections between new words and existing knowledge

## 4. Learn Phrases, Not Just Words

English speakers use a lot of set phrases and collocations:

- Learn common phrases like "make a decision" rather than just "decision"
- Pay attention to which words commonly go together
- Practice using these phrases in context
- Create a personal phrasebook with examples

## 5. Set Specific, Measurable Goals

Vague goals like "improve my English" are hard to achieve. Instead:

- Set specific goals like "learn 5 new phrasal verbs this week"
- Track your progress regularly
- Celebrate small achievements
- Adjust your goals as you improve

## 6. Focus on High-Frequency Words

Not all words are created equal. Focus on learning the most common words first:

- The top 1000 words make up about 80% of everyday English
- The top 2000 words make up about 95% of everyday English
- Use frequency dictionaries to prioritize vocabulary
- Learn words in context rather than isolated lists

## 7. Think in English

This is challenging but extremely effective:

- Start with simple thoughts and gradually increase complexity
- Try to narrate your daily activities in English
- Write a journal in English
- Practice inner monologue in English

## 8. Make Mistakes and Learn from Them

Don't be afraid of mistakes—they're essential for learning:

- Embrace errors as learning opportunities
- Keep a mistake journal to track and review common errors
- Ask for corrections from native speakers
- Focus on communication, not perfection

## 9. Use Technology Wisely

Technology can be a powerful learning tool when used correctly:

- Use language learning apps for structured practice
- Watch YouTube channels designed for English learners
- Join online communities of English learners
- Use speech recognition tools to practice pronunciation

## 10. Be Consistent

Consistency is more important than intensity:

- Practice a little every day rather than cramming once a week
- Create a daily routine that includes English practice
- Set reminders and make learning a habit
- Don't break the chain—track consecutive days of practice

## Conclusion

Learning English faster isn't about finding a magic solution—it's about using proven strategies consistently. By implementing these techniques and making them part of your daily routine, you'll see significant improvement in your English skills.

Remember that everyone learns at a different pace, so be patient with yourself and celebrate your progress along the way. With dedication and the right approach, you'll achieve your English learning goals faster than you ever thought possible.`,
    author: {
      name: "Sarah Johnson",
      avatar: "https://randomuser.me/api/portraits/women/32.jpg",
      bio: "Sarah is an experienced English language instructor with over 10 years of teaching experience.",
    },
    publishDate: "2023-10-25",
    readTime: 8,
    category: "Learning Tips",
    tags: ["learning", "strategies", "fluency", "practice"],
    featuredImage:
      "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    likesCount: 342,
    commentsCount: 28,
    isLiked: false,
    isBookmarked: false,
  },
  {
    id: "2",
    slug: "common-grammar-mistakes",
    title: "Common Grammar Mistakes and How to Avoid Them",
    excerpt:
      "Even advanced English speakers make these common grammar mistakes. Learn what they are and how to avoid them in your writing and speaking to sound more professional and confident.",
    content: `# Common Grammar Mistakes and How to Avoid Them

Grammar mistakes can undermine your credibility and make your English sound less professional. In this article, we'll identify the most common grammar errors that even advanced learners make and provide clear explanations on how to avoid them.

## 1. Subject-Verb Agreement

One of the most frequent errors is incorrect subject-verb agreement:

**Incorrect:** The team of players are winning.
**Correct:** The team of players is winning.

The subject is "team" (singular), not "players" (plural), so we use the singular verb "is."

## 2. Tense Consistency

Switching tenses unnecessarily within a sentence or paragraph:

**Incorrect:** I went to the store and buy some bread.
**Correct:** I went to the store and bought some bread.

Keep the tense consistent unless there's a specific reason to change it.

## 3. Misplaced Modifiers

Placing modifiers in the wrong position can completely change meaning:

**Incorrect:** I only ate the vegetables.
**Correct:** I ate only the vegetables.

The first sentence means you did nothing else to the vegetables except eat them. The second means you ate nothing except the vegetables.

## 4. Pronoun Agreement

Pronouns must agree with the nouns they refer to in number and gender:

**Incorrect:** Each student should bring their book.
**Correct:** Each student should bring his or her book.

"Each" is singular, so it requires a singular pronoun. (Note: "Their" is becoming more accepted in informal writing.)

## 5. Double Negatives

Using two negatives in the same clause:

**Incorrect:** I don't need no help.
**Correct:** I don't need any help.

In English, two negatives cancel each other out and create a positive, which is usually not the intended meaning.

## 6. Fewer vs. Less

Use "fewer" for countable nouns and "less" for uncountable nouns:

**Incorrect:** There are less people here than yesterday.
**Correct:** There are fewer people here than yesterday.

## 7. Who vs. Whom

"Who" is the subject of a verb, while "whom" is the object:

**Incorrect:** Who did you give the book to?
**Correct:** Whom did you give the book to?

## 8. Dangling Participles

When a participle phrase doesn't clearly modify the right noun:

**Incorrect:** Walking down the street, the trees were beautiful.
**Correct:** Walking down the street, I saw beautiful trees.

## 9. Affect vs. Effect

"Affect" is usually a verb (to influence), while "effect" is usually a noun (result):

**Incorrect:** The rain effected our plans.
**Correct:** The rain affected our plans.

## 10. Its vs. It's

"Its" is possessive, while "it's" is a contraction of "it is" or "it has":

**Incorrect:** Its going to rain today.
**Correct:** It's going to rain today.

## Conclusion

Being aware of these common grammar mistakes is the first step to avoiding them. Practice regularly, proofread your writing carefully, and don't hesitate to use grammar checking tools. With time and practice, these rules will become second nature, and your English will sound more natural and professional.`,
    author: {
      name: "Michael Chen",
      avatar: "https://randomuser.me/api/portraits/men/45.jpg",
      bio: "Michael is a grammar expert with a passion for helping students improve their English accuracy.",
    },
    publishDate: "2023-10-20",
    readTime: 6,
    category: "Grammar",
    tags: ["grammar", "mistakes", "writing", "accuracy"],
    featuredImage:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    likesCount: 287,
    commentsCount: 42,
    isLiked: true,
    isBookmarked: false,
  },
  {
    id: "3",
    slug: "business-english-vocabulary",
    title: "Essential Business English Vocabulary for Professionals",
    excerpt:
      "Expand your professional vocabulary with these essential business English terms and phrases. Perfect for meetings, presentations, and workplace communication.",
    content: `# Essential Business English Vocabulary for Professionals

In today's global business environment, having a strong command of business English vocabulary is crucial for professional success. This comprehensive guide covers the most important terms and phrases used in business contexts.

## Meeting Vocabulary

### Arranging a Meeting
- **Schedule**: To arrange a time for something to happen
- **Agenda**: A list of items to be discussed at a meeting
- **Minutes**: Written record of what was said and decided at a meeting
- **Action items**: Tasks that need to be completed after a meeting

### During a Meeting
- **Facilitate**: To make an action or process easy or easier
- **Consensus**: General agreement among a group
- **Brainstorm**: To produce ideas or thoughts
- **Follow up**: To take further action after something has been done

## Presentation Vocabulary

### Planning a Presentation
- **Objective**: What you want to achieve
- **Target audience**: The people you want to reach
- **Key points**: The main ideas you want to communicate
- **Structure**: The way something is organized

### Delivering a Presentation
- **Engage**: To get and keep someone's attention
- **Articulate**: To express an idea or feeling fluently
- **Elaborate**: To explain something in more detail
- **Summarize**: To give a brief statement of the main points

## Negotiation Vocabulary

### Preparation
- **Bargaining chip**: Something you can use to negotiate
- **Bottom line**: The lowest price or offer someone will accept
- **Walk away point**: The point at which you will stop negotiating
- **Leverage**: Power to influence a situation

### During Negotiation
- **Counteroffer**: An offer made in response to another offer
- **Compromise**: An agreement reached by each side making concessions
- **Stalemate**: A situation in which no progress can be made
- **Win-win**: A situation where both parties benefit

## Email Vocabulary

### Structure
- **Subject line**: The title of an email
- **Salutation**: The greeting at the beginning of a letter or email
- **Body**: The main part of an email
- **Closing**: The words used to end an email before signing your name

### Common Phrases
- **Following up**: To check that something has been done
- **Looking forward to**: Used to say you are excited about something
- **Regards**: Used at the end of an email before your name
- **Attachment**: A file that is sent with an email

## Conclusion

Building your business English vocabulary takes time and practice. Focus on learning words and phrases that are relevant to your specific field or industry. Use these terms in your daily work communications to reinforce your learning.

Remember that context is key—understanding when and how to use these terms is just as important as knowing what they mean. With consistent practice, you'll soon be communicating with confidence in any business setting.`,
    author: {
      name: "Emily Watson",
      avatar: "https://randomuser.me/api/portraits/women/67.jpg",
      bio: "Emily is a business communication specialist with experience in corporate training.",
    },
    publishDate: "2023-10-15",
    readTime: 10,
    category: "Business English",
    tags: ["business", "vocabulary", "professional", "workplace"],
    featuredImage:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    likesCount: 198,
    commentsCount: 15,
    isLiked: false,
    isBookmarked: true,
  },
  {
    id: "4",
    slug: "pronunciation-tips",
    title: "5 Pronunciation Tips to Sound More Like a Native Speaker",
    excerpt:
      "Improve your English pronunciation with these expert tips. Learn about stress patterns, intonation, and common pronunciation challenges that many English learners face.",
    content: `# 5 Pronunciation Tips to Sound More Like a Native Speaker

Achieving native-like pronunciation is one of the most challenging aspects of learning English. However, with the right techniques and consistent practice, you can significantly improve your pronunciation and sound more natural.

## 1. Master Word Stress

English is a stress-timed language, which means certain syllables in words are emphasized more than others. Learning correct word stress is essential for clear communication:

### Basic Stress Rules
- In two-syllable nouns and adjectives, stress usually falls on the first syllable (PREsent, HAPPy)
- In two-syllable verbs, stress usually falls on the second syllable (preSENT, beGIN)
- Words ending in -tion, -sion, -ic usually have stress on the syllable before these endings (inforMAtion, deCIsion)

### Practice Techniques
- Listen carefully to how native speakers stress words
- Use a dictionary with pronunciation guides
- Practice with minimal pairs (words that differ by only one sound)
- Record yourself and compare with native speakers

## 2. Understand Sentence Stress and Rhythm

English has a characteristic rhythm where stressed words occur at regular intervals, while unstressed words are often reduced:

### Stress Patterns
- Content words (nouns, verbs, adjectives, adverbs) are usually stressed
- Function words (articles, prepositions, pronouns) are usually unstressed
- Unstressed words often have reduced vowels (schwa sound /ə/)

### Example
**Stressed words in bold:** I **went** to the **store** to **buy** some **bread**.
**Unstressed words:** I went **to** the store **to** buy **some** bread.

## 3. Master Intonation

Intonation refers to the rise and fall of your voice when speaking. It's crucial for conveying meaning and emotion:

### Types of Intonation
- **Falling intonation**: Used for statements, commands, and wh-questions
- **Rising intonation**: Used for yes/no questions and to show surprise
- **Fall-rise intonation**: Used for uncertainty or to show you haven't finished speaking

### Practice Tips
- Listen to how native speakers use intonation in different situations
- Practice with questions that have different meanings based on intonation
- Exaggerate intonation patterns when practicing to make them more noticeable

## 4. Focus on Problem Sounds

Certain English sounds are particularly challenging for learners:

### Consonant Challenges
- **Th sounds** (/θ/ and /ð/): Practice with "think," "this," "three," "there"
- **R and L sounds**: Many languages don't distinguish between these
- **V and W sounds**: Practice minimal pairs like "very" vs. "wery"

### Vowel Challenges
- **Vowel length**: English has short and long vowels that change word meaning
- **Diphthongs**: Two-part vowels like in "boy," "say," "how"
- **Schwa sound** (/ə/): The most common vowel in unstressed syllables

## 5. Use Technology and Feedback

Modern tools can help you improve your pronunciation:

### Helpful Tools
- **Pronunciation apps**: Use apps that provide instant feedback
- **Speech recognition**: Test if technology can understand your pronunciation
- **Recording devices**: Record yourself regularly to track progress
- **Online tutors**: Get personalized feedback from native speakers

### Feedback Techniques
- Ask native speakers to correct your pronunciation
- Focus on one sound or pattern at a time
- Practice in low-pressure situations before important ones
- Remember that improvement takes time and consistent effort

## Conclusion

Improving your pronunciation is a gradual process that requires patience and consistent practice. Focus on these five key areas, and you'll see significant improvement over time.

Remember that the goal is clear communication, not perfect accent. Even native speakers have different accents, so aim for pronunciation that is easily understood by others.

With regular practice and the right techniques, you'll develop confidence in your speaking abilities and sound more natural when communicating in English.`,
    author: {
      name: "David Brown",
      avatar: "https://randomuser.me/api/portraits/men/22.jpg",
      bio: "David is a pronunciation coach with expertise in phonetics and accent reduction.",
    },
    publishDate: "2023-10-10",
    readTime: 7,
    category: "Speaking",
    tags: ["pronunciation", "accent", "speaking", "native"],
    featuredImage:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    likesCount: 423,
    commentsCount: 31,
    isLiked: true,
    isBookmarked: false,
  },
  {
    id: "5",
    slug: "ielts-writing-task-2",
    title: "Mastering IELTS Writing Task 2: A Step-by-Step Guide",
    excerpt:
      "Learn how to structure your essay, develop ideas, and use appropriate vocabulary to achieve a high score in IELTS Writing Task 2. Includes sample essays and examiner feedback.",
    content: `# Mastering IELTS Writing Task 2: A Step-by-Step Guide

IELTS Writing Task 2 can be challenging, but with the right approach, you can achieve a high score. This comprehensive guide breaks down the essay writing process into manageable steps, from understanding the question to proofreading your final draft.

## Understanding the Task

Before you start writing, it's crucial to understand exactly what the question is asking:

### Question Types
- **Opinion essays**: Do you agree or disagree?
- **Discussion essays**: Discuss both views and give your opinion
- **Problem/solution essays**: What are the causes and solutions?
- **Advantage/disadvantage essays**: What are the pros and cons?

### Key Requirements
- Write at least 250 words
- Spend about 40 minutes on this task
- Use formal academic language
- Present a clear position with supporting arguments

## Step 1: Analyze the Question

Take 2-3 minutes to carefully analyze the question:

### Identify Key Elements
- **Topic**: What is the subject matter?
- **Focus**: What specific aspect of the topic is addressed?
- **Scope**: How narrow or broad is the question?
- **Instructions**: What exactly are you asked to do?

### Example Analysis
**Question:** "Some people believe that unpaid community service should be a compulsory part of high school programs. To what extent do you agree or disagree?"

**Analysis:**
- Topic: Unpaid community service in high schools
- Focus: Whether it should be compulsory
- Scope: High school programs only
- Instruction: State your opinion with supporting arguments

## Step 2: Brainstorm and Plan

Spend 5 minutes planning your essay:

### Brainstorming Technique
- Create a mind map with the topic in the center
- Branch out with relevant ideas, examples, and personal experiences
- Consider both sides of the argument, even for opinion essays
- Select the strongest 2-3 main points

### Essay Structure
Create a clear outline with:
1. **Introduction**: Background + thesis statement
2. **Body Paragraph 1**: First main point + supporting details
3. **Body Paragraph 2**: Second main point + supporting details
4. **Body Paragraph 3**: Third main point + supporting details (optional)
5. **Conclusion**: Summary of main points + final thought

## Step 3: Write the Introduction

Your introduction should be 2-3 sentences long:

### Structure
1. **Background statement**: General information about the topic
2. **Paraphrase the question**: Restate the question in your own words
3. **Thesis statement**: Clearly state your position or main argument

### Example Introduction
"Community involvement has long been considered a valuable component of education. There is a growing debate about whether unpaid community service should be mandatory for high school students. While some argue that it would burden students with additional responsibilities, I firmly believe that compulsory community service would provide significant benefits for both students and society."

## Step 4: Develop Body Paragraphs

Each body paragraph should focus on one main idea:

### PEEL Structure
- **Point**: Clearly state the main idea of the paragraph
- **Explain**: Elaborate on your point
- **Example**: Provide specific examples or evidence
- **Link**: Connect back to your main argument

### Example Body Paragraph
"Firstly, mandatory community service would help students develop important life skills. By participating in activities such as helping the elderly or environmental conservation, students learn responsibility, teamwork, and empathy. For instance, a study by the National Youth Leadership Council found that students who regularly engaged in community service demonstrated higher levels of emotional intelligence and problem-solving abilities. These skills are not typically taught in traditional classroom settings but are invaluable for future success in both personal and professional life."

## Step 5: Write the Conclusion

Your conclusion should summarize your main points without introducing new information:

### Structure
1. **Signal the end**: Use phrases like "In conclusion" or "To summarize"
2. **Summarize main points**: Briefly restate your key arguments
3. **Restate thesis**: Rephrase your main position
4. **Final thought**: End with a prediction, recommendation, or final comment

### Example Conclusion
"In conclusion, while implementing mandatory community service in high schools would require careful planning and resources, the benefits far outweigh the challenges. Not only would it help students develop essential life skills and civic responsibility, but it would also strengthen communities and address social needs. Therefore, I strongly support the integration of compulsory community service into high school curricula as a means of developing well-rounded, socially conscious individuals."

## Step 6: Review and Edit

Take the final 3-5 minutes to review your essay:

### Checklist
- Word count: Have you written at least 250 words?
- Paragraph structure: Does each paragraph have a clear topic sentence?
- Grammar and spelling: Check for common errors
- Vocabulary: Have you used a range of appropriate vocabulary?
- Cohesion: Are your ideas connected with appropriate transition words?
- Task response: Have you fully addressed all parts of the question?

## Common Mistakes to Avoid

1. **Not addressing all parts of the question**
2. **Unclear position or argument**
3. **Insufficient support for main points**
4. **Overuse of simple vocabulary and sentence structures**
5. **Grammatical errors that impede communication**
6. **Not managing time effectively**

## Sample Essay with Examiner Comments

Here's a sample essay with comments from an IELTS examiner:

[Sample essay content with examiner feedback highlighting strengths and areas for improvement]

## Conclusion

Mastering IELTS Writing Task 2 requires understanding the task, planning carefully, structuring your essay logically, and using appropriate language. With regular practice using these steps, you can develop the skills needed to achieve a high score.

Remember to time yourself when practicing to ensure you can complete all steps within the 40-minute time limit. Quality practice with feedback from experienced teachers or tutors will help you identify and improve on your specific weaknesses.`,
    author: {
      name: "Jennifer Lee",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      bio: "Jennifer is an IELTS examiner with over 15 years of experience in test preparation.",
    },
    publishDate: "2023-10-05",
    readTime: 12,
    category: "Test Preparation",
    tags: ["IELTS", "writing", "essay", "test"],
    featuredImage:
      "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    likesCount: 567,
    commentsCount: 89,
    isLiked: false,
    isBookmarked: true,
  },
  {
    id: "6",
    slug: "english-idioms-expressions",
    title: "20 Common English Idioms and How to Use Them",
    excerpt:
      "Idioms add color and personality to your English. Learn 20 common English idioms, their meanings, and how to use them correctly in everyday conversation.",
    content: `# 20 Common English Idioms and How to Use Them

English idioms can be confusing for language learners because their meanings often can't be guessed from the individual words. In this article, we'll explore 20 common English idioms, explain their meanings, and provide examples of how to use them in context.

## 1. Break a leg

**Meaning**: Good luck, especially before a performance or exam
**Example**: "Break a leg in your job interview tomorrow!"

## 2. Bite the bullet

**Meaning**: To face a difficult situation with courage
**Example**: "I hate going to the dentist, but I'll have to bite the bullet and get my tooth fixed."

## 3. Hit the nail on the head

**Meaning**: To describe something exactly right
**Example**: "You hit the nail on the head with that analysis of the situation."

## 4. Once in a blue moon

**Meaning**: Very rarely
**Example**: "I only see my cousins from Australia once in a blue moon."

## 5. A piece of cake

**Meaning**: Something very easy
**Example**: "The English test was a piece of cake. I finished in 30 minutes."

## 6. Spill the beans

**Meaning**: To reveal a secret
**Example**: "Come on, spill the beans about what happened at the party last night."

## 7. Under the weather

**Meaning**: Feeling ill or sick
**Example**: "I'm feeling under the weather today, so I'm staying home from work."

## 8. Costs an arm and a leg

**Meaning**: Very expensive
**Example**: "That new smartphone costs an arm and a leg."

## 9. Add insult to injury

**Meaning**: To make a bad situation worse
**Example**: "To add insult to injury, after my car broke down, it started raining."

## 10. In the same boat

**Meaning**: In the same difficult situation
**Example**: "We're all in the same boat with this difficult project."

## 11. See eye to eye

**Meaning**: To agree with someone
**Example**: "I don't see eye to eye with my boss on this issue."

## 12. The ball is in your court

**Meaning**: It's your turn to take action or make a decision
**Example**: "I've done all I can. The ball is in your court now."

## 13. Cross that bridge when you come to it

**Meaning**: Deal with a problem when it happens, not before
**Example**: "I'm not worried about potential problems. We'll cross that bridge when we come to it."

## 14. Through thick and thin

**Meaning**: In all situations, both good and bad
**Example**: "True friends stick with you through thick and thin."

## 15. Think outside the box

**Meaning**: To think creatively in an unconventional way
**Example**: "We need to think outside the box to solve this complex problem."

## 16. Let the cat out of the bag

**Meaning**: To accidentally reveal a secret
**Example**: "Who let the cat out of the bag about the surprise party?"

## 17. Hit the books

**Meaning**: To study hard
**Example**: "I need to hit the books this weekend if I want to pass the exam."

## 18. On the same page

**Meaning**: To have the same understanding or opinion
**Example**: "Before we proceed, let's make sure we're all on the same page."

## 19. Burn the midnight oil

**Meaning**: To work late into the night
**Example**: "I'll have to burn the midnight oil to finish this report by tomorrow."

## 20. The icing on the cake

**Meaning**: Something extra that makes a good thing even better
**Example**: "Winning the game was great, but scoring the winning goal was the icing on the cake."

## Tips for Learning Idioms

1. **Learn in context**: Don't just memorize lists of idioms. Learn them in sentences or stories.
2. **Visualize**: Create mental images or drawings to help remember the meanings.
3. **Practice regularly**: Try to use one or two new idioms each day in conversation or writing.
4. **Group by theme**: Learn idioms that are related to each other (e.g., idioms about animals, weather, etc.).
5. **Check appropriateness**: Some idioms are more formal or informal than others.

## Common Mistakes to Avoid

1. **Translating directly**: Idioms often don't translate well between languages.
2. **Using them too frequently**: Overusing idioms can make your speech sound unnatural.
3. **Getting the wording wrong**: Small changes can completely change the meaning.
4. **Using them in inappropriate contexts**: Some idioms are too informal for business or academic settings.

## Conclusion

Idioms add richness and color to your English, but they can be challenging to learn and use correctly. Focus on learning the most common idioms first, and practice them in context before using them in important conversations or writing.

Remember that even native speakers don't use all idioms, so focus on the ones that are most relevant to your needs and communication style. With practice, you'll start to recognize and use these expressions naturally.`,
    author: {
      name: "Robert Wilson",
      avatar: "https://randomuser.me/api/portraits/men/67.jpg",
      bio: "Robert is a linguist specializing in English idioms and expressions.",
    },
    publishDate: "2023-09-28",
    readTime: 9,
    category: "Vocabulary",
    tags: ["idioms", "expressions", "vocabulary", "phrases"],
    featuredImage:
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    likesCount: 234,
    commentsCount: 17,
    isLiked: false,
    isBookmarked: false,
  },
];

// Mock comments data
export const mockComments: Comment[] = [
  {
    id: "1",
    userId: "user1",
    userName: "Alice Johnson",
    userAvatar: "https://randomuser.me/api/portraits/women/32.jpg",
    content:
      "This article was incredibly helpful! I've been struggling with English pronunciation for months, and these tips have already made a difference. The section on word stress was particularly useful for me.",
    date: "2023-10-26",
    likesCount: 12,
    isLiked: false,
  },
  {
    id: "2",
    userId: "user2",
    userName: "Bob Smith",
    userAvatar: "https://randomuser.me/api/portraits/men/45.jpg",
    content:
      "Great article! I would add that watching movies with subtitles in English first, then without subtitles, has been really effective for improving my listening skills. Also, finding a language exchange partner has helped me practice speaking regularly.",
    date: "2023-10-26",
    likesCount: 8,
    isLiked: true,
  },
  {
    id: "3",
    userId: "user3",
    userName: "Carol Davis",
    userAvatar: "https://randomuser.me/api/portraits/women/67.jpg",
    content:
      "I've been learning English for 3 years, and I can confirm that consistency is key. Even 15 minutes of practice every day makes a huge difference compared to studying for hours once a week. Thanks for sharing these strategies!",
    date: "2023-10-25",
    likesCount: 15,
    isLiked: false,
  },
];

// Categories for filter
export const categories = [
  "All",
  "Learning Tips",
  "Grammar",
  "Business English",
  "Speaking",
  "Test Preparation",
  "Vocabulary",
];
