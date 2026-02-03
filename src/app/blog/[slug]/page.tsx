// src/app/blog/[slug]/page.tsx

"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useTheme } from "@/app/context/ThemeContext";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { format } from "date-fns";
import {
  Calendar,
  Clock,
  User,
  MessageCircle,
  Heart,
  Share2,
  Bookmark,
  ChevronRight,
  ArrowLeft,
  Tag,
  Facebook,
  Twitter,
  Linkedin,
  Mail,
  Send,
} from "lucide-react";

// TypeScript interfaces
interface BlogPost {
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

interface Comment {
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

// Mock blog data (same as blog listing page)
const blogPosts: BlogPost[] = [
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
- Record yourself speaking and listen back to identify areas for improvement
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
const mockComments: Comment[] = [
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

// Validation schema for comment form
const commentSchema = yup.object().shape({
  comment: yup
    .string()
    .required("Comment is required")
    .min(10, "Comment must be at least 10 characters"),
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
});

export default function BlogDetailsPage() {
  const { theme, colors } = useTheme();
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [post, setPost] = useState<BlogPost | null>(null);
  const [comments, setComments] = useState<Comment[]>(mockComments);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // React Hook Form for comment
  const {
    register: registerComment,
    handleSubmit: handleCommentSubmit,
    formState: { errors: commentErrors },
    reset: resetCommentForm,
  } = useForm({
    resolver: yupResolver(commentSchema),
    defaultValues: {
      comment: "",
      name: "",
      email: "",
    },
  });

  // Load blog post data
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const foundPost = blogPosts.find((p) => p.slug === slug);
      if (foundPost) {
        setPost(foundPost);
        setIsLiked(foundPost.isLiked);
        setIsBookmarked(foundPost.isBookmarked);

        // Find related posts (same category, different post)
        const related = blogPosts
          .filter(
            (p) => p.category === foundPost.category && p.id !== foundPost.id,
          )
          .slice(0, 3);
        setRelatedPosts(related);
      } else {
        // Post not found, redirect to blog listing
        router.push("/blog");
      }
      setIsLoading(false);
    }, 500);
  }, [slug, router]);

  // Handle comment submission
  const onCommentSubmit: SubmitHandler<any> = (data) => {
    setIsSubmittingComment(true);

    // Simulate API call
    setTimeout(() => {
      const newComment: Comment = {
        id: `comment-${Date.now()}`,
        userId: "current-user",
        userName: data.name,
        userAvatar: "https://randomuser.me/api/portraits/lego/1.jpg",
        content: data.comment,
        date: new Date().toISOString().split("T")[0],
        likesCount: 0,
        isLiked: false,
      };

      setComments([newComment, ...comments]);
      resetCommentForm();
      setIsSubmittingComment(false);
    }, 1000);
  };

  // Handle like
  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  // Handle bookmark
  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  // Handle share
  const handleShare = (platform: string) => {
    const url = window.location.href;
    const text = post?.title || "";

    let shareUrl = "";

    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
        break;
      case "email":
        shareUrl = `mailto:?subject=${text}&body=${url}`;
        break;
      default:
        return;
    }

    window.open(shareUrl, "_blank");
  };

  if (isLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "var(--color-background)" }}
      >
        <div
          className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2"
          style={{ borderColor: "var(--color-primary)" }}
        ></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "var(--color-background)" }}
      >
        <div className="text-center">
          <h1
            className="text-2xl font-bold mb-4"
            style={{ color: "var(--color-foreground)" }}
          >
            Blog Post Not Found
          </h1>
          <p className="mb-6" style={{ color: "var(--color-foreground)" }}>
            The blog post you're looking for doesn't exist.
          </p>
          <Link
            href="/blog"
            className="px-4 py-2 rounded-md text-white font-medium"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "var(--color-background)" }}
    >
      {/* Featured Image */}
      <div className="relative h-64 md:h-96 overflow-hidden">
        <Image
          src={post.featuredImage}
          alt={post.title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-4">
              <span
                className="text-xs font-medium px-2 py-1 rounded"
                style={{
                  backgroundColor: "var(--color-accent)",
                  color: "var(--color-background)",
                }}
              >
                {post.category}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center text-white">
              <div className="flex items-center mr-6 mb-2">
                <div className="w-8 h-8 rounded-full overflow-hidden mr-2">
                  <Image
                    src={post.author.avatar}
                    alt={post.author.name}
                    width={32}
                    height={32}
                    className="object-cover"
                  />
                </div>
                <span>{post.author.name}</span>
              </div>
              <div className="flex items-center mr-6 mb-2">
                <Calendar className="h-4 w-4 mr-1" />
                <span>
                  {format(new Date(post.publishDate), "MMM dd, yyyy")}
                </span>
              </div>
              <div className="flex items-center mb-2">
                <Clock className="h-4 w-4 mr-1" />
                <span>{post.readTime} min read</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Main Content */}
          <div className="flex-1">
            {/* Blog Content */}
            <div
              className="prose prose-lg max-w-none"
              style={{ color: "var(--color-foreground)" }}
            >
              {post.content.split("\n").map((paragraph, index) => {
                if (paragraph.startsWith("# ")) {
                  const level = paragraph.split(" ")[0].length;
                  const text = paragraph.substring(level + 1);
                  const Tag = `h${level}` as keyof React.JSX.IntrinsicElements;
                  return (
                    <Tag
                      key={index}
                      style={{ color: "var(--color-foreground)" }}
                    >
                      {text}
                    </Tag>
                  );
                } else if (paragraph.startsWith("## ")) {
                  const text = paragraph.substring(3);
                  return (
                    <h2
                      key={index}
                      style={{ color: "var(--color-foreground)" }}
                    >
                      {text}
                    </h2>
                  );
                } else if (paragraph.startsWith("### ")) {
                  const text = paragraph.substring(4);
                  return (
                    <h3
                      key={index}
                      style={{ color: "var(--color-foreground)" }}
                    >
                      {text}
                    </h3>
                  );
                } else if (paragraph.startsWith("#### ")) {
                  const text = paragraph.substring(5);
                  return (
                    <h4
                      key={index}
                      style={{ color: "var(--color-foreground)" }}
                    >
                      {text}
                    </h4>
                  );
                } else if (paragraph.startsWith("- ")) {
                  const text = paragraph.substring(2);
                  return (
                    <li
                      key={index}
                      style={{ color: "var(--color-foreground)" }}
                    >
                      {text}
                    </li>
                  );
                } else if (
                  paragraph.startsWith("**") &&
                  paragraph.endsWith("**")
                ) {
                  const text = paragraph.substring(2, paragraph.length - 2);
                  return (
                    <strong
                      key={index}
                      style={{ color: "var(--color-foreground)" }}
                    >
                      {text}
                    </strong>
                  );
                } else if (
                  paragraph.startsWith("*") &&
                  paragraph.endsWith("*")
                ) {
                  const text = paragraph.substring(1, paragraph.length - 1);
                  return (
                    <em
                      key={index}
                      style={{ color: "var(--color-foreground)" }}
                    >
                      {text}
                    </em>
                  );
                } else if (paragraph.trim() === "") {
                  return <br key={index} />;
                } else {
                  return (
                    <p key={index} style={{ color: "var(--color-foreground)" }}>
                      {paragraph}
                    </p>
                  );
                }
              })}
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-8">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-sm px-3 py-1 rounded-full flex items-center"
                  style={{
                    backgroundColor: "var(--color-background)",
                    color: "var(--color-foreground)",
                    border: `1px solid var(--color-border)`,
                  }}
                >
                  <Tag className="h-3 w-3 mr-1" />
                  {tag}
                </span>
              ))}
            </div>

            {/* Actions */}
            <div
              className="flex items-center justify-between mt-8 pt-8 border-t"
              style={{ borderColor: "var(--color-border)" }}
            >
              <div className="flex items-center gap-4">
                <button
                  onClick={handleLike}
                  className="flex items-center"
                  style={{
                    color: isLiked ? "#ef4444" : "var(--color-foreground)",
                    opacity: isLiked ? 1 : 0.7,
                  }}
                >
                  <Heart
                    className={`h-5 w-5 mr-1 ${isLiked ? "fill-current" : ""}`}
                  />
                  {post.likesCount +
                    (isLiked && !post.isLiked ? 1 : 0) -
                    (!isLiked && post.isLiked ? 1 : 0)}
                </button>
                <div
                  className="flex items-center"
                  style={{ color: "var(--color-foreground)", opacity: 0.7 }}
                >
                  <MessageCircle className="h-5 w-5 mr-1" />
                  {post.commentsCount}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleBookmark}
                  className="p-2 rounded-full"
                  style={{
                    color: isBookmarked ? "#f59e0b" : "var(--color-foreground)",
                    opacity: isBookmarked ? 1 : 0.7,
                  }}
                >
                  <Bookmark
                    className={`h-5 w-5 ${isBookmarked ? "fill-current" : ""}`}
                  />
                </button>
                <div className="relative">
                  <button
                    className="p-2 rounded-full"
                    style={{ color: "var(--color-foreground)", opacity: 0.7 }}
                  >
                    <Share2 className="h-5 w-5" />
                  </button>
                  <div
                    className="absolute right-0 mt-2 w-48 rounded-md shadow-lg z-10"
                    style={{ backgroundColor: "var(--color-card)" }}
                  >
                    <button
                      onClick={() => handleShare("facebook")}
                      className="flex items-center w-full px-4 py-2 text-left hover:bg-gray-100"
                      style={{ color: "var(--color-foreground)" }}
                    >
                      <Facebook className="h-4 w-4 mr-2" />
                      Facebook
                    </button>
                    <button
                      onClick={() => handleShare("twitter")}
                      className="flex items-center w-full px-4 py-2 text-left hover:bg-gray-100"
                      style={{ color: "var(--color-foreground)" }}
                    >
                      <Twitter className="h-4 w-4 mr-2" />
                      Twitter
                    </button>
                    <button
                      onClick={() => handleShare("linkedin")}
                      className="flex items-center w-full px-4 py-2 text-left hover:bg-gray-100"
                      style={{ color: "var(--color-foreground)" }}
                    >
                      <Linkedin className="h-4 w-4 mr-2" />
                      LinkedIn
                    </button>
                    <button
                      onClick={() => handleShare("email")}
                      className="flex items-center w-full px-4 py-2 text-left hover:bg-gray-100"
                      style={{ color: "var(--color-foreground)" }}
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      Email
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Author Bio */}
            <div
              className="mt-12 p-6 rounded-lg"
              style={{ backgroundColor: "var(--color-card)" }}
            >
              <div className="flex items-center mb-4">
                <div className="w-16 h-16 rounded-full overflow-hidden mr-4">
                  <Image
                    src={post.author.avatar}
                    alt={post.author.name}
                    width={64}
                    height={64}
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3
                    className="text-xl font-bold"
                    style={{ color: "var(--color-foreground)" }}
                  >
                    {post.author.name}
                  </h3>
                  <p style={{ color: "var(--color-foreground)", opacity: 0.7 }}>
                    {post.author.bio}
                  </p>
                </div>
              </div>
              <button
                className="px-4 py-2 rounded-md text-white font-medium"
                style={{ backgroundColor: "var(--color-primary)" }}
              >
                Follow Author
              </button>
            </div>

            {/* Comments Section */}
            <div className="mt-12">
              <h2
                className="text-2xl font-bold mb-6"
                style={{ color: "var(--color-foreground)" }}
              >
                Comments ({comments.length})
              </h2>

              {/* Comment Form */}
              <div
                className="p-6 rounded-lg mb-8"
                style={{ backgroundColor: "var(--color-card)" }}
              >
                <h3
                  className="text-lg font-medium mb-4"
                  style={{ color: "var(--color-foreground)" }}
                >
                  Leave a Comment
                </h3>
                <form onSubmit={handleCommentSubmit(onCommentSubmit)}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium mb-1"
                        style={{ color: "var(--color-foreground)" }}
                      >
                        Name
                      </label>
                      <input
                        id="name"
                        type="text"
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        style={{
                          backgroundColor: "var(--color-background)",
                          borderColor: commentErrors.name
                            ? "#ef4444"
                            : "var(--color-border)",
                          color: "var(--color-foreground)",
                        }}
                        {...registerComment("name")}
                      />
                      {commentErrors.name && (
                        <p className="mt-1 text-sm text-red-600">
                          {commentErrors.name.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium mb-1"
                        style={{ color: "var(--color-foreground)" }}
                      >
                        Email
                      </label>
                      <input
                        id="email"
                        type="email"
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        style={{
                          backgroundColor: "var(--color-background)",
                          borderColor: commentErrors.email
                            ? "#ef4444"
                            : "var(--color-border)",
                          color: "var(--color-foreground)",
                        }}
                        {...registerComment("email")}
                      />
                      {commentErrors.email && (
                        <p className="mt-1 text-sm text-red-600">
                          {commentErrors.email.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="comment"
                      className="block text-sm font-medium mb-1"
                      style={{ color: "var(--color-foreground)" }}
                    >
                      Comment
                    </label>
                    <textarea
                      id="comment"
                      rows={4}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      style={{
                        backgroundColor: "var(--color-background)",
                        borderColor: commentErrors.comment
                          ? "#ef4444"
                          : "var(--color-border)",
                        color: "var(--color-foreground)",
                      }}
                      placeholder="Share your thoughts..."
                      {...registerComment("comment")}
                    ></textarea>
                    {commentErrors.comment && (
                      <p className="mt-1 text-sm text-red-600">
                        {commentErrors.comment.message}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmittingComment}
                    className="px-4 py-2 rounded-md text-white font-medium disabled:opacity-50 flex items-center"
                    style={{ backgroundColor: "var(--color-primary)" }}
                  >
                    {isSubmittingComment ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Posting...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Post Comment
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Comments List */}
              <div className="space-y-6">
                {comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="p-6 rounded-lg"
                    style={{ backgroundColor: "var(--color-card)" }}
                  >
                    <div className="flex items-start">
                      <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                        <Image
                          src={comment.userAvatar}
                          alt={comment.userName}
                          width={48}
                          height={48}
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <h4
                            className="font-medium mr-2"
                            style={{ color: "var(--color-foreground)" }}
                          >
                            {comment.userName}
                          </h4>
                          <span
                            className="text-sm"
                            style={{
                              color: "var(--color-foreground)",
                              opacity: 0.7,
                            }}
                          >
                            {format(new Date(comment.date), "MMM dd, yyyy")}
                          </span>
                        </div>
                        <p
                          className="mb-3"
                          style={{
                            color: "var(--color-foreground)",
                            opacity: 0.8,
                          }}
                        >
                          {comment.content}
                        </p>
                        <button
                          className="flex items-center text-sm"
                          style={{
                            color: comment.isLiked
                              ? "#ef4444"
                              : "var(--color-foreground)",
                            opacity: comment.isLiked ? 1 : 0.7,
                          }}
                        >
                          <Heart
                            className={`h-4 w-4 mr-1 ${comment.isLiked ? "fill-current" : ""}`}
                          />
                          {comment.likesCount}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-80">
            <div className="sticky top-6 space-y-8">
              {/* Table of Contents */}
              <div
                className="p-6 rounded-lg"
                style={{ backgroundColor: "var(--color-card)" }}
              >
                <h3
                  className="text-lg font-medium mb-4"
                  style={{ color: "var(--color-foreground)" }}
                >
                  Table of Contents
                </h3>
                <ul className="space-y-2">
                  {post.content
                    .split("\n")
                    .filter((line) => line.startsWith("# "))
                    .map((heading, index) => {
                      const level = heading.split(" ")[0].length;
                      const text = heading.substring(level + 1);
                      return (
                        <li
                          key={index}
                          className={`${level > 1 ? "ml-" + (level - 1) * 4 : ""}`}
                        >
                          <a
                            href={`#${text.toLowerCase().replace(/\s+/g, "-")}`}
                            className="text-sm hover:underline"
                            style={{
                              color: "var(--color-foreground)",
                              opacity: 0.8,
                            }}
                          >
                            {text}
                          </a>
                        </li>
                      );
                    })}
                </ul>
              </div>

              {/* Related Posts */}
              <div>
                <h3
                  className="text-lg font-medium mb-4"
                  style={{ color: "var(--color-foreground)" }}
                >
                  Related Posts
                </h3>
                <div className="space-y-4">
                  {relatedPosts.map((relatedPost) => (
                    <Link
                      key={relatedPost.id}
                      href={`/blog/${relatedPost.slug}`}
                      className="block p-4 rounded-lg transition-all hover:shadow-md"
                      style={{ backgroundColor: "var(--color-card)" }}
                    >
                      <div className="flex gap-3">
                        <div className="w-16 h-16 rounded overflow-hidden flex-shrink-0">
                          <Image
                            src={relatedPost.featuredImage}
                            alt={relatedPost.title}
                            width={64}
                            height={64}
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h4
                            className="font-medium text-sm mb-1 line-clamp-2"
                            style={{ color: "var(--color-foreground)" }}
                          >
                            {relatedPost.title}
                          </h4>
                          <div
                            className="flex items-center text-xs"
                            style={{
                              color: "var(--color-foreground)",
                              opacity: 0.7,
                            }}
                          >
                            <Calendar className="h-3 w-3 mr-1" />
                            {format(
                              new Date(relatedPost.publishDate),
                              "MMM dd",
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
