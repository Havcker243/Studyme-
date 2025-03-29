import { useLocalStorage } from "./use-local-storage.tsx";

export interface MCQOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  mcqOptions?: MCQOption[];
}

export interface FlashcardSet {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  flashcards: Flashcard[];
}

const DEFAULT_FLASHCARD_SETS: FlashcardSet[] = [
  {
    id: "demo",
    title: "Sample Business Strategy Document",
    description: "Key concepts from the business strategy document",
    createdAt: new Date().toISOString(),
    flashcards: [
      {
        id: "card-1",
        question: "What is the main thesis of the document?",
        answer: "Adaptive management strategies lead to improved business outcomes in complex organizational systems.",
        mcqOptions: [
          { id: "opt-1", text: "Adaptive management strategies lead to improved business outcomes", isCorrect: true },
          { id: "opt-2", text: "Rigid hierarchies produce the best business results", isCorrect: false },
          { id: "opt-3", text: "Small businesses outperform large corporations in all sectors", isCorrect: false },
          { id: "opt-4", text: "Remote work reduces productivity in all cases", isCorrect: false },
        ]
      },
      {
        id: "card-2",
        question: "What evidence does the author use to support their arguments?",
        answer: "Case studies across multiple industries, statistical analysis, and qualitative assessments from industry leaders.",
        mcqOptions: [
          { id: "opt-1", text: "Only theoretical models without practical examples", isCorrect: false },
          { id: "opt-2", text: "A single case study from one company", isCorrect: false },
          { id: "opt-3", text: "Case studies, statistical analysis, and qualitative assessments", isCorrect: true },
          { id: "opt-4", text: "Expert opinions without supporting data", isCorrect: false },
        ]
      },
      {
        id: "card-3",
        question: "What are the key challenges identified in implementing the proposed strategies?",
        answer: "Resistance to change, resource constraints, and lack of organizational alignment.",
        mcqOptions: [
          { id: "opt-1", text: "Only technical limitations", isCorrect: false },
          { id: "opt-2", text: "Resistance to change, resource constraints, and lack of alignment", isCorrect: true },
          { id: "opt-3", text: "Financial constraints only", isCorrect: false },
          { id: "opt-4", text: "Legal and regulatory barriers", isCorrect: false },
        ]
      },
      {
        id: "card-4",
        question: "How does the document recommend addressing implementation challenges?",
        answer: "Through stakeholder engagement, phased implementation, and continuous monitoring with feedback loops.",
        mcqOptions: [
          { id: "opt-1", text: "Complete reorganization of the company structure", isCorrect: false },
          { id: "opt-2", text: "Hiring external consultants to drive change", isCorrect: false },
          { id: "opt-3", text: "Stakeholder engagement, phased implementation, and feedback loops", isCorrect: true },
          { id: "opt-4", text: "Implementing all changes at once", isCorrect: false },
        ]
      },
      {
        id: "card-5",
        question: "What metrics are suggested for measuring success?",
        answer: "Operational efficiency, employee engagement, innovation output, and financial performance indicators.",
        mcqOptions: [
          { id: "opt-1", text: "Only revenue and profit margins", isCorrect: false },
          { id: "opt-2", text: "Customer satisfaction scores exclusively", isCorrect: false },
          { id: "opt-3", text: "Stock price and market capitalization", isCorrect: false },
          { id: "opt-4", text: "Operational efficiency, employee engagement, innovation, and financial indicators", isCorrect: true },
        ]
      }
    ]
  }
];

export function useFlashcardSets() {
  const [flashcardSets, setFlashcardSets] = useLocalStorage<FlashcardSet[]>(
    "flashcard-sets",
    DEFAULT_FLASHCARD_SETS
  );

  const addFlashcardSet = (newSet: Omit<FlashcardSet, "id" | "createdAt">) => {
    const set: FlashcardSet = {
      ...newSet,
      id: `set-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setFlashcardSets([...flashcardSets, set]);
    return set;
  };

  const updateFlashcardSet = (updatedSet: FlashcardSet) => {
    setFlashcardSets(
      flashcardSets.map((set) => (set.id === updatedSet.id ? updatedSet : set))
    );
  };

  const deleteFlashcardSet = (setId: string) => {
    setFlashcardSets(flashcardSets.filter((set) => set.id !== setId));
  };

  const getFlashcardSet = (setId: string) => {
    return flashcardSets.find((set) => set.id === setId);
  };

  return {
    flashcardSets,
    addFlashcardSet,
    updateFlashcardSet,
    deleteFlashcardSet,
    getFlashcardSet,
  };
}
