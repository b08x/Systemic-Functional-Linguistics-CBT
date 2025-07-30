import React from 'react';

const resourceCategories = [
    {
        category: 'Core SFL Concepts',
        resources: [
            {
                title: 'An Introduction to SFL',
                description: 'A primer on the foundational ideas of Systemic Functional Linguistics.',
                url: 'https://www.sfl-analyse.de/sfl-english/sfl-english1.htm'
            },
            {
                title: 'Halliday\'s Metafunctions',
                description: 'Explore the ideational, interpersonal, and textual metafunctions.',
                url: 'https://parentheses.info/hallidays-metafunctions-of-language/'
            }
        ]
    },
    {
        category: 'SFL in Systems & Software',
        resources: [
            {
                title: 'Analyzing Functional Requirements',
                description: 'A research paper on applying SFL to improve requirements quality.',
                url: 'https://www.researchgate.net/publication/220803928_Analyzing_the_quality_of_functional_requirements_based_on_systemic_functional_linguistics_theory'
            },
            {
                title: 'SFL for User Story Refinement',
                description: 'Using linguistic analysis to create clearer, more testable user stories.',
                url: 'https://www.agileconnection.com/article/writing-better-user-stories-using-sfl'
            }
        ]
    },
    {
        category: 'Further Reading',
        resources: [
            {
                title: 'Halliday\'s Introduction to Functional Grammar',
                description: 'The seminal text on SFL, for a deep dive into the theory.',
                url: 'https://www.amazon.com/Hallidays-Introduction-Functional-Grammar-M-K/dp/1138561701/'
            }
        ]
    }
];

const Sidebar: React.FC = () => {
    return (
        <aside className="bg-[#333e48] rounded-xl shadow-2xl border border-[#5c6f7e] p-6 h-fit">
            <h2 className="text-xl font-bold text-gray-200 mb-4 border-b border-[#5c6f7e] pb-3">Resources & Reading</h2>
            <div className="space-y-6">
                {resourceCategories.map((cat, index) => (
                    <div key={index}>
                        <h3 className="font-semibold text-[#e2a32d] mb-3">{cat.category}</h3>
                        <ul className="space-y-4">
                            {cat.resources.map((res, resIndex) => (
                                <li key={resIndex}>
                                    <a 
                                        href={res.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group block"
                                        aria-label={`Read more about ${res.title}`}
                                    >
                                        <p className="font-medium text-gray-200 group-hover:text-[#e2a32d] transition-colors duration-200">{res.title}</p>
                                        <p className="text-sm text-[#95aac0] group-hover:text-gray-200 transition-colors duration-200">{res.description}</p>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </aside>
    );
};

export default Sidebar;
