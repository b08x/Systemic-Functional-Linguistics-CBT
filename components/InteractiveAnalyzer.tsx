
import React, { useState, useCallback } from 'react';
import { analyzeTextWithSFL } from '../services/geminiService';
import type { SflAnalysis } from '../types';
import Spinner from './Spinner';
import CodeBlock from './CodeBlock';

const InteractiveAnalyzer: React.FC = () => {
    const [text, setText] = useState<string>("The user must be able to export the report as a CSV file from the dashboard.");
    const [analysis, setAnalysis] = useState<SflAnalysis | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [showJson, setShowJson] = useState<boolean>(false);

    const handleAnalysis = useCallback(async () => {
        if (!text.trim()) {
            setError("Please enter some text to analyze.");
            return;
        }
        setLoading(true);
        setError(null);
        setAnalysis(null);
        try {
            const result = await analyzeTextWithSFL(text);
            setAnalysis(result);
        } catch (e) {
            const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    }, [text]);

    const renderAnalysis = () => {
        if (!analysis) return null;

        const { ideational, interpersonal, textual, softwareEngineeringImplications } = analysis;

        return (
            <div className="mt-6 space-y-4 animate-fade-in">
                {/* Software Engineering Implications */}
                <div className="bg-[#333e48] rounded-lg p-4 border border-[#e2a32d]/30">
                    <h3 className="text-xl font-semibold text-[#e2a32d]">Software Engineering Implications</h3>
                    <div className="mt-3 space-y-2 text-[#95aac0]">
                        <p><strong className="font-medium text-gray-200">Clarity:</strong> {softwareEngineeringImplications.requirementsClarity}</p>
                        <p><strong className="font-medium text-gray-200">Ambiguities:</strong> {softwareEngineeringImplications.potentialAmbiguities}</p>
                        <p className="mt-3 pt-3 border-t border-[#5c6f7e]"><strong className="font-medium text-gray-200">Suggested Refinement:</strong> <em className="text-[#e2a32d]">"{softwareEngineeringImplications.suggestedRefinement}"</em></p>
                    </div>
                </div>

                {/* SFL Metafunctions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-[#333e48]/70 rounded-lg p-4">
                        <h4 className="font-bold text-lg text-gray-200">Ideational</h4>
                        <p className="text-sm text-[#95aac0] italic mb-2">{ideational.summary}</p>
                        <ul className="text-sm space-y-1">
                            <li><strong>Process:</strong> {ideational.processType}</li>
                            <li><strong>Participants:</strong> {ideational.participants.map(p => `${p.role}: ${p.entity}`).join(', ')}</li>
                            <li><strong>Circumstances:</strong> {ideational.circumstances.map(c => `${c.type}: ${c.details}`).join(', ')}</li>
                        </ul>
                    </div>
                    <div className="bg-[#333e48]/70 rounded-lg p-4">
                        <h4 className="font-bold text-lg text-gray-200">Interpersonal</h4>
                        <p className="text-sm text-[#95aac0] italic mb-2">{interpersonal.summary}</p>
                        <ul className="text-sm space-y-1">
                            <li><strong>Mood:</strong> {interpersonal.mood}</li>
                            <li><strong>Modality:</strong> {interpersonal.modality}</li>
                            <li><strong>Persona:</strong> {interpersonal.persona}</li>
                        </ul>
                    </div>
                </div>
                 <div className="bg-[#333e48]/70 rounded-lg p-4">
                    <h4 className="font-bold text-lg text-gray-200">Textual</h4>
                    <p className="text-sm text-[#95aac0] italic mb-2">{textual.summary}</p>
                    <ul className="text-sm space-y-1">
                        <li><strong>Theme:</strong> "{textual.theme}"</li>
                        <li><strong>Rheme:</strong> "{textual.rheme}"</li>
                        <li><strong>Cohesion:</strong> {textual.cohesion.map(c => `${c.type}: "${c.example}"`).join('; ')}</li>
                    </ul>
                </div>
                
                <div className="text-center pt-4">
                     <button onClick={() => setShowJson(!showJson)} className="text-sm text-[#e2a32d] hover:brightness-110">
                        {showJson ? 'Hide Raw JSON' : 'Show Raw JSON'}
                    </button>
                </div>

                {showJson && <CodeBlock content={JSON.stringify(analysis, null, 2)} />}

            </div>
        )
    };

    return (
        <div className="bg-[#333e48] rounded-xl p-6 shadow-2xl border border-[#5c6f7e]">
            <h2 className="text-2xl font-bold text-gray-200 mb-4">Live Analyzer</h2>
            <p className="text-[#95aac0] mb-4">Enter a requirement, user story, or any text below to see its SFL breakdown and implications for development.</p>
            
            <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="e.g., The system shall validate the user's email address."
                className="w-full h-32 p-3 bg-[#212934] border-2 border-[#5c6f7e] rounded-md focus:ring-2 focus:ring-[#e2a32d] focus:border-[#e2a32d] transition duration-200 text-gray-200 resize-y"
                disabled={loading}
            />

            <button
                onClick={handleAnalysis}
                disabled={loading}
                className="w-full mt-4 py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-[#c36e26] text-white hover:bg-[#a55d20] focus:outline-none focus:ring-2 focus:ring-[#e2a32d] focus:ring-offset-2 focus:ring-offset-[#333e48] transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading && <Spinner />}
                {loading ? 'Analyzing...' : 'Analyze Text'}
            </button>

            {error && <div className="mt-4 text-red-300 bg-red-600/20 p-3 rounded-md border border-red-600/50">{error}</div>}
            
            <div className="mt-4 min-h-[100px]">
                {loading && <div className="flex justify-center items-center h-full pt-8"><Spinner size="lg"/></div>}
                {renderAnalysis()}
            </div>
        </div>
    );
};

export default InteractiveAnalyzer;