import type { StepInputs } from '..';

// Fix code blocks
export function fixCodeblocks({ $ }: StepInputs): void {
  $('pre > code').each((_, el) => {
    const lines = ($(el).html() ?? '').split('\n');
    for (let i = 1; i < lines.length; i++) {
      lines[i] = lines[i].substring(4);
    }
    $(el).html(lines.join('\n').trim());
  });
}
