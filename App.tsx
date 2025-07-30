import React, { useState, useCallback, useEffect, useRef } from 'react';
import SflConcept from './components/SflConcept';
import Tooltip from './components/Tooltip';
import ChatInterface from './components/ChatInterface';
import InteractiveAnalyzer from './components/InteractiveAnalyzer';
import Spinner from './components/Spinner';
import Sidebar from './components/Sidebar';

// Helper to shuffle array for a different order on each load
const shuffleArray = <T,>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
};

interface Slide {
    id: string;
    component: React.ReactNode;
}

const App: React.FC = () => {
  const [activeTopic, setActiveTopic] = useState<string | null>(null);
  const [fileContext, setFileContext] = useState<{ name: string; content: string } | null>(null);
  const [chatKey, setChatKey] = useState<number>(1);
  const [showHeader, setShowHeader] = useState(true);
  const [shuffledSlides, setShuffledSlides] = useState<Slide[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [animationKey, setAnimationKey] = useState(0);
  const lastScrollY = useRef(0);

  const handleTopicSelect = useCallback((topic: string) => {
    setActiveTopic(topic);
    setFileContext(null);
    setChatKey(prev => prev + 1);
  }, []);

  const handleFileContextChange = useCallback((name: string, content: string) => {
    setFileContext({ name, content });
    setActiveTopic(null);
    setChatKey(prev => prev + 1);
  }, []);
  
  const clearAllContext = useCallback(() => {
    setFileContext(null);
    setActiveTopic(null);
    setChatKey(prev => prev + 1);
  }, []);

  useEffect(() => {
    const concepts: Slide[] = [
      {
        id: 'sfl-intro',
        component: <SflConcept title={<>What is <Tooltip isClickable onClick={() => handleTopicSelect('Systemic Functional Linguistics (SFL)')} content="A sociological approach to language. Instead of just rules, SFL provides a toolkit to understand how language is used to build meaning, relationships, and reality in different contexts.">Systemic Functional Linguistics (SFL)</Tooltip>?</>}>
              <p>SFL is a theory of language that focuses on meaning and choice. Instead of asking "Is this sentence grammatically correct?", SFL asks "What does this language do? What meaning does it create?". It views language as a resource for making meaning in context.</p>
              <p className="mt-2">It's built around three 'metafunctions' that happen simultaneously in any piece of text. Click on a concept to start a chat!</p>
            </SflConcept>
      },
      {
        id: 'ideational',
        component: <SflConcept title={<>1. <Tooltip isClickable onClick={() => handleTopicSelect('Ideational Metafunction')} content="This is the 'what's happening' function. It's how language constructs a model of experience, like a blueprint for a scene in a play. It's all about processes, who's involved, and the surrounding circumstances.">Ideational Metafunction</Tooltip>: Representing Experience</>}>
              <p>This is about how language represents the world and our experience of it. In software terms, this is the "domain model" of the text. We look for:</p>
              <ul className="list-disc list-inside mt-2 space-y-1 text-[#95aac0]">
                <li><Tooltip isClickable onClick={() => handleTopicSelect('Processes')} content="Think of these as the verbs of your system's story. 'Material' processes are actions (user clicks), 'Mental' processes are thoughts (system validates), and 'Relational' processes are states of being (report is ready).">Processes</Tooltip>: Actions, states, events (verbs - e.g., 'submits', 'calculates', 'is').</li>
                <li><Tooltip isClickable onClick={() => handleTopicSelect('Participants')} content="These are the 'characters' in your requirement. The 'Actor' performs the action, the 'Goal' is what's acted upon. Identifying them clearly defines who does what to whom.">Participants</Tooltip>: Who or what is involved (nouns - e.g., 'the user', 'the system').</li>
                <li><Tooltip isClickable onClick={() => handleTopicSelect('Circumstances')} content="The 'scenery' and 'props' of your story. They answer when, where, why, and how. 'After validation' sets a temporal condition, crucial for sequencing logic.">Circumstances</Tooltip>: Where, when, how, why (adverbials - e.g., 'on the dashboard', 'after validation').</li>
              </ul>
              <p className="mt-2">For a developer, analyzing this reveals the core entities, actions, and constraints of a feature.</p>
            </SflConcept>
      },
      {
        id: 'interpersonal',
        component: <SflConcept title={<>2. <Tooltip isClickable onClick={() => handleTopicSelect('Interpersonal Metafunction')} content="This is the 'who we are to each other' function. It's how language establishes roles, attitudes, and relationships. Are we giving an order, asking a question, or making a statement? This function builds the social context.">Interpersonal Metafunction</Tooltip>: Enacting Social Roles</>}>
              <p>This is about the relationship between the speaker/writer and the listener/reader. It's how language builds social reality. We analyze:</p>
              <ul className="list-disc list-inside mt-2 space-y-1 text-[#95aac0]">
                <li><Tooltip isClickable onClick={() => handleTopicSelect('Mood')} content="This reveals the expected interaction. 'Declarative' (The user sees...) describes a state. 'Interrogative' (Can the user...?) asks about capability. 'Imperative' (Export the report) is a direct command, often from a user story.">Mood</Tooltip>: Is it a statement (Declarative), question (Interrogative), or command (Imperative)?</li>
                <li><Tooltip isClickable onClick={() => handleTopicSelect('Modality')} content="The language of commitment. 'Must' is a high-modality, non-negotiable requirement. 'Should' is medium, a strong suggestion. 'May' or 'Can' is low, an optional feature. This is critical for prioritizing work.">Modality</Tooltip>: The level of certainty or obligation (e.g., 'must', 'should', 'might').</li>
                <li><Tooltip isClickable onClick={() => handleTopicSelect('Persona')} content="The voice of the requirement. Is it 'Authoritative' (The system shall...), 'Collaborative' (As a user, I want to...), or 'Neutral'? This can reveal hidden assumptions about the user's relationship with the system.">Persona</Tooltip>: The tone and attitude conveyed.</li>
              </ul>
              <p className="mt-2">For requirements, this exposes assumptions, power dynamics, and the certainty of a requirement. "The user must..." is very different from "The user should be able to...".</p>
            </SflConcept>
      },
      {
        id: 'textual',
        component: <SflConcept title={<>3. <Tooltip isClickable onClick={() => handleTopicSelect('Textual Metafunction')} content="This is the 'how it all hangs together' function. It organizes the Ideational and Interpersonal meanings into a linear, coherent flow of information, making text make sense as a whole, not just a jumble of words.">Textual Metafunction</Tooltip>: Creating Coherent Text</>}>
              <p>This is about how the message is organized and structured to be a coherent piece of text, rather than just random clauses. We look at:</p>
              <ul className="list-disc list-inside mt-2 space-y-1 text-[#95aac0]">
                <li><Tooltip isClickable onClick={() => handleTopicSelect('Theme/Rheme')} content="Theme is the 'topic' of the sentence, what it's about. Rheme is the 'comment', what's being said about the topic. In 'The user exports the report', 'The user' is the theme. Changing it to 'The report is exported by the user' shifts the focus to the report.">Theme/Rheme</Tooltip>: The 'point of departure' of a clause (Theme) and what's said about it (Rheme). Shows what's being prioritized.</li>
                <li><Tooltip isClickable onClick={() => handleTopicSelect('Cohesion')} content="The 'glue' that holds text together. Pronouns ('it', 'they'), conjunctions ('and', 'but', 'so'), and repetition create a logical flow. Poor cohesion in requirements leads to developers making incorrect connections between ideas.">Cohesion</Tooltip>: How different parts of the text are linked together (e.g., pronouns, conjunctions).</li>
              </ul>
              <p className="mt-2">In documentation or user stories, a confusing textual structure leads directly to ambiguity and implementation errors.</p>
            </SflConcept>
      }
    ];

    const analyzerSlide: Slide = {
      id: 'analyzer',
      component: <InteractiveAnalyzer />
    };

    setShuffledSlides([...shuffleArray(concepts), analyzerSlide]);
  }, [handleTopicSelect]);

  const goTo = (index: number) => {
    if (index === activeIndex) return;
    setActiveIndex(index);
    setAnimationKey(prev => prev + 1);
  };
  
  const goToNext = useCallback(() => {
    goTo((activeIndex + 1) % shuffledSlides.length);
  }, [activeIndex, shuffledSlides.length]);

  const goToPrev = useCallback(() => {
    goTo((activeIndex - 1 + shuffledSlides.length) % shuffledSlides.length);
  }, [activeIndex, shuffledSlides.length]);

  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;
    if (lastScrollY.current < currentScrollY && currentScrollY > 100) {
      setShowHeader(false);
    } else {
      setShowHeader(true);
    }
    lastScrollY.current = currentScrollY;
  }, []);
  
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    const target = event.target as HTMLElement;
    if (target.tagName === 'TEXTAREA' || target.tagName === 'INPUT' || target.isContentEditable) {
        return;
    }
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault();
      goToNext();
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault();
      goToPrev();
    }
  }, [goToNext, goToPrev]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleScroll, handleKeyDown]);

  const NavButton: React.FC<{onClick: () => void, children: React.ReactNode, 'aria-label': string}> = ({ onClick, children, 'aria-label': ariaLabel }) => (
      <button 
          onClick={onClick}
          aria-label={ariaLabel}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-[#95aac0] bg-[#333e48] rounded-md border border-[#5c6f7e] hover:bg-[#5c6f7e] hover:text-gray-200 transition-all focus:outline-none focus:ring-2 focus:ring-[#e2a32d]">
          {children}
      </button>
  );

  return (
    <div className="min-h-screen bg-[#212934] text-gray-200">
      <header className={`bg-[#333e48]/50 backdrop-blur-sm sticky top-0 z-20 border-b border-[#5c6f7e]/50 transition-transform duration-300 ease-in-out ${showHeader ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-3xl font-bold text-[#e2a32d] tracking-tight">Systemic Functional Linguistics CBT</h1>
          <p className="mt-1 text-[#95aac0]">A CBT for Systems & Software Engineering</p>
        </div>
      </header>

      <main className="max-w-screen-2xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Content Slides: appears first on mobile, second on desktop */}
          <div className="flex flex-col lg:col-span-5 lg:order-2">
            {shuffledSlides.length === 0 ? (
                <div className="flex items-center justify-center h-96">
                    <Spinner size="lg" />
                </div>
            ) : (
                <>
                    <div className="flex-grow">
                      <div key={animationKey} className="animate-slide-enter">
                          {shuffledSlides[activeIndex].component}
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center mt-6 pt-6 border-t border-[#5c6f7e]">
                        <NavButton onClick={goToPrev} aria-label="Previous slide">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                            Previous
                        </NavButton>

                        <div className="flex items-center justify-center gap-3">
                            {shuffledSlides.map((slide, index) => (
                                <button 
                                    key={slide.id}
                                    onClick={() => goTo(index)}
                                    className={`w-2.5 h-2.5 rounded-full transition-colors duration-300 ${activeIndex === index ? 'bg-[#e2a32d]' : 'bg-[#5c6f7e] hover:bg-[#95aac0]'}`}
                                    aria-label={`Go to slide ${index + 1}`}
                                />
                            ))}
                        </div>

                        <NavButton onClick={goToNext} aria-label="Next slide">
                            Next
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                        </NavButton>
                    </div>
                </>
            )}
          </div>
          
          {/* Chat Interface: appears second on mobile, third on desktop */}
          <div className={`lg:col-span-4 lg:order-3 sticky ${showHeader ? 'top-24' : 'top-6'} self-start transition-all duration-300 ease-in-out`}>
             <ChatInterface 
                key={chatKey}
                topic={activeTopic}
                fileContext={fileContext}
                onFileContextChange={handleFileContextChange}
                onClearContext={clearAllContext}
             />
          </div>

          {/* Sidebar: appears last on mobile, first on desktop */}
          <div className="lg:col-span-3 lg:order-1">
            <div className={`sticky ${showHeader ? 'top-24' : 'top-6'} self-start transition-all duration-300 ease-in-out`}>
                <Sidebar />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;