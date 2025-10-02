export type Prompt = {
  title: string;
  prompt: string;
};
export type PromptCategory = {
  category: string;
  icon: string; // Using string for icon names from lucide-react
  prompts: Prompt[];
};
export const PROMPT_LIBRARY: PromptCategory[] = [
  {
    category: 'Code Generation',
    icon: 'Code',
    prompts: [
      {
        title: 'React Component Boilerplate',
        prompt: 'Generate a functional React component boilerplate named `MyComponent`. It should use TypeScript, accept `title` and `children` as props, and use Tailwind CSS for basic styling.',
      },
      {
        title: 'Python Data Scraping Script',
        prompt: 'Write a Python script using BeautifulSoup and requests to scrape the headlines from the front page of bbc.com/news. The script should handle potential errors and print the headlines to the console.',
      },
      {
        title: 'SQL Query for User Analytics',
        prompt: 'Write a SQL query to find the top 5 users with the highest total purchase amount in the last 30 days. Assume a `users` table with `user_id` and a `purchases` table with `user_id`, `amount`, and `purchase_date`.',
      },
    ],
  },
  {
    category: 'Creative Writing',
    icon: 'Feather',
    prompts: [
      {
        title: 'Sci-Fi Story Opener',
        prompt: 'Write the opening paragraph of a science fiction story about a lone archivist living on a space station that orbits a black hole. The archivist discovers a message from a long-lost civilization.',
      },
      {
        title: 'Marketing Copy for a Coffee Brand',
        prompt: 'Generate three variations of marketing copy for a new brand of ethically sourced, single-origin coffee. The tone should be sophisticated, warm, and inviting. Highlight the unique flavor notes of Ethiopian Yirgacheffe beans.',
      },
      {
        title: 'Poem about the Ocean',
        prompt: 'Write a short, evocative poem about the deep ocean, focusing on the themes of mystery, pressure, and the unknown life that exists in the darkness.',
      },
    ],
  },
  {
    category: 'Business & Productivity',
    icon: 'Briefcase',
    prompts: [
      {
        title: 'Professional Email Template',
        prompt: 'Draft a professional email template to follow up with a potential client after a sales meeting. The email should be concise, reiterate the value proposition, and suggest clear next steps.',
      },
      {
        title: 'Summarize a Technical Article',
        prompt: 'Summarize the following article into five key bullet points, suitable for a busy executive. Focus on the main takeaways and business implications. [Paste article text here]',
      },
      {
        title: 'Brainstorm Project Names',
        prompt: 'Brainstorm 10 potential project names for a new internal software tool designed to streamline employee onboarding. The names should be modern, memorable, and reflect efficiency and a positive starting experience.',
      },
    ],
  },
  {
    category: 'General Knowledge',
    icon: 'BrainCircuit',
    prompts: [
      {
        title: 'Explain Quantum Computing',
        prompt: 'Explain the concept of quantum computing to a high school student. Use an analogy to describe qubits and superposition.',
      },
      {
        title: 'History of the Silk Road',
        prompt: 'Provide a brief overview of the history of the Silk Road, highlighting its importance in trade, cultural exchange, and the spread of ideas between the East and West.',
      },
    ],
  },
];