export interface ParsedClass {
  grade: string;
  subject: string;
  board: string;
  language: string;
  originalName: string;
}

export const SEPARATOR = '||';

export const formatClassName = (grade: string, subject: string, board: string, language: string) => {
  // e.g. "Class 12 || Physics || Bihar Board || Hindi"
  return `${grade.trim()} ${SEPARATOR} ${subject.trim()} ${SEPARATOR} ${board.trim()} ${SEPARATOR} ${language.trim()}`;
};

export const parseClassName = (name: string): ParsedClass => {
  if (!name.includes(SEPARATOR)) {
    return {
      grade: name,
      subject: '',
      board: '',
      language: '',
      originalName: name,
    };
  }
  
  const parts = name.split(SEPARATOR).map(p => p.trim());
  return {
    grade: parts[0] || '',
    subject: parts[1] || '',
    board: parts[2] || '',
    language: parts[3] || '',
    originalName: name,
  };
};

export const getDisplayClassName = (name: string) => {
  const parsed = parseClassName(name);
  if (!parsed.subject) return parsed.originalName;
  
  // Format for display: "Class 12 Physics (Bihar Board, Hindi)"
  let display = `${parsed.grade} ${parsed.subject}`;
  if (parsed.board || parsed.language) {
    const details = [parsed.board, parsed.language].filter(Boolean).join(', ');
    display += ` (${details})`;
  }
  
  return display;
};
