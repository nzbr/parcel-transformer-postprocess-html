import type { StepInputs } from '..';

export const name = "fix-codeblocks";

// Fix code blocks
export function fn({ $ }: StepInputs): void {
  $('pre.mermaid').each((_, el) => {
    $(el).html($(el).text());
  });
  $('pre > code').each((_, el) => {
    const lines = ($(el).html() ?? '').split('\n');
    for (let i = 1; i < lines.length; i++) {
      lines[i] = lines[i].substring(4);
    }
    $(el).html(lines.join('\n').trim());
  });
}
