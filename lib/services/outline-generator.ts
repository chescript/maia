import { Outline, OutlineModule, OutlineLesson, Document } from '@/lib/types/admin-content';

export class OutlineGenerator {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateOutline(document: Document, documentChunks: any[]): Promise<Outline> {
    // Get document overview from first few chunks
    const overviewText = documentChunks
      .slice(0, 10)
      .map(chunk => chunk.content)
      .join('\n\n');

    const prompt = this.buildOutlinePrompt(document, overviewText);
    const response = await this.callLLM(prompt, {
      temperature: 0.3,
      max_tokens: 2000
    });

    const parsedOutline = this.parseOutlineResponse(response);
    
    return {
      id: crypto.randomUUID(),
      document_id: document.id,
      title: parsedOutline.title,
      modules: parsedOutline.modules,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  }

  private buildOutlinePrompt(document: Document, overviewText: string): string {
    return `Create a comprehensive exam outline for this educational document.

DOCUMENT: ${document.name}
CONTEXT: This is for ${document.context_type} preparation
PAGES: ${document.pages}

DOCUMENT OVERVIEW:
${overviewText.slice(0, 3000)}

Create an outline with:
- 4-6 MODULES (major topic areas)
- Each module has 3-5 LESSONS (subtopics)
- Each lesson has 3-6 KEY CONCEPTS (specific learnable items)
- Each lesson has 2-4 LEARNING OBJECTIVES (what students will be able to do)

Format as JSON:
{
  "title": "Comprehensive outline title",
  "modules": [
    {
      "id": "module-1",
      "title": "Module Title",
      "description": "Brief description of what this module covers",
      "order_index": 0,
      "lessons": [
        {
          "id": "lesson-1-1",
          "title": "Lesson Title",
          "description": "Brief description of the lesson",
          "order_index": 0,
          "concepts": ["Concept 1", "Concept 2", "Concept 3"],
          "learning_objectives": [
            "Students will be able to...",
            "Students will understand..."
          ]
        }
      ]
    }
  ]
}

Focus on creating a logical progression that builds knowledge systematically. Each learning objective should be specific and measurable.`;
  }

  private parseOutlineResponse(response: string): { title: string; modules: OutlineModule[] } {
    try {
      const parsed = JSON.parse(response);
      return {
        title: parsed.title || 'Generated Outline',
        modules: parsed.modules.map((module: any, moduleIndex: number) => ({
          id: module.id || `module-${moduleIndex + 1}`,
          title: module.title,
          description: module.description,
          order_index: module.order_index ?? moduleIndex,
          lessons: module.lessons.map((lesson: any, lessonIndex: number) => ({
            id: lesson.id || `lesson-${moduleIndex + 1}-${lessonIndex + 1}`,
            title: lesson.title,
            description: lesson.description,
            order_index: lesson.order_index ?? lessonIndex,
            concepts: lesson.concepts || [],
            learning_objectives: lesson.learning_objectives || []
          }))
        }))
      };
    } catch (error) {
      console.error('Failed to parse outline response:', error);
      
      // Fallback outline structure
      return {
        title: 'Generated Outline',
        modules: [
          {
            id: 'module-1',
            title: 'Introduction and Fundamentals',
            description: 'Basic concepts and foundational knowledge',
            order_index: 0,
            lessons: [
              {
                id: 'lesson-1-1',
                title: 'Core Concepts',
                description: 'Introduction to key concepts',
                order_index: 0,
                concepts: ['Basic definitions', 'Key principles', 'Core terminology'],
                learning_objectives: [
                  'Students will understand fundamental concepts',
                  'Students will be able to use basic terminology'
                ]
              }
            ]
          }
        ]
      };
    }
  }

  private async callLLM(prompt: string, options: { temperature: number; max_tokens: number }): Promise<string> {
    // Mock LLM response for demonstration
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return JSON.stringify({
      title: "Machine Learning Fundamentals",
      modules: [
        {
          id: "module-1",
          title: "Introduction to Machine Learning",
          description: "Foundational concepts and terminology in machine learning",
          order_index: 0,
          lessons: [
            {
              id: "lesson-1-1",
              title: "What is Machine Learning?",
              description: "Definition and scope of machine learning",
              order_index: 0,
              concepts: ["Artificial Intelligence", "Supervised Learning", "Unsupervised Learning", "Reinforcement Learning"],
              learning_objectives: [
                "Students will be able to define machine learning",
                "Students will understand the difference between AI and ML"
              ]
            },
            {
              id: "lesson-1-2",
              title: "Types of Learning Problems",
              description: "Classification of machine learning problems",
              order_index: 1,
              concepts: ["Classification", "Regression", "Clustering", "Dimensionality Reduction"],
              learning_objectives: [
                "Students will be able to categorize ML problems",
                "Students will understand when to use different approaches"
              ]
            }
          ]
        },
        {
          id: "module-2",
          title: "Supervised Learning",
          description: "Algorithms and techniques for supervised learning",
          order_index: 1,
          lessons: [
            {
              id: "lesson-2-1",
              title: "Linear Models",
              description: "Linear regression and logistic regression",
              order_index: 0,
              concepts: ["Linear Regression", "Logistic Regression", "Gradient Descent", "Feature Engineering"],
              learning_objectives: [
                "Students will be able to implement linear regression",
                "Students will understand gradient descent optimization"
              ]
            }
          ]
        }
      ]
    });
  }
}