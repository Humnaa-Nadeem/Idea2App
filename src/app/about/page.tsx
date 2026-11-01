export default function AboutPage() {
  return (
    <div className="flex-1 container mx-auto px-4 py-16 max-w-4xl">
      <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-slate-200">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-6">What is Idea2App?</h1>
        
        <div className="prose prose-slate lg:prose-lg max-w-none text-slate-700 space-y-6">
          <p className="text-xl text-slate-600 font-medium">
            Idea2App transforms software ideas into structured development blueprints using AI.
          </p>

          <p>
            It is designed to help founders, product managers, and developers bridge the gap between a raw concept and an actionable technical plan. By taking a natural language description of an idea, Idea2App assists with:
          </p>

          <ul className="list-disc list-inside space-y-2 font-medium text-slate-800">
            <li>Requirements engineering</li>
            <li>Project planning</li>
            <li>Software architecture planning</li>
            <li>SRS (Software Requirements Specification) generation</li>
            <li>Development timeline planning</li>
          </ul>

          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">How it works</h2>
          <p>
            Behind the scenes, Idea2App leverages advanced Large Language Models to act as a virtual senior software architect. It analyzes your input, infers necessary user roles, extracts core features, defines functional and non-functional requirements, and designs a logical database structure.
          </p>
          <p>
            All of this information is then structured into a comprehensive Software Requirements Specification document that you can instantly export to PDF or share with your engineering team.
          </p>

          <div className="bg-primary/10 p-6 rounded-xl mt-8 border border-primary/20">
            <h3 className="font-bold text-primary-dark mb-2">Built as an AI-assisted SDLC project</h3>
            <p className="text-sm text-primary-dark/80">
              Note: Idea2App generates blueprints and requirements documents. It does not automatically write or compile production application source code. It is a planning tool designed to support the initial phases of the Software Development Life Cycle.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
