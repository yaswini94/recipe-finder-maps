interface InstructionsProps {
  text: string;
}

export function Instructions({ text }: InstructionsProps) {
  const paragraphs = text.split(/\r?\n/).filter((p) => p.trim());

  return (
    <div className="prose prose-gray max-w-none">
      {paragraphs.map((paragraph, index) => (
        <p key={index} className="text-gray-700 mb-4 leading-relaxed">
          {paragraph}
        </p>
      ))}
    </div>
  );
}
