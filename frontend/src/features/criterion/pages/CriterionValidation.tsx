'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { marked } from 'marked';
import hljs from 'highlight.js/lib/core';
import html from 'highlight.js/lib/languages/xml'; // XML includes HTML
import 'highlight.js/styles/github-dark.css';
import { 
  CheckIcon, 
  XMarkIcon, 
  MinusIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  PaperClipIcon,
  ChatBubbleLeftIcon
} from '@heroicons/react/24/outline';

interface CriterionValidationProps {
  projectSlug: string;
  criterionId: string;
  pageId?: string;
}

interface Comment {
  id: string;
  author: string;
  date: string;
  content: string;
  attachments?: string[];
  isOwn?: boolean;
}

interface Criterion {
  id: string;
  name: string;
}

interface Topic {
  num: number;
  name: string;
  criteria: Criterion[];
}

export default function CriterionValidation({ 
  projectSlug, 
  criterionId, 
  pageId 
}: CriterionValidationProps) {
  const { t } = useTranslation('criterion');
  
  // Mock data - replace with real data later
  const projectName = "My Project";
  const pages = [
    { id: "456", name: "Page Contact" },
    { id: "457", name: "Page d'accueil" },
    { id: "458", name: "Mentions légales" },
    { id: "459", name: "Recrutement" },
    { id: "460", name: "À propos" },
    { id: "461", name: "Services" },
    { id: "462", name: "Portfolio" },
    { id: "463", name: "Blog" }
  ];
  
  // Generate hierarchical criteria structure
  const generateCriteriaByTopic = () => {
    const topics = [
      { 
        num: 1, 
        name: "Images", 
        criteria: [
          { id: "1.1", name: "Chaque image porteuse d'information a-t-elle une alternative textuelle ?" },
          { id: "1.2", name: "Chaque image de décoration est-elle correctement ignorée par les technologies d'assistance ?" },
          { id: "1.3", name: "Pour chaque image porteuse d'information ayant une alternative textuelle, cette alternative est-elle pertinente ?" },
          { id: "1.4", name: "Pour chaque image utilisée comme CAPTCHA ou comme image-test, y a-t-il une alternative ?" },
          { id: "1.5", name: "Pour chaque image utilisée comme CAPTCHA, y a-t-il une alternative accessible ?" },
          { id: "1.6", name: "Chaque image porteuse d'information a-t-elle, si nécessaire, une description détaillée ?" },
          { id: "1.7", name: "Pour chaque image porteuse d'information ayant une description détaillée, cette description est-elle pertinente ?" },
          { id: "1.8", name: "Chaque image texte porteuse d'information, en l'absence d'un mécanisme de remplacement, doit-elle être remplacée par du texte stylé ?" },
          { id: "1.9", name: "Chaque légende d'image est-elle, si nécessaire, correctement reliée à l'image correspondante ?" }
        ]
      },
      { 
        num: 2, 
        name: "Cadres", 
        criteria: [
          { id: "2.1", name: "Chaque cadre a-t-il un titre de cadre ?" },
          { id: "2.2", name: "Pour chaque cadre ayant un titre de cadre, ce titre de cadre est-il pertinent ?" }
        ]
      },
      { 
        num: 3, 
        name: "Couleurs", 
        criteria: [
          { id: "3.1", name: "Dans chaque page web, l'information ne doit pas être donnée uniquement par la couleur. Cette règle est-elle respectée ?" },
          { id: "3.2", name: "Dans chaque page web, le contraste entre la couleur du texte et la couleur de son arrière-plan est-il suffisamment élevé ?" },
          { id: "3.3", name: "Dans chaque page web, les couleurs utilisées dans les composants d'interface ou les éléments graphiques porteurs d'informations sont-elles suffisamment contrastées ?" }
        ]
      },
      { 
        num: 4, 
        name: "Multimédia", 
        criteria: [
          { id: "4.1", name: "Chaque média temporel pré-enregistré a-t-il, si nécessaire, une transcription textuelle ou une audiodescription ?" },
          { id: "4.2", name: "Pour chaque média temporel pré-enregistré ayant une transcription textuelle ou une audiodescription synchrone, celles-ci sont-elles pertinentes ?" },
          { id: "4.3", name: "Chaque média temporel synchrone pré-enregistré a-t-il, si nécessaire, des sous-titres synchrones ?" },
          { id: "4.4", name: "Pour chaque média temporel synchrone pré-enregistré ayant des sous-titres synchrones, ces sous-titres sont-ils pertinents ?" },
          { id: "4.5", name: "Chaque média temporel en direct a-t-il, si nécessaire, des sous-titres synchrones ?" },
          { id: "4.6", name: "Pour chaque média temporel en direct ayant des sous-titres synchrones, ces sous-titres sont-ils pertinents ?" },
          { id: "4.7", name: "Chaque média temporel pré-enregistré a-t-il, si nécessaire, une langue des signes ?" },
          { id: "4.8", name: "Pour chaque média temporel pré-enregistré ayant une langue des signes, celle-ci est-elle pertinente ?" },
          { id: "4.9", name: "Chaque média temporel pré-enregistré a-t-il, si nécessaire, une audiodescription étendue ?" },
          { id: "4.10", name: "Pour chaque média temporel pré-enregistré ayant une audiodescription étendue, celle-ci est-elle pertinente ?" },
          { id: "4.11", name: "Chaque média temporel pré-enregistré a-t-il, si nécessaire, une audiodescription synchrone ?" },
          { id: "4.12", name: "Pour chaque média temporel pré-enregistré ayant une audiodescription synchrone, celle-ci est-elle pertinente ?" },
          { id: "4.13", name: "Chaque média temporel synchrone ou seulement vidéo a-t-il, si nécessaire, une transcription textuelle ?" },
          { id: "4.14", name: "Pour chaque média temporel synchrone ou seulement vidéo ayant une transcription textuelle, celle-ci est-elle pertinente ?" },
          { id: "4.15", name: "Chaque média temporel est-il clairement identifiable ?" },
          { id: "4.16", name: "Chaque média temporel et non temporel est-il compatible avec les technologies d'assistance ?" },
          { id: "4.17", name: "Pour chaque média temporel ayant une alternative, cette alternative est-elle accessible ?" },
          { id: "4.18", name: "Chaque son déclenché automatiquement est-il contrôlable par l'utilisateur ?" },
          { id: "4.19", name: "Pour chaque média temporel ayant des sous-titres synchrones, l'utilisateur a-t-il accès à un mécanisme de contrôle de l'affichage de ces sous-titres ?" },
          { id: "4.20", name: "La consultation de chaque média temporel est-elle, si nécessaire, contrôlable par le clavier et tout dispositif de pointage ?" },
          { id: "4.21", name: "La consultation de chaque média non temporel est-elle contrôlable par le clavier et tout dispositif de pointage ?" },
          { id: "4.22", name: "Chaque média temporel et non temporel est-il compatible avec les technologies d'assistance ?" }
        ]
      },
      { 
        num: 11, 
        name: "Formulaires", 
        criteria: [
          { id: "11.1", name: "Chaque champ de formulaire a-t-il une étiquette ?" },
          { id: "11.2", name: "Chaque étiquette associée à un champ de formulaire est-elle pertinente ?" },
          { id: "11.3", name: "Dans chaque formulaire, chaque étiquette associée à un champ de formulaire ayant la même fonction et répétée plusieurs fois dans une même page ou dans un ensemble de pages est-elle cohérente ?" },
          { id: "11.4", name: "Dans chaque formulaire, chaque étiquette de champ et son champ associé sont-ils accolés ?" },
          { id: "11.5", name: "Dans chaque formulaire, les champs de même nature sont-ils regroupés, si nécessaire ?" },
          { id: "11.6", name: "Dans chaque formulaire, chaque regroupement de champs de formulaire a-t-il une légende ?" },
          { id: "11.7", name: "Dans chaque formulaire, chaque légende associée à un regroupement de champs de même nature est-elle pertinente ?" },
          { id: "11.8", name: "Dans chaque formulaire, les items de même nature d'une liste de choix sont-ils regroupés de manière pertinente ?" },
          { id: "11.9", name: "Dans chaque formulaire, l'intitulé de chaque bouton est-il pertinent ?" },
          { id: "11.10", name: "Dans chaque formulaire, le contrôle de saisie est-il utilisé de manière pertinente ?" },
          { id: "11.11", name: "Dans chaque formulaire, le contrôle de saisie est-il accompagné, si nécessaire, de suggestions pour faciliter la correction des erreurs de saisie ?" },
          { id: "11.12", name: "Dans chaque formulaire, les données à caractère financier, juridique ou personnel peuvent-elles être modifiées, mises à jour ou récupérées par l'utilisateur ?" },
          { id: "11.13", name: "La finalité d'un champ de saisie peut-elle être déduite pour faciliter le remplissage automatique des champs avec les données de l'utilisateur ?" }
        ]
      }
    ];
    
    // Add placeholder topics for remaining ones
    const remainingTopics = [
      { num: 5, name: "Tableaux" },
      { num: 6, name: "Liens" },
      { num: 7, name: "Scripts" },
      { num: 8, name: "Éléments obligatoires" },
      { num: 9, name: "Structuration de l'information" },
      { num: 10, name: "Présentation de l'information" },
      { num: 12, name: "Navigation" },
      { num: 13, name: "Consultation" }
    ];
    
    remainingTopics.forEach(topic => {
      const criteriaCount = topic.num === 5 ? 8 : topic.num === 6 ? 2 : topic.num === 7 ? 5 : 
                           topic.num === 8 ? 9 : topic.num === 9 ? 4 : topic.num === 10 ? 14 : 
                           topic.num === 12 ? 3 : 12;
      
      const criteria = [];
      for (let i = 1; i <= criteriaCount; i++) {
        criteria.push({
          id: `${topic.num}.${i}`,
          name: `Critère ${topic.num}.${i} - ${topic.name} (description à venir)`
        });
      }
      
      topics.push({
        num: topic.num,
        name: topic.name,
        criteria
      });
    });
    
    return topics.sort((a, b) => a.num - b.num);
  };
  
  const topicsWithCriteria = generateCriteriaByTopic();
  const currentPage = pages.find(p => p.id === pageId) || pages[0];
  
  // Find current criterion across all topics
  let currentCriterion: Criterion | undefined;
  for (const topic of topicsWithCriteria) {
    currentCriterion = topic.criteria.find(c => c.id === criterionId);
    if (currentCriterion) break;
  }
  currentCriterion = currentCriterion || topicsWithCriteria[0]?.criteria[1];
  
  // Generate random status for each criterion
  const getCriterionStatus = (id: string): 'valid' | 'invalid' | 'not-applicable' => {
    const statuses: ('valid' | 'invalid' | 'not-applicable')[] = ['valid', 'invalid', 'not-applicable'];
    // Use criterion ID to generate consistent random status
    const hash = id.split('.').reduce((acc, part) => acc + parseInt(part), 0);
    return statuses[hash % 3];
  };
  
  const [validationStatus, setValidationStatus] = useState<'valid' | 'invalid' | 'not-applicable' | ''>('invalid');
  const [criticality, setCriticality] = useState<'blocking' | 'annoying' | 'good-practice' | ''>('annoying');
  const [newComment, setNewComment] = useState('');
  
  const comments: Comment[] = [
    {
      id: '1',
      author: 'Marie Dupont',
      date: '15 jan. 14:30',
      content: 'J\'ai trouvé **3 images décoratives** avec des attributs `alt` non vides sur la page d\'accueil :\n\n• Logo décoratif en header : `alt="Belle décoration"`\n• Séparateur visuel : `alt="ligne de séparation"`\n• Image de fond : `alt="arrière-plan coloré"`\n\n**Correction suggérée** :\n\n```html\n<!-- ❌ Problématique -->\n<img src="logo-decoratif.svg" alt="Belle décoration" class="header-logo">\n<div class="separator">\n  <img src="line.png" alt="ligne de séparation">\n</div>\n\n<!-- ✅ Corrigé -->\n<img src="logo-decoratif.svg" alt="" role="presentation" class="header-logo">\n<div class="separator" aria-hidden="true">\n  <img src="line.png" alt="">\n</div>\n```\n\nCes images devraient avoir `alt=""` ou `role="presentation"` car elles sont purement décoratives.',
      attachments: ['screenshot-header.png', 'separator-issue.png'],
      isOwn: false
    },
    {
      id: '2',
      author: 'Vous',
      date: '14 jan. 16:45',
      content: '**Suggestion de correction** :\n\n```html\n<!-- ❌ Incorrect -->\n<img src="decoration.jpg" alt="Belle image décorative">\n\n<!-- ✅ Correct -->\n<img src="decoration.jpg" alt="" role="presentation">\n```\n\nOu mieux encore, utiliser CSS `background-image` pour les images purement décoratives.',
      isOwn: true
    },
    {
      id: '3',
      author: 'Sophie Leroy',
      date: '13 jan. 09:15',
      content: 'Test avec **NVDA** : les images décoratives avec texte alternatif perturbent la navigation. L\'utilisateur entend "Belle décoration image" sans contexte utile.\n\n> Impact : **Gênant** pour la navigation au clavier et lecteur d\'écran.',
      attachments: ['nvda-test.mp3'],
      isOwn: false
    }
  ];

  // Auto-save handlers
  const handleValidationChange = (value: 'valid' | 'invalid' | 'not-applicable') => {
    setValidationStatus(value);
    console.log('Auto-saving validation status:', value);
  };

  const handleCriticalityChange = (value: string) => {
    setCriticality(value as any);
    console.log('Auto-saving criticality:', value);
  };

  const handlePageChange = (pageId: string) => {
    console.log('Navigate to page:', pageId);
  };

  const handleCriterionChange = (criterionId: string) => {
    console.log('Navigate to criterion:', criterionId);
  };

  const handleSubmitComment = () => {
    if (newComment.trim()) {
      console.log('Submitting comment:', newComment);
      setNewComment('');
    }
  };

  // Initialize highlight.js and marked
  useEffect(() => {
    hljs.registerLanguage('html', html);
    hljs.registerLanguage('xml', html); // XML includes HTML
    
    // Configure marked with simpler, more stable renderer
    marked.setOptions({
      breaks: true,
      gfm: true
    });
  }, []);

  // Safer markdown rendering function
  const renderMarkdown = (content: string) => {
    try {
      // Pre-process content to handle code blocks more safely
      let processedContent = content
        // Handle code blocks with proper escaping
        .replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
          const language = lang || 'html';
          const escapedCode = code
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
          
          let highlightedCode = escapedCode;
          try {
            if (hljs.getLanguage(language)) {
              highlightedCode = hljs.highlight(escapedCode, { language }).value;
            }
          } catch (e) {
            console.warn('Highlighting failed, using plain text');
          }
          
          return `<pre class="bg-slate-900 text-slate-100 p-4 rounded-lg text-sm overflow-x-auto my-4 border max-w-full"><code class="language-${language} whitespace-pre-wrap break-all">${highlightedCode}</code></pre>`;
        })
        // Handle inline code more safely
        .replace(/`([^`]+)`/g, '<code class="bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded text-sm font-mono">$1</code>')
        // Handle blockquotes
        .replace(/^> (.+)$/gm, '<blockquote class="border-l-4 border-blue-300 pl-4 italic text-slate-600 my-2 bg-slate-50 py-2 rounded-r">$1</blockquote>')
        // Handle bold text
        .replace(/\*\*([^*]+)\*\*/g, '<strong class="font-semibold text-slate-900">$1</strong>')
        // Handle bullet points
        .replace(/^• (.+)$/gm, '<div class="flex items-start gap-2 my-1"><span class="text-blue-500 mt-1 font-bold">•</span><span>$1</span></div>')
        // Handle line breaks
        .replace(/\n/g, '<br>');

      return processedContent;
    } catch (error) {
      console.error('Markdown parsing error:', error);
      // Return safely escaped plain text as fallback
      return content
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/\n/g, '<br>');
    }
  };

  const ValidationToggle = () => (
    <div className="inline-flex bg-slate-100 rounded-lg p-1">
      <button
        onClick={() => handleValidationChange('valid')}
        className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-all duration-200 ${
          validationStatus === 'valid'
            ? 'bg-white text-green-700 shadow-sm'
            : 'text-slate-600 hover:text-green-600'
        }`}
      >
        <CheckIcon className="w-4 h-4" />
        Valide
      </button>
      
      <button
        onClick={() => handleValidationChange('invalid')}
        className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-all duration-200 ${
          validationStatus === 'invalid'
            ? 'bg-white text-red-700 shadow-sm'
            : 'text-slate-600 hover:text-red-600'
        }`}
      >
        <XMarkIcon className="w-4 h-4" />
        Invalide
      </button>
      
      <button
        onClick={() => handleValidationChange('not-applicable')}
        className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-all duration-200 ${
          validationStatus === 'not-applicable'
            ? 'bg-white text-slate-700 shadow-sm'
            : 'text-slate-600 hover:text-slate-700'
        }`}
      >
        <MinusIcon className="w-4 h-4" />
        Non applicable
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 relative">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-20 w-32 h-32 bg-blue-100 rounded-full blur-xl"></div>
        <div className="absolute top-40 right-32 w-24 h-24 bg-purple-100 rounded-full blur-xl"></div>
        <div className="absolute bottom-32 left-1/3 w-28 h-28 bg-indigo-100 rounded-full blur-xl"></div>
      </div>

      {/* Top Navigation Bar */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-4">
                <Link href="/" className="group flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-sm hover:shadow-md transition-all duration-200 group-hover:scale-105">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                  </div>
                  <span className="text-lg font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">OhDit</span>
                </Link>
                <div className="w-px h-6 bg-slate-300"></div>
                <h1 className="text-lg font-medium text-slate-700">{projectName}</h1>
              </div>
              
              {/* Page Selector */}
              <div className="relative">
                <select 
                  className="appearance-none bg-white border border-slate-300 rounded-lg px-4 py-2 pr-10 text-slate-700 font-medium hover:border-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all min-w-[200px]"
                  value={currentPage.id}
                  onChange={(e) => handlePageChange(e.target.value)}
                >
                  {pages.map(page => (
                    <option key={page.id} value={page.id}>{page.name}</option>
                  ))}
                </select>
                <ChevronDownIcon className="w-4 h-4 text-slate-500 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full">Critère {criterionId}</span>
              {validationStatus && (
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  validationStatus === 'valid' ? 'bg-green-100 text-green-700' :
                  validationStatus === 'invalid' ? 'bg-red-100 text-red-700' :
                  'bg-slate-100 text-slate-700'
                }`}>
                  {validationStatus === 'valid' ? '✓ Valide' :
                   validationStatus === 'invalid' ? '✗ Invalide' : '— Non applicable'}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex relative z-10">
        {/* Left Sidebar - Criteria List */}
        <div className="w-80 bg-white border-r border-slate-200 h-screen sticky top-0 overflow-y-auto">
          <div className="p-6">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-2">Critères RGAA 4.1</h2>
              <p className="text-sm text-slate-600">Évaluez chaque critère d'accessibilité</p>
            </div>
            
            <div className="space-y-4">
              {topicsWithCriteria.map(topic => (
                <div key={topic.num}>
                  {/* Topic Header */}
                  <div className="mb-3">
                    <h3 className="text-sm font-semibold text-slate-900 px-3 py-2 bg-slate-100 rounded-lg">
                      {topic.num}. {topic.name}
                    </h3>
                  </div>
                  
                  {/* Criteria List */}
                  <div className="space-y-1 ml-2">
                    {topic.criteria.map(criterion => {
                      const status = getCriterionStatus(criterion.id);
                      const isActive = criterion.id === criterionId;
                      
                      return (
                        <div key={criterion.id} className="relative">
                          {/* Status Bar */}
                          <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-r ${
                            status === 'valid' ? 'bg-green-500' :
                            status === 'invalid' ? 'bg-red-500' :
                            'bg-slate-300'
                          }`} />
                          
                          <button
                            onClick={() => handleCriterionChange(criterion.id)}
                            className={`w-full text-left p-3 pl-6 rounded-lg transition-all duration-200 group ${
                              isActive 
                                ? 'bg-blue-50 border border-blue-200 shadow-sm' 
                                : 'hover:bg-slate-50 border border-transparent hover:border-slate-200'
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <span className={`text-sm font-medium flex-shrink-0 ${
                                isActive ? 'text-blue-900' : 'text-slate-900'
                              }`}>
                                {criterion.id}
                              </span>
                              <p className={`text-xs leading-relaxed truncate ${
                                isActive ? 'text-blue-700' : 'text-slate-600'
                              }`}>
                                {criterion.name}
                              </p>
                            </div>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 max-w-none">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex gap-8">
              {/* Main Content - 3/5 width */}
              <div className="flex-1 w-3/5">
            {/* Main Criterion Section */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 mb-6">
              {/* Topic Badge */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                  </svg>
                </div>
                <span className="text-blue-700 font-medium bg-blue-50 px-3 py-1 rounded-full text-sm">Images</span>
              </div>
              
              {/* Criterion Header */}
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 mb-3">
                  Critère {criterionId}
                </h1>
                <p className="text-lg text-slate-700 leading-relaxed mb-6">
                  Les images décoratives ne doivent pas avoir un texte de remplacement
                </p>
                
                {/* Validation Toggle */}
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-slate-700">Statut de validation :</span>
                  <ValidationToggle />
                </div>
              </div>

              {/* Criticality Selector */}
              <div className="border-t border-slate-200 pt-6">
                <label className="block text-sm font-medium text-slate-700 mb-3">
                  Niveau de criticité
                </label>
                <div className="relative max-w-xs">
                  <select 
                    className="appearance-none bg-white border border-slate-300 rounded-lg px-4 py-2.5 pr-10 text-slate-700 hover:border-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all w-full"
                    value={criticality}
                    onChange={(e) => handleCriticalityChange(e.target.value)}
                  >
                    <option value="">Sélectionner le niveau...</option>
                    <option value="blocking">🚫 Bloquant</option>
                    <option value="annoying">⚠️ Gênant</option>
                    <option value="good-practice">💡 Bonne pratique</option>
                  </select>
                  <ChevronDownIcon className="w-4 h-4 text-slate-500 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Comments Section */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <ChatBubbleLeftIcon className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-900">
                    Discussion
                  </h3>
                  <p className="text-sm text-slate-500">{comments.length} commentaire{comments.length > 1 ? 's' : ''}</p>
                </div>
              </div>
          
          {/* Comment List */}
          <div className="space-y-4 mb-8">
            {comments.map(comment => (
              <div key={comment.id} className={`p-6 rounded-lg border transition-all duration-200 ${
                comment.isOwn 
                  ? 'bg-blue-50 border-blue-200' 
                  : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white font-medium ${
                    comment.isOwn ? 'bg-blue-600' : 'bg-slate-500'
                  }`}>
                    {comment.author.charAt(0)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="font-medium text-slate-900">
                        {comment.author}
                      </span>
                      <span className="text-sm text-slate-500">{comment.date}</span>
                    </div>
                    
                    <div 
                      className="text-slate-700 prose prose-sm max-w-none leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: renderMarkdown(comment.content) }}
                    />
                    
                    {comment.attachments && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {comment.attachments.map(attachment => (
                          <div key={attachment} className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-slate-200 hover:border-slate-300 cursor-pointer transition-colors text-sm">
                            <PaperClipIcon className="w-4 h-4 text-slate-500" />
                            <span className="text-slate-700">{attachment}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add Comment */}
          <div className="border-t border-slate-200 pt-6">
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-medium">
                V
              </div>
              <div className="flex-1">
                <textarea
                  className="w-full border border-slate-300 rounded-lg px-4 py-3 text-slate-700 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                  rows={3}
                  placeholder="Partagez vos observations, suggestions ou questions..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
                <div className="flex justify-between items-center mt-3">
                  <button className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors px-3 py-2 rounded-lg hover:bg-slate-50">
                    <PaperClipIcon className="w-4 h-4" />
                    <span className="text-sm">Joindre un fichier</span>
                  </button>
                  <button 
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleSubmitComment}
                    disabled={!newComment.trim()}
                  >
                    Publier
                  </button>
                </div>
              </div>
            </div>
          </div>
            </div>

            {/* Validation Info */}
            <div className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckIcon className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">
                    Dernière validation par Marie Dupont
                  </p>
                  <p className="text-xs text-slate-500">
                    15 janvier 2024 à 14:30
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Description Sidebar - 2/5 width */}
          <div className="w-2/5">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sticky top-24">
              <h3 className="text-lg font-semibold text-slate-900 mb-6">
                Guide du critère
              </h3>
              
              <div className="space-y-6">
                {/* Description */}
                <div>
                  <h4 className="font-medium text-slate-900 mb-3 flex items-center gap-2">
                    <div className="w-5 h-5 bg-blue-100 rounded flex items-center justify-center">
                      <span className="text-blue-600 text-xs">📋</span>
                    </div>
                    Description
                  </h4>
                  <p className="text-slate-700 text-sm mb-3">
                    Chaque image de décoration doit vérifier une de ces conditions :
                  </p>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-1">•</span>
                      <span>L'image de décoration est dépourvue d'alternative textuelle</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-1">•</span>
                      <span>L'image de décoration possède un attribut alt vide (alt="")</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-1">•</span>
                      <span>L'image de décoration possède un attribut role="presentation"</span>
                    </li>
                  </ul>
                </div>

                {/* Why it matters */}
                <div>
                  <h4 className="font-medium text-slate-900 mb-3 flex items-center gap-2">
                    <div className="w-5 h-5 bg-amber-100 rounded flex items-center justify-center">
                      <span className="text-amber-600 text-xs">💡</span>
                    </div>
                    Impact utilisateur
                  </h4>
                  <p className="text-slate-700 text-sm">
                    Les images décoratives avec des textes alternatifs créent de la confusion pour les utilisateurs de lecteurs d'écran. 
                    Ces utilisateurs entendent des descriptions d'images qui n'apportent aucune information utile, ce qui rend la navigation 
                    plus difficile et moins efficace.
                  </p>
                </div>

                {/* Examples */}
                <div>
                  <h4 className="font-medium text-slate-900 mb-3 flex items-center gap-2">
                    <div className="w-5 h-5 bg-green-100 rounded flex items-center justify-center">
                      <span className="text-green-600 text-xs">✓</span>
                    </div>
                    Exemples
                  </h4>
                  
                  <div className="space-y-3">
                    <div className="border border-red-200 bg-red-50 p-3 rounded-lg">
                      <h5 className="font-medium text-red-700 mb-2 text-sm">❌ Incorrect</h5>
                      <code className="bg-red-100 text-red-800 p-2 rounded text-xs font-mono block">
                        &lt;img src="decoration.jpg" alt="Belle image décorative"&gt;
                      </code>
                    </div>
                    
                    <div className="border border-green-200 bg-green-50 p-3 rounded-lg">
                      <h5 className="font-medium text-green-700 mb-2 text-sm">✅ Correct</h5>
                      <code className="bg-green-100 text-green-800 p-2 rounded text-xs font-mono block mb-2">
                        &lt;img src="decoration.jpg" alt=""&gt;
                      </code>
                      <p className="text-xs text-green-600 mb-1">ou</p>
                      <code className="bg-green-100 text-green-800 p-2 rounded text-xs font-mono block">
                        &lt;img src="decoration.jpg" alt="" role="presentation"&gt;
                      </code>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
    </div>
  );
} 